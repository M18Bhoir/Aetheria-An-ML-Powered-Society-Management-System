import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { BarChart3, Clock, CheckCircle, Tag, ArrowLeft } from "lucide-react";

export default function TicketReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/admin/tickets/reports")
      .then((res) => setReport(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const StatTile = ({ title, value, icon: Icon, colorClass, subText }) => (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-lg hover:bg-white/10 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-20`}>
          <Icon
            size={24}
            className={colorClass.replace("bg-", "text-").replace("/20", "")}
          />
        </div>
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-white mt-1 group-hover:scale-105 transition-transform origin-left">
          {value}
        </h3>
        {subText && <p className="text-xs text-gray-500 mt-2">{subText}</p>}
      </div>
    </div>
  );

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
            <BarChart3 className="text-blue-400" size={32} />
            Ticket Analytics
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Performance metrics for support resolution.
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-center text-gray-400 py-20 animate-pulse">
          Gathering data...
        </p>
      )}

      {!loading && report && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatTile
            title="Total Tickets"
            value={report.total}
            icon={Tag}
            colorClass="bg-blue-500"
            subText="All time volume"
          />
          <StatTile
            title="Avg Resolution"
            value={`${report.avgResolution} hrs`}
            icon={Clock}
            colorClass="bg-purple-500"
            subText="Time to close"
          />
          <StatTile
            title="SLA Compliance"
            value={`${report.slaCompliance}%`}
            icon={CheckCircle}
            colorClass="bg-green-500"
            subText="Tickets within time limit"
          />
          <StatTile
            title="Top Category"
            value={report.topCategory || "N/A"}
            icon={BarChart3}
            colorClass="bg-orange-500"
            subText="Most frequent issue"
          />
        </div>
      )}

      {!loading && report && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center mt-8">
          <p className="text-gray-400 italic">
            Detailed CSV export and charts coming soon.
          </p>
        </div>
      )}
    </div>
  );
}
