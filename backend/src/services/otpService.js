import bcrypt from "bcryptjs";
import crypto from "crypto";

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;

export const generateOtp = () => {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH;

  return crypto.randomInt(min, max).toString();
};

export const hashOtp = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

export const compareOtp = async (otp, otpHash) => {
  return bcrypt.compare(otp, otpHash);
};

export const getOtpExpiryDate = () => {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
};

export const isOtpExpired = (expiresAt) => {
  return new Date(expiresAt).getTime() < Date.now();
};
