import { useEffect, useState } from "react";
import api from "../../utils/api";
import TicketTimeline from "../../tickets/TicketTimeline";

export default function AssignTickets() {
  const [tickets, setTickets] = useState([]);
  const [staff, setStaff] = useState([]);
  const [otpMap, setOtpMap] = useState({}); // ticketId → otp

  useEffect(() => {
    api
      .get("/api/admin/tickets/unassigned")
      .then((res) => setTickets(res.data))
      .catch(console.error);

    api
      .get("/api/admin/staff")
      .then((res) => setStaff(res.data))
      .catch(console.error);
  }, []);

  /* ================= ASSIGN TICKET ================= */
  const assign = async (ticketId, staffId) => {
    if (!staffId) return;

    try {
      await api.put("/api/admin/tickets/assign", { ticketId, staffId });
      alert("Ticket assigned successfully");
    } catch {
      alert("Failed to assign ticket");
    }
  };

  /* ================= CLOSE WITH OTP ================= */
  const closeTicket = async (ticketId) => {
    const otp = otpMap[ticketId];
    if (!otp) return alert("Please enter OTP");

    try {
      await api.patch(`/api/admin/tickets/${ticketId}/close-with-otp`, { otp });

      alert("Ticket closed successfully");

      // Remove closed ticket from list
      setTickets((prev) => prev.filter((t) => t._id !== ticketId));
    } catch {
      alert("Invalid or expired OTP");
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">🎯 Assign & Close Tickets</h2>

      {tickets.length === 0 && (
        <p className="text-gray-400">No unassigned tickets</p>
      )}

      {tickets.map((ticket) => (
        <div
          key={ticket._id}
          className="bg-gray-800 p-4 rounded mb-4 space-y-3"
        >
          <div>
            <p className="font-semibold text-lg">{ticket.title}</p>
            <p className="text-sm text-gray-300">{ticket.category}</p>
            <p className="text-sm text-gray-400">
              Priority: {ticket.priority || "Normal"}
            </p>
            <TicketTimeline ticket={ticket} />
          </div>

          {/* ===== ASSIGN STAFF ===== */}
          <select
            className="w-full bg-gray-700 p-2 rounded text-white"
            onChange={(e) => assign(ticket._id, e.target.value)}
          >
            <option value="">Assign to staff</option>
            {staff.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* ===== OTP CLOSE SECTION ===== */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter OTP from resident"
              value={otpMap[ticket._id] || ""}
              onChange={(e) =>
                setOtpMap({
                  ...otpMap,
                  [ticket._id]: e.target.value,
                })
              }
              className="flex-1 p-2 rounded text-black"
            />

            <button
              onClick={() => closeTicket(ticket._id)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
