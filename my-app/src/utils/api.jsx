import axios from "axios";

// Create a new Axios instance
const api = axios.create({
  // NO baseURL here
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor for requests
 */
api.interceptors.request.use(
  (config) => {
    // Get the most up-to-date token from localStorage
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      config.headers["Authorization"] = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Interceptor for responses
 */
api.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response && err.response.status === 401) {
      console.error("Unauthorized! Logging out.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("admin");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export default api;
