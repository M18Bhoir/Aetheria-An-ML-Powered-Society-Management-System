import React, { useState, useEffect } from "react";
import {
  Clock,
  Bell,
  Users,
  Wrench,
  UserPlus,
  DollarSign,
  Brain,
  TrendingUp,
  Activity,
} from "lucide-react";
import api from "../utils/api";
import MaintenanceSchedule from "./AdminViews/MaintenanceSchedule";
import NoticeBoard from "./AdminViews/NoticeBoard";
import Chart from "../Components/Charts";

/* -------------------- Glass Card Components -------------------- */

const StatCard = ({ title, value, icon: Icon, color, subColor }) => (
  <div className="relative group overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:bg-white/10 transition-all duration-300">
    <div
      className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}
    >
      <Icon size={64} />
    </div>
    <div className="flex flex-col justify-between h-full relative z-10">
      <div
        className={`p-3 w-fit rounded-2xl mb-4 ${subColor} text-white shadow-inner`}
      >
        <Icon size={24} />
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  </div>
);

const ActivityItem = ({ activity }) => {
  const icons = { Bell, Users, Wrench, UserPlus };
  const IconComponent = icons[activity.icon] || Bell;

  return (
    <div className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
      <div
        className={`p-3 rounded-full shrink-0 ${activity.bgColor} ${activity.color}`}
      >
        <IconComponent size={18} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-bold text-gray-200">{activity.title}</h4>
          <span className="text-xs text-gray-500 flex items-center">
            <Clock size={12} className="mr-1" /> {activity.time}
          </span>
        </div>
        <p className="text-sm text-gray-400 mt-1 leading-relaxed">
          {activity.description}
        </p>
      </div>
    </div>
  );
};

/* -------------------- Main Component -------------------- */

export default function AdminHome() {
  const [dashboardData, setDashboardData] = useState({
    residentCount: 0,
    visitorCount: 0,
    duesSummary: { pending: 0 },
    noticeCount: 0,
  });
  const [maintenanceData, setMaintenanceData] = useState([
    { ds: "2026-01", amount: 4500 },
    { ds: "2026-02", amount: 5200 },
    { ds: "2026-03", amount: 4800 },
    { ds: "2026-04", amount: 6100 },
    { ds: "2026-05", amount: 5500 },
    { ds: "2026-06", amount: 7000 },
  ]);
  const [failureData, setFailureData] = useState([
    { ds: "Jan", rate: 5 },
    { ds: "Feb", rate: 8 },
    { ds: "Mar", rate: 12 },
    { ds: "Apr", rate: 7 },
    { ds: "May", rate: 15 },
    { ds: "Jun", rate: 10 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Parallel fetching for speed
        const [statsRes, mlRes] = await Promise.allSettled([
          api.get("/api/admin/dashboard-stats"),
          api.get("/api/analytics/maintenance-prediction"),
        ]);

        // Handle Stats
        if (statsRes.status === "fulfilled") {
          setDashboardData(statsRes.value.data);
        }

        // Handle ML Data (Format it safely)
        if (mlRes.status === "fulfilled" && mlRes.value.data) {
          const { actual = [], predicted = [] } = mlRes.value.data;
          const combinedData = [
            ...actual.map((d) => ({ ds: d.ds, amount: d.y, type: "Actual" })),
            ...predicted.map((d) => ({
              ds: new Date(d.ds).toISOString().split("T")[0],
              amount: d.yhat,
              type: "Predicted",
            })),
          ];
          setMaintenanceData(combinedData);
        }
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const activities = [
    {
      id: 1,
      icon: "Bell",
      title: "New Notice Posted",
      description: "Annual meeting scheduled for next week.",
      time: "2h ago",
      bgColor: "bg-blue-500/20",
      color: "text-blue-400",
    },
    {
      id: 2,
      icon: "Users",
      title: "Visitor Logged",
      description: "Delivery for Apt 101 registered at gate.",
      time: "4h ago",
      bgColor: "bg-green-500/20",
      color: "text-green-400",
    },
    {
      id: 3,
      icon: "Wrench",
      title: "Maintenance",
      description: "Elevator B reported for inspection.",
      time: "6h ago",
      bgColor: "bg-yellow-500/20",
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>
        <div className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full flex items-center text-indigo-300 text-sm font-medium shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Brain size={16} className="mr-2" />
          AI Insights Active
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Residents"
          value={dashboardData.residentCount}
          icon={Users}
          color="text-blue-500"
          subColor="bg-blue-500/20"
        />
        <StatCard
          title="Active Visitors"
          value={dashboardData.visitorCount}
          icon={UserPlus}
          color="text-green-500"
          subColor="bg-green-500/20"
        />
        <StatCard
          title="Visitors Today"
          value={dashboardData.visitorsToday || 0}
          icon={UserPlus}
          color="text-emerald-500"
          subColor="bg-emerald-500/20"
        />
        <StatCard
          title="Guest Visitors Today"
          value={dashboardData.guestVisitorsToday || 0}
          icon={UserPlus}
          color="text-cyan-500"
          subColor="bg-cyan-500/20"
        />
        <StatCard
          title="Pending Dues"
          value={`₹${(dashboardData.duesSummary?.pending || 0).toLocaleString()}`}
          icon={DollarSign}
          color="text-yellow-500"
          subColor="bg-yellow-500/20"
        />
        <StatCard
          title="Notices Issued"
          value={dashboardData.noticeCount}
          icon={Bell}
          color="text-purple-500"
          subColor="bg-purple-500/20"
        />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Charts) */}
        <div className="lg:col-span-2 space-y-8">
          {/* AI Chart Section - Maintenance */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity size={20} className="text-indigo-400" />
                  Maintenance Forecast
                </h3>
                <p className="text-sm text-gray-400">
                  Predicted monthly maintenance expenses (Static)
                </p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <Chart
                type="line"
                data={maintenanceData}
                dataKey="amount"
                xAxis="ds"
                xLabel="Month"
                yLabel="Amount (₹)"
              />
            </div>
          </div>

          {/* AI Chart Section - Equipment Failure */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity size={20} className="text-rose-400" />
                  Equipment Failure Prediction
                </h3>
                <p className="text-sm text-gray-400">
                  Predicted probability of critical failure (%)
                </p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <Chart
                type="bar"
                data={failureData}
                dataKey="rate"
                xAxis="ds"
                xLabel="Month"
                yLabel="Failure Risk (%)"
              />
            </div>
          </div>

          {/* Maintenance Schedule Component */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-lg overflow-hidden">
            <MaintenanceSchedule schedule={[]} />
          </div>
        </div>

        {/* Right Column (Activity & Notices) */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-green-400" />
              Recent Activity
            </h3>
            <div className="space-y-2">
              {activities.map((act) => (
                <ActivityItem key={act.id} activity={act} />
              ))}
            </div>
          </div>

          {/* Notice Board Component */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-lg overflow-hidden">
            <NoticeBoard notices={[]} />
          </div>
        </div>
      </div>
    </div>
  );
}
