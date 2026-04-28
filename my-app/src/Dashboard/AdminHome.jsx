import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Users,
  Wrench,
  UserPlus,
  DollarSign,
  Brain,
  TrendingUp,
  Activity,
  Zap,
  ArrowRight,
  ShieldAlert,
  MessageSquare,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../utils/api";
import MaintenanceSchedule from "./AdminViews/MaintenanceSchedule";
import NoticeBoard from "./AdminViews/NoticeBoard";
import Chart from "../Components/Charts";
import SocietyMap from "../Components/SocietyMap";

/* ================= Animation Variants ================= */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }, // Reduced from 0.1
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 }, // Reduced y from 20
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }, // Replaced spring with faster duration
  },
};

/* ================= Components ================= */

const StatCard = ({ title, value, icon: Icon, color, subColor }) => (
  <motion.div
    variants={itemVariants}
    className="relative group overflow-hidden glass-card p-6 shadow-xl border-white/5"
  >
    <div
      className={`absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform ${color}`}
    >
      <Icon size={80} strokeWidth={1} />
    </div>
    <div className="flex flex-col justify-between h-full relative z-10">
      <div
        className={`p-4 w-fit rounded-2xl mb-6 ${subColor} text-white shadow-inner border border-white/5 group-hover:bg-opacity-30 transition-all`}
      >
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
          {title}
        </p>
        <h3 className="text-4xl font-black text-white tracking-tighter">
          {value}
        </h3>
      </div>
    </div>
  </motion.div>
);

const QuickAction = ({ title, description, icon: Icon, path, color }) => {
  const navigate = useNavigate();
  return (
    <motion.button
      variants={itemVariants}
      onClick={() => navigate(path)}
      className="flex items-center gap-4 p-5 glass-card glass-card-hover border-white/5 text-left w-full group relative overflow-hidden"
    >
      <div
        className={`p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-${color}-500/30 group-hover:bg-${color}-500/10 transition-all text-white`}
      >
        <Icon
          size={24}
          className={`text-${color}-400 group-hover:scale-110 transition-transform`}
        />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-white mb-0.5 group-hover:text-blue-400 transition-colors uppercase tracking-tight">
          {title}
        </h4>
        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
          {description}
        </p>
      </div>
      <ArrowRight
        size={16}
        className="text-slate-700 group-hover:translate-x-1 group-hover:text-blue-400 transition-all"
      />
    </motion.button>
  );
};

/* ================= Main Admin Home ================= */

