import express from "express";
import { getTemperature } from "../controllers/temperatureController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { apiRateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/", authenticateToken, apiRateLimiter, getTemperature);

export default router;
