import { CustomError } from "../utils/CustomError.js";
import { generateTemperatureData } from "../services/temperatureService.js";

/**
 * Get the current temperature
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getTemperature = (req, res, next) => {
  try {
    const data = generateTemperatureData();

    if (!data.temperature) {
      throw new CustomError("Temperature data missing", 422);
    }
    console.log(`${process.pid} handled GET /api/temperature request`);

    res.status(200).json({
      temperature: data.temperature,
      unit: "Celsius",
      timestamp: data.timestamp,
    });
  } catch (err) {
    next(err);
  }
};
