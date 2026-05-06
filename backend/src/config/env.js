const requiredVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
];

const optionalVars = [
  "ADMIN_EMAIL",
  "ADMIN_FIXED_PASSWORD",
];

export const validateEnv = () => {
  const missing = requiredVars.filter((key) => !String(process.env[key] || "").trim());

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  const missingOptional = optionalVars.filter((key) => !String(process.env[key] || "").trim());
  if (missingOptional.length > 0 && process.env.NODE_ENV !== "production") {
    console.warn(
      `Optional admin env vars not set: ${missingOptional.join(", ")}. Defaults will be used.`,
    );
  }
};

export const getCorsOrigins = () => {
  const raw = process.env.CORS_ORIGINS || process.env.FRONTEND_ORIGIN || "http://localhost:5173";
  return raw.split(",").map((origin) => origin.trim()).filter(Boolean);
};

export const getCookieOptions = (maxAgeMs) => {
  const sameSite = String(process.env.COOKIE_SAME_SITE || "lax").toLowerCase();
  const secureEnv = String(process.env.COOKIE_SECURE || "").toLowerCase();
  const secure = secureEnv === "true" ? true : secureEnv === "false" ? false : process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: maxAgeMs,
  };
};
