import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import hpp from "hpp";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

import { getCorsOrigins } from "./config/env.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import errorHandler from "./middlewares/errorHandler.js";
import { sendError } from "./utils/apiResponse.js";

const app = express();

app.set("trust proxy", 1);

// Logger
app.use(requestLogger);

// ✅ Helmet (fixed CSP to avoid frontend break)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", ...getCorsOrigins()],
      },
    },
  })
);

app.disable("x-powered-by");

// ✅ Compression + HPP (added)
app.use(compression());
app.use(hpp());

// ✅ Fixed CORS (strict whitelist)
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = getCorsOrigins();
      // Allow requests with no origin (server-to-server or curl)
      if (!origin) return callback(null, true);

      // Development convenience: allow any localhost origin (vite may pick dynamic port)
      if (process.env.NODE_ENV !== "production" && (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1"))) {
        return callback(null, true);
      }

      if (allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many auth attempts, please try again later.",
});

// ✅ Added route-specific limiter
const complaintLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: "Too many complaints created, slow down.",
});

app.use(globalLimiter);

// ✅ Increased payload size (fix for PayloadTooLargeError)
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Routes
app.get("/", (req, res) => res.send("API Running"));

// ✅ Improved health endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    db:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
    memory: process.memoryUsage(),
  });
});

// Routes with limiter
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/complaints", complaintLimiter, complaintRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// 404 handler (improved)
app.use((req, res) =>
  sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`)
);

// Global error handler
app.use(errorHandler);

// ❌ REMOVED: unhandledRejection (should only be in server.js)

export default app;