import express from "express";
import { register } from "../controllers/authControllers.js";
import { login } from "../controllers/authControllers.js";
import { logout } from "../controllers/authControllers.js";
import { getMe } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/logout", logout);
router.get("/me", getMe);

export default router;