export default function AdminHome() {
  const [dashboardData, setDashboardData] = useState({
    residentCount: 0,
    visitorCount: 0,
    duesSummary: { pending: 0 },
    noticeCount: 0,
    visitorsToday: 0,
    guestVisitorsToday: 0,
  });
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [failureData, setFailureData] = useState([
    { ds: "Jan", amount: 2, type: "actual" },
    { ds: "Feb", amount: 1, type: "actual" },
    { ds: "Mar", amount: 3, type: "actual" },
    { ds: "Apr", amount: 2, type: "actual" },
    { ds: "May", amount: 4, type: "predicted" },
    { ds: "Jun", amount: 5, type: "predicted" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);

      // Fetch Dashboard Stats - High Priority
      try {
        const statsRes = await api.get("/api/admin/dashboard-stats");
        setDashboardData(statsRes.data);
      } catch (error) {
        console.error("Dashboard Stats Error:", error);
      }

      // Fetch Predictions - Lower Priority, can be slow
      try {
        const [maintenanceRes, failureRes] = await Promise.allSettled([
          api.get("/api/analytics/maintenance-prediction"),
          api.get("/api/analytics/equipment-failure-prediction"),
        ]);

        if (
          maintenanceRes.status === "fulfilled" &&
          maintenanceRes.value.data
        ) {
          const { actual = [], predicted = [] } = maintenanceRes.value.data;
          const combinedData = [
            ...actual.map((d) => ({ ds: d.ds, amount: d.y, type: "actual" })),
            ...predicted.map((d) => ({
              ds: d.ds,
              amount: d.yhat,
              type: "predicted",
            })),
          ];
          setMaintenanceData(combinedData);
        } else {
          // Fallback static data for maintenance
          setMaintenanceData([
            { ds: "Jan", amount: 45, type: "actual" },
            { ds: "Feb", amount: 52, type: "actual" },
            { ds: "Mar", amount: 48, type: "actual" },
            { ds: "Apr", amount: 60, type: "predicted" },
            { ds: "May", amount: 58, type: "predicted" },
          ]);
        }

        if (failureRes.status === "fulfilled" && failureRes.value.data) {
          const data = failureRes.value.data;
          setFailureData(
            data.map((d) => ({
              ds: new Date(d.ds).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              }),
              amount: d.yhat,
              type: d.failure_risk ? "predicted" : "actual",
            })),
          );
        }
      } catch (error) {
        console.error("Predictions Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10"
    >
      {/* Header & Status Hub */}
      <section className="flex flex-col xl:flex-row justify-between items-start gap-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 py-1 px-3 bg-indigo-500/10 rounded-full border border-indigo-500/20">
              Operational Root
            </span>
            <div className="h-px w-20 bg-white/5"></div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              SYSTEM LIVE
            </div>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
            Command <span className="text-gradient">Center</span>
          </h1>
          <p className="text-slate-400 font-medium tracking-wide max-w-xl">
            Managing resident experiences, complex maintenance forecasts, and
            community logistics through a unified administrative node.
          </p>
        </div>

        {/* Quick Insights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-2 gap-4 w-full xl:w-fit">
          <div className="p-5 glass-card border-white/5 min-w-[160px]">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
              Residents
            </p>
            <div className="flex items-end gap-2 text-2xl font-black text-indigo-400">
              {dashboardData.residentCount}
              <Users size={18} className="text-indigo-400 bottom-1" />
            </div>
          </div>
          <div className="p-5 glass-card border-white/5 min-w-[160px]">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
              Visitors Today
            </p>
            <div className="flex items-end gap-2 text-2xl font-black text-blue-400">
              {dashboardData.visitorsToday}
              <Activity size={18} />
            </div>
          </div>
        </div>
      </section>

      {/* Primary Actions & Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Actions Hub (Center) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions Hub */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickAction
              title="Issue Notice"
              description="Broadcast updates"
              icon={Bell}
              path="/admin/notices"
              color="blue"
            />
            <QuickAction
              title="Add Revenue"
              description="Create dues for flats"
              icon={DollarSign}
              path="/admin/create-dues"
              color="indigo"
            />
            <QuickAction
              title="Log Expenses"
              description="Record society costs"
              icon={FileText}
              path="/admin/expense-logger"
              color="rose"
            />
            <QuickAction
              title="Onboard Resident"
              description="Register new members"
              icon={UserPlus}
              path="/admin/residents"
              color="emerald"
            />
          </div>

          {/* Pulse Map integration */}
          <div className="h-full">
            <SocietyMap />
          </div>
        </div>

        {/* Financial & Activity Sidebar */}
        <div className="space-y-8">
          {/* Financial Highlight */}
          <motion.div
            variants={itemVariants}
            className="p-8 glass-card border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent shadow-2xl relative overflow-hidden group"
          >
            <ShieldAlert
              className="absolute -right-4 -bottom-4 text-amber-500/10"
              size={120}
            />
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <DollarSign className="text-amber-400" size={28} />
              </div>
              <span className="text-[10px] font-black text-amber-400 py-1 px-3 bg-amber-500/10 rounded-full border border-amber-500/20 uppercase tracking-widest">
                Pending Collection
              </span>
            </div>
            <p className="text-5xl font-black text-white tracking-tighter mb-2">
              ₹{(dashboardData.duesSummary?.pending || 0).toLocaleString()}
            </p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
              Total overdue and pending maintenance contributions across all
              wings.
            </p>
          </motion.div>

          {/* Forecaster Card (Updated to show status) */}
          <motion.div
            variants={itemVariants}
            className="p-8 glass-card relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight text-white uppercase flex items-center gap-3">
                <Brain size={20} className="text-indigo-400 animate-pulse" />
                AI Forecaster
              </h3>
              <Activity size={18} className="text-emerald-400" />
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  Maintenance Health
                </p>
                <p className="text-lg font-bold text-white uppercase">
                  Optimal{" "}
                  <span className="text-emerald-400 ml-2 text-xs">94%</span>
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  Critical Failures
                </p>
                <p className="text-lg font-bold text-white uppercase">
                  Zero{" "}
                  <span className="text-blue-400 ml-2 text-xs">Predicted</span>
                </p>
              </div>
            </div>
            <button className="w-full py-3 mt-6 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all">
              Generate Detailed Analysis
            </button>
          </motion.div>

          {/* Real-time Feeds */}
          <div className="grid grid-cols-1 gap-8">
            <NoticeBoard notices={[]} />
          </div>
        </div>
      </div>

      {/* AI Prediction Hub - Full Width Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            Predictive <span className="text-gradient">Analytics</span>
          </h2>
          <div className="h-px flex-1 bg-white/5"></div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <motion.div
            variants={itemVariants}
            className="p-8 glass-card relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight text-white uppercase flex items-center gap-3">
                  <Wrench size={20} className="text-blue-400" />
                  Maintenance Expenditure Forecast
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                  Projected costs vs historical collection rates
                </p>
              </div>
              <TrendingUp
                size={24}
                className="text-blue-500/20 group-hover:text-blue-500/40 transition-colors"
              />
            </div>
            <div className="h-[350px] w-full">
              <Chart
                type="line"
                data={maintenanceData}
                dataKey="amount"
                xAxis="ds"
                xLabel="Timeline (Months)"
                yLabel="Expenditure (₹)"
              />
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-8 glass-card relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight text-white uppercase flex items-center gap-3">
                  <Zap size={20} className="text-rose-400" />
                  Equipment Failure Probability
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                  Risk assessment based on sensor telemetry
                </p>
              </div>
              <ShieldAlert
                size={24}
                className="text-rose-500/20 group-hover:text-rose-500/40 transition-colors"
              />
            </div>
            <div className="h-[350px] w-full">
              <Chart
                type="line"
                data={failureData}
                dataKey="amount"
                xAxis="ds"
                xLabel="Inspection Date"
                yLabel="Risk Factor (%)"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
