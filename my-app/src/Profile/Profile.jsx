import React, { useState, useEffect } from "react";
import api from '../utils/api'; // Import the API utility

const Profile = () => {
  // 1. Add state for user, loading, and error
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch user data from the backend
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Use the API route defined in userRoutes.js
        const res = await api.get('/api/user/profile'); 
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError(err.response?.data?.msg || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // Empty dependency array means this runs once on mount

  // 3. Add loading and error states
  if (loading) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500 dark:text-red-400">Error: {error}</div>;
  }

  if (!user) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">No profile data found.</div>;
  }

  // 4. Update JSX to use data from state
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">My Profile</h2>
        <div className="space-y-4">
          
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Name</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</p>
          </div>
          
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.email}</p>
          </div>
          
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">User ID / Flat Number</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.userId}</p>
          </div>
          
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Role</p>
            <p className="text-lg font-semibold capitalize text-gray-900 dark:text-white">{user.role}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;