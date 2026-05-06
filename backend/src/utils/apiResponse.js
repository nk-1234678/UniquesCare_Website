export const sendSuccess = (res, statusCode, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    ...data,
  });
};

const getErrorName = (statusCode, message = "") => {
  if (statusCode === 400) return "Validation Error";
  if (statusCode === 401) return "Authentication Error";
  if (statusCode === 403) return "Permission Error";
  if (statusCode === 404) return "Not Found Error";
  if (statusCode === 409) return "Conflict Error";
  if (statusCode === 429) return "Rate Limit Error";
  if (statusCode >= 500) return "Server Error";

  const normalized = String(message || "").toLowerCase();
  if (normalized.includes("duplicate")) return "Conflict Error";
  if (normalized.includes("invalid")) return "Validation Error";
  if (normalized.includes("not found")) return "Not Found Error";
  return "Request Error";
};

export const sendError = (res, statusCode, message, errors, errorName) => {
  const payload = {
    success: false,
    errorName: errorName || getErrorName(statusCode, message),
    message,
  };

  if (Array.isArray(errors) && errors.length > 0) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};


