import jwt from "jsonwebtoken";
import { CustomError } from "../utils/CustomError.js";

const dummyUser = {
  id: 1,
  email: "test@example.com",
  password: "123456",
};

export const login = (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError("Email and password are required", 400);
    }

    if (email !== dummyUser.email || password !== dummyUser.password) {
      throw new CustomError("Invalid credentials", 401);
    }

    const token = jwt.sign(
      { id: dummyUser.id, email: dummyUser.email },
      process.env.JWT_SECRET || "jwt_secret_key",
      { expiresIn: "1h" }
    );

    res.json({ success: true, token });
  } catch (err) {
    next(err); // Pass to centralized error handler
  }
};
