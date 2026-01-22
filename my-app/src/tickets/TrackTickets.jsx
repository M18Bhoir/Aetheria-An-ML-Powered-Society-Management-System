import { useState } from "react";
import axios from "axios";

export default function TrackTicket() {
  const [ticketId, setTicketId] = useState("");
  const [ticket, setTicket] = useState(null);

  const handleTrack = async () => {
    try {
      const res = await axios.get(`/api/tickets/${ticketId}`);
      setTicket(res.data);
    } catch {
      alert("Ticket not found");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Track Ticket</h2>

      <input
        type="text"
        placeholder="Enter Ticket ID"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      <button onClick={handleTrack} className="bg-green-600 text-white px-4 py-2 rounded">
        Track
      </button>

      {ticket && (
        <div className="mt-4 border p-4 rounded">
          <h3 className="font-semibold">{ticket.title}</h3>
          <p>Status: {ticket.status}</p>
          <p>Assigned To: {ticket.assignedTo || "Pending"}</p>
        </div>
      )}
    </div>
  );
}
