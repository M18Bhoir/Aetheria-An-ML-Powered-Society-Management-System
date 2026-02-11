import React, { useState, useEffect } from "react";
import api from "../utils/api";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await api.get("/user/profile");
      setFormData({ name: data.name, email: data.email, phone: data.phone });
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put("/user/profile", formData);
      alert("Profile and Phone Number Updated!");
    } catch (err) {
      alert("Update Failed");
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input type="email" value={formData.email} disabled />
        <input
          type="text"
          placeholder="Phone (e.g. +918652718080)"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;
