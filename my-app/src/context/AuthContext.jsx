import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const storedAdmin = localStorage.getItem("admin");

      if (token && (storedUser || storedAdmin)) {
        // Determine which user object to use
        const userData = storedAdmin
          ? JSON.parse(storedAdmin)
          : JSON.parse(storedUser);
        // Optional: Verify token with backend here if strictly needed
        setUser({ ...userData, role: storedAdmin ? "admin" : "user" });
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = (userData, token, role) => {
    localStorage.setItem("token", token);
    if (role === "admin") {
      localStorage.setItem("admin", JSON.stringify(userData));
      localStorage.removeItem("user");
    } else {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.removeItem("admin");
    }
    setUser({ ...userData, role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
