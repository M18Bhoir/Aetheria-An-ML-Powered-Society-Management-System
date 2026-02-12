import { useEffect, useState } from "react";
import {
  getComplaintCategories,
  getAmenityPeakHours,
  getVisitorTrends,
  getMaintenanceCollection,
  getMaintenancePrediction, // Added
  getEquipmentFailurePrediction, // Added
} from "../services/analyticsApi";
import Chart from "../Components/Charts";

export default function AnalyticsDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [amenity, setAmenity] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [maintenanceCol, setMaintenanceCol] = useState([]);
  const [maintenancePred, setMaintenancePred] = useState([]);
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    getComplaintCategories().then((res) => setComplaints(res.data));
    getAmenityPeakHours().then((res) => setAmenity(res.data));
    getVisitorTrends().then((res) => setVisitors(res.data));
    getMaintenanceCollection().then((res) => setMaintenanceCol(res.data));
    getEquipmentFailurePrediction().then((res) => setEquipment(res.data));

    // Fetch ML Predictions
    getMaintenancePrediction().then((res) => {
      const combined = [
        ...(res.data.actual || []).map((d) => ({ ...d, type: "actual" })),
        ...(res.data.predicted || []).map((d) => ({ ...d, type: "predicted" })),
      ];
      setMaintenancePred(combined);
    });

    getEquipmentFailurePrediction().then((res) => setEquipment(res.data));
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-900 min-h-screen">
      {/* 1. Complaint Graph */}
      <div className="bg-gray-800 p-4 rounded h-[350px]">
        <h2 className="text-white font-semibold mb-2">
          Complaints by Category
        </h2>
        <Chart data={complaints} type="bar" dataKey="count" xAxis="category" />
      </div>

      {/* 2. Visitor Graph */}
      <div className="bg-gray-800 p-4 rounded h-[350px]">
        <h2 className="text-white font-semibold mb-2">Visitor Trends</h2>
        <Chart data={visitors} type="line" dataKey="visitors" xAxis="date" />
      </div>

      {/* 3. Maintenance Prediction Graph */}
      <div className="bg-gray-800 p-4 rounded h-[350px]">
        <h2 className="text-white font-semibold mb-2">
          Maintenance Cost Forecast (ML)
        </h2>
        <Chart data={maintenancePred} type="line" dataKey="y" xAxis="ds" />
      </div>

      {/* 4. Equipment Graph */}
      <div className="bg-gray-800 p-4 rounded h-[350px]">
        <h2 className="text-white font-semibold mb-2">
          Equipment Failure Risk
        </h2>
        <div className="h-[260px]">
          <Chart
            data={equipment} // Ensure this state is being set
            type="area"
            dataKey="yhat" // Must match the 'yhat' key from your Python dictionary
            xAxis="ds"
          />
        </div>
      </div>

      {/* 5. Amenity Usage Graph */}
      <div className="bg-gray-800 p-4 rounded h-[350px]">
        <h2 className="text-white font-semibold mb-2">Amenity Peak Usage</h2>
        <Chart data={amenity} type="bar" dataKey="bookings" xAxis="hour" />
      </div>
    </div>
  );
}
