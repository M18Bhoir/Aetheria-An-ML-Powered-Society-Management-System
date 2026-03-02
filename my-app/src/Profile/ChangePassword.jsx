import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // ================= TOGGLE PASSWORD VISIBILITY =================
  const togglePassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // ================= PASSWORD STRENGTH CHECK =================
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;

    const labels = ["Weak", "Fair", "Good", "Strong"];
    const colors = [
      "bg-red-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];

    return {
      strength,
      label: labels[Math.min(Math.floor(strength / 25), 3)],
      color: colors[Math.min(Math.floor(strength / 25), 3)],
    };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  // ================= VALIDATION =================
  const validateForm = () => {
    if (!formData.currentPassword) {
      setMessage({ type: "error", text: "Please enter your current password" });
      return false;
    }

    if (!formData.newPassword) {
      setMessage({ type: "error", text: "Please enter a new password" });
      return false;
    }

    if (formData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "New password must be at least 6 characters",
      });
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      setMessage({
        type: "error",
        text: "New password must be different from current password",
      });
      return false;
    }

    return true;
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await api.put("/api/user/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setMessage({
        type: "success",
        text: "Password changed successfully! Redirecting to profile...",
      });

      // Clear form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Redirect to profile after 2 seconds
      setTimeout(() => {
        navigate("/dashboard/profile");
      }, 2000);
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Failed to change password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <button
            onClick={() => navigate("/dashboard/profile")}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Profile
          </button>

          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Lock className="text-blue-400" size={32} />
            Change Password
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Update your password to keep your account secure.
          </p>
        </div>
      </div>

      {/* Glass Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>

        {/* Alert Message */}
        {message && (
          <div
            className={`p-4 rounded-xl mb-6 text-sm font-medium border flex items-center gap-2 ${
              message.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-300"
                : "bg-green-500/10 border-green-500/20 text-green-300"
            }`}
          >
            {message.type === "error" ? (
              <XCircle size={18} />
            ) : (
              <CheckCircle size={18} />
            )}
            {message.text}
          </div>
        )}

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Password
            </label>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-blue-400">
                <Lock size={18} />
              </div>

              <input
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                className="w-full pl-11 pr-12 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                placeholder="Enter current password"
                required
              />

              <button
                type="button"
                onClick={() => togglePassword("current")}
                className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors"
              >
                {showPasswords.current ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-blue-400">
                <Lock size={18} />
              </div>

              <input
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="w-full pl-11 pr-12 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                placeholder="Enter new password"
                required
              />

              <button
                type="button"
                onClick={() => togglePassword("new")}
                className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors"
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength.strength >= 75
                        ? "text-green-400"
                        : passwordStrength.strength >= 50
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>

                {/* Password requirements */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div
                    className={`flex items-center gap-1 ${formData.newPassword.length >= 6 ? "text-green-400" : ""}`}
                  >
                    {formData.newPassword.length >= 6 ? (
                      <CheckCircle size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    At least 6 characters
                  </div>
                  <div
                    className={`flex items-center gap-1 ${formData.newPassword.length >= 8 ? "text-green-400" : ""}`}
                  >
                    {formData.newPassword.length >= 8 ? (
                      <CheckCircle size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    At least 8 characters
                  </div>
                  <div
                    className={`flex items-center gap-1 ${/[A-Z]/.test(formData.newPassword) ? "text-green-400" : ""}`}
                  >
                    {/[A-Z]/.test(formData.newPassword) ? (
                      <CheckCircle size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    One uppercase letter
                  </div>
                  <div
                    className={`flex items-center gap-1 ${/[0-9]/.test(formData.newPassword) || /[^A-Za-z0-9]/.test(formData.newPassword) ? "text-green-400" : ""}`}
                  >
                    {/[0-9]/.test(formData.newPassword) ||
                    /[^A-Za-z0-9]/.test(formData.newPassword) ? (
                      <CheckCircle size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    One number or symbol
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm New Password
            </label>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-blue-400">
                <Lock size={18} />
              </div>

              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className={`w-full pl-11 pr-12 py-3 bg-black/20 border rounded-xl text-white placeholder-gray-500 focus:outline-none ${
                  formData.confirmPassword &&
                  formData.newPassword !== formData.confirmPassword
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50"
                    : "border-white/10 focus:border-blue-500/50 focus:ring-blue-500/50"
                }`}
                placeholder="Confirm new password"
                required
              />

              <button
                type="button"
                onClick={() => togglePassword("confirm")}
                className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors"
              >
                {showPasswords.confirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {/* Match indicator */}
            {formData.confirmPassword && (
              <div className="mt-2 flex items-center gap-1 text-xs">
                {formData.newPassword === formData.confirmPassword ? (
                  <span className="text-green-400 flex items-center gap-1">
                    <CheckCircle size={12} /> Passwords match
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-1">
                    <XCircle size={12} /> Passwords do not match
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold text-white transition-all duration-300 ${
                loading
                  ? "bg-gray-600 opacity-50 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30"
              }`}
            >
              {loading ? (
                "Changing Password..."
              ) : (
                <>
                  <Lock size={18} /> Change Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
        <p className="text-yellow-300 text-sm">
          <strong>Security Tip:</strong> Choose a strong password that you don't
          use elsewhere. Include a mix of letters, numbers, and symbols.
        </p>
      </div>
    </div>
  );
};

export default ChangePassword;
