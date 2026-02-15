import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter } from "lucide-react";
import api from "../../utils/api";

function ManageDues() {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const navigate = useNavigate();

  // Helper for Status Badge Styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Overdue":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const fetchAllDues = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/admin/all-dues");
      setDues(res.data);
    } catch (err) {
      console.error("Error fetching all dues:", err);
      setError(err.response?.data?.msg || "Failed to fetch dues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDues();
  }, []);

  const handleStatusChange = async (dueId, newStatus) => {
    setUpdating(dueId);
    try {
      const res = await api.patch(`/api/admin/dues/${dueId}/status`, {
        status: newStatus,
      });
      setDues(dues.map((d) => (d._id === dueId ? res.data : d)));
    } catch (err) {
      console.error("Error updating due status:", err);
      alert(err.response?.data?.msg || "Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">Manage Dues</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track and update payment statuses for all residents.
          </p>
        </div>
      </div>

      {/* Main Glass Table Container */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden">
        {/* Loading / Error States */}
        {loading && (
          <div className="p-12 text-center text-gray-400 animate-pulse">
            Loading dues records...
          </div>
        )}
        {error && (
          <div className="p-8 text-center text-red-400 bg-red-500/10 border-b border-red-500/20">
            {error}
          </div>
        )}

        {!loading && !error && dues.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Search size={24} />
            </div>
            <p>No dues records found.</p>
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && dues.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider bg-white/5">
                  <th className="p-4 font-semibold">Resident</th>
                  <th className="p-4 font-semibold">Flat / User ID</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Due Date</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 text-sm divide-y divide-white/5">
                {dues.map((due) => (
                  <tr
                    key={due._id}
                    className="hover:bg-white/5 transition-colors duration-200 group"
                  >
                    <td className="p-4 font-medium text-white">
                      {due.user?.name || "Unknown Resident"}
                    </td>
                    <td className="p-4 text-gray-400">
                      {due.user?.userId || "N/A"}
                    </td>
                    <td className="p-4 font-mono text-white">
                      ₹{due.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="p-4">
                      {new Date(due.dueDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs">
                        {due.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusStyle(due.status)}`}
                      >
                        {due.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <select
                        value={due.status}
                        disabled={updating === due._id || due.status === "Paid"}
                        onChange={(e) =>
                          handleStatusChange(due._id, e.target.value)
                        }
                        className={`
                            bg-black/40 text-white text-xs p-2 rounded-lg border border-white/20 
                            outline-none focus:border-blue-500 transition-all cursor-pointer
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${due.status === "Paid" ? "hidden" : ""}
                        `}
                      >
                        <option className="bg-gray-900" value="Pending">
                          Pending
                        </option>
                        <option className="bg-gray-900" value="Paid">
                          Mark Paid
                        </option>
                        <option className="bg-gray-900" value="Overdue">
                          Mark Overdue
                        </option>
                      </select>
                      {due.status === "Paid" && (
                        <span className="text-green-400 text-xs italic">
                          Completed
                        </span>
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

export default ManageDues;
