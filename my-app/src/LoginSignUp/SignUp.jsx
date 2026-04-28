import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Shield,
  Phone,
} from "lucide-react";
import api from "../utils/api";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");
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
        userId,
        phone,
        password,
      });

      if (res.status === 201 || res.status === 200) {
        setMessage({
          type: "success",
          text: "Signup successful! Redirecting to login...",
        });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage({
          type: "error",
          text: res.data.message || res.data.msg || "Signup failed. Try again.",
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      let errorMessage = "Error during sign up. Please try again.";
      if (err.response) {
        errorMessage =
          err.response.data.message ||
          err.response.data.msg ||
          "Server error during signup.";
      } else if (err.request) {
        errorMessage = "Network error. Could not connect to the server.";
      }
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Background handled by index.css body gradient
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in-up">
      {/* Glass Card Container */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        {/* Background Glow Effect */}
        <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-50%] right-[-50%] w-full h-full bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            Create Account
          </h2>
          <p className="text-gray-400 text-sm">
            Join the community and manage your society seamlessly.
          </p>
        </div>

        {/* Message Display Area */}
        {message && (
          <div
            className={`flex items-center p-3 rounded-xl mb-6 text-sm font-medium border relative z-10 ${
              message.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-300"
                : "bg-green-500/10 border-green-500/20 text-green-300"
            }`}
          >
            <AlertCircle size={16} className="mr-2 shrink-0" />
            {message.text}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4 relative z-10">
          {/* Name Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-400 transition-colors">
              <User size={18} />
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>

          {/* Email Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-400 transition-colors">
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>

          {/* User ID Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-400 transition-colors">
              <Shield size={18} />
            </div>
            <input
              type="text"
              placeholder="User ID (e.g., A-101)"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>

          {/* Phone Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-400 transition-colors">
              <Phone size={18} />
            </div>
            <input
              type="tel"
              placeholder="Phone Number (e.g., +91...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-400 transition-colors">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              className="w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>

          {/* Confirm Password Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-400 transition-colors">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
              className="w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-white tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-6
              ${
                loading
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30 border border-transparent hover:border-blue-400/30"
              }`}
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                Sign Up <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-sm text-gray-400 relative z-10">
          <p>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-400 hover:text-blue-300 cursor-pointer font-semibold transition-colors"
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
