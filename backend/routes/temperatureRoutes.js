// routes/temperatureRoutes.js
import express from "express";
import { getTemperature } from "../controllers/temperatureController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getTemperature);

export default router;
