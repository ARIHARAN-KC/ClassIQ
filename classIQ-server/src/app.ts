import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./modules/auth/routes.js";
import userRoutes from "./modules/users/userRoutes.js";
import classRoutes from "./modules/classes/classRoutes.js";
import { globalErrorHandler } from "./middleware/error.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "ClassIQ API is running",
  });
});

// Enable routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/classes", classRoutes)

// 404
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler MUST be last
app.use(globalErrorHandler);

export default app;
