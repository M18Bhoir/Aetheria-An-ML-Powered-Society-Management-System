import { useEffect, useState } from "react";
import {
  getComplaintCategories,
  getAmenityPeakHours,
  getVisitorTrends,
} from "../services/analyticsApi";

import Chart from "../Components/Charts";

export default function AnalyticsDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [amenity, setAmenity] = useState([]);
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    getComplaintCategories().then((res) => setComplaints(res.data));
    getAmenityPeakHours().then((res) => setAmenity(res.data));

    getVisitorTrends().then((res) =>
      setVisitors(res.data.map((d) => ({ ...d }))),
    );
  }, []);

  return (
    <div className="p-6 grid grid-cols-2 gap-6 bg-gray-900 min-h-screen">
      {/* Complaints */}
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

      {/* Amenity Peak Hours */}
      <div className="bg-gray-800 p-4 rounded h-[350px]">
        <h2 className="text-white font-semibold mb-2">Amenity Peak Hours</h2>
        <div className="h-[260px]">
          <Chart data={amenity} type="bar" dataKey="bookings" xAxis="hour" />
        </div>
      </div>

      {/* Visitor Trends */}
      <div className="bg-gray-800 p-4 rounded h-[350px] col-span-2">
        <h2 className="text-white font-semibold mb-2">Visitor Trends</h2>
        <div className="h-[260px]">
          <Chart data={visitors} type="line" dataKey="visitors" xAxis="date" />
        </div>
      </div>
    </div>
  );
}
