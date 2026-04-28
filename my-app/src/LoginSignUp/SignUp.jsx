import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  AlertCircle,
  Shield,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../utils/api";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/auth/signup", {
        name,
        email,
        phone,
        userId,
        password,
      });
      if (res.status === 201 || res.status === 200) {
        setMessage({
          type: "success",
          text: "Onboarding complete! Your account is ready.",
        });
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.msg ||
          "Registration failed. Please check your details.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden bg-[#020617]">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[180px] -z-10 animate-float"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] -z-10"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg glass-card p-10 relative overflow-hidden shadow-[0_32px_128px_-16px_rgba(0,0,0,0.6)]"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
            <CheckCircle2 size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
              Resident Onboarding
            </span>
          </div>
          <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">
            Join the Society
          </h2>
          <p className="text-slate-400 text-sm font-medium italic">
            Your gateway to a smarter community.
          </p>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center p-4 rounded-2xl mb-8 text-xs font-bold border ${
              message.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-300"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
            } relative z-10`}
          >
            <AlertCircle size={14} className="mr-2 shrink-0" />
            {message.text}
          </motion.div>
        )}

        <form
          onSubmit={handleSignUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
        >
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Full Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400">
                <User size={16} />
              </div>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/30 transition-all font-medium text-sm shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400">
                <Mail size={16} />
              </div>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/30 transition-all font-medium text-sm shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Phone Number
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400">
                <Phone size={16} />
              </div>
              <input
                type="tel"
                placeholder="+918652718080"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/30 transition-all font-medium text-sm shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Society Identity (User ID)
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400">
                <Shield size={16} />
              </div>
              <input
                type="text"
                placeholder="e.g. A-101"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/30 transition-all font-medium text-sm shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400">
                <Lock size={16} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/30 transition-all font-medium text-sm shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Verify Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400">
                <Lock size={16} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
                className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/30 transition-all font-medium text-sm shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`md:col-span-2 w-full py-4 px-4 rounded-2xl shadow-xl text-sm font-black uppercase tracking-widest text-white transition-all transform active:scale-95 flex items-center justify-center gap-3 mt-4
              ${loading ? "bg-slate-700 cursor-not-allowed opacity-50" : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-indigo-500/40 border border-white/10"}`}
          >
            {loading ? (
              "Initializing..."
            ) : (
              <>
                Create Account <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-500 relative z-10">
          <p>
            Connected already?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-bold transition-colors"
            >
              Login to Portal
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
