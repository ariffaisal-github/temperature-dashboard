import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import temperatureRoutes from "./routes/temperatureRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(express.json());

import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

import compression from "compression";
// Compress only for responses larger than 1 KB to reduce CPU overhead on small JSON payloads
app.use(
  compression({
    threshold: 1024, // bytes
  })
);

const NODE_PORT = process.env.NODE_PORT || 3000;

// Temperature API routes with authentication and rate limiting
app.use("/api/temperature", temperatureRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Temperature Dashboard Backend is running!");
});

app.use(errorHandler);

app.listen(NODE_PORT, () => {
  console.log(
    `✅ Worker ${process.pid} started. Server running on http://localhost:${NODE_PORT}`
  );
});
