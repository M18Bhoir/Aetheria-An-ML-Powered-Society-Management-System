import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import {
  Trash2,
  CheckCircle,
  XCircle,
  CalendarCheck,
  ArrowLeft,
  User,
  Clock,
} from "lucide-react";

const ManageBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/bookings/all");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // DELETE booking
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

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Rejected":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <CalendarCheck className="text-blue-400" size={32} />
            Manage Bookings
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Review and manage resident amenity reservations.
          </p>
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Booking Requests</h3>
          <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
            {bookings.length} total
          </span>
        </div>

        {loading && (
          <p className="p-8 text-center text-gray-400 animate-pulse">
            Loading bookings...
          </p>
        )}

        {!loading && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <CalendarCheck size={48} className="mb-4 opacity-20" />
            <p>No active bookings found.</p>
          </div>
        )}

        <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {!loading &&
            bookings.map((booking) => (
              <div
                key={booking._id}
                className="group relative bg-black/20 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-white/5 hover:border-blue-500/30 transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                    {booking.amenityName}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-400 text-sm">
                    <User size={14} className="mr-2 opacity-70" />
                    {booking.bookedBy?.name || "Unknown User"}
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock size={14} className="mr-2 opacity-70" />
                    {new Date(booking.startTime).toLocaleString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 border-t border-white/10 pt-4 mt-auto">
                  <button
                    onClick={() => updateStatus(booking._id, "Approved")}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-all text-xs font-bold"
                    title="Approve"
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button
                    onClick={() => updateStatus(booking._id, "Rejected")}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                    title="Reject"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-red-600 hover:text-white transition-all"
                    title="Delete Request"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
