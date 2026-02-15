import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  Vote,
  ArrowLeft,
  Plus,
  CheckCircle2,
  Clock,
  User,
  AlertCircle,
  Send,
} from "lucide-react";

// ---------------------- 1. Poll List Component ----------------------
export function PollList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/polls`);
      setPolls(res.data);
    } catch (err) {
      console.error("Failed to fetch polls:", err);
      if (err.message !== "Unauthorized access - Redirecting to login.") {
        setError(
          err.response?.data?.message ||
            err.response?.data?.msg ||
            "Could not load polls.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    try {
      await api.post(`/api/polls/${pollId}/vote`, { optionIndex });
      fetchPolls(); // Refresh to show new results
    } catch (err) {
      alert(err.response?.data?.msg || "Vote failed.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Vote className="text-blue-400" size={32} />
            Community Polls
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Voice your opinion on society matters.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/create-poll")} // Ensure this route exists in App.jsx or adjust path
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30 rounded-xl text-white font-bold shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          <Plus size={18} className="mr-2" />
          Create New Poll
        </button>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="text-center p-12 text-gray-400 animate-pulse">
          Loading polls...
        </div>
      )}
      {error && (
        <div className="text-center p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && polls.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-3xl border border-white/10 text-gray-500">
          <Vote size={48} className="mb-4 opacity-20" />
          <p>No active polls found.</p>
        </div>
      )}

      {/* Polls Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {!loading &&
          polls.map((poll) => {
            const totalVotes = poll.options.reduce(
              (acc, opt) => acc + opt.votes,
              0,
            );

            return (
              <div
                key={poll._id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-lg p-6 hover:bg-white/10 transition-all duration-300 flex flex-col"
              >
                {/* Poll Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3
                    className="text-xl font-bold text-white leading-snug cursor-pointer hover:text-blue-400 transition-colors"
                    onClick={() => navigate(`/dashboard/poll/${poll._id}`)}
                  >
                    {poll.question}
                  </h3>
                  <span className="text-xs text-gray-400 flex items-center bg-white/5 px-2 py-1 rounded-full whitespace-nowrap border border-white/5">
                    <Clock size={12} className="mr-1" />
                    {new Date(poll.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Options / Results Preview */}
                <div className="space-y-3 flex-1">
                  {poll.options.map((option, index) => {
                    const percentage =
                      totalVotes > 0
                        ? Math.round((option.votes / totalVotes) * 100)
                        : 0;

                    return (
                      <div key={index} className="relative group">
                        <button
                          onClick={() => handleVote(poll._id, index)}
                          className="w-full relative overflow-hidden rounded-xl bg-black/30 border border-white/5 p-3 text-left transition-all hover:border-blue-500/50 group-hover:bg-black/40"
                        >
                          <div
                            className="absolute top-0 left-0 h-full bg-blue-600/20 transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                          ></div>

                          <div className="relative flex justify-between items-center z-10">
                            <span className="font-medium text-gray-200 group-hover:text-white transition-colors">
                              {option.text}
                            </span>
                            <span className="text-xs text-blue-300 font-bold">
                              {percentage}%
                            </span>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Info */}
                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-sm text-gray-400">
                  <p>
                    Total Votes:{" "}
                    <span className="text-white font-bold">{totalVotes}</span>
                  </p>
                  <button
                    onClick={() => navigate(`/dashboard/poll/${poll._id}`)}
                    className="text-blue-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

// ---------------------- 2. Poll Detail Component ----------------------
export function PollDetail() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteMessage, setVoteMessage] = useState(null);
  const navigate = useNavigate();

  const isAdmin = !!localStorage.getItem("admin");

  useEffect(() => {
    const fetchPoll = async () => {
      setLoading(true);
      setError(null);
      setVoteMessage(null);

      const url = isAdmin ? `/api/polls/admin/${id}` : `/api/polls/${id}`;

      try {
        const res = await api.get(url);
        setPoll(res.data);
        setSelectedOptionIndex(null);
      } catch (err) {
        console.error(`Failed to fetch poll ${id}:`, err);
        if (err.message === "Unauthorized access - Redirecting to login.") {
          return;
        }

        if (err.response && err.response.status === 404) {
          setError("Poll not found.");
        } else {
          setError(
            err.response?.data?.message ||
              err.response?.data?.msg ||
              "Could not load poll details.",
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [id, isAdmin]);

  const handleVote = async () => {
    if (selectedOptionIndex === null) {
      setVoteMessage({
        type: "error",
        text: "Please select an option before voting.",
      });
      return;
    }
    setVoteMessage(null);

    try {
      await api.post(`/api/polls/vote/${id}`, {
        optionIndex: selectedOptionIndex,
      });
      setVoteMessage({ type: "success", text: "Your vote has been recorded!" });

      // Refetch poll data
      const url = isAdmin ? `/api/polls/admin/${id}` : `/api/polls/${id}`;
      const res = await api.get(url);
      setPoll(res.data);
    } catch (err) {
      console.error("Error submitting vote:", err);
      let errMsg = "Error submitting vote.";
      if (err.response) {
        errMsg =
          err.response.data?.message ||
          err.response.data?.msg ||
          "An error occurred.";
        if (err.response.status === 401)
          errMsg = "Authentication error. Please log in again.";
        if (err.response.data?.msg?.includes("already voted")) {
          errMsg = "You have already voted in this poll.";
        }
      }
      setVoteMessage({ type: "error", text: errMsg });
    }
  };

  const backPath = isAdmin ? "/admin/manage-polls" : "/dashboard/voting";

  if (loading)
    return (
      <div className="text-center text-gray-400 py-20 animate-pulse">
        Loading poll details...
      </div>
    );
  if (error)
    return (
      <div className="text-center p-6 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl max-w-lg mx-auto mt-10">
        {error}
      </div>
    );
  if (!poll) return null;

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0,
  );

  return (
    <div className="max-w-3xl mx-auto p-4 animate-fade-in-up">
      {/* Header */}
      <button
        onClick={() => navigate(backPath)}
        className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Polls
      </button>

      {/* Glass Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        {/* Question Section */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-extrabold text-white mb-3">
            {poll.question}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <User size={14} className="opacity-70" />
              {poll.createdBy?.name || "Admin"}
            </div>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            <div className="flex items-center gap-1">
              <Clock size={14} className="opacity-70" />
              {new Date(poll.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Error/Success Message */}
        {voteMessage && (
          <div
            className={`flex items-center p-4 rounded-xl mb-6 text-sm font-medium border ${
              voteMessage.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-300"
                : "bg-green-500/10 border-green-500/20 text-green-300"
            }`}
          >
            {voteMessage.type === "error" ? (
              <AlertCircle size={18} className="mr-2" />
            ) : (
              <CheckCircle2 size={18} className="mr-2" />
            )}
            {voteMessage.text}
          </div>
        )}

        {/* Voting Options (Hidden if Admin) */}
        {!isAdmin && (
          <div className="space-y-3 mb-8">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
              Select an option
            </p>
            {poll.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-all duration-200 group
                            ${
                              selectedOptionIndex === index
                                ? "bg-blue-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                                : "bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10"
                            }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                            ${selectedOptionIndex === index ? "border-blue-400" : "border-gray-500 group-hover:border-gray-300"}`}
                >
                  {selectedOptionIndex === index && (
                    <div className="w-2.5 h-2.5 bg-blue-400 rounded-full"></div>
                  )}
                </div>
                <input
                  type="radio"
                  name="pollOption"
                  value={index}
                  checked={selectedOptionIndex === index}
                  onChange={() => setSelectedOptionIndex(index)}
                  className="hidden"
                />
                <span
                  className={`font-medium ${selectedOptionIndex === index ? "text-white" : "text-gray-300 group-hover:text-white"}`}
                >
                  {option.text}
                </span>
              </label>
            ))}
          </div>
        )}

        {/* Submit Button (Hidden if Admin) */}
        {!isAdmin && (
          <button
            onClick={handleVote}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mb-8"
          >
            Submit Vote <Send size={16} />
          </button>
        )}

        {/* Results Section */}
        <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-green-400" />
            Current Results
          </h3>

          {totalVotes === 0 ? (
            <p className="text-gray-500 text-sm italic">
              No votes cast yet. Be the first!
            </p>
          ) : (
            <div className="space-y-4">
              {poll.options.map((option, index) => {
                const percentage =
                  totalVotes > 0
                    ? Math.round((option.votes / totalVotes) * 100)
                    : 0;
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-gray-200 font-medium">
                        {option.text}
                      </span>
                      <span className="text-gray-400">
                        {option.votes} votes ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out relative"
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="pt-4 mt-4 border-t border-white/5 text-center">
                <p className="text-gray-400 text-sm">
                  Total Votes:{" "}
                  <span className="text-white font-bold">{totalVotes}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
