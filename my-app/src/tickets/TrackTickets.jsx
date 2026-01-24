// src/tickets/TrackTickets.jsx
import { useState } from "react";
import api from "../utils/api";

export default function TrackTicket() {
  const [ticketId, setTicketId] = useState("");
  const [ticket, setTicket] = useState(null);

  const handleTrack = async () => {
    try {
      const res = await api.get(`/api/tickets/${ticketId}`);
      setTicket(res.data);
    } catch (err) {
      alert("Ticket not found or Unauthorized");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4 text-white">🎫 Track Ticket</h2>

      <input
        type="text"
        placeholder="Enter Ticket ID"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
        className="w-full p-2 rounded mb-3 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <button
        onClick={handleTrack}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Track
      </button>

      {ticket && (
        <div className="mt-6 p-4 rounded bg-gray-800 text-white border border-gray-700">
          <h3 className="text-lg font-semibold mb-2">{ticket.title}</h3>

          <p>
            <span className="font-semibold">Status:</span> {ticket.status}
          </p>

          <p>
            <span className="font-semibold">Assigned To:</span>{" "}
            {ticket.assignedTo
              ? ticket.assignedTo.name || "Assigned"
              : "Pending"}
          </p>
        </div>
      )}
    </div>
  );
}
