import express from "express";
import { register } from "../controllers/authControllers.js";
import { login } from "../controllers/authControllers.js";
import { logout } from "../controllers/authControllers.js";
import { getMe } from "../controllers/authControllers.js";
import { updateProfile } from "../controllers/authControllers.js";
import { getUsers } from "../controllers/authControllers.js";
import { getStudents } from "../controllers/authControllers.js";
import { getTechnicians } from "../controllers/authControllers.js";
import { getStudentDetail } from "../controllers/authControllers.js";
import { getTechnicianDetail } from "../controllers/authControllers.js";
import { refreshAccessToken } from "../controllers/authControllers.js";
import { authorizeRoles, requireAuth } from "../middlewares/authMiddleware.js";
import rateLimit from "express-rate-limit";

const router = express.Router();
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
});
const registerLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	standardHeaders: true,
	legacyHeaders: false,
});

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/logout", requireAuth, logout);
router.get("/logout", requireAuth, logout);
router.get("/me", requireAuth, getMe);
router.put("/profile", requireAuth, updateProfile);
router.post("/refresh", refreshAccessToken);
router.get("/users", requireAuth, authorizeRoles("admin"), getUsers);
router.get("/students", requireAuth, authorizeRoles("admin"), getStudents);
router.get("/technicians", requireAuth, authorizeRoles("admin"), getTechnicians);
router.get("/students/:id", requireAuth, authorizeRoles("admin"), getStudentDetail);
router.get("/technicians/:id", requireAuth, authorizeRoles("admin"), getTechnicianDetail);

export default router;