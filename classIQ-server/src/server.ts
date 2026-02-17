import mongoose from "mongoose";
import app from "./app.js";
import { env } from "./config/env.js";

const startServer = async () => {
  try {
    if (!env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB connected successfully");

    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
