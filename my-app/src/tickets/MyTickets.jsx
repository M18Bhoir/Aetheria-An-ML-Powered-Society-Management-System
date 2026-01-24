import { useEffect, useState } from "react";
import api from "../utils/api";

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
      <h2 className="text-2xl font-bold mb-4 text-white">🎫 My Tickets</h2>

      {tickets.length === 0 ? (
        <p className="text-gray-400">No tickets raised yet.</p>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-gray-800 border border-gray-700 p-4 rounded shadow"
            >
              <h3 className="font-semibold text-lg text-white">
                {ticket.title}
              </h3>

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
