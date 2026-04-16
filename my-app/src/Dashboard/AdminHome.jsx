import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Zap,
  ArrowRight,
  ShieldAlert,
  Calendar,
  MessageSquare,
  BarChart3,
  Search,
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
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

/* ================= Components ================= */

const StatCard = ({ title, value, icon: Icon, color, subColor }) => (
  <motion.div 
    variants={itemVariants} 
    className="relative group overflow-hidden glass-card p-6 shadow-xl border-white/5"
  >
    <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform ${color}`}>
      <Icon size={80} strokeWidth={1} />
    </div>
    <div className="flex flex-col justify-between h-full relative z-10">
      <div className={`p-4 w-fit rounded-2xl mb-6 ${subColor} text-white shadow-inner border border-white/5 group-hover:bg-opacity-30 transition-all`}>
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
      <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-${color}-500/30 group-hover:bg-${color}-500/10 transition-all text-white`}>
        <Icon size={24} className={`text-${color}-400 group-hover:scale-110 transition-transform`} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-white mb-0.5 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{title}</h4>
        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{description}</p>
      </div>
      <ArrowRight size={16} className="text-slate-700 group-hover:translate-x-1 group-hover:text-blue-400 transition-all" />
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [statsRes, mlRes] = await Promise.allSettled([
          api.get("/api/admin/dashboard-stats"),
          api.get("/api/analytics/maintenance-prediction"),
        ]);

        if (statsRes.status === "fulfilled") {
          setDashboardData(statsRes.value.data);
        }

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
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 py-1 px-3 bg-indigo-500/10 rounded-full border border-indigo-500/20">Operational Root</span>
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
             Managing resident experiences, complex maintenance forecasts, and community logistics through a unified administrative node.
          </p>
        </div>

        {/* Quick Insights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-2 gap-4 w-full xl:w-fit">
           <div className="p-5 glass-card border-white/5 min-w-[160px]">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Residents</p>
              <div className="flex items-end gap-2 text-2xl font-black text-indigo-400">
                 {dashboardData.residentCount}
                 <Users size={18} className="text-indigo-400 bottom-1" />
              </div>
           </div>
           <div className="p-5 glass-card border-white/5 min-w-[160px]">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Visitors Today</p>
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
              <QuickAction title="Issue Notice" description="Broadcast updates" icon={Bell} path="/admin/notices" color="blue" />
              <QuickAction title="Add Revenue" description="Create dues for flats" icon={DollarSign} path="/admin/create-dues" color="indigo" />
              <QuickAction title="Log Expenses" description="Record society costs" icon={FileText} path="/admin/expense-logger" color="rose" />
              <QuickAction title="Onboard Resident" description="Register new members" icon={UserPlus} path="/admin/residents" color="emerald" />
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
              <ShieldAlert className="absolute -right-4 -bottom-4 text-amber-500/10" size={120} />
              <div className="flex items-center justify-between mb-8">
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                   <DollarSign className="text-amber-400" size={28} />
                </div>
                <span className="text-[10px] font-black text-amber-400 py-1 px-3 bg-amber-500/10 rounded-full border border-amber-500/20 uppercase tracking-widest">Pending Collection</span>
              </div>
              <p className="text-5xl font-black text-white tracking-tighter mb-2">
                 ₹{(dashboardData.duesSummary?.pending || 0).toLocaleString()}
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                 Total overdue and pending maintenance contributions across all wings.
              </p>
           </motion.div>

           {/* AI Prediction Preview */}
           <motion.div variants={itemVariants} className="p-8 glass-card relative overflow-hidden group">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black tracking-tight text-white uppercase flex items-center gap-3">
                   <Brain size={20} className="text-indigo-400 animate-pulse" />
                   Forecaster
                </h3>
                <BarChart3 size={18} className="text-slate-600" />
              </div>
              <div className="h-[200px] w-full">
                 {maintenanceData.length > 0 ? (
                    <Chart type="line" data={maintenanceData} dataKey="amount" xAxis="ds" />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4">
                       <Zap className="animate-pulse" />
                       <span className="text-xs font-bold uppercase tracking-widest">Running ML Analysis...</span>
                    </div>
                  )}
              </div>
              <button className="w-full py-3 mt-6 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                 View Full Prediction Report
              </button>
           </motion.div>

           {/* Real-time Feeds */}
           <div className="grid grid-cols-1 gap-8">
              <NoticeBoard notices={[]} />
           </div>

        </div>
      </div>
    </motion.div>
  );
}
