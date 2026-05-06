import validator from "validator";

const ALLOWED_ROLES = ["student", "technician", "admin"];

const isNonEmptyString = (value, minLength = 1, maxLength = 200) => {
  return typeof value === "string" && validator.isLength(value.trim(), { min: minLength, max: maxLength });
};

const normalizeText = (value) => String(value || "").trim();

export const validateRegisterBody = (body = {}) => {
  const errors = [];
  const name = normalizeText(body.name);
  const email = normalizeText(body.email).toLowerCase();
  const password = String(body.password || "");
  const role = normalizeText(body.role || "student").toLowerCase();

  if (!isNonEmptyString(name, 2, 80)) {
    errors.push("Name must be between 2 and 80 characters");
  }

  if (!validator.isEmail(email)) {
    errors.push("Please provide a valid email address");
  }

  if (!validator.isLength(password, { min: 6, max: 128 })) {
    errors.push("Password must be at least 6 characters long");
  }

  if (role && !ALLOWED_ROLES.includes(role)) {
    errors.push("Invalid role selected");
  }

  if (role === "admin") {
    errors.push("Admin accounts cannot be created through registration");
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: { name, email, password, role: role || "student" },
  };
};

export const validateLoginBody = (body = {}) => {
  const errors = [];
  const email = normalizeText(body.email).toLowerCase();
  const password = String(body.password || "");
  const role = normalizeText(body.role || "").toLowerCase();

  if (!validator.isEmail(email)) {
    errors.push("Please provide a valid email address");
  }

  if (!validator.isLength(password, { min: 1, max: 128 })) {
    errors.push("Password is required");
  }

  if (role && !ALLOWED_ROLES.includes(role)) {
    errors.push("Invalid role selected");
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: { email, password, role },
  };
};

export const validateProfileBody = (body = {}) => {
  const errors = [];
  const updates = {};

  if (body.name !== undefined) {
    const name = normalizeText(body.name);
    if (!isNonEmptyString(name, 2, 80)) {
      errors.push("Name must be between 2 and 80 characters");
    } else {
      updates.name = name;
    }
  }

  if (body.email !== undefined) {
    const email = normalizeText(body.email).toLowerCase();
    if (!validator.isEmail(email)) {
      errors.push("Please provide a valid email address");
    } else {
      updates.email = email;
    }
  }

  if (body.department !== undefined) {
    const department = normalizeText(body.department);
    if (!validator.isLength(department, { min: 0, max: 120 })) {
      errors.push("Department must be 120 characters or fewer");
    } else {
      updates.department = department;
    }
  }

  if (body.phone !== undefined) {
    const phone = normalizeText(body.phone);
    if (!validator.isLength(phone, { min: 0, max: 30 })) {
      errors.push("Phone number is too long");
    } else {
      updates.phone = phone;
    }
  }

  if (body.profilePhoto !== undefined) {
    const profilePhoto = String(body.profilePhoto || "").trim();
    if (!validator.isLength(profilePhoto, { min: 0, max: 3000000 })) {
      errors.push("Profile photo payload is too large");
    } else {
      updates.profilePhoto = profilePhoto;
    }
  }

  if (body.academicStartYear !== undefined) {
  const academicStartYear = normalizeText(body.academicStartYear);
  if (!validator.isLength(academicStartYear, { min: 0, max: 4 })) {
    errors.push("Academic start year is invalid");
  } else {
    updates.academicStartYear = academicStartYear;
  }
}

if (body.academicEndYear !== undefined) {
  const academicEndYear = normalizeText(body.academicEndYear);
  if (!validator.isLength(academicEndYear, { min: 0, max: 4 })) {
    errors.push("Academic end year is invalid");
  } else {
    updates.academicEndYear = academicEndYear;
  }
}

if (body.academicStartYear !== undefined) {
  const academicStartYear = normalizeText(body.academicStartYear);
  if (!validator.isLength(academicStartYear, { min: 0, max: 4 })) {
    errors.push("Academic start year is invalid");
  } else {
    updates.academicStartYear = academicStartYear;
  }
}

if (body.academicEndYear !== undefined) {
  const academicEndYear = normalizeText(body.academicEndYear);
  if (!validator.isLength(academicEndYear, { min: 0, max: 4 })) {
    errors.push("Academic end year is invalid");
  } else {
    updates.academicEndYear = academicEndYear;
  }
}

  return {
    isValid: errors.length === 0,
    errors,
    value: updates,
  };
};
