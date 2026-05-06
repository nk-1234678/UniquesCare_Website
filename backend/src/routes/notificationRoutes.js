import express from "express";
import { dismissNotification, getNotifications } from "../controllers/notificationController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, getNotifications);
router.post("/:id/dismiss", requireAuth, dismissNotification);

export default router;
