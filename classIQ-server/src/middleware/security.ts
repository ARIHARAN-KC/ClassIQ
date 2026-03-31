import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import crypto from "crypto";
import { env } from "../config/env.js";

export const corsConfig = {
  origin: env.CORS_ORIGIN.map((o) => o.trim()),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
  maxAge: 3600,
};

export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again after 15 minutes",
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: "Too many password reset attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: "Too many AI requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export const helmetConfig = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts:
    env.NODE_ENV === "production"
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false,
});

export const sanitizeInputs = mongoSanitize({
  replaceWith: "_",
});

export const requestIdMiddleware = ( req: Request, _res: Response, next: NextFunction ) => {
  const incoming = req.headers["x-request-id"];

  req.requestId =
    typeof incoming === "string" && incoming.trim().length > 0
      ? incoming.trim()
      : crypto.randomUUID();

  next();
};

export const securityHeaders = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.removeHeader("X-Powered-By");
  next();
};