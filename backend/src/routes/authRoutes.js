import express from "express";
import { getMe, login, signup } from "../controllers/authController.js";
import {
  forgotPassword,
  resetPassword,
  verifyOtp,
} from "../controllers/passwordResetController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  forgotPasswordLimiter,
  verifyOtpLimiter,
} from "../middleware/passwordResetLimiter.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/verify-otp", verifyOtpLimiter, verifyOtp);
router.post("/reset-password", verifyOtpLimiter, resetPassword);

export default router;
