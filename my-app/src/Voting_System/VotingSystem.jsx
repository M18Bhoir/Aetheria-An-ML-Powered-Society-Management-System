import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import {
  Vote,
  ArrowLeft,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  User,
  AlertCircle,
  Send,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.02 },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 150, damping: 20 },
  },
};

// ---------------------- 1. Poll List Component ----------------------
export function PollList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isAdmin = !!localStorage.getItem("admin");

  const fetchPolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/polls`);
      setPolls(res.data);
    } catch (err) {
      console.error("Failed to fetch polls:", err);
      if (err.message !== "Unauthorized access - Redirecting to login.") {
        setError(err.response?.data?.message || "Could not load polls.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    if (!window.confirm("Confirm your vote? This action cannot be undone.")) {
      return;
    }
    try {
      await api.post(`/api/polls/${pollId}/vote`, { optionIndex });
      fetchPolls();
    } catch (err) {
      alert(err.response?.data?.msg || "Vote failed.");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto space-y-10 p-4 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <motion.div variants={itemVariants}>
          <button
            onClick={() => navigate("/dashboard")}
            className="group flex items-center text-sm font-semibold text-gray-500 hover:text-white transition-all mb-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-white/10"
          >
            <ArrowLeft
              size={16}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
              <Vote className="text-blue-400" size={32} />
            </div>
            <span className="text-gradient uppercase">Community Polls</span>
          </h1>
          <p className="text-gray-400 font-medium mt-2 tracking-wide">
            Participate in society's decision-making process.
          </p>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() =>
            navigate(isAdmin ? "/admin/create-poll" : "/dashboard/create-poll")
          }
          className="flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-bold shadow-2xl shadow-blue-900/40 transition-all border border-blue-400/20"
        >
          <Plus size={20} className="mr-2" />
          Create New Poll
        </motion.button>
      </div>

      {loading && (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 glass-card animate-pulse"></div>
          ))}
        </div>
      )}

      {error && (
        <motion.div
          variants={itemVariants}
          className="text-center p-8 glass-dark border border-rose-500/20 rounded-3xl text-rose-300 shadow-2xl"
        >
          <AlertCircle size={40} className="mx-auto mb-4 opacity-50" />
          <p className="font-bold">{error}</p>
        </motion.div>
      )}

      {!loading && !error && polls.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center p-20 glass-card text-gray-500"
        >
          <Vote size={64} className="mb-6 opacity-10" />
          <p className="text-lg font-bold tracking-tight">
            No active polls found.
          </p>
        </motion.div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {!loading &&
          polls.map((poll) => {
            const totalVotes = poll.options.reduce(
              (acc, opt) => acc + opt.votes,
              0,
            );

            return (
              <motion.div
                key={poll._id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="glass-card glass-card-hover p-8 shadow-2xl flex flex-col group overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity pointer-events-none group-hover:scale-110 transition-transform duration-300">
                  <Vote size={120} strokeWidth={1} />
                </div>

                {/* Poll Header */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <h3
                    className="text-2xl font-extrabold text-white leading-tight cursor-pointer hover:text-blue-400 transition-colors tracking-tight"
                    onClick={() => navigate(`/dashboard/poll/${poll._id}`)}
                  >
                    {poll.question}
                  </h3>
                  <div className="flex items-center bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl whitespace-nowrap ml-4">
                    <Clock size={12} className="mr-2 text-blue-400" />
                    <span className="text-[10px] font-black uppercase text-gray-400">
                      {new Date(poll.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Options Preview */}
                <div className="space-y-4 flex-1 relative z-10">
                  {poll.options.map((option, index) => {
                    const percentage =
                      totalVotes > 0
                        ? Math.round((option.votes / totalVotes) * 100)
                        : 0;

                    return (
                      <div key={index} className="relative">
                        <div className="relative overflow-hidden rounded-2xl bg-black/40 border border-white/5 p-4 text-left group/opt transition-all hover:border-blue-500/30">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full bg-blue-600/10"
                          ></motion.div>

                          <div className="relative flex justify-between items-center z-10">
                            <span className="text-sm font-bold text-gray-300 group-hover/opt:text-white transition-colors">
                              {option.text}
                            </span>
                            <span className="text-xs font-black text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Info */}
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center relative z-10">
                  <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">
                    Total:{" "}
                    <span className="text-white ml-1">{totalVotes} VOTES</span>
                  </p>
                  <button
                    onClick={() => navigate(`/dashboard/poll/${poll._id}`)}
                    className="flex items-center gap-2 text-blue-400 hover:text-white transition-all text-[11px] font-black uppercase tracking-widest group/btn"
                  >
                    Details
                    <ArrowRight
                      size={14}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </motion.div>
            );
          })}
      </div>
    </motion.div>
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
      const url = isAdmin ? `/api/polls/admin/${id}` : `/api/polls/${id}`;
      try {
        const res = await api.get(url);
        setPoll(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load poll details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [id, isAdmin]);

  const handleVote = async () => {
    if (selectedOptionIndex === null) {
      setVoteMessage({ type: "error", text: "Please select an option first." });
      return;
    }
    try {
      if (!window.confirm("Confirm your vote?")) return;
      await api.post(`/api/polls/${id}/vote`, {
        optionIndex: selectedOptionIndex,
      });
      setVoteMessage({ type: "success", text: "Vote recorded successfully!" });
      const res = await api.get(
        isAdmin ? `/api/polls/admin/${id}` : `/api/polls/${id}`,
      );
      setPoll(res.data);
    } catch (err) {
      setVoteMessage({
        type: "error",
        text: err.response?.data?.msg || "Vote failed.",
      });
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-400 py-32 animate-pulse font-bold uppercase tracking-widest">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="max-w-lg mx-auto mt-20 p-8 glass-card border-rose-500/20 text-rose-400 text-center font-bold shadow-2xl">
        {error}
      </div>
    );
  if (!poll) return null;

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0,
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto p-4 py-12"
    >
      <button
        onClick={() =>
          navigate(isAdmin ? "/admin/manage-polls" : "/dashboard/voting")
        }
        className="group flex items-center text-sm font-semibold text-gray-500 hover:text-white transition-all mb-8 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-white/10"
      >
        <ArrowLeft
          size={16}
          className="mr-2 group-hover:-translate-x-1 transition-transform"
        />
        Back to Polls
      </button>

      <div className="glass-card p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
          <Vote size={240} strokeWidth={1} />
        </div>

        <div className="mb-10 relative z-10">
          <h1 className="text-4xl font-black tracking-tight text-white mb-6 leading-tight">
            {poll.question}
          </h1>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
              <User size={16} className="text-blue-400" />
              <span className="text-sm font-bold text-gray-300">
                {poll.createdBy?.name || "Admin"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
              <Clock size={16} className="text-blue-400" />
              <span className="text-sm font-bold text-gray-300">
                {new Date(poll.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {voteMessage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`flex items-center p-5 rounded-2xl mb-8 text-sm font-black uppercase tracking-wide border overflow-hidden ${
                voteMessage.type === "error"
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}
            >
              <AlertCircle size={20} className="mr-3 shrink-0" />
              {voteMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 px-2">
              Select Your Option
            </h3>
            {poll.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center gap-4 p-5 rounded-2xl cursor-pointer border transition-all duration-200 group
                           ${selectedOptionIndex === index ? "bg-blue-600/20 border-blue-500/50 shadow-2xl shadow-blue-500/10" : "bg-black/30 border-white/5 hover:bg-white/5"}`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selectedOptionIndex === index ? "border-blue-400 scale-110" : "border-gray-500 group-hover:border-gray-300"}`}
                >
                  {selectedOptionIndex === index && (
                    <motion.div
                      layoutId="dot"
                      className="w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]"
                    ></motion.div>
                  )}
                </div>
                <input
                  type="radio"
                  value={index}
                  checked={selectedOptionIndex === index}
                  onChange={() => setSelectedOptionIndex(index)}
                  className="hidden"
                />
                <span
                  className={`font-bold tracking-tight text-lg ${selectedOptionIndex === index ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}
                >
                  {option.text}
                </span>
              </label>
            ))}
            <button
              onClick={handleVote}
              className="w-full mt-6 py-5 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:bg-blue-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              Submit Vote <Send size={18} />
            </button>
          </div>

          <div className="bg-black/30 rounded-[32px] p-8 border border-white/5 shadow-inner">
            <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Live Results
            </h3>
            <div className="space-y-6">
              {poll.options.map((option, index) => {
                const percentage =
                  totalVotes > 0
                    ? Math.round((option.votes / totalVotes) * 100)
                    : 0;
                return (
                  <div key={index}>
                    <div className="flex justify-between items-end mb-2 px-1">
                      <span className="text-sm font-bold text-gray-300">
                        {option.text}
                      </span>
                      <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg uppercase">
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/5 shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full relative"
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-30"></div>
                      </motion.div>
                    </div>
                    <p className="text-[10px] text-gray-600 font-bold mt-1.5 px-1 uppercase tracking-tighter">
                      {option.votes} total votes
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">
                Total Participation
              </span>
              <span className="text-2xl font-black text-white">
                {totalVotes}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
