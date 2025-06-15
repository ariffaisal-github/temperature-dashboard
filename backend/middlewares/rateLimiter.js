import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";

const redisClient = new Redis();

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

export const apiRateLimiter = rateLimit({
  windowMs: 1000, // 1 second window
  max: 100, // Limit each IP to 100 requests per windowMs
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    statusCode: 429,
    error: "Too many requests. Please try again later.",
  },
});
