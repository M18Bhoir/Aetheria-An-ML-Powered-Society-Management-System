import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function TicketOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("/api/admin/tickets/overview")
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  if (!stats) return <p className="text-white">Loading...</p>;

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Ticket Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total", value: stats.total, color: "bg-blue-600" },
          { label: "Open", value: stats.open, color: "bg-yellow-600" },
          {
            label: "In Progress",
            value: stats.inProgress,
            color: "bg-indigo-600",
          },
          { label: "Resolved", value: stats.resolved, color: "bg-green-600" },
        ].map((card) => (
          <div key={card.label} className={`p-6 rounded-lg ${card.color}`}>
            <p className="text-sm">{card.label}</p>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
