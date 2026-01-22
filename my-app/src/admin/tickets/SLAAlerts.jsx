import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function SLAAlerts() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    api
      .get("/api/admin/tickets/sla-breached")
      .then((res) => setTickets(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">SLA Alerts</h2>

      {tickets.length === 0 && (
        <p className="text-green-400">No SLA breaches 🎉</p>
      )}

      {tickets.map((ticket) => (
        <div key={ticket._id} className="bg-red-700 p-4 rounded mb-4">
          <p className="font-bold">{ticket.title}</p>
          <p className="text-sm">Priority: {ticket.priority}</p>
          <p className="text-sm">Exceeded by {ticket.slaExceededHours} hrs</p>
        </div>
      ))}
    </div>
  );
}
