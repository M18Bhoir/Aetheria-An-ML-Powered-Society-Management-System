import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { Trash2, CheckCircle, XCircle } from "lucide-react";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);

  // Fetch all bookings using the correct admin endpoint
  const fetchBookings = async () => {
    try {
      const res = await api.get("/api/bookings/all");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // DELETE booking from database and local state
  const handleCancel = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to remove this booking from the queue?",
      )
    ) {
      try {
        await api.delete(`/api/bookings/${id}`);
        setBookings(bookings.filter((b) => b._id !== id));
      } catch (err) {
        alert("Error removing booking");
      }
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/api/bookings/${id}/status`, { status });
      setBookings(bookings.map((b) => (b._id === id ? res.data : b)));
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6">Manage Bookings</h2>
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700"
          >
            <div>
              <p className="text-lg font-bold text-blue-400">
                {booking.amenityName}
              </p>
              <p className="text-sm">
                User: {booking.bookedBy?.name || "Unknown"}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(booking.startTime).toLocaleString()}
              </p>
              <p
                className={`text-xs mt-1 font-semibold ${
                  booking.status === "Approved"
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                Status: {booking.status}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => updateStatus(booking._id, "Approved")}
                className="text-green-500 hover:text-green-400"
              >
                <CheckCircle size={20} />
              </button>
              <button
                onClick={() => updateStatus(booking._id, "Rejected")}
                className="text-orange-500 hover:text-orange-400"
              >
                <XCircle size={20} />
              </button>
              {/* CANCEL OPTION */}
              <button
                onClick={() => handleCancel(booking._id)}
                className="text-red-500 hover:text-red-400"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBookings;
