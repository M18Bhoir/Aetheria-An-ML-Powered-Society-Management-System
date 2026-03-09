import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const storedAdmin = localStorage.getItem("admin");

      const parseSafe = (val) => {
        if (!val || val === "undefined" || val === "null") return null;
        try {
          return JSON.parse(val);
        } catch {
          return null;
        }
      };

      if (token) {
        const adminData = parseSafe(storedAdmin);
        const userData = parseSafe(storedUser);
        const finalData = adminData || userData;
        if (finalData) {
          setUser({ ...finalData, role: adminData ? "admin" : "user" });
        }
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
