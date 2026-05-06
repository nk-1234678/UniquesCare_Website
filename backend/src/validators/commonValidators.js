import validator from "validator";

/**
 * Normalize email (lowercase + trim)
 */
export const normalizeEmail = (email) => {
  return validator.normalizeEmail(email || "") || "";
};

/**
 * Validate email (corporate-grade)
 */
export const validateEmail = (email) => {
  if (!email) return "Email is required";

  const normalized = normalizeEmail(email);

  if (!validator.isEmail(normalized)) {
    return "Invalid email format";
  }

  if (normalized.length > 254) {
    return "Email too long";
  }

  return null;
};

/**
 * Validate phone number (India-focused, extendable)
 */
export const validatePhone = (phone) => {
  if (!phone) return "Phone number is required";

  const clean = phone.replace(/\D/g, ""); // remove non-digits

  // Indian mobile validation
  if (!/^[6-9]\d{9}$/.test(clean)) {
    return "Invalid phone number";
  }

  return null;
};

/**
 * Normalize phone (store clean version)
 */
export const normalizePhone = (phone) => {
  return phone.replace(/\D/g, "");
};