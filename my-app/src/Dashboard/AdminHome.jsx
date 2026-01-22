import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import {
  Clock, Bell, Users, Wrench, ClipboardList, UserPlus,   
  DollarSign // Removed AlertCircle
} from "lucide-react";
import { 
  BarChart, PieChart, Bar, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'; 
import api from "../utils/api"; 
import MaintenanceSchedule from "./AdminViews/MaintenanceSchedule";
import NoticeBoard from "./AdminViews/NoticeBoard";

// ... (MaintenanceForecast, StatsCards, ActivityFeed, DuesBarChart, ImportantDates components are unchanged) ...
// --- These sub-components are unchanged ---
const MaintenanceForecast = () => {
    // ... (code for MaintenanceForecast)
};
const StatsCards = ({ stats }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.title} className="flex items-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          <div className={`p-4 rounded-full ${stat.iconBg} ${stat.iconColor} mr-4`}>{stat.icon}</div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
);
const icons = { Bell, Users, Wrench };
const ActivityFeed = ({ activities }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Activity Feed</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = icons[activity.icon];
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-3 rounded-full ${activity.bgColor} ${activity.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{activity.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{activity.description}</p>
                <div className="flex items-center text-xs text-slate-400 mt-1">
                  <Clock className="w-3 h-3 mr-1.5" />
                  {activity.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
);
const DuesBarChart = ({ summary }) => {
  // This component now receives real, formatted numbers
  const collectedNum = parseFloat(summary.collected.replace('₹', '').replace(/,/g, ''));
  const pendingNum = parseFloat(summary.pending.replace('₹', '').replace(/,/g, ''));
  const data = [
    { name: 'Collected', Amount: collectedNum, fill: '#16a34a' }, 
    { name: 'Pending', Amount: pendingNum, fill: '#dc2626' } 
  ];
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg" style={{ height: '350px' }}>
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Dues Overview</h3>
      <ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" stroke="#475569" /><XAxis dataKey="name" stroke="#cbd5e1" /><YAxis stroke="#cbd5e1" /><Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} labelStyle={{ color: '#cbd5e1' }} itemStyle={{ color: '#e2e8f0' }} cursor={{ fill: 'rgba(100, 116, 139, 0.2)' }} /><Bar dataKey="Amount">{data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}</Bar></BarChart></ResponsiveContainer>
    </div>
  );
};
const ImportantDates = () => {
    // ... (code for ImportantDates)
};
// --- End of unchanged sub-components ---


// --- This is the main component for this file ---
export default function AdminHome() {
  
  // --- 1. SET UP STATE FOR REAL DATA ---
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 2. FETCH REAL DATA ON LOAD ---
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get('/api/admin/dashboard-stats');
        setDashboardData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(err.response?.data?.msg || "Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // --- 3. REMOVE MOCK DATA ---
  // (Mock 'stats', 'summary', 'complaints' arrays are GONE)

  // Mock data for components not yet converted
  const activities = [
    { id: 1, icon: "Bell", title: "New Notice Posted", description: "Annual meeting scheduled", time: "2h ago", bgColor: "bg-blue-100 dark:bg-blue-900", color: "text-blue-600 dark:text-blue-400" },
    { id: 2, icon: "Users", title: "Visitor Logged", description: "John entered the premises", time: "4h ago", bgColor: "bg-green-100 dark:bg-green-900", color: "text-green-600 dark:text-green-400" },
    { id: 3, icon: "Wrench", title: "Maintenance Work", description: "Lift maintenance ongoing", time: "6h ago", bgColor: "bg-yellow-100 dark:bg-yellow-900", color: "text-yellow-600 dark:text-yellow-400" },
  ];
  const maintenanceTasks = [
    { name: "Elevator Service (Tower A)", date: "Nov 10, 2025", status: "Pending" },
    { name: "Water Tank Cleaning", date: "Nov 12, 2025", status: "Pending" },
  ];
  const notices = [
    { title: "Annual General Meeting", date: "Nov 04, 2025", body: "The AGM is scheduled for Nov 10th in the clubhouse." },
  ];


  // --- 4. SHOW LOADING/ERROR STATE ---
  if (isLoading) {
    return <div className="text-center p-6 text-gray-500 dark:text-gray-400">Loading Dashboard...</div>;
  }
  if (error) {
    return <div className="text-center p-6 text-red-500">{error}</div>;
  }

  // --- 5. CREATE DYNAMIC DATA FROM STATE ---
  // We only build this data *after* loading is complete and data exists
  const stats = [
    { title: "Residents", value: dashboardData.residentCount, icon: <Users size={24} />, iconBg: "bg-blue-100 dark:bg-blue-900", iconColor: "text-blue-600 dark:text-blue-400" },
    { title: "Visitors Today", value: dashboardData.visitorCount, icon: <UserPlus size={24} />, iconBg: "bg-green-100 dark:bg-green-900", iconColor: "text-green-600 dark:text-green-400" },
    { title: "Dues Pending", value: `₹${dashboardData.duesSummary.pending.toLocaleString('en-IN')}`, icon: <DollarSign size={24} />, iconBg: "bg-yellow-100 dark:bg-yellow-900", iconColor: "text-yellow-600 dark:text-yellow-400" },
    { title: "Notices Issued", value: dashboardData.noticeCount, icon: <Bell size={24} />, iconBg: "bg-purple-100 dark:bg-purple-900", iconColor: "text-purple-600 dark:text-purple-400" },
  ];
  
  const duesSummary = {
      collected: `₹${dashboardData.duesSummary.collected.toLocaleString('en-IN')}`,
      pending: `₹${dashboardData.duesSummary.pending.toLocaleString('en-IN')}`
  };


  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
      {/* 6. PASS REAL DATA TO COMPONENTS */}
      <StatsCards stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <DuesBarChart summary={duesSummary} />
        {/* --- 7. COMPLAINTS PIE CHART REMOVED --- */}
        <ActivityFeed activities={activities} /> {/* This still uses mock data */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ImportantDates />
        <MaintenanceForecast />
        <NoticeBoard notices={notices} /> {/* This still uses mock data */}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <MaintenanceSchedule schedule={maintenanceTasks} />
        {/* ComplaintTracker and VisitorLogs removed as requested/implied */}
      </div>
    </>
  );
}