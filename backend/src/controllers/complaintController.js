import Complaint from "../modals/Complaint.js";
import Notification from "../modals/Notification.js";
import User from "../modals/User.js";
import mongoose from "mongoose";
import { canAdvanceStatus } from "../utils/statusOrder.js";
import {
  validateComplaintCreateBody,
  validateComplaintId,
  validateComplaintUpdateBody,
} from "../validators/complaintValidators.js";
import {
  sendError,
  sendSuccess,
} from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import xss from "xss";

const isPrivilegedRole = (role) =>
  ["admin", "technician"].includes(String(role || "").toLowerCase());

const sanitize = (val) => xss(String(val || "").trim());
const getRole = (req) => String(req.user?.role || "").toLowerCase();

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (value) =>
  new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

// Fetch all technician IDs from DB
const getTechnicianIds = async () => {
  const technicians = await User.find({ role: "technician" })
    .select("_id")
    .lean();
  return technicians.map((t) => t._id);
};

const createNotification = async (payload) => {
  try {
    await Notification.create(payload);
  } catch (err) {
    console.error("Notification failed:", err);
  }
};

// ─────────────────────────────────────────────
export const createComplaint = asyncHandler(async (req, res) => {
  const creatorId = req.user?._id;
  if (!creatorId) return sendError(res, 401, "Unauthorized");

  const validation = validateComplaintCreateBody(req.body);
  if (!validation.isValid) {
    return sendError(res, 400, validation.errors[0], validation.errors);
  }

  const { title, description, category, priority } = validation.value;

  const complaint = await Complaint.create({
    createdBy: creatorId,
    title: sanitize(title),
    description: sanitize(description),
    category: sanitize(category),
    priority,
  });

  const technicianIds = await getTechnicianIds();
  const recipients = [creatorId, ...technicianIds];

  await createNotification({
    complaintId: complaint._id,
    recipients,
    type: "raised",
    title: "Complaint Raised",
    message: `Complaint "${complaint.title}" was raised under ${complaint.category}.`,
    actor: "Student Side",
    tone: "#16A34A",
    icon: "📝",
    date: formatDate(complaint.createdAt),
    time: formatTime(complaint.createdAt),
    sortAt: complaint.createdAt,
  });

  return sendSuccess(res, 201, { complaint });
});

// ─────────────────────────────────────────────
export const getComplaints = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const userRole = getRole(req);
  if (!userId) return sendError(res, 401, "Unauthorized");

  const query = isPrivilegedRole(userRole)
    ? {}
    : { createdBy: new mongoose.Types.ObjectId(userId) };

  const page = parseInt(req.query.page) || 1;
  const rawLimit = parseInt(req.query.limit);
  const hasLimit = Number.isFinite(rawLimit) && rawLimit > 0;
  const limit = hasLimit ? rawLimit : 0;

  const complaintQuery = Complaint.find(query)
    .sort({ createdAt: -1 })
    .select("title category priority status createdAt")
    .lean();

  if (hasLimit) {
    complaintQuery.skip((page - 1) * limit).limit(limit);
  }

  const complaints = await complaintQuery;

  return sendSuccess(res, 200, { complaints, page, limit });
});

// ─────────────────────────────────────────────
export const getComplaintById = asyncHandler(async (req, res) => {
  const idValidation = validateComplaintId(req.params.id);
  if (!idValidation.isValid) {
    return sendError(res, 400, idValidation.error);
  }

  const userId = req.user?._id;
  const userRole = getRole(req);
  if (!userId) return sendError(res, 401, "Unauthorized");

  const complaint = await Complaint.findOne({
    _id: req.params.id,
    ...(isPrivilegedRole(userRole)
      ? {}
      : { createdBy: new mongoose.Types.ObjectId(userId) }),
  }).lean();

  if (!complaint) return sendError(res, 404, "Complaint not found");

  return sendSuccess(res, 200, { complaint });
});

// ─────────────────────────────────────────────
export const updateComplaint = asyncHandler(async (req, res) => {
  const idValidation = validateComplaintId(req.params.id);
  if (!idValidation.isValid) {
    return sendError(res, 400, idValidation.error);
  }

  const validation = validateComplaintUpdateBody(req.body);
  if (!validation.isValid) {
    return sendError(res, 400, validation.errors[0], validation.errors);
  }

  const updates = validation.value;
  if (Object.keys(updates).length === 0) {
    return sendError(res, 400, "No valid fields provided");
  }

  const userId = req.user?._id;
  if (!userId) return sendError(res, 401, "Unauthorized");

  const userRole = getRole(req);

  const existingComplaint = await Complaint.findOne({
    _id: req.params.id,
    ...(isPrivilegedRole(userRole)
      ? {}
      : { createdBy: new mongoose.Types.ObjectId(userId) }),
  });

  if (!existingComplaint) return sendError(res, 404, "Complaint not found");

  const prev = existingComplaint.toObject();

  if (updates.status && !canAdvanceStatus(prev.status, updates.status)) {
    return sendError(res, 400, `Status can only move forward from ${prev.status}`);
  }

  if (!isPrivilegedRole(userRole) && prev.status !== "Submitted") {
    return sendError(res, 403, "Complaint cannot be edited once it is being processed");
  }

  Object.assign(existingComplaint, updates);
  const complaint = await existingComplaint.save();

  if (prev.status !== complaint.status) {
    await createNotification({
      complaintId: complaint._id,
      recipients: [complaint.createdBy, userId],
      type: "status_changed",
      title: "Complaint Status Updated",
      message: `Complaint "${complaint.title}" status changed from ${prev.status} to ${complaint.status}.`,
      actor: "Technician",
      tone: "#2563EB",
      icon: "🔄",
      date: formatDate(complaint.updatedAt),
      time: formatTime(complaint.updatedAt),
      sortAt: complaint.updatedAt,
    });
  }

  return sendSuccess(res, 200, { complaint });
});

// ─────────────────────────────────────────────
export const deleteComplaint = asyncHandler(async (req, res) => {
  const idValidation = validateComplaintId(req.params.id);
  if (!idValidation.isValid) {
    return sendError(res, 400, idValidation.error);
  }

  const userId = req.user?._id;
  if (!userId) return sendError(res, 401, "Unauthorized");

  const userRole = getRole(req);

  const existingComplaint = await Complaint.findOne({
    _id: req.params.id,
    ...(isPrivilegedRole(userRole)
      ? {}
      : { createdBy: new mongoose.Types.ObjectId(userId) }),
  });

  if (!existingComplaint) return sendError(res, 404, "Complaint not found");

  if (!isPrivilegedRole(userRole) && existingComplaint.status !== "Submitted") {
    return sendError(res, 403, "Complaint cannot be deleted once it is being processed");
  }

  await existingComplaint.deleteOne();

  return sendSuccess(res, 200, { message: "Complaint deleted successfully" });
});