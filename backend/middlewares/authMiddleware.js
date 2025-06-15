import jwt from "jsonwebtoken";
import { CustomError } from "../utils/CustomError.js";
import { isBlacklisted } from "../utils/tokenBlacklist.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    throw new CustomError("Authorization token missing", 401);
  }

  if (isBlacklisted(token)) {
    throw new CustomError("Token has been logged out", 403);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "jwt_secret_key"
    );
    req.user = decoded;
    next();
  } catch (err) {
    next(new CustomError("Invalid or expired token", 403));
  }
};
