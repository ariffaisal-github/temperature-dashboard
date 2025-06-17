import jwt from "jsonwebtoken";
import { CustomError } from "../utils/CustomError.js";
import { isBlacklisted } from "../utils/tokenBlacklist.js";

// Simple in-memory cache for already-verified tokens within a single worker
// Map<token, decoded>
const verifiedTokenCache = new Map();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return next(new CustomError("Authorization token missing", 401));
  }

  if (isBlacklisted(token)) {
    return next(new CustomError("Token has been logged out", 403));
  }

  // Try fast-path: return cached decoded token
  const cachedDecoded = verifiedTokenCache.get(token);
  if (cachedDecoded) {
    req.user = cachedDecoded;
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "jwt_secret_key"
    );
    // Cache for subsequent requests in this worker
    verifiedTokenCache.set(token, decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new CustomError("Invalid or expired token", 403));
  }
};
