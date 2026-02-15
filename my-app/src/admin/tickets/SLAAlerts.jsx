import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import api from "../../utils/api";

export default function SLAAlerts() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/admin/tickets/sla-breached")
      .then((res) => setTickets(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <AlertTriangle className="text-red-500" size={32} />
            SLA Breaches
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Tickets that have exceeded their resolution time limit.
          </p>
        </div>
      </div>

      {/* Glass Container */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Critical Alerts</h3>
          <span className="text-xs text-red-300 bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-full animate-pulse">
            {tickets.length} Active Breaches
          </span>
        </div>

        {loading && (
          <p className="p-8 text-center text-gray-400 animate-pulse">
            Scanning tickets...
          </p>
        )}

        {!loading && tickets.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <CheckCircle size={48} className="mb-4 text-green-500/50" />
            <p className="text-green-400 font-medium">
              No SLA breaches detected! 🎉
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Great job keeping up with support.
            </p>
          </div>
        )}

        {!loading && tickets.length > 0 && (
          <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl relative overflow-hidden hover:bg-red-500/20 transition-all duration-300 group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20">
                  <Clock size={48} />
                </div>

                <h3 className="font-bold text-white text-lg mb-1 z-10 relative">
                  {ticket.title}
                </h3>
                <div className="flex items-center gap-2 mb-4 z-10 relative">
                  <span className="text-xs font-bold text-red-300 uppercase tracking-wider bg-red-500/20 px-2 py-0.5 rounded">
                    {ticket.priority} Priority
                  </span>
                </div>

                <div className="flex items-center text-red-200 text-sm font-mono mt-4 pt-4 border-t border-red-500/20">
                  <Clock size={16} className="mr-2" />
                  Overdue by {ticket.slaExceededHours} hrs
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
