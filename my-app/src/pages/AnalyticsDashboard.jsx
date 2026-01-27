import { useEffect, useState } from "react";
import axios from "axios";
import {
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
    /* 🤖 Maintenance ML (Actual + Predicted) */
    axios.get("/api/analytics/maintenance-prediction").then((res) => {
      const { actual, predicted } = res.data;

      const actualData = actual.map((d) => ({
        month: d.ds,
        collectionRate: Number(d.y), // 👈 force number
        type: "actual",
      }));

      const predictedData = predicted.map((d) => ({
        month: d.ds.slice(0, 7),
        collectionRate: Number(d.yhat), // 👈 force number
        type: "predicted",
      }));

      setMaintenance([...actualData, ...predictedData]);
    });

    /* Other analytics */
    getComplaintCategories().then((res) => setComplaints(res.data));
    getAmenityPeakHours().then((res) => setAmenity(res.data));

    getVisitorTrends().then((res) =>
      setVisitors(res.data.map((d) => ({ ...d, type: "actual" }))),
    );
  }, []);

  return (
    <div className="p-6 grid grid-cols-2 gap-6 bg-gray-900 min-h-screen">
      {/* 🤖 Maintenance Collection (ML) */}
      <div className="bg-gray-800 p-4 rounded h-[350px]">
        <h2 className="text-white font-semibold mb-2">
          Maintenance Cost Forecast (ML)
        </h2>
        <Chart
          data={maintenance}
          type="line"
          dataKey="collectionRate"
          xAxis="month"
        />
      </div>

      {/* Complaints */}
      <div className="bg-gray-800 p-4 rounded h-[350px]">
        <h2 className="text-white font-semibold mb-2">
          Complaints by Category
        </h2>
        <Chart data={complaints} type="bar" dataKey="count" xAxis="category" />
      </div>

      {/* Amenity Peak Hours */}
      <div className="bg-gray-800 p-4 rounded h-[350px]">
        <h2 className="text-white font-semibold mb-2">Amenity Peak Hours</h2>
        <Chart data={amenity} type="bar" dataKey="bookings" xAxis="hour" />
      </div>

      {/* Visitor Trends */}
      <div className="bg-gray-800 p-4 rounded h-[350px]">
        <h2 className="text-white font-semibold mb-2">Visitor Trends</h2>
        <Chart data={visitors} type="line" dataKey="visitors" xAxis="date" />
      </div>
    </div>
  );
}
