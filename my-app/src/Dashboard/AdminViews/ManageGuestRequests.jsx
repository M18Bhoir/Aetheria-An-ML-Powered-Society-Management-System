import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, XCircle, User, Calendar, Key, LogIn, LogOut, Clock } from "lucide-react";
import api from "../../utils/api";

function ManageGuestRequests() {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const navigate = useNavigate();

  const fetchPasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/guestpass/all");
      setPasses(res.data);
    } catch (err) {
      console.error("Error fetching guest passes:", err);
      setError(err.response?.data?.msg || "Failed to fetch guest passes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const handleApprove = async (passId) => {
    setUpdating(passId);
    try {
      const res = await api.patch(`/api/guestpass/${passId}/approve`);
      setPasses(passes.map((p) => (p._id === passId ? res.data : p)));
    } catch (err) {
      console.error("Error approving pass:", err);
      alert(err.response?.data?.msg || "Failed to approve pass.");
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = async (passId) => {
    if (!window.confirm("Are you sure you want to reject this request?"))
      return;
    setUpdating(passId);
    try {
      const res = await api.patch(`/api/guestpass/${passId}/reject`);
      setPasses(passes.map((p) => (p._id === passId ? res.data : p)));
    } catch (err) {
      console.error("Error rejecting pass:", err);
      alert("Failed to reject pass.");
    } finally {
      setUpdating(null);
    }
  };

  const handleCheckIn = async (passId) => {
    setUpdating(passId);
    try {
      const res = await api.patch(`/api/guestpass/${passId}/checkin`);
      setPasses(passes.map((p) => (p._id === passId ? res.data : p)));
    } catch (err) {
      console.error("Error checking in guest:", err);
      alert(err.response?.data?.msg || "Failed to check in guest.");
    } finally {
      setUpdating(null);
    }
  };

  const handleCheckOut = async (passId) => {
    setUpdating(passId);
    try {
      const res = await api.patch(`/api/guestpass/${passId}/checkout`);
      setPasses(passes.map((p) => (p._id === passId ? res.data : p)));
    } catch (err) {
      console.error("Error checking out guest:", err);
      alert(err.response?.data?.msg || "Failed to check out guest.");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Rejected":
      case "Revoked":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "Cancelled":
      case "Expired":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
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
            <Key className="text-blue-400" size={32} />
            Guest Passes
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage entry requests for visitors.
          </p>
        </div>
      </div>

      {/* Glass Container */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">All Requests</h3>
          <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
            {passes.length} requests
          </span>
        </div>

        {loading && (
          <p className="p-8 text-center text-gray-400 animate-pulse">
            Loading requests...
          </p>
        )}
        {error && <p className="p-8 text-center text-red-400">{error}</p>}

        {!loading && !error && passes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <User size={48} className="mb-4 opacity-20" />
            <p>No guest pass requests found.</p>
          </div>
        )}

        {!loading && !error && passes.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider bg-black/20">
                  <th className="p-4 font-semibold">Guest</th>
                  <th className="p-4 font-semibold">Resident (Flat)</th>
                  <th className="p-4 font-semibold">Scheduled Visit</th>
                  <th className="p-4 font-semibold">Actual Times</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Code</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 text-sm divide-y divide-white/5">
                {passes.map((pass) => (
                  <tr
                    key={pass._id}
                    className="hover:bg-white/5 transition-colors duration-200 group"
                  >
                    <td className="p-4 font-medium text-white">
                      {pass.guestName}
                    </td>
                    <td className="p-4 text-gray-400">
                      <span className="text-white">
                        {pass.requestedBy?.name}
                      </span>
                      <span className="text-xs block opacity-50">
                        {pass.requestedBy?.userId}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="opacity-50 text-blue-400" />
                          {new Date(pass.visitDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-xs opacity-70">
                          <Clock size={12} />
                          {pass.arrivalTime} - {pass.departureTime}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">
                      <div className="flex flex-col gap-1 text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-500 uppercase w-10">In:</span>
                          <span className={pass.checkInTime ? "text-green-400 font-mono" : "text-gray-600 italic"}>
                            {pass.checkInTime ? new Date(pass.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "---"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-500 uppercase w-10">Out:</span>
                          <span className={pass.checkOutTime ? "text-rose-400 font-mono" : "text-gray-600 italic"}>
                            {pass.checkOutTime ? new Date(pass.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "---"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusStyle(pass.status)}`}
                      >
                        {pass.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-blue-300 tracking-wider">
                      {pass.code || "---"}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center space-x-2">
                        {pass.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(pass._id)}
                              disabled={updating === pass._id}
                              className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(pass._id)}
                              disabled={updating === pass._id}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        
                        {pass.status === "Approved" && !pass.checkInTime && (
                          <button
                            onClick={() => handleCheckIn(pass._id)}
                            disabled={updating === pass._id}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50 text-xs font-bold"
                            title="Check In"
                          >
                            <LogIn size={14} />
                            Check In
                          </button>
                        )}

                        {pass.checkInTime && !pass.checkOutTime && (
                          <button
                            onClick={() => handleCheckOut(pass._id)}
                            disabled={updating === pass._id}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50 text-xs font-bold"
                            title="Check Out"
                          >
                            <LogOut size={14} />
                            Check Out
                          </button>
                        )}

                        {(pass.status === "Rejected" || pass.status === "Cancelled" || pass.status === "Expired" || (pass.checkInTime && pass.checkOutTime)) && (
                          <span className="text-xs text-gray-500 italic">
                            Completed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageGuestRequests;
