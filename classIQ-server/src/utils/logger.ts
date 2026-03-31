import fs from "fs";
import path from "path";
import { env } from "../config/env.js";

const logsDir = path.join(process.cwd(), "logs");

if (env.NODE_ENV === "development") {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  data?: any;
}

const writeToFile = (fileName: string, entry: LogEntry) => {
  if (env.NODE_ENV !== "development") return;

  try {
    fs.appendFileSync(
      path.join(logsDir, fileName),
      JSON.stringify(entry) + "\n"
    );
  } catch (err) {
    console.error("Failed to write log:", err);
  }
};

export const logError = (message: string, data?: any) => {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: "ERROR",
    message,
    data,
  };

  console.error("ERROR:", message, data);
  writeToFile("error.log", entry);
};

export const logInfo = (message: string, data?: any) => {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: "INFO",
    message,
    data,
  };

  console.log("INFO:", message, data);
  writeToFile("app.log", entry);
};

export const logPerformance = (
  endpoint: string,
  method: string,
  duration: number,
  statusCode: number
) => {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: "PERFORMANCE",
    message: `${method} ${endpoint}`,
    data: { durationMs: duration, statusCode },
  };

  writeToFile("performance.log", entry);
};

export const logSecurityEvent = (
  eventType: string,
  userId: string,
  details: string,
  data?: any
) => {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: "SECURITY",
    message: `${eventType} - User: ${userId}`,
    data: { details, ...data },
  };

  console.log("SECURITY:", entry.message);
  writeToFile("security-audit.log", entry);
};

// Middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  const originalJson = res.json;

  res.json = function (body: any) {
    const duration = Date.now() - start;
    logPerformance(req.originalUrl, req.method, duration, res.statusCode);
    return originalJson.call(this, body);
  };

  next();
};