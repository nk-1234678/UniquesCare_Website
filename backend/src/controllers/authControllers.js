import asyncHandler from "../utils/asyncHandler.js";

import {
  registerUser,
  loginUser,
  signAccessToken,
  verifyRefreshToken,
} from "../services/authService.js";

import User from "../modals/User.js";
import Complaint from "../modals/Complaint.js";
import { getCookieOptions } from "../config/env.js";
import {
  validateLoginBody,
  validateProfileBody,
  validateRegisterBody,
} from "../validators/authValidators.js";
import { getCookieValue } from "../utils/cookieAuth.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";


// ✅ REGISTER
export const register = asyncHandler(async (req, res) => {
  const validation = validateRegisterBody(req.body);

  if (!validation.isValid) {
    return sendError(res, 400, validation.errors[0], validation.errors);
  }

  const { name, email, password, role } = validation.value;

  const { user, accessToken, refreshToken } =
    await registerUser(name, email, password, role);

  res
    .cookie("token", accessToken, getCookieOptions(15 * 60 * 1000))
    .cookie(
      "refreshToken",
      refreshToken,
      getCookieOptions(30 * 24 * 60 * 60 * 1000)
    );

  return sendSuccess(res, 201, {
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone,
      profilePhoto: user.profilePhoto,
      hasLoggedInBefore: user.hasLoggedInBefore,
    },
  });
});


// ✅ LOGIN
export const login = asyncHandler(async (req, res) => {
  const validation = validateLoginBody(req.body);

  if (!validation.isValid) {
    return sendError(res, 400, validation.errors[0], validation.errors);
  }

  const { email, password, role } = validation.value;

  const { user, accessToken, refreshToken } =
    await loginUser(email, password, role);

  const isFirstLogin = !user.hasLoggedInBefore;

  if (isFirstLogin) {
    user.hasLoggedInBefore = true;
    await user.save();
  }

  res
    .cookie("token", accessToken, getCookieOptions(15 * 60 * 1000))
    .cookie(
      "refreshToken",
      refreshToken,
      getCookieOptions(30 * 24 * 60 * 60 * 1000)
    );

  return sendSuccess(res, 200, {
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone,
      profilePhoto: user.profilePhoto,
      hasLoggedInBefore: user.hasLoggedInBefore,
    },
    isFirstLogin,
  });
});


// ✅ LOGOUT (no asyncHandler needed)
export const logout = (req, res) => {
  res.clearCookie("token", { ...getCookieOptions(0) });
  res.clearCookie("refreshToken", { ...getCookieOptions(0) });

  return sendSuccess(res, 200, { message: "Logged out successfully" });
};


// ✅ REFRESH TOKEN (special case)
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = getCookieValue(req, "refreshToken");

  if (!refreshToken) {
    return sendError(res, 401, "Unauthorized");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    return sendError(res, 401, "Unauthorized");
  }

  const user = await User.findById(decoded.id).select("_id");

  if (!user) {
    return sendError(res, 401, "Unauthorized");
  }

  const accessToken = signAccessToken(user._id);

  res.cookie("token", accessToken, getCookieOptions(15 * 60 * 1000));

  return sendSuccess(res, 200, { message: "Token refreshed" });
});


// ✅ GET ME
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return sendError(res, 401, "Unauthorized");
  }

  return sendSuccess(res, 200, { user });
});


// ✅ UPDATE PROFILE
export const updateProfile = asyncHandler(async (req, res) => {
  const validation = validateProfileBody(req.body);

  if (!validation.isValid) {
    return sendError(res, 400, validation.errors[0], validation.errors);
  }

  const {
    name,
    email,
    department,
    phone,
    profilePhoto,
    academicStartYear,
    academicEndYear,
  } = validation.value;

  const user = await User.findById(req.user._id);

  if (!user) {
    return sendError(res, 404, "User not found");
  }

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (department !== undefined) user.department = department;
  if (phone !== undefined) user.phone = phone;

  if (profilePhoto && profilePhoto.length > 0) {
    user.profilePhoto = profilePhoto;
  }

  if (user.role === "student") {
    if (academicStartYear !== undefined)
      user.academicStartYear = academicStartYear;

    if (academicEndYear !== undefined)
      user.academicEndYear = academicEndYear;
  }

  await user.save();

  return sendSuccess(res, 200, {
    message: "Profile updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone,
      profilePhoto: user.profilePhoto,
      hasLoggedInBefore: user.hasLoggedInBefore,
      academicStartYear: user.academicStartYear,
      academicEndYear: user.academicEndYear,
    },
  });
});

