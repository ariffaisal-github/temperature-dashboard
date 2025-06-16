import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";

// Read token from CLI arg
const jwtToken = new SharedArray("tokens", () =>
  JSON.parse(open("./token.json"))
);
const PORT = __ENV.PORT || 3000;

export const options = {
  vus: 200, // Number of virtual users
  duration: "1s", // Duration of the test
};

export default function () {
  const res = http.get(`http://localhost:${PORT}/api/temperature`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  check(res, {
    "Status is either 200 or 429": (r) => r.status === 200 || r.status === 429,
    "Response time < 500ms": (r) => r.timings.duration < 500,
  });
}
