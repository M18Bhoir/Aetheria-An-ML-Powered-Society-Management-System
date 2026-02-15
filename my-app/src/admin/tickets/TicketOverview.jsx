import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import {
  CheckCircle,
  ShieldCheck,
  Send,
  Ticket,
  ArrowLeft,
  User,
  Lock,
  MessageCircle,
} from "lucide-react";

const TicketOverview = () => {
  const [tickets, setTickets] = useState([]);
  const [otpInputs, setOtpInputs] = useState({});
  const [isVerifying, setIsVerifying] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/tickets/all");
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleRequestClose = async (ticketId) => {
    try {
      await api.post(`/api/tickets/${ticketId}/request-close`);
      setIsVerifying((prev) => ({ ...prev, [ticketId]: true }));
      alert("OTP sent to resident. Please ask them for the 6-digit code.");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (ticketId) => {
    try {
      const otp = otpInputs[ticketId];
      if (!otp || otp.length < 4) return alert("Please enter a valid OTP");

      await api.post(`/api/tickets/${ticketId}/verify-close`, { otp });
      alert("Ticket closed successfully!");

      setIsVerifying((prev) => ({ ...prev, [ticketId]: false }));
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.msg || "Invalid OTP");
    }
  };

  const handleOtpChange = (ticketId, value) => {
    setOtpInputs((prev) => ({ ...prev, [ticketId]: value }));
  };

  const getStatusColor = (status) => {
    if (status === "Closed")
      return "text-green-400 border-green-500/30 bg-green-500/10";
    if (status === "Open")
      return "text-blue-400 border-blue-500/30 bg-blue-500/10";
    return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
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
            <Ticket className="text-blue-400" size={32} />
            Ticket Overview
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage and resolve resident complaints.
          </p>
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-4">
        {loading && (
          <p className="text-center text-gray-400 animate-pulse py-10">
            Loading tickets...
          </p>
        )}

        {!loading &&
          tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {ticket.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(ticket.status)}`}
                  >
                    {ticket.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-gray-300">
                    {ticket.priority}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <User size={14} /> {ticket.createdBy?.name || "Unknown"}
                  </div>
                  {ticket.description && (
                    <div className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      <span className="truncate max-w-xs">
                        {ticket.description}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Section */}
              <div className="w-full md:w-auto flex flex-col items-end gap-2">
                {ticket.status !== "Closed" && (
                  <>
                    {!isVerifying[ticket._id] ? (
                      <button
                        onClick={() => handleRequestClose(ticket._id)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 px-5 py-2.5 rounded-xl text-white font-medium transition-all"
                      >
                        <CheckCircle size={18} /> Close Ticket
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-black/20 p-2 rounded-xl border border-white/10">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Lock size={14} />
                          </div>
                          <input
                            type="text"
                            placeholder="Enter OTP"
                            className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 w-36 text-center text-white focus:outline-none focus:border-blue-500 transition-all"
                            value={otpInputs[ticket._id] || ""}
                            onChange={(e) =>
                              handleOtpChange(ticket._id, e.target.value)
                            }
                          />
                        </div>
                        <button
                          onClick={() => handleVerifyOtp(ticket._id)}
                          className="bg-green-600 hover:bg-green-500 text-white p-2.5 rounded-lg shadow-lg hover:shadow-green-500/20 transition-all"
                          title="Verify and Close"
                        >
                          <ShieldCheck size={20} />
                        </button>
                      </div>
                    )}
                  </>
                )}
                {ticket.status === "Closed" && (
                  <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
                    <CheckCircle size={18} />
                    <span className="font-medium">Resolved</span>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TicketOverview;
