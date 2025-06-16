import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

export const apiRateLimiter = rateLimit({
  windowMs: 1000, // 1 second window
  max: 100, // Limit each req.user?.id to 100 requests per windowMs
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  keyGenerator: (req, res) => {
    return req.user?.id || req.ip; // Fallback to IP if user ID is not available
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    statusCode: 429,
    error: "Too many requests. Please try again later.",
  },
});
