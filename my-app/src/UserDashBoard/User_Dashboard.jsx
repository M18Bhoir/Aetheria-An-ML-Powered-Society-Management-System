import React, { useState, useEffect, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import {
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Vote,
  Calendar,
  ShoppingCart,
  ArrowRight,
  Ticket,
  MessageCircle,
  Users,
  Key,
  Activity,
  Zap,
  Droplet,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { loadScript } from "../utils/loadScript";
import { useToast } from "../context/ToastContext";
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

/* ================= Dashboard Components ================= */

const StatCard = memo(({ title, value, unit, icon, color, trend }) => (
  <motion.div variants={itemVariants} className="p-6 glass-card group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 border border-opacity-20 border-white`}>
        {icon}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
          <TrendingUp size={12} /> {trend}
        </div>
      )}
    </div>
    <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">{title}</p>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-black text-white">{value}</span>
      <span className="text-xs font-bold text-slate-400">{unit}</span>
    </div>
  </motion.div>
));

const UserNoticeBoard = memo(() => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get("/api/notices/user");
        setNotices(res.data.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  return (
    <div className="p-8 glass-dark rounded-[32px] border border-white/5 text-white h-full flex flex-col shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold tracking-tight">Society Bulletins</h3>
        <span className="text-[10px] px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-bold uppercase tracking-widest">Live Updates</span>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : notices.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 italic text-sm">No new notices.</div>
      ) : (
        <ul className="space-y-4 flex-1 overflow-auto pr-2 custom-scrollbar">
          {notices.map((notice) => (
            <motion.li
              key={notice._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-5 bg-white/5 hover:bg-white/10 transition-all rounded-2xl border border-white/5 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-blue-300 text-sm tracking-tight">{notice.title}</p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">{new Date(notice.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{notice.body}</p>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
});

/* ================= MAIN DASHBOARD ================= */
function User_Dashboard() {
  const [dues, setDues] = useState(null);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { show } = useToast();
  const navigate = useNavigate();

  const [ticketSummary, setTicketSummary] = useState({ open: 0, inProgress: 0 });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUserData(JSON.parse(storedUser));

    const initializePage = async () => {
      try {
        await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        const duesRes = await api.get("/api/user/dues");
        setDues(duesRes.data.dues);
        const ticketRes = await api.get("/api/tickets/summary");
        setTicketSummary(ticketRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, []);

  const getDuesStatusInfo = useCallback(() => {
    if (!dues || dues.status === "Paid") {
      return {
        bg: "from-emerald-600/20 to-emerald-900/20 border-emerald-500/30",
        icon: <CheckCircle className="text-emerald-400" size={32} />,
        statusText: "Paid",
        statusColor: "text-emerald-400",
      };
    }
    return {
      bg: "from-rose-600/20 to-rose-900/20 border-rose-500/30",
      icon: <AlertTriangle className="text-rose-400" size={32} />,
      statusText: dues.status || "Pending",
      statusColor: "text-rose-400",
    };
  }, [dues]);

  const statusInfo = getDuesStatusInfo();
  const displayAmount = !dues || dues.status === "Paid" ? 0 : dues.amount || 0;

  const quickActions = [
    { title: "Voting", icon: <Vote size={24} />, path: "/dashboard/voting", color: "text-purple-400" },
    { title: "Booking", icon: <Calendar size={24} />, path: "/dashboard/booking", color: "text-blue-400" },
    { title: "Marketplace", icon: <ShoppingCart size={24} />, path: "/dashboard/marketplace", color: "text-emerald-400" },
    { title: "Complaints", icon: <Ticket size={24} />, path: "/dashboard/tickets/new", color: "text-rose-400" },
    { title: "Guest Pass", icon: <Key size={24} />, path: "/dashboard/request-guest-pass", color: "text-amber-400" },
    { title: "Residents", icon: <Users size={24} />, path: "/dashboard/community", color: "text-cyan-400" },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto space-y-8 pb-12"
    >
      {/* Hero Welcome */}
      <section className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-white/5 pb-8">
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 py-1 px-3 bg-blue-500/10 rounded-full border border-blue-500/20">Active Session</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">
            Hello, <span className="text-gradient">{(userData.name || "Resident").split(' ')[0]}</span>
          </h1>
          <p className="text-slate-400 font-medium tracking-wide">Ready to manage your home today?</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex gap-4">
           <div className="p-4 bg-white/5 border border-white/5 rounded-[24px] text-center min-w-[120px]">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Society Pulse</p>
              <p className="text-xl font-black text-emerald-400">98%</p>
           </div>
           <div className="p-4 bg-white/5 border border-white/5 rounded-[24px] text-center min-w-[120px]">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Residents</p>
              <p className="text-xl font-black text-blue-400">420+</p>
           </div>
        </motion.div>
      </section>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column Stack */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Dynamic Status Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Card */}
              <motion.div
                variants={itemVariants}
                className={`p-8 rounded-[32px] glass-card border flex flex-col justify-between relative overflow-hidden group bg-gradient-to-br ${statusInfo.bg} shadow-2xl cursor-pointer`}
                onClick={() => navigate("/dashboard/dues")}
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <DollarSign size={80} strokeWidth={1} />
                </div>
                <div className="flex justify-between items-center relative z-10 mb-8">
                  <div className="p-3 bg-white/10 rounded-xl border border-white/10">{statusInfo.icon}</div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-[0.2em] border bg-black/20 ${statusInfo.statusColor}`}>
                    {statusInfo.statusText}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">Maintenance Dues</p>
                  <p className="text-4xl font-black">₹{Number(displayAmount).toLocaleString("en-IN")}</p>
                  <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-white/60 group-hover:text-white transition-colors">
                    PAY NOW <ArrowRight size={12} />
                  </div>
                </div>
              </motion.div>

              {/* Support Tickets Card */}
              <motion.div
                variants={itemVariants}
                className="p-8 glass-card border border-indigo-500/10 flex flex-col justify-between relative overflow-hidden group bg-gradient-to-br from-indigo-500/10 to-transparent"
                onClick={() => navigate("/dashboard/tickets")}
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 text-indigo-400">
                  <MessageCircle size={80} strokeWidth={1} />
                </div>
                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 w-fit mb-8">
                  <Ticket className="text-indigo-400" size={32} />
                </div>
                <div>
                  <p className="text-xs font-black text-indigo-400/40 uppercase tracking-widest mb-4">Tickets Activity</p>
                  <div className="flex gap-8">
                    <div>
                      <span className="text-4xl font-black block">{ticketSummary.open}</span>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Open Cases</span>
                    </div>
                    <div className="w-px bg-white/10 h-8 self-center"></div>
                    <div>
                      <span className="text-4xl font-black block">{ticketSummary.inProgress}</span>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Resolving</span>
                    </div>
                  </div>
                </div>
              </motion.div>
           </div>

           {/* Society Pulse Map - Integrated */}
           <motion.div variants={itemVariants} className="h-fit">
              <SocietyMap />
           </motion.div>
        </div>

        {/* Right Column Stack */}
        <div className="space-y-8 flex flex-col">
           {/* Bulletin Board */}
           <div className="flex-1">
              <UserNoticeBoard />
           </div>

           {/* Quick Actions Grid */}
           <motion.div variants={itemVariants} className="p-8 glass-card">
              <h3 className="text-xl font-black tracking-tight mb-6 flex items-center gap-3">
                 <Zap size={20} className="text-amber-400" />
                 Quick Access
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(action.path)}
                    className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all flex flex-col items-center gap-3 group"
                  >
                    <div className={`${action.color} group-hover:scale-110 transition-transform`}>{action.icon}</div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{action.title}</span>
                  </button>
                ))}
              </div>
           </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default User_Dashboard;
