// routes/temperatureRoutes.js
import express from "express";
import { getTemperature } from "../controllers/temperatureController.js";

const router = express.Router();

router.get("/", getTemperature);

export default router;
