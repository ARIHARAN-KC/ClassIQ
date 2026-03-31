import mongoose from "mongoose";
import app from "./app.js";
import { env } from "./config/env.js";
import { verifyEmailConfig } from "./utils/mail.js";
import { logError, logSecurityEvent } from "./utils/logger.js";

const connectDB = async () => {
  if (!env.MONGO_URI) throw new Error("MONGO_URI is not defined");

  mongoose.set("strictQuery", false);

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    logError("MongoDB connection error", { error: err.message });
  });

  mongoose.connection.on("disconnected", () => {
    logError("MongoDB disconnected", {});
  });

  await mongoose.connect(env.MONGO_URI);
};

const startServer = async () => {
  try {
    await connectDB();

    // Verify email configuration (non-blocking)
    verifyEmailConfig().catch(() => null);

    const server = app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logSecurityEvent("SERVER_SHUTDOWN", "system", `Shutdown triggered: ${signal}`);

      server.close(async () => {
        try {
          await mongoose.disconnect();
          process.exit(0);
        } catch (err) {
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error: any) {
    console.error("Server failed to start:", error.message);
    logError("Server startup failed", { error: error.message });
    process.exit(1);
  }
};

startServer();