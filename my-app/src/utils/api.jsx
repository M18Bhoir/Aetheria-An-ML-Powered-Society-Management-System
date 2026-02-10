// my-app/src/utils/api.jsx
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const currentToken = localStorage.getItem("token");
  if (currentToken) {
    config.headers["Authorization"] = `Bearer ${currentToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const originalRequest = err.config;

    // Only handle 401 errors
    if (err.response && err.response.status === 401) {
      // 1. NEVER redirect if the error came from the login route itself
      if (originalRequest.url.includes("/api/auth/login")) {
        return Promise.reject(err);
      }

      // 2. Prevent infinite loops and only redirect if NOT on a public page
      const publicPages = ["/login", "/signup", "/"];
      if (
        !publicPages.includes(window.location.pathname) &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        // Instead of clear(), specifically remove only auth items
        // to avoid breaking other app state
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("admin");

        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);

export default api;
