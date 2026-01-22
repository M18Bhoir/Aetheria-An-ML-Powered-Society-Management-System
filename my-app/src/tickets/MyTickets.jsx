import { useEffect, useState } from "react";
import axios from "axios";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios.get("/api/tickets/user")
      .then(res => setTickets(res.data))
      .catch(() => alert("Failed to load tickets"));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Tickets</h2>

      <div className="grid gap-4">
        {tickets.map(ticket => (
          <div key={ticket._id} className="border p-4 rounded shadow">
            <h3 className="font-semibold">{ticket.title}</h3>
            <p className="text-sm text-gray-600">{ticket.category}</p>
            <p>Status: <span className="font-medium">{ticket.status}</span></p>
            <p>Priority: {ticket.priority}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
