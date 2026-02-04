import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function TicketOverview() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    pendingClosure: 0,
    closed: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/admin/tickets/overview");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats");
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Tickets", value: stats.total, color: "bg-blue-600" },
    { label: "Open", value: stats.open, color: "bg-red-500" },
    { label: "In Progress", value: stats.inProgress, color: "bg-yellow-500" },
    {
      label: "Pending Closure",
      value: stats.pendingClosure,
      color: "bg-orange-400",
    },
    { label: "Closed", value: stats.closed, color: "bg-green-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} p-4 rounded shadow text-white`}
        >
          <h3 className="text-sm font-semibold uppercase">{card.label}</h3>
          <p className="text-3xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
