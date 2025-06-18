import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";
import { Rate } from "k6/metrics";

// Load test tokens
const tokens = new SharedArray("tokens", () => {
  const data = JSON.parse(open("./token.json"));
  return Array.isArray(data) ? data : [data]; // Handle both single token and array of tokens
});

// Configuration
const BASE_URL = __ENV.BASE_URL || "http://nginx";
const RATE_LIMIT = parseInt(__ENV.RATE_LIMIT || "100", 10);
const TEST_DURATION = __ENV.DURATION || "30s";

// Custom metrics
const successRate = new Rate("successful_requests");
const rateLimitedRequests = new Rate("rate_limited_requests");

export const options = {
  scenarios: {
    constant_load: {
      executor: "constant-arrival-rate",
      rate: RATE_LIMIT * 2, // Intentionally exceed the rate limit
      timeUnit: "1s",
      duration: TEST_DURATION,
      preAllocatedVUs: 50,
      maxVUs: 200,
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.1"], // Less than 10% failures
    rate_limited_requests: [
      { threshold: "rate>0.5", abortOnFail: false },
    ],
  },
  noConnectionReuse: true,
  discardResponseBodies: true,
};

// Get a token in a round-robin fashion
function getToken() {
  const index = __VU % tokens.length;
  return tokens[index];
}

export default function () {
  const token = getToken();
  const url = `${BASE_URL}/api/temperature`;
  
  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    timeout: "10s",
    tags: { name: "TemperatureAPI" },
  };

  const res = http.get(url, params);
  
  // Track success/failure rates
  const isSuccess = res.status === 200;
  const isRateLimited = res.status === 429;
  
  successRate.add(isSuccess);
  rateLimitedRequests.add(isRateLimited);

  // Basic validation of responses
  check(res, {
    "status is valid": (r) => [200, 429].includes(r.status),
    "response time is acceptable": (r) => r.timings.duration < 500,
  });

  // Add a small delay to avoid overwhelming the system
  sleep(0.1);
}

// Add a teardown function to log summary
export function teardown() {
  const successPct = (successRate.count / (successRate.count + rateLimitedRequests.count) * 100).toFixed(2);
  console.log(`\nTest completed:`);
  console.log(`- Success rate: ${successPct}%`);
  console.log(`- Rate limited requests: ${rateLimitedRequests.count}`);
  console.log(`- Total requests: ${successRate.count + rateLimitedRequests.count}\n`);
}
