import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { ensureDefaultAdminAccount } from "./src/services/authService.js";
import { validateEnv } from "./src/config/env.js";
import mongoose from "mongoose";

dotenv.config();

validateEnv();

const startServer = async () => {
  try {
    // Connect Database
    await connectDB();

    // Run only if explicitly enabled
    if (process.env.SEED_ADMIN === "true") {
      await ensureDefaultAdminAccount();
    }

    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);

      // Avoid sensitive logs in production
      if (process.env.NODE_ENV !== "production") {
        console.log("Admin account configured");
      }
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      process.exit(1);
    });

    // Graceful shutdown
  if (process.env.NODE_ENV === "production") {
  process.on("SIGINT", async () => {
    console.log("Shutting down...");
    await mongoose.connection.close();
    server.close(() => process.exit(0));
  });

  process.on("SIGTERM", async () => {
    console.log("Terminating...");
    await mongoose.connection.close();
    server.close(() => process.exit(0));
  });
}

  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
};

startServer();