// ✅ GET USERS FOR ADMIN DASHBOARD
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select("name email role department createdAt hasLoggedInBefore")
    .sort({ createdAt: -1 })
    .lean();

  return sendSuccess(res, 200, {
    users: users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      createdAt: user.createdAt,
      hasLoggedInBefore: user.hasLoggedInBefore,
    })),
  });
});

// ✅ GET ALL STUDENTS WITH COMPLAINT COUNT
export const getStudents = asyncHandler(async (req, res) => {
  const students = await User.find({ role: "student" })
    .select("name email department createdAt hasLoggedInBefore")
    .sort({ createdAt: -1 })
    .lean();

  // Get complaint count for each student
  const studentsWithCount = await Promise.all(
    students.map(async (student) => {
      const complaintCount = await Complaint.countDocuments({
        createdBy: student._id,
      });
      return {
        id: student._id,
        name: student.name,
        email: student.email,
        department: student.department,
        createdAt: student.createdAt,
        hasLoggedInBefore: student.hasLoggedInBefore,
        complaintCount,
      };
    })
  );

  return sendSuccess(res, 200, { students: studentsWithCount });
});

// ✅ GET ALL TECHNICIANS WITH HANDLED COMPLAINT COUNT
export const getTechnicians = asyncHandler(async (req, res) => {
  const technicians = await User.find({ role: "technician" })
    .select("name email department createdAt hasLoggedInBefore")
    .sort({ createdAt: -1 })
    .lean();

  // Get handled complaint count for each technician
  const techniciansWithCount = await Promise.all(
    technicians.map(async (tech) => {
      const complaintCount = await Complaint.countDocuments({
        assignedTo: tech._id,
      });
      const resolvedCount = await Complaint.countDocuments({
        assignedTo: tech._id,
        status: "Resolved",
      });
      return {
        id: tech._id,
        name: tech.name,
        email: tech.email,
        department: tech.department,
        createdAt: tech.createdAt,
        hasLoggedInBefore: tech.hasLoggedInBefore,
        complaintCount,
        resolvedCount,
      };
    })
  );

  return sendSuccess(res, 200, { technicians: techniciansWithCount });
});

// ✅ GET STUDENT WITH COMPLAINTS DETAIL
export const getStudentDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await User.findById(id)
    .select("name email department createdAt hasLoggedInBefore")
    .lean();

  if (!student) {
    return sendError(res, 404, "Student not found");
  }

  const complaints = await Complaint.find({ createdBy: id })
    .select("title status category priority createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const complaintStats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  };

  return sendSuccess(res, 200, {
    student: {
      id: student._id,
      name: student.name,
      email: student.email,
      department: student.department,
      createdAt: student.createdAt,
      hasLoggedInBefore: student.hasLoggedInBefore,
    },
    complaintStats,
    complaints: complaints.map((c) => ({
      id: c._id,
      title: c.title,
      status: c.status,
      category: c.category,
      priority: c.priority,
      createdAt: c.createdAt,
    })),
  });
});

// ✅ GET TECHNICIAN WITH ASSIGNED COMPLAINTS DETAIL
export const getTechnicianDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const technician = await User.findById(id)
    .select("name email department createdAt hasLoggedInBefore")
    .lean();

  if (!technician) {
    return sendError(res, 404, "Technician not found");
  }

  const complaints = await Complaint.find({ assignedTo: id })
    .select("title status category priority createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const complaintStats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  };

  return sendSuccess(res, 200, {
    technician: {
      id: technician._id,
      name: technician.name,
      email: technician.email,
      department: technician.department,
      createdAt: technician.createdAt,
      hasLoggedInBefore: technician.hasLoggedInBefore,
    },
    complaintStats,
    complaints: complaints.map((c) => ({
      id: c._id,
      title: c.title,
      status: c.status,
      category: c.category,
      priority: c.priority,
      createdAt: c.createdAt,
    })),
  });
});