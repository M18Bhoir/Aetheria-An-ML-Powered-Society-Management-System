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
    <div className="p-8 bg-[#0a0f1c] min-h-screen text-slate-200">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Analytics Overview
        </h1>
        <p className="text-slate-400 mt-1">
          Real-time society insights and ML-powered predictions.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {/* 1. Complaint Graph - Glass Card */}
        <div className="group bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl h-[400px] flex flex-col transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold tracking-wide">
              Complaints by Category
            </h2>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div className="flex-1 min-h-0">
            <Chart
              data={complaints}
              type="bar"
              dataKey="count"
              xAxis="category"
            />
          </div>
        </div>

        {/* 2. Visitor Graph - Glass Card */}
        <div className="group bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl h-[400px] flex flex-col transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold tracking-wide">
              Visitor Trends
            </h2>
            <span className="text-xs font-medium px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Daily Entry
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <Chart
              data={visitors}
              type="line"
              dataKey="visitors"
              xAxis="date"
            />
          </div>
        </div>

        {/* 3. Equipment Failure Risk - Highlighted Card */}
        <div className="group bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl h-[400px] flex flex-col transition-all duration-300 hover:border-orange-500/50 hover:shadow-[0_0_30px_-10px_rgba(249,115,22,0.3)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold tracking-wide">
              Equipment Failure Risk
            </h2>
            <span className="text-xs font-bold px-2 py-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-tighter">
              ML Forecast
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <Chart data={equipment} type="area" dataKey="yhat" xAxis="ds" />
          </div>
        </div>

        {/* 4. Amenity Usage - Glass Card */}
        <div className="group bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl h-[400px] flex flex-col transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold tracking-wide">
              Amenity Peak Usage
            </h2>
            <div className="flex space-x-1">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-600"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-slate-600"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <Chart data={amenity} type="bar" dataKey="bookings" xAxis="hour" />
          </div>
        </div>
      </div>
    </div>
  );
}
