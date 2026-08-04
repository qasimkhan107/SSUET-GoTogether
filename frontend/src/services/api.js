import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "ssuet-gotogether-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;