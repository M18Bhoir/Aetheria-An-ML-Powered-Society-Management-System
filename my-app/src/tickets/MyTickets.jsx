import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import TicketTimeline from "./TicketTimeline";
import TicketComments from "./TicketComments";
import {
  Ticket,
  PlusCircle,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Key,
} from "lucide-react";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/tickets/user");
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "P1":
        return "text-red-400 border-red-500/30 bg-red-500/10";
      case "P2":
        return "text-orange-400 border-orange-500/30 bg-orange-500/10";
      case "P3":
        return "text-blue-400 border-blue-500/30 bg-blue-500/10";
      default:
        return "text-gray-400 border-gray-500/30 bg-gray-500/10";
    }
  };

  const getStatusStyle = (status) => {
    return status === "Closed"
      ? "bg-green-500/20 text-green-300 border-green-500/30"
      : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Ticket className="text-blue-400" size={32} />
            My Tickets
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Track and manage your support requests.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchTickets}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            title="Refresh"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={() => navigate("/tickets/raise")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
          >
            <PlusCircle size={20} />
            Raise Ticket
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-gray-400 py-20 animate-pulse">
          Loading tickets...
        </p>
      )}

      {/* Empty State */}
      {!loading && tickets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
          <Ticket size={64} className="mb-4 opacity-20" />
          <p className="text-lg">No tickets raised yet.</p>
        </div>
      )}

      {/* Ticket Grid */}
      {!loading && tickets.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-white mb-1 line-clamp-1">
                    {ticket.title}
                  </h3>
                  <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                    {ticket.category}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(ticket.status)}`}
                >
                  {ticket.status}
                </span>
              </div>

              {/* Priority Badge */}
              <div className="mb-6">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded border ${getPriorityStyle(ticket.priority)}`}
                >
                  {ticket.priority} Priority
                </span>
              </div>

              {/* Timeline Component */}
              <div className="bg-black/20 rounded-xl p-4 mb-4 border border-white/5">
                <TicketTimeline ticket={ticket} />
              </div>

              {/* Comments Section */}
              <div className="mb-4">
                <TicketComments ticketId={ticket._id} />
              </div>

              {/* OTP Action (Footer) */}
              <div className="mt-auto pt-4 border-t border-white/10">
                {ticket.status === "Resolved" && !ticket.otpVerified ? (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-3 text-yellow-300">
                      <Key size={18} />
                      <span className="font-bold text-sm">
                        Closure Verification
                      </span>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          const res = await api.patch(
                            `/api/tickets/${ticket._id}/generate-otp`,
                          );
                          alert(`Your OTP: ${res.data.otp}`);
                        } catch (e) {
                          alert("Error generating OTP");
                        }
                      }}
                      className="w-full py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors text-sm"
                    >
                      Generate OTP
                    </button>
                    <p className="text-[10px] text-yellow-200/70 mt-2 text-center">
                      Share this code with the admin to close the ticket.
                    </p>
                  </div>
                ) : ticket.status === "Closed" ? (
                  <div className="flex items-center justify-center gap-2 text-green-400 py-2">
                    <CheckCircle size={18} />
                    <span className="font-medium text-sm">Ticket Closed</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-blue-400 py-2 opacity-70">
                    <AlertCircle size={18} />
                    <span className="font-medium text-sm">In Progress</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
