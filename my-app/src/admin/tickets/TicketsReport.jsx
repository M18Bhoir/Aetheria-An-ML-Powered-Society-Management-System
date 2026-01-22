import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function TicketReports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    api
      .get("/api/admin/tickets/reports")
      .then((res) => setReport(res.data))
      .catch(console.error);
  }, []);

  if (!report) return <p className="text-white">Loading...</p>;

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Ticket Reports</h2>

      <div className="bg-gray-800 p-6 rounded">
        <p>
          Total Tickets: <b>{report.total}</b>
        </p>
        <p>
          Avg Resolution Time: <b>{report.avgResolution} hrs</b>
        </p>
        <p>
          SLA Compliance: <b>{report.slaCompliance}%</b>
        </p>
        <p>
          Most Common Category: <b>{report.topCategory}</b>
        </p>
      </div>
    </div>
  );
}
