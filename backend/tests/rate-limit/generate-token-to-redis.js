import Redis from "ioredis";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// === CONFIGURATION ===
const redis = new Redis();
const secret = process.env.JWT_SECRET || "your_jwt_secret";
const numberOfTokens = 1; // Only 1 token for rate limit test
const keyPrefix = "loadtest:token:";

// === GENERATE & STORE TOKEN ===
const pipeline = redis.pipeline();

for (let i = 1; i <= numberOfTokens; i++) {
  const payload = {
    id: i,
    username: `user${i}`,
    email: `user${i}@example.com`,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  pipeline.set(`${keyPrefix}${i}`, token, "EX", 900); // Set token with 15 minutes expiration
}

pipeline.exec().then(() => {
  console.log(
    `✅ Stored ${numberOfTokens} token in Redis with prefix "${keyPrefix}"`
  );
  redis.quit();
});
