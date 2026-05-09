import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000" : "",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("noteforge_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("noteforge_token");
      localStorage.removeItem("noteforge_user");

      if (!["/login", "/signup"].includes(window.location.pathname)) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
