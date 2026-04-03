import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
  "FRONTEND_URL",
  "MONGO_URI",
  "JWT_SECRET",
  "OPENROUTER_API_KEY",

  "EMAIL_USER",
  "EMAIL_PASSWORD",

  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REDIRECT_URI",
  "GOOGLE_REFRESH_TOKEN",
  "GOOGLE_DRIVE_FOLDER_ID",
];

// Only require Drive vars if using file upload features
const driveRequired = process.env.USE_DRIVE === "true" || process.env.NODE_ENV === "production";
const driveVars = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN", "GOOGLE_DRIVE_FOLDER_ID"];

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.warn(`Missing environment variables: ${missingEnvVars.join(", ")}`);

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `Missing critical environment variables: ${missingEnvVars.join(", ")}`
    );
  }
}

// Drive-specific warning
if (driveRequired) {
  const missingDrive = driveVars.filter((key) => !process.env[key]);
  if (missingDrive.length) {
    console.warn(`Drive features limited. Missing: ${missingDrive.join(", ")}`);
  }
}

export const env = {
  // Server
  PORT: process.env.PORT || "5000",
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  // Database
  MONGO_URI: process.env.MONGO_URI || "",

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // Email
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587"),

  // AI
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo",

  // Google Drive
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || "",
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN || "",
  GOOGLE_DRIVE_FOLDER_ID: process.env.GOOGLE_DRIVE_FOLDER_ID || "",

  // Security
  CORS_ORIGIN: (process.env.CORS_ORIGIN || "http://localhost:5173").split(","),

  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
  RATE_LIMIT_MAX_REQUESTS: parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || "100"
  ),

  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || "10"),
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || "10"),

  // Allowed MIME types
  ALLOWED_FILE_TYPES: (
    process.env.ALLOWED_FILE_TYPES ||
    "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp,application/zip,application/x-zip-compressed"
  ).split(","),
};

// Production validation (must not be empty)
if (env.NODE_ENV === "production") {
  if (!env.MONGO_URI) throw new Error("MONGO_URI is required in production");
  if (!env.JWT_SECRET) throw new Error("JWT_SECRET is required in production");
}