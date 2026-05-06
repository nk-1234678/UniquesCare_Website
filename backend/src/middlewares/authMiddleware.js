import jwt from "jsonwebtoken";
import User from "../modals/User.js";
import { getAccessTokenFromRequest } from "../utils/cookieAuth.js";
import { sendError } from "../utils/apiResponse.js";

export const requireAuth = async (req, res, next) => {
  try {
    const token = getAccessTokenFromRequest(req);
    if (!token) return sendError(res, 401, "Unauthorized");

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return sendError(res, 401, "Token expired");
      }
      return sendError(res, 401, "Invalid token");
    }

    // Guard: decoded payload must have id
    if (!decoded?.id) {
      return sendError(res, 401, "Invalid token payload");
    }

    const user = await User.findById(decoded.id)
      .select("_id name email role")
      .lean();

    if (!user) {
      return sendError(res, 401, "User no longer exists");
    }

    req.user = user;
    return next();
  } catch (err) {
    console.error("requireAuth Error:", err);
    return sendError(res, 500, "Internal Server Error");
  }
};

export const authorizeRoles = (...roles) => {
  const normalizedRoles = roles.map((r) => String(r).toLowerCase());

  return (req, res, next) => {
    // Guard: requireAuth must run before authorizeRoles
    if (!req.user) {
      return sendError(res, 401, "Unauthorized");
    }

    const userRole = String(req.user.role || "").toLowerCase();

    if (!normalizedRoles.includes(userRole)) {
      return sendError(res, 403, "Forbidden: insufficient permissions");
    }

    return next();
  };
};