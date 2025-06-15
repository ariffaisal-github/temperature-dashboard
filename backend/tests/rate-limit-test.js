import http from "k6/http";
import { check, sleep } from "k6";

// Read token from CLI arg
const jwtToken = __ENV.TOKEN;
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
  });

  sleep(0.01);
}
