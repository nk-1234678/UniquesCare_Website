import express from "express";
import {
  createComplaint,
  deleteComplaint,
  getComplaintById,
  getComplaints,
  updateComplaint,
} from "../controllers/complaintController.js";
import { authorizeRoles, requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All roles: students create and view their own complaints
router.post("/", requireAuth, createComplaint);
router.get("/", requireAuth, getComplaints);
router.get("/:id", requireAuth, getComplaintById);

// ✅ No authorizeRoles here — controller handles ownership internally
// Students → can only update/delete their OWN complaints
// Admins/Technicians → can update/delete ANY complaint
router.put("/:id", requireAuth, updateComplaint);
router.delete("/:id", requireAuth, deleteComplaint);

export default router;