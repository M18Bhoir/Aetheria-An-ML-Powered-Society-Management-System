// my-app/src/pages/AnalyticsDashboard.jsx
import { useEffect, useState } from "react";
import {
  getComplaintCategories,
  getAmenityPeakHours,
  getVisitorTrends,
  getMaintenanceCollection, // ✅ Import this
} from "../services/analyticsApi";
import Chart from "../Components/Charts";

export default function AnalyticsDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [amenity, setAmenity] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [maintenance, setMaintenance] = useState([]); // ✅ New state

  useEffect(() => {
    getComplaintCategories().then((res) => setComplaints(res.data));
    getAmenityPeakHours().then((res) => setAmenity(res.data));
    getVisitorTrends().then((res) => setVisitors(res.data));
    getMaintenanceCollection().then((res) => setMaintenance(res.data)); // ✅ Fetch data
  }, []);

  return (
    <div className="p-6 grid grid-cols-2 gap-6 bg-gray-900 min-h-screen">
      {/* 1. Complaints Chart */}
      <div className="bg-gray-800 p-4 rounded h-[350px]">
        <h2 className="text-white font-semibold mb-2">
          Complaints by Category
        </h2>
        <div className="h-[260px]">
          <Chart
            data={complaints}
            type="bar"
            dataKey="count"
            xAxis="category"
          />
        </div>
      </div>

      {/* 2. Amenity Peak Hours */}
      <div className="bg-gray-800 p-4 rounded h-[350px]">
        <h2 className="text-white font-semibold mb-2">Amenity Peak Hours</h2>
        <div className="h-[260px]">
          <Chart data={amenity} type="bar" dataKey="bookings" xAxis="hour" />
        </div>
      </div>

      {/* 3. Maintenance Collection Rate ✅ NEW */}
      <div className="bg-gray-800 p-4 rounded h-[350px]">
        <h2 className="text-white font-semibold mb-2">
          Maintenance Collection (%)
        </h2>
        <div className="h-[260px]">
          <Chart
            data={maintenance}
            type="area"
            dataKey="collectionRate"
            xAxis="month"
          />
        </div>
      </div>

      {/* 4. Visitor Trends */}
      <div className="bg-gray-800 p-4 rounded h-[350px]">
        <h2 className="text-white font-semibold mb-2">Visitor Trends</h2>
        <div className="h-[260px]">
          <Chart data={visitors} type="line" dataKey="visitors" xAxis="date" />
        </div>
      </div>
    </div>
  );
}
