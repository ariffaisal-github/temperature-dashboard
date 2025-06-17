import { CustomError } from "../utils/CustomError.js";
import { generateTemperatureData } from "../services/temperatureService.js";
import redisClient from "../utils/redisClient.js";
const CACHE_TTL_MS = parseInt(process.env.TEMP_CACHE_TTL_MS || "2000", 10); // 2 seconds default
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
    if (memoryCache && now - lastUpdated < CACHE_TTL_MS) {
      return res.status(200).json(memoryCache);
    }

    // If not in memory, check Redis
    const cached = await redisClient.get("latest_temperature");
    if (cached) {
      memoryCache = JSON.parse(cached);
      lastUpdated = now;

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
    await redisClient.set(
      "latest_temperature",
      JSON.stringify(data),
      "EX",
      CACHE_TTL_MS / 1000
    );

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
