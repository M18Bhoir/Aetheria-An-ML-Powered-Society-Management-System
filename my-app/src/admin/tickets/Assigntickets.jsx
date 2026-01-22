import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function AssignTickets() {
  const [tickets, setTickets] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    api
      .get("/api/admin/tickets/unassigned")
      .then((res) => setTickets(res.data));
    api.get("/api/admin/staff").then((res) => setStaff(res.data));
  }, []);

  const assign = async (ticketId, staffId) => {
    await api.put("/api/admin/tickets/assign", { ticketId, staffId });
    setTickets(tickets.filter((t) => t._id !== ticketId));
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Assign Tickets</h2>

      {tickets.map((ticket) => (
        <div key={ticket._id} className="bg-gray-800 p-4 rounded mb-4">
          <p className="font-semibold">{ticket.title}</p>
          <p className="text-sm text-gray-300">{ticket.category}</p>

          <select
            className="mt-2 bg-gray-700 p-2 rounded text-white"
            onChange={(e) => assign(ticket._id, e.target.value)}
          >
            <option value="">Assign to staff</option>
            {staff.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
