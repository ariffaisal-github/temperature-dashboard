import http from "k6/http";
import { check } from "k6";
import { SharedArray } from "k6/data";

const jwtToken = new SharedArray("tokens", () =>
  JSON.parse(open("./token.json"))
);

const BASE_URL = __ENV.BASE_URL || "http://nginx";

export const options = {
  vus: 200,
  duration: "1s",
};

export default function () {
  const res = http.get(`${BASE_URL}/api/temperature`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  check(res, {
    "Status is either 200 or 429": (r) => r.status === 200 || r.status === 429,
    "Response time < 500ms": (r) => r.timings.duration < 500,
  });
}
