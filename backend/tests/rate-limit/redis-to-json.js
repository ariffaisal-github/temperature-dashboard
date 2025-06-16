// redis-to-json.js
import Redis from "ioredis";
import fs from "fs";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});
const keyPrefix = "loadtest:token:";
const numberOfTokens = 1;

(async () => {
  const tokens = [];

  for (let i = 1; i <= numberOfTokens; i++) {
    const token = await redis.get(`${keyPrefix}${i}`);
    if (token) tokens.push(token);
  }

  fs.writeFileSync(
    "tests/rate-limit/token.json",
    JSON.stringify(tokens, null, 2)
  );
  console.log(
    `✅ Exported ${tokens.length} token from Redis to tests/rate-limit/token.json`
  );
  redis.quit();
})();
