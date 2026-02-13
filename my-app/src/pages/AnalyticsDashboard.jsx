import { useEffect, useState } from "react";
import {
  getComplaintCategories,
  getAmenityPeakHours,
  getVisitorTrends,
  getEquipmentFailurePrediction,
} from "../services/analyticsApi";
import Chart from "../Components/Charts";

export default function AnalyticsDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [amenity, setAmenity] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    getComplaintCategories().then((res) => setComplaints(res.data || []));
    getAmenityPeakHours().then((res) => setAmenity(res.data || []));
    getVisitorTrends().then((res) => setVisitors(res.data || []));
    getEquipmentFailurePrediction().then((res) => setEquipment(res.data || []));
  }, []);

  return (
    /* Changed lg:grid-cols-3 to lg:grid-cols-2 to create the 2x2 arrangement */
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 bg-gray-900 min-h-screen">
      {/* Row 1: Item 1 - Complaint Graph */}
      <div className="bg-gray-800 p-4 rounded h-[350px] flex flex-col">
        <h2 className="text-white font-semibold mb-2">
          Complaints by Category
        </h2>
        <div className="flex-1">
          <Chart
            data={complaints}
            type="bar"
            dataKey="count"
            xAxis="category"
          />
        </div>
      </div>

      {/* Row 1: Item 2 - Visitor Graph */}
      <div className="bg-gray-800 p-4 rounded h-[350px] flex flex-col">
        <h2 className="text-white font-semibold mb-2">Visitor Trends</h2>
        <div className="flex-1">
          <Chart data={visitors} type="line" dataKey="visitors" xAxis="date" />
        </div>
      </div>

      {/* Row 2: Item 1 - Equipment Graph */}
      <div className="bg-gray-800 p-4 rounded h-[350px] flex flex-col">
        <h2 className="text-white font-semibold mb-2">
          Equipment Failure Risk
        </h2>
        <div className="flex-1">
          <Chart data={equipment} type="area" dataKey="yhat" xAxis="ds" />
        </div>
      </div>

      {/* Row 2: Item 2 - Amenity Usage Graph */}
      <div className="bg-gray-800 p-4 rounded h-[350px] flex flex-col">
        <h2 className="text-white font-semibold mb-2">Amenity Peak Usage</h2>
        <div className="flex-1">
          <Chart data={amenity} type="bar" dataKey="bookings" xAxis="hour" />
        </div>
      </div>
    </div>
  );
}
