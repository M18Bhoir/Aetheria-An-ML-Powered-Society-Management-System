import React, { useState, useEffect } from "react";
import api from "../utils/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for password change form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updateMessage, setUpdateMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/users/profile"); // Ensure this matches your server route
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError(err.response?.data?.msg || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setUpdateMessage({ type: "", text: "" });

    // Client-side validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setUpdateMessage({
        type: "error",
        text: "New passwords do not match",
      });
    }

    try {
      const res = await api.put("/api/users/profile", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setUpdateMessage({
        type: "success",
        text: "Password updated successfully!",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setUpdateMessage({
        type: "error",
        text: err.response?.data?.msg || "Failed to update password",
      });
    }
  };

  if (loading)
    return <div className="p-6 text-center text-gray-400">Loading...</div>;
  if (error)
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex-1 space-y-6 p-6 bg-slate-900 min-h-screen">
      <div className="bg-slate-800 p-8 rounded-xl shadow-lg max-w-lg mx-auto border border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-white">My Profile</h2>

        {/* Profile Info Section */}
        <div className="space-y-4 mb-8 pb-8 border-b border-slate-700">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Name
            </p>
            <p className="text-lg text-white">{user.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                User ID
              </p>
              <p className="text-white">{user.userId}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Role
              </p>
              <p className="text-white capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <h3 className="text-xl font-bold mb-4 text-white">Change Password</h3>
        <form onSubmit={handleSubmitPassword} className="space-y-4">
          <div>
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password (e.g. 123456)"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {updateMessage.text && (
            <p
              className={`text-sm ${updateMessage.type === "success" ? "text-green-400" : "text-red-400"}`}
            >
              {updateMessage.text}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
