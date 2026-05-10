import bcrypt from "bcryptjs";
import PasswordReset from "../models/PasswordReset.model.js";
import User from "../models/User.model.js";
import { sendPasswordResetOtpEmail } from "../services/emailService.js";
import {
  compareOtp,
  generateOtp,
  getOtpExpiryDate,
  hashOtp,
  isOtpExpired,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_SECONDS,
} from "../services/otpService.js";

const GENERIC_FORGOT_PASSWORD_MESSAGE =
  "If an account exists with this email, an OTP has been sent.";

const normalizeEmail = (email) => email?.trim().toLowerCase();

const isValidOtpFormat = (otp) => /^\d{6}$/.test(otp);

export const forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: GENERIC_FORGOT_PASSWORD_MESSAGE,
      });
    }

    const existingReset = await PasswordReset.findOne({ email });
    const cooldownMs = OTP_RESEND_COOLDOWN_SECONDS * 1000;

    if (
      existingReset?.lastSentAt &&
      Date.now() - existingReset.lastSentAt.getTime() < cooldownMs
    ) {
      return res.status(200).json({
        message: GENERIC_FORGOT_PASSWORD_MESSAGE,
      });
    }

    const otp = generateOtp();
    const otpHash = await hashOtp(otp);

    await PasswordReset.deleteMany({ user: user._id });

    await PasswordReset.create({
      user: user._id,
      email,
      otpHash,
      expiresAt: getOtpExpiryDate(),
      attempts: 0,
      maxAttempts: OTP_MAX_ATTEMPTS,
      lastSentAt: new Date(),
    });

    try {
      await sendPasswordResetOtpEmail({
        to: user.email,
        name: user.name,
        otp,
      });
    } catch (emailError) {
      await PasswordReset.deleteMany({ user: user._id });
      console.error("Password reset email error:", emailError.message);
      return res.status(500).json({
        message: "Unable to send password reset email. Please try again later.",
      });
    }

    res.status(200).json({
      message: GENERIC_FORGOT_PASSWORD_MESSAGE,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = req.body.otp?.trim();

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    if (!isValidOtpFormat(otp)) {
      return res.status(400).json({ message: "OTP must be a 6-digit code" });
    }

    const resetRequest = await PasswordReset.findOne({ email }).select("+otpHash");

    if (!resetRequest) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (isOtpExpired(resetRequest.expiresAt)) {
      await PasswordReset.deleteOne({ _id: resetRequest._id });
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (resetRequest.attempts >= resetRequest.maxAttempts) {
      await PasswordReset.deleteOne({ _id: resetRequest._id });
      return res.status(429).json({
        message: "Too many incorrect OTP attempts. Please request a new OTP.",
      });
    }

    const isOtpValid = await compareOtp(otp, resetRequest.otpHash);

    if (!isOtpValid) {
      resetRequest.attempts += 1;
      await resetRequest.save();
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    resetRequest.verifiedAt = new Date();
    await resetRequest.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = req.body.otp?.trim();
    const newPassword = req.body.newPassword;

    if (!email || !otp || !newPassword?.trim()) {
      return res
        .status(400)
        .json({ message: "Email, OTP, and new password are required" });
    }

    if (!isValidOtpFormat(otp)) {
      return res.status(400).json({ message: "OTP must be a 6-digit code" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const resetRequest = await PasswordReset.findOne({ email }).select("+otpHash");

    if (!resetRequest || !resetRequest.verifiedAt) {
      return res.status(400).json({ message: "Please verify OTP first" });
    }

    if (isOtpExpired(resetRequest.expiresAt)) {
      await PasswordReset.deleteOne({ _id: resetRequest._id });
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const isOtpValid = await compareOtp(otp, resetRequest.otpHash);

    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      await PasswordReset.deleteOne({ _id: resetRequest._id });
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    await PasswordReset.deleteOne({ _id: resetRequest._id });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
