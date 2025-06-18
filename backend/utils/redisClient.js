import Redis from "ioredis";

// Singleton Redis client shared across the whole application
const redisClient = new Redis({ host: "redis", port: 6379 });

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redisClient;
