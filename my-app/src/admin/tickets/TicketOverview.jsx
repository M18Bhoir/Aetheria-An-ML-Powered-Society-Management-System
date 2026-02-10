import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { CheckCircle, ShieldCheck, Send } from "lucide-react";

const TicketOverview = () => {
  const [tickets, setTickets] = useState([]);
  const [otpInputs, setOtpInputs] = useState({}); // Stores OTP text per ticket ID
  const [isVerifying, setIsVerifying] = useState({}); // Tracks which ticket is in "OTP mode"

  const fetchTickets = async () => {
    try {
      const res = await api.get("/api/tickets/all");
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Step 1: Request Twilio OTP
  const handleRequestClose = async (ticketId) => {
    try {
      await api.post(`/api/tickets/${ticketId}/request-close`);
      setIsVerifying((prev) => ({ ...prev, [ticketId]: true }));
      alert("OTP sent to resident. Please ask them for the 6-digit code.");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to send OTP");
    }
  };

  // Step 2: Verify OTP and Close
  const handleVerifyOtp = async (ticketId) => {
    try {
      const otp = otpInputs[ticketId];
      if (!otp || otp.length < 4) return alert("Please enter a valid OTP");

      await api.post(`/api/tickets/${ticketId}/verify-close`, { otp });
      alert("Ticket closed successfully!");

      // Reset UI and refresh list
      setIsVerifying((prev) => ({ ...prev, [ticketId]: false }));
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.msg || "Invalid OTP");
    }
  };

  const handleOtpChange = (ticketId, value) => {
    setOtpInputs((prev) => ({ ...prev, [ticketId]: value }));
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6">Admin Ticket Overview</h2>
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-bold text-blue-400">
                {ticket.title}
              </h3>
              <p className="text-sm text-gray-400">
                Resident: {ticket.createdBy?.name} | Priority: {ticket.priority}
              </p>
              <p
                className={`text-xs mt-2 font-bold ${ticket.status === "Closed" ? "text-green-500" : "text-yellow-500"}`}
              >
                Status: {ticket.status}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              {ticket.status !== "Closed" && (
                <>
                  {!isVerifying[ticket._id] ? (
                    <button
                      onClick={() => handleRequestClose(ticket._id)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <CheckCircle size={18} /> Close Ticket
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-2 w-32 text-center"
                        value={otpInputs[ticket._id] || ""}
                        onChange={(e) =>
                          handleOtpChange(ticket._id, e.target.value)
                        }
                      />
                      <button
                        onClick={() => handleVerifyOtp(ticket._id)}
                        className="bg-green-600 hover:bg-green-700 p-2 rounded-lg"
                        title="Verify and Close"
                      >
                        <ShieldCheck size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
              {ticket.status === "Closed" && (
                <span className="text-green-500 italic">Resolved</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketOverview;
