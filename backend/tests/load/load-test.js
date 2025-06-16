import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";

const tokens = new SharedArray("tokens", () =>
  JSON.parse(open("./tokens.json"))
);

export const options = {
  stages: [
    { duration: "30s", target: 1000 },
    { duration: "60s", target: 1000 },
    { duration: "10s", target: 0 },
  ],
};
const NGINX_PORT = 8080;
const BASE_URL = `http://localhost:${NGINX_PORT}/api/temperature`;

export default function () {
  const token = tokens[(__VU - 1) % tokens.length];
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const res = http.get(BASE_URL, { headers });

  check(res, {
    "Status is 200": (r) => r.status === 200,
    "Response time < 500ms": (r) => r.timings.duration < 500,
    "No 429 Rate Limit": (r) => r.status !== 429,
  });
}
