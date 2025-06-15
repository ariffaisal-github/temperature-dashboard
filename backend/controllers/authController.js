import jwt from "jsonwebtoken";

const dummyUser = {
  id: 1,
  email: "test@example.com",
  password: "123456",
};

export const login = (req, res) => {
  const { email, password } = req.body;

  if (email !== dummyUser.email || password !== dummyUser.password) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: dummyUser.id, email: dummyUser.email },
    process.env.JWT_SECRET || "jwt_secret_key",
    { expiresIn: "1h" }
  );

  return res.json({ success: true, token });
};
