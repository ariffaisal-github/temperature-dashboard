import Redis from "ioredis";

// Singleton Redis client shared across the whole application
const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redisClient;
