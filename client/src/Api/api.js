import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:3200/api", 
  withCredentials: true, 
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    // Handle 401 errors (unauthorized) globally
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Token may be invalid or expired.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;