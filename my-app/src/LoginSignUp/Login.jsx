import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Shield,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("user");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // src/LoginSignUp/Login.jsx

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!userId.trim() || !password.trim()) {
      setMessage({ type: "error", text: "Please enter both ID and Password" });
      return;
    }

    setLoading(true);

    try {
      // FIX: Dynamically key the ID field based on the selected role
      const payload = {
        // If role is admin, send 'adminId', otherwise send 'userId'
        ...(loginType === "admin"
          ? { adminId: userId.trim() }
          : { userId: userId.trim() }),
        password: password.trim(),
        role: loginType,
      };

      const res = await api.post("/api/auth/login", payload);

      if (res.status === 200 && res.data.token) {
        // Update auth context and storage atomically
        login(res.data.user, res.data.token, res.data.role);
        // Navigate based on role
        navigate(res.data.role === "admin" ? "/admin" : "/dashboard", {
          replace: true,
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.msg || "Invalid credentials or server error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Background handled by index.css body gradient, just center content here
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in-up">
      {/* Glass Card Container */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        {/* Background Glow Effect */}
        <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-50%] right-[-50%] w-full h-full bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-sm">
            Sign in to access your{" "}
            {loginType === "admin" ? "admin portal" : "resident dashboard"}.
          </p>
        </div>

        {/* Error/Success Message */}
        {message && (
          <div
            className={`flex items-center p-3 rounded-xl mb-6 text-sm font-medium border ${
              message.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-300"
                : "bg-green-500/10 border-green-500/20 text-green-300"
            }`}
          >
            <AlertCircle size={16} className="mr-2 shrink-0" />
            {message.text}
          </div>
        )}

        {/* Role Toggle Switch */}
        <div className="flex bg-black/20 p-1 rounded-xl mb-8 relative z-10">
          <button
            type="button"
            onClick={() => setLoginType("user")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
              loginType === "user"
                ? "bg-white/10 text-white shadow-lg border border-white/10"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <User size={16} /> Resident
          </button>
          <button
            type="button"
            onClick={() => setLoginType("admin")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
              loginType === "admin"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {loginType === "admin" ? (
              <ShieldCheck size={16} />
            ) : (
              <Shield size={16} />
            )}
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          {/* User ID Input */}
          <div className="group">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-400 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder={loginType === "admin" ? "Admin ID" : "User ID"}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="group">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-400 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-white tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2
              ${
                loading
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30 border border-transparent hover:border-blue-400/30"
              }`}
          >
            {loading ? (
              "Verifying..."
            ) : (
              <>
                Login <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Links */}
      <div className="mt-8 text-center text-sm text-gray-400">
        <p>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-400 hover:text-blue-300 cursor-pointer font-semibold transition-colors"
          >
            Sign up here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
