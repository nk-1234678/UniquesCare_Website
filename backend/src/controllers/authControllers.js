import { registerUser } from "../services/authService.js";
import { loginUser } from "../services/authService.js";
import jwt from "jsonwebtoken";
import User from "../modals/User.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const { user, token } = await registerUser(name, email, password);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .status(201)
      .json({
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
  } catch (error) {
  res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error"
  });
}
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const { user, token } = await loginUser(email, password);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error"
    });
  }
};




export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie || "";
    const token = cookieHeader
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};