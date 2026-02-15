import { useState } from "react";
import api from "../utils/api";
import TicketTimeline from "./TicketTimeline";
import { Search, Ticket, AlertCircle } from "lucide-react";

export default function TrackTicket() {
  const [ticketId, setTicketId] = useState("");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!ticketId.trim()) return;

    setLoading(true);
    setError(null);
    setTicket(null);

    try {
      const res = await api.get(`/api/tickets/${ticketId}`);
      setTicket(res.data);
    } catch (err) {
      setError(
        err.response?.status === 404
          ? "Ticket not found. Please check the ID."
          : "You do not have permission to view this ticket.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-fade-in-up p-4 min-h-[60vh] flex flex-col justify-center">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-white mb-2 flex justify-center items-center gap-3">
          <Ticket className="text-blue-400" size={40} />
          Track Ticket
        </h2>
        <p className="text-gray-400">
          Enter your Ticket ID to check its current status.
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
        <form onSubmit={handleTrack} className="flex flex-col gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Enter Ticket ID (e.g., 65a...)"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-lg font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl shadow-lg text-lg font-bold text-white tracking-wide transition-all duration-300 transform hover:-translate-y-0.5
                ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30 border border-transparent hover:border-blue-400/30"
                }`}
          >
            {loading ? "Searching..." : "Track Status"}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-300 flex items-center justify-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Result Card */}
      {ticket && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-lg animate-fade-in">
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/10">
            <div>
              <h3 className="text-xl font-bold text-white">{ticket.title}</h3>
              <span className="text-sm text-gray-400">
                Category: {ticket.category}
              </span>
            </div>
            <span className="px-3 py-1 bg-white/10 rounded-lg text-sm font-bold text-white border border-white/10">
              {ticket.status}
            </span>
          </div>

          <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              History
            </h4>
            <TicketTimeline ticket={ticket} />
          </div>
        </div>
      )}
    </div>
  );
}
