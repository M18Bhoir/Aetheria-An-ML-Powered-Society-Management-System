import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function TicketOverview() {
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [statsRes, ticketsRes] = await Promise.all([
      api.get("/api/admin/tickets/overview"),
      api.get("/api/admin/tickets"),
    ]);
    setStats(statsRes.data);
    setTickets(ticketsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const requestCloseTicket = async (id) => {
    try {
      await api.post(`/api/admin/tickets/${id}/request-close`);
      alert("OTP sent to resident");
      fetchData();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to request close");
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="p-6 text-white space-y-6">
      <h2 className="text-2xl font-bold">Ticket Overview</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-600 p-4 rounded">Total: {stats.total}</div>
        <div className="bg-yellow-600 p-4 rounded">Open: {stats.open}</div>
        <div className="bg-green-600 p-4 rounded">Closed: {stats.closed}</div>
      </div>

      <table className="w-full mt-6 text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th>Title</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((t) => (
            <tr key={t._id} className="border-b border-gray-800">
              <td>{t.title}</td>
              <td>{t.status}</td>
              <td>{new Date(t.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  disabled={t.status !== "Open"}
                  onClick={() => requestCloseTicket(t._id)}
                  className={`px-3 py-1 rounded text-sm
                    ${
                      t.status === "Open"
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-gray-500 cursor-not-allowed"
                    }`}
                >
                  {t.status === "Pending Closure"
                    ? "OTP Sent"
                    : "Request Close"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
