import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Shield,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!userId.trim() || !password.trim()) {
      setMessage({ type: "error", text: "Please enter both ID and Password" });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...(loginType === "admin"
          ? { adminId: userId.trim() }
          : { userId: userId.trim() }),
        password: password.trim(),
        role: loginType,
      };
      const res = await api.post("/api/auth/login", payload);
      if (res.status === 200 && res.data.token) {
        login(res.data.user, res.data.token, res.data.role);
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden bg-[#020617]">
      {/* Immersive Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[180px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] -z-10 transition-all duration-1000"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md glass-card p-10 relative overflow-hidden shadow-[0_32px_128px_-16px_rgba(0,0,0,0.6)]"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
            <Activity size={14} className="text-blue-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
              Secure Access
            </span>
          </div>
          <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">
            Aetheria
          </h2>
          <p className="text-slate-400 text-sm font-medium italic">
            Empowering your community living.
          </p>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center p-4 rounded-2xl mb-6 text-xs font-bold border ${
              message.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
          >
            <AlertCircle size={14} className="mr-2 shrink-0" />
            {message.text}
          </motion.div>
        )}

        {/* Role Toggle */}
        <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/5 shadow-inner">
          <button
            type="button"
            onClick={() => setLoginType("user")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              loginType === "user"
                ? "bg-white/10 text-white shadow-xl"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <User size={14} /> Resident
          </button>
          <button
            type="button"
            onClick={() => setLoginType("admin")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              loginType === "admin"
                ? "bg-blue-600/80 text-white shadow-xl"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Shield size={14} /> Society Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="group space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
              Access Identity
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400">
                <User size={18} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder={
                  loginType === "admin" ? "Admin ID" : "User (e.g. A-101)"
                }
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/30 transition-all font-medium text-sm"
                required
              />
            </div>
          </div>

          <div className="group space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
              Secret Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400">
                <Lock size={18} strokeWidth={2.5} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/30 transition-all font-medium text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-4 rounded-2xl shadow-xl text-sm font-black uppercase tracking-widest text-white transition-all transform active:scale-95 flex items-center justify-center gap-3 mt-8
              ${loading ? "bg-slate-700 cursor-not-allowed opacity-50" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/40 border border-white/10"}`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              <>
                Authorize <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-sm font-medium text-slate-500">
          New to the society?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-400 hover:text-blue-300 cursor-pointer font-bold transition-colors"
          >
            Register Account
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
