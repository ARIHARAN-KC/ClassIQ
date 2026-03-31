import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";
import { logError } from "../utils/logger.js";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const requestId = req.requestId || "unknown";

  // ApiError (Custom)
  if (err instanceof ApiError) {
    logError("ApiError", {
      message: err.message,
      statusCode: err.statusCode,
      requestId,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      requestId,
    });
  }

  // Mongoose Validation Error
  if (err?.name === "ValidationError") {
    const messages = Object.values(err.errors || {})
      .map((e: any) => e.message)
      .join(", ");

    logError("ValidationError", {
      requestId,
      url: req.originalUrl,
      message: messages,
    });

    return res.status(400).json({
      success: false,
      message: "Validation error",
      requestId,
      ...(env.NODE_ENV === "development" ? { details: messages } : {}),
    });
  }

  // Mongo duplicate key error
  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";

    logError("DuplicateKeyError", {
      requestId,
      field,
      url: req.originalUrl,
    });

    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
      requestId,
    });
  }

  // Unknown errors
  logError("UnexpectedError", {
    requestId,
    message: err?.message,
    stack: err?.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    requestId,
    ...(env.NODE_ENV === "development" ? { error: err?.message, stack: err?.stack } : {}),
  });
};

export const asyncHandler =
  (fn: Function) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };