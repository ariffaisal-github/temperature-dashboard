import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import temperatureRoutes from "./routes/temperatureRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Temperature API routes
app.use("/api/temperature", temperatureRoutes);

app.get("/", (req, res) => {
  res.send("Temperature Dashboard Backend is running!");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend Server is running on http://localhost:${PORT}`);
});
