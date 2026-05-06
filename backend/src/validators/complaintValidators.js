import validator from "validator";
import { COMPLAINT_STATUS_ORDER } from "../utils/statusOrder.js";

const ALLOWED_PRIORITIES = ["Low", "Medium", "High"];

const normalizeText = (value) => String(value || "").trim();

const isTextInRange = (value, minLength, maxLength) => {
  return typeof value === "string" && validator.isLength(value.trim(), { min: minLength, max: maxLength });
};

export const validateComplaintCreateBody = (body = {}) => {
  const errors = [];
  const title = normalizeText(body.title);
  const description = normalizeText(body.description);
  const category = normalizeText(body.category);
  const priority = normalizeText(body.priority || "Medium");

  if (!isTextInRange(title, 3, 120)) {
    errors.push("Title must be between 3 and 120 characters");
  }

  if (!isTextInRange(description, 20, 4000)) {
    errors.push("Description must be between 20 and 4000 characters");
  }

  if (!isTextInRange(category, 2, 80)) {
    errors.push("Category is required");
  }

  if (!ALLOWED_PRIORITIES.includes(priority)) {
    errors.push("Invalid priority selected");
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: {
      title,
      description,
      category,
      priority,
    },
  };
};

export const validateComplaintUpdateBody = (body = {}) => {
  const errors = [];
  const updates = {};
  const allowedStatuses = [...COMPLAINT_STATUS_ORDER];

  if (body.title !== undefined) {
    const title = normalizeText(body.title);
    if (!isTextInRange(title, 3, 120)) {
      errors.push("Title must be between 3 and 120 characters");
    } else {
      updates.title = title;
    }
  }

  if (body.description !== undefined) {
    const description = normalizeText(body.description);
    if (!isTextInRange(description, 20, 4000)) {
      errors.push("Description must be between 20 and 4000 characters");
    } else {
      updates.description = description;
    }
  }

  if (body.category !== undefined) {
    const category = normalizeText(body.category);
    if (!isTextInRange(category, 2, 80)) {
      errors.push("Category is required");
    } else {
      updates.category = category;
    }
  }

  if (body.priority !== undefined) {
    const priority = normalizeText(body.priority);
    if (!ALLOWED_PRIORITIES.includes(priority)) {
      errors.push("Invalid priority selected");
    } else {
      updates.priority = priority;
    }
  }

  if (body.status !== undefined) {
    const status = normalizeText(body.status);
    if (!allowedStatuses.includes(status)) {
      errors.push("Invalid status selected");
    } else {
      updates.status = status;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: updates,
  };
};

export const validateComplaintId = (id) => {
  if (!validator.isMongoId(String(id || ""))) {
    return {
      isValid: false,
      error: "Invalid complaint id",
    };
  }

  return {
    isValid: true,
  };
};
