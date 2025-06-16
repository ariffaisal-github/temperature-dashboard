// redis-to-json.js
import Redis from "ioredis";
import fs from "fs";

const redis = new Redis();
const keyPrefix = "loadtest:token:";
const numberOfTokens = 1000;

(async () => {
  const tokens = [];

  for (let i = 1; i <= numberOfTokens; i++) {
    const token = await redis.get(`${keyPrefix}${i}`);
    if (token) tokens.push(token);
  }

  fs.writeFileSync("tests/load/tokens.json", JSON.stringify(tokens, null, 2));
  console.log(
    `✅ Exported ${tokens.length} tokens from Redis to tests/load/tokens.json`
  );
  redis.quit();
})();
