import { CustomError } from "../utils/CustomError.js";
import { generateTemperatureData } from "../services/temperatureService.js";

export const getTemperature = (req, res, next) => {
  try {
    const data = generateTemperatureData();

    if (!data.temperature) {
      throw new CustomError("Temperature data missing", 422);
    }

    res.status(200).json({
      temperature: data.temperature,
      unit: "Celsius",
      timestamp: data.timestamp,
    });
  } catch (err) {
    next(err);
  }
};
