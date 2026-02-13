import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, XCircle } from "lucide-react";
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600 dark:text-green-400";
      case "Pending":
        return "text-yellow-600 dark:text-yellow-400";
      case "Rejected":
      case "Revoked":
        return "text-red-600 dark:text-red-400";
      case "Cancelled":
      case "Expired":
        return "text-gray-500 dark:text-gray-400";
      default:
        return "text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate("/admin")}
        className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Dashboard
      </button>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Manage Guest Pass Requests
        </h2>

        {loading && (
          <p className="text-gray-500 dark:text-gray-400">
            Loading requests...
          </p>
        )}
        {error && <p className="text-red-500 dark:text-red-300">{error}</p>}

        {!loading && !error && passes.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No guest pass requests found.
          </p>
        )}

        {!loading && !error && passes.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b dark:border-slate-700">
                <tr className="text-left text-slate-500 dark:text-slate-400">
                  <th className="pb-3 p-2">Guest</th>
                  <th className="pb-3 p-2">Resident (Flat)</th>
                  <th className="pb-3 p-2">Visit Date</th>
                  <th className="pb-3 p-2">Status</th>
                  <th className="pb-3 p-2">Code</th>
                  <th className="pb-3 p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {passes.map((pass) => (
                  <tr
                    key={pass._id}
                    className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 align-top"
                  >
                    <td className="py-3 p-2 font-medium text-gray-800 dark:text-gray-200">
                      {pass.guestName}
                    </td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">
                      {pass.requestedBy?.name} ({pass.requestedBy?.userId})
                    </td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">
                      {new Date(pass.visitDate).toLocaleDateString()}
                    </td>
                    <td
                      className={`py-3 p-2 font-medium ${getStatusColor(pass.status)}`}
                    >
                      {pass.status}
                    </td>
                    <td className="py-3 p-2 font-mono text-blue-600 dark:text-blue-400">
                      {pass.code || "N/A"}
                    </td>
                    <td className="py-3 p-2 text-center">
                      {pass.status === "Pending" && (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleApprove(pass._id)}
                            disabled={updating === pass._id}
                            className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleReject(pass._id)}
                            disabled={updating === pass._id}
                            className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      )}
                      {pass.status !== "Pending" && (
                        <span className="text-xs text-gray-400">Handled</span>
                      )}
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
