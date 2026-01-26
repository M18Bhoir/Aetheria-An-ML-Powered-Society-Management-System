import { useEffect, useState } from "react";
import api from "../utils/api";
import TicketTimeline from "./TicketTimeline";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    api
      .get("/api/tickets/user")
      .then((res) => setTickets(res.data))
      .catch(() => alert("Failed to load tickets"));
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">🎫 My Tickets</h2>

      {tickets.length === 0 ? (
        <p className="text-gray-400">No tickets raised yet.</p>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-gray-800 border border-gray-700 p-4 rounded shadow"
            >
              <h3 className="font-semibold text-lg">{ticket.title}</h3>

              <p className="text-sm text-gray-400">
                Category: {ticket.category}
              </p>

              <p className="mt-1">
                <span className="font-medium text-gray-300">Status:</span>{" "}
                {ticket.status}
              </p>

              <p>
                <span className="font-medium text-gray-300">Priority:</span>{" "}
                {ticket.priority}
              </p>
              <TicketTimeline ticket={ticket} />

              {/* OTP section */}
              {ticket.status === "Resolved" && !ticket.otpVerified && (
                <div className="mt-3 bg-gray-700 p-3 rounded">
                  <button
                    onClick={async () => {
                      const res = await api.patch(
                        `/api/tickets/${ticket._id}/generate-otp`,
                      );
                      alert(`Your OTP: ${res.data.otp}`);
                    }}
                    className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold"
                  >
                    Generate OTP
                  </button>

                  <p className="text-yellow-400 mt-2 text-sm">
                    Share this OTP with admin to close ticket
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
