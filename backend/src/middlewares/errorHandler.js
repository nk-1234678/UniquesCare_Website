import { sendError } from "../utils/apiResponse.js";

const getErrorName = (statusCode, err) => {
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return "Authentication Error";
  }

  if (err.code === 11000) return "Conflict Error";
  if (err.name === "ValidationError") return "Validation Error";
  if (err.name === "CastError") return "Validation Error";

  if (statusCode === 401) return "Authentication Error";
  if (statusCode === 403) return "Permission Error";
  if (statusCode === 404) return "Not Found Error";
  if (statusCode === 429) return "Rate Limit Error";
  if (statusCode >= 500) return "Server Error";

  return "Request Error";
};

const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // 🔐 JWT Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // 🗄️ Mongo Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value";
  }

  // 🧪 Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // ❌ Cast Error (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  return sendError(res, statusCode, message, undefined, getErrorName(statusCode, err));
};

export default errorHandler;