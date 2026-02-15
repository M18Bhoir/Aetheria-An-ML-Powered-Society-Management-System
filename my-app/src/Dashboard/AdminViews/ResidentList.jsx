import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Mail, Calendar } from "lucide-react";
import api from "../../utils/api";

function ResidentList() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResidents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/api/admin/residents");
        setResidents(res.data);
      } catch (err) {
        console.error("Error fetching residents:", err);
        setError(err.response?.data?.msg || "Failed to fetch residents.");
      } finally {
        setLoading(false);
      }
    };
    fetchResidents();
  }, []);

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
            <Users className="text-blue-400" size={32} />
            All Residents
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            View details of registered community members.
          </p>
        </div>
      </div>

      {/* Glass Container */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Resident Directory</h3>
          <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
            {residents.length} members
          </span>
        </div>

        {loading && (
          <p className="p-8 text-center text-gray-400 animate-pulse">
            Loading residents...
          </p>
        )}
        {error && <p className="p-8 text-center text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider bg-black/20">
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">User ID / Flat No.</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 text-sm divide-y divide-white/5">
                {residents.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-white/5 transition-colors duration-200 group"
                  >
                    <td className="p-4 font-medium text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold border border-blue-500/30">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 font-mono">
                      {user.userId}
                    </td>
                    <td className="p-4 text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="opacity-50" />
                        {user.email || "N/A"}
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="opacity-50" />
                        {new Date(user.createdAt).toLocaleDateString()}
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

export default ResidentList;
