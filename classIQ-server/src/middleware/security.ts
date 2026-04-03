import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
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

// Custom MongoDB sanitization to avoid read-only query issues
const sanitizeObject = (obj: any): any => {
  if (obj === null || typeof obj !== "object") return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    // Replace $ and . to prevent MongoDB operator injection
    let sanitizedKey = key.replace(/\$/g, '_').replace(/\./g, '_');
    sanitized[sanitizedKey] = sanitizeObject(value);
  }
  return sanitized;
};

export const sanitizeInputs = (req: Request, _res: Response, next: NextFunction) => {
  // Sanitize body (mutable)
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  // Sanitize query (read-only workaround)
  if (req.query && Object.keys(req.query).length > 0) {
    const originalQuery = { ...req.query };
    // Clear existing properties
    for (const key of Object.keys(req.query)) {
      delete req.query[key];
    }
    // Assign sanitized values
    Object.assign(req.query, sanitizeObject(originalQuery));
  }
  
  // Sanitize params (read-only workaround)
  if (req.params && Object.keys(req.params).length > 0) {
    const originalParams = { ...req.params };
    for (const key of Object.keys(req.params)) {
      delete req.params[key];
    }
    Object.assign(req.params, sanitizeObject(originalParams));
  }
  
  next();
};

export const requestIdMiddleware = (req: Request, _res: Response, next: NextFunction) => {
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