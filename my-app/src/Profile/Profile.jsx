import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { User, Mail, Phone, Save, ArrowLeft, ShieldCheck } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // ================= FETCH PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 👉 Make sure your baseURL in api.js includes "/api"
        const { data } = await api.get("/user/profile");

        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
        setMessage({
          type: "error",
          text: "Failed to load profile data",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ================= HANDLE UPDATE =================
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // 📞 Phone validation
    if (formData.phone && !/^\+?\d{10,15}$/.test(formData.phone)) {
      setMessage({
        type: "error",
        text: "Invalid phone number format",
      });
      setLoading(false);
      return;
    }

    try {
      await api.put("/user/profile", formData);

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING SCREEN =================
  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <User className="text-blue-400" size={32} />
            My Profile
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Manage your personal information and contact details.
          </p>
        </div>
      </div>

      {/* Glass Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {formData.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              {formData.name || "User"}
            </h2>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
              <ShieldCheck size={12} /> Verified Resident
            </span>
          </div>
        </div>

        {/* Alert Message */}
        {message && (
          <div
            className={`p-4 rounded-xl mb-6 text-sm font-medium border ${
              message.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-300"
                : "bg-green-500/10 border-green-500/20 text-green-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* ================= FORM ================= */}
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-blue-400">
                <User size={18} />
              </div>

              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                placeholder="Your Name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">
                <Mail size={18} />
              </div>

              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-gray-400 cursor-not-allowed"
              />

              <span className="absolute right-4 top-3.5 text-xs text-gray-500 italic">
                Read-only
              </span>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-blue-400">
                <Phone size={18} />
              </div>

              <input
                type="text"
                placeholder="e.g. +91 9876543210"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold text-white transition-all duration-300
                ${
                  loading
                    ? "bg-gray-600 opacity-50 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30"
                }`}
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save size={18} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
