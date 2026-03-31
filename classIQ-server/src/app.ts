import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

// Module routes
import authRoutes from "./modules/auth/routes.js";
import userRoutes from "./modules/users/userRoutes.js";
import classRoutes from "./modules/classes/classRoutes.js";
import streamRoutes from "./modules/streams/streamRoutes.js";
import assignmentRoutes from "./modules/assignment/assignmentRoutes.js";
import submissionRoutes from "./modules/submission/submissionRoutes.js";
import aiRoutes from "./modules/ai/aiRoutes.js";

// Middleware
import { globalErrorHandler, asyncHandler } from "./middleware/error.js";
import {
  corsConfig,
  apiLimiter,
  authLimiter,
  helmetConfig,
  sanitizeInputs,
  requestIdMiddleware,
  securityHeaders,
} from "./middleware/security.js";

import { requestLogger } from "./utils/logger.js";

const app = express();

// Required for deployments behind reverse proxies (Render, Railway, Nginx)
app.set("trust proxy", 1);

// Security middleware
app.use(helmetConfig);
app.use(securityHeaders);
app.use(requestIdMiddleware);

// CORS
app.use(cors(corsConfig));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Sanitization
app.use(sanitizeInputs);

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(requestLogger);

// Rate limiting
app.use(apiLimiter);

// Health check
app.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "ClassIQ API is running",
      timestamp: new Date().toISOString(),
    });
  })
);

// Strict limiter only for auth endpoints
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/classes", classRoutes);

app.use("/api", streamRoutes);
app.use("/api", assignmentRoutes);
app.use("/api", submissionRoutes);

app.use("/api/ai", aiRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    requestId: req.requestId || "unknown",
  });
});

// Global error handler
app.use(globalErrorHandler);

export default app;