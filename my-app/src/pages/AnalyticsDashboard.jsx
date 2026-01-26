// pages/AnalyticsDashboard.jsx
import { useEffect, useState } from "react";
import {
  getMaintenanceCollection,
  getComplaintCategories,
  getAmenityPeakHours,
  getVisitorTrends,
} from "../services/analyticsApi";

import Chart from "../Components/Charts";

export default function AnalyticsDashboard() {
  const [maintenance, setMaintenance] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [amenity, setAmenity] = useState([]);
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    getMaintenanceCollection().then((res) => setMaintenance(res.data));
    getComplaintCategories().then((res) => setComplaints(res.data));
    getAmenityPeakHours().then((res) => setAmenity(res.data));
    getVisitorTrends().then((res) => setVisitors(res.data));
  }, []);

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      <Chart />
    </div>
  );
}
