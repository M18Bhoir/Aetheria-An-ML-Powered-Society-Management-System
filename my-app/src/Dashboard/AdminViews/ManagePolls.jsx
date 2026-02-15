import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Eye, Vote } from "lucide-react";
import api from "../../utils/api";

function ManagePolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/polls/admin/all");
      setPolls(res.data);
    } catch (err) {
      console.error("Error fetching polls:", err);
      setError(err.response?.data?.msg || "Failed to fetch polls.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleDelete = async (pollId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this poll? This action cannot be undone.",
      )
    ) {
      try {
        await api.delete(`/api/polls/${pollId}`);
        fetchPolls();
      } catch (err) {
        console.error("Error deleting poll:", err);
        alert(err.response?.data?.msg || "Failed to delete poll.");
      }
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
            <Vote className="text-blue-400" size={32} />
            Manage Polls
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Create and manage community voting sessions.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/create-poll")}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30 rounded-xl text-white font-bold shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          <Plus size={18} className="mr-2" />
          Create New Poll
        </button>
      </div>

      {/* Glass Container */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-white/10 bg-white/5">
          <h3 className="text-lg font-bold text-white">Active & Past Polls</h3>
        </div>

        {loading && (
          <p className="p-8 text-center text-gray-400 animate-pulse">
            Loading polls...
          </p>
        )}
        {error && <p className="p-8 text-center text-red-400">{error}</p>}

        {!loading && !error && polls.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Vote size={48} className="mb-4 opacity-20" />
            <p>No polls created yet.</p>
          </div>
        )}

        {!loading && !error && polls.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider bg-black/20">
                  <th className="p-4 font-semibold">Question</th>
                  <th className="p-4 font-semibold">Created By</th>
                  <th className="p-4 font-semibold">Total Votes</th>
                  <th className="p-4 font-semibold">Created On</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 text-sm divide-y divide-white/5">
                {polls.map((poll) => (
                  <tr
                    key={poll._id}
                    className="hover:bg-white/5 transition-colors duration-200 group"
                  >
                    <td className="p-4 font-medium text-white max-w-xs truncate">
                      {poll.question}
                    </td>
                    <td className="p-4 text-gray-400">
                      {poll.createdBy?.name || "Admin"}
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs">
                        {poll.options.reduce((sum, opt) => sum + opt.votes, 0)}{" "}
                        votes
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {new Date(poll.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <Link
                          to={`/admin/poll/${poll._id}`}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(poll._id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                          title="Delete Poll"
                        >
                          <Trash2 size={16} />
                        </button>
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

export default ManagePolls;
