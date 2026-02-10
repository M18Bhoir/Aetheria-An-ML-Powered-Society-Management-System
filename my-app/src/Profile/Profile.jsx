import React, { useState, useEffect } from "react";
import api from "../utils/api";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/users/profile");
        setUserData(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="text-white">Loading profile...</div>;
  if (!userData)
    return <div className="text-red-500">Could not load profile data.</div>;

  return (
    <div className="p-6 bg-[#1a1a2e] rounded-xl text-white max-w-md mx-auto mt-10 shadow-2xl">
      <h2 className="text-3xl font-bold text-[#ff6347] mb-6 text-center">
        My Profile
      </h2>
      <div className="space-y-4">
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">Name:</span>
          <span className="font-semibold">{userData.name}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">User ID:</span>
          <span className="font-semibold">{userData.userId}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">Email:</span>
          <span className="font-semibold">{userData.email}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">Phone:</span>
          <span className="font-semibold">{userData.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
