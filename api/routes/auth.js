import express from "express";
import { register, login, logout } from "../controller/auth.js"; // Ensure this matches the export names

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
