import User from "../modals/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ALLOWED_REGISTER_ROLES = ["student", "technician"];
const DEFAULT_ADMIN_EMAIL = "admin@uniquecare.com";
const DEFAULT_ADMIN_NAME = "System Admin";

const getAdminEmail = () =>
  String(process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL)
    .trim()
    .toLowerCase();

const getAdminFixedPassword = () =>
  String(process.env.ADMIN_FIXED_PASSWORD || "Admin@123").trim();

const getAccessSecret = () => process.env.JWT_SECRET;
const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET;

export const signAccessToken = (userId) =>
  jwt.sign({ id: userId, type: "access" }, getAccessSecret(), { expiresIn: "15m" });

export const signRefreshToken = (userId) =>
  jwt.sign({ id: userId, type: "refresh" }, getRefreshSecret(), { expiresIn: "30d" });

export const verifyRefreshToken = (token) => jwt.verify(token, getRefreshSecret());

export const registerUser = async (name, email, password, role = "student") => {

  const normalizedRole = String(role || "student").toLowerCase();

  if (!ALLOWED_REGISTER_ROLES.includes(normalizedRole)) {
    const error = new Error("Invalid role selected");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;   // 🔥 VERY IMPORTANT
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: normalizedRole
  });

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  return { user, accessToken, refreshToken };
};




export const loginUser = async (email, password, role) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (typeof role === "string" && role.trim().length > 0) {
    const normalizedRole = role.trim().toLowerCase();
    if (normalizedRole !== user.role) {
      const error = new Error("Selected role does not match this account");
      error.statusCode = 401;
      throw error;
    }
  }

  let isMatch = false;

  if (user.role === "admin") {
    const adminEmail = getAdminEmail();
    if (normalizedEmail !== adminEmail) {
      const error = new Error("Use configured admin email for admin login");
      error.statusCode = 401;
      throw error;
    }

    const adminFixedPassword = getAdminFixedPassword();
    isMatch = password === adminFixedPassword;
  } else {
    isMatch = await bcrypt.compare(password, user.password);
  }

  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  return { user, accessToken, refreshToken };
};

export const ensureDefaultAdminAccount = async () => {
  const adminEmail = getAdminEmail();
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const placeholderPassword = await bcrypt.hash("admin-placeholder", 10);
    return User.create({
      name: DEFAULT_ADMIN_NAME,
      email: adminEmail,
      password: placeholderPassword,
      role: "admin",
      hasLoggedInBefore: false,
    });
  }

  if (existingAdmin.role !== "admin" || existingAdmin.name !== DEFAULT_ADMIN_NAME) {
    existingAdmin.role = "admin";
    existingAdmin.name = DEFAULT_ADMIN_NAME;
    await existingAdmin.save();
  }

  return existingAdmin;
};