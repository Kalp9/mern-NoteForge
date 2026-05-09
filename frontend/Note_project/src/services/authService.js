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
