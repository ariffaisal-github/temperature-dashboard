import { CustomError } from "../utils/CustomError.js";
import { generateTemperatureData } from "../services/temperatureService.js";
import Redis from "ioredis";
const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});
let memoryCache = null;
let lastUpdated = 0;
/**
 * Get the current temperature (with Redis caching)
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getTemperature = async (req, res, next) => {
  try {
    const now = Date.now();

    // Check per-worker in-memory cache first
    if (memoryCache && now - lastUpdated < 2000) {
      console.log(`${process.pid} served from memory`);
      return res.status(200).json(memoryCache);
    }

    // If not in memory, check Redis
    const cached = await redisClient.get("latest_temperature");
    if (cached) {
      memoryCache = JSON.parse(cached);
      lastUpdated = now;
      console.log(`${process.pid} served from redis`);
      return res.status(200).json(memoryCache);
    }

    // If not in Redis, generate fresh data
    const data = generateTemperatureData();
    if (!data.temperature) {
      throw new CustomError("Temperature data missing", 422);
    }

    memoryCache = data;
    lastUpdated = now;

    // Store in Redis with 2-second expiry
    await redisClient.set("latest_temperature", JSON.stringify(data), "EX", 2);

    console.log(`${process.pid} generated fresh data`);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

// without redis cache
// export const getTemperature = (req, res, next) => {
//   try {
//     const data = generateTemperatureData();

//     if (!data.temperature) {
//       throw new CustomError("Temperature data missing", 422);
//     }
//     console.log(`${process.pid} handled GET /api/temperature request`);

//     res.status(200).json({
//       temperature: data.temperature,
//       unit: "Celsius",
//       timestamp: data.timestamp,
//     });
//   } catch (err) {
//     next(err);
//   }
// };
