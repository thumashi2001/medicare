import axios from "axios";

const adminAPI = axios.create({
  baseURL: "http://localhost:5004/api/admin"
});

adminAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default adminAPI;