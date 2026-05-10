import api from "../lib/axios";

export const signupUser = async (formData) => {
  const response = await api.post("/auth/signup", formData);
  return response.data;
};

export const loginUser = async (formData) => {
  const response = await api.post("/auth/login", formData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const requestPasswordResetOtp = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const verifyPasswordResetOtp = async ({ email, otp }) => {
  const response = await api.post("/auth/verify-otp", { email, otp });
  return response.data;
};

export const resetPassword = async ({ email, otp, newPassword }) => {
  const response = await api.post("/auth/reset-password", {
    email,
    otp,
    newPassword,
  });

  return response.data;
};
