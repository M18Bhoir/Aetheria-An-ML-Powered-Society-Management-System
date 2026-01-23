import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.jsx";

import user_icon from "../Assets/person.png";
import password_icon from "../Assets/password.png";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("user");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const payload = {
        adminId: loginType === "admin" ? userId.trim() : undefined,
        userId: loginType === "user" ? userId.trim() : undefined,
        password: password.trim(),
      };

      const res = await api.post("/api/auth/login", payload);

      if (res.status === 200 && res.data.token) {
        localStorage.setItem("token", res.data.token);

        if (res.data.role === "admin") {
          localStorage.setItem("admin", JSON.stringify(res.data.admin));
          localStorage.removeItem("user");
          navigate("/admin");
        } else {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.removeItem("admin");
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.msg || "Invalid credentials or server error",
      });
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f1e] p-4">
      <div className="w-full max-w-sm bg-[#1a1a2e] rounded-xl p-6">
        <h2 className="text-center text-3xl text-[#ff6347] font-bold mb-4">
          Login
        </h2>

        {message && (
          <div className="bg-red-900 text-red-300 p-3 rounded mb-4">
            {message.text}
          </div>
        )}

        {/* Role Toggle */}
        <div className="flex gap-2 mb-4">
          {["user", "admin"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setLoginType(role)}
              className={`w-full py-2 rounded ${
                loginType === role
                  ? "bg-[#ff6347] text-white"
                  : "bg-[#2e2e42] text-gray-400"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center bg-[#2e2e42] rounded px-3">
            <img src={user_icon} alt="" className="w-5 h-5 mr-2 invert" />
            <input
              type="text"
              placeholder={loginType === "admin" ? "Admin ID" : "User ID"}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="bg-transparent w-full h-12 text-white outline-none"
              required
            />
          </div>

          <div className="flex items-center bg-[#2e2e42] rounded px-3">
            <img src={password_icon} alt="" className="w-5 h-5 mr-2 invert" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent w-full h-12 text-white outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#ff6347] text-white font-bold rounded"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
