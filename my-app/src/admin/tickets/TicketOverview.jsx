import { useEffect, useState } from "react";
import api from "../../utils/api"; // ✅ FIXED PATH

export default function TicketOverview() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/admin/tickets/overview");
        setStats(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load ticket statistics");
      }
    };

    fetchStats();
  }, []);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!stats) return <p className="text-white">Loading...</p>;

  const cards = [
    { label: "Total", value: stats.total ?? 0, color: "bg-blue-600" },
    { label: "Open", value: stats.open ?? 0, color: "bg-yellow-600" },
    { label: "Assigned", value: stats.assigned ?? 0, color: "bg-indigo-600" },
    { label: "Closed", value: stats.closed ?? 0, color: "bg-green-600" },
  ];

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">📊 Ticket Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`p-6 rounded-lg shadow-lg ${card.color}`}
          >
            <p className="text-sm opacity-80">{card.label}</p>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
