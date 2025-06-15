import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Access denied. Token missing." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "jwt_secret_key"
    );
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, error: "Invalid or expired token." });
  }
};
