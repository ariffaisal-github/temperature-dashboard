import express from "express";
import { login, logout } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { apiRateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/login", apiRateLimiter, login);
router.post("/logout", authenticateToken, logout);

export default router;
