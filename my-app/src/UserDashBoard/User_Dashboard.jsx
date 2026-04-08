import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import {
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Vote,
  Calendar,
  CalendarCheck,
  ShoppingCart,
  List,
  User,
  ArrowRight,
  Ticket,
  MessageCircle,
  Info,
  Users,
  Key,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { loadScript } from "../utils/loadScript";
import { useToast } from "../context/ToastContext";
import SocietyMap from "../Components/SocietyMap";

/* ================= Animation Variants ================= */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

/* ================= Glass Card Component ================= */
const DashboardCard = ({
  title,
  description,
  intro,
  icon,
  path,
  className = "",
}) => {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={() => navigate(path)}
      className={`group relative p-6 glass-card glass-card-hover text-left text-white cursor-pointer overflow-hidden ${className}`}
    >
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity pointer-events-none group-hover:scale-110 transition-transform duration-500">
        <ArrowRight size={80} strokeWidth={1} />
      </div>

      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="p-4 bg-white/5 rounded-2xl text-blue-400 border border-white/5 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300">
            {icon}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo((v) => !v);
            }}
            className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
          >
            <Info size={16} className="text-gray-400" />
          </button>
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight mb-1.5">{title}</h3>
          <p className="text-sm text-gray-400 font-medium leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-4 bottom-4 glass-dark rounded-2xl p-4 text-xs text-blue-200 z-30 border border-blue-500/20 shadow-xl"
          >
            {intro || description}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ================= Glass Notice Board ================= */
const UserNoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get("/api/notices/user");
        setNotices(res.data.slice(0, 3));
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
        <h3 className="text-xl font-bold tracking-tight">Recent Notices</h3>
        <span className="text-[10px] px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-bold uppercase tracking-widest">
          Updates
        </span>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-20 bg-white/5 rounded-2xl animate-pulse"
            ></div>
          ))}
        </div>
      )}
      {!loading && notices.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-gray-500 italic text-sm">
          No active notices.
        </div>
      )}
      {!loading && notices.length > 0 && (
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
                <p className="font-bold text-blue-300 text-sm tracking-tight">
                  {notice.title}
                </p>
                <p className="text-[10px] text-gray-500 font-semibold uppercase">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                {notice.body}
              </p>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ================= MAIN DASHBOARD ================= */
function User_Dashboard() {
  const [dues, setDues] = useState(null);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { show } = useToast();

  const [ticketSummary, setTicketSummary] = useState({
    open: 0,
    inProgress: 0,
  });

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

  const getDuesStatusInfo = () => {
    if (!dues || dues.status === "Paid") {
      return {
        bg: "from-emerald-600/20 to-emerald-900/20 border-emerald-500/30",
        icon: <CheckCircle className="text-emerald-400" size={32} />,
        statusText: "Paid",
        statusColor: "text-emerald-400",
        glow: "shadow-emerald-500/20",
      };
    }
    if (dues.status === "Overdue") {
      return {
        bg: "from-rose-600/20 to-rose-900/20 border-rose-500/30",
        icon: <AlertTriangle className="text-rose-400" size={32} />,
        statusText: "Overdue",
        statusColor: "text-rose-400",
        glow: "shadow-rose-500/20",
      };
    }
    return {
      bg: "from-amber-600/20 to-amber-900/20 border-amber-500/30",
      icon: <DollarSign className="text-amber-400" size={32} />,
      statusText: "Pending",
      statusColor: "text-amber-400",
      glow: "shadow-amber-500/20",
    };
  };

  const handlePayment = async () => {
    if (!dues || dues.status === "Paid") return;

    try {
      const orderRes = await api.post("/api/payment/create-order", {
        amount: dues.amount,
        dueId: dues._id,
      });

      if (!orderRes.data?.success) {
        show(orderRes.data?.message || "Payment service unavailable.", "error");
        return;
      }

      const { orderId, amount, keyId } = orderRes.data;
      const finalKey = keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;

      const options = {
        key: finalKey,
        amount,
        currency: "INR",
        name: "Aetheria Society",
        description: "Maintenance Dues Payment",
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyRes = await api.post("/api/payment/verify-payment", {
              order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dueId: dues._id,
            });

            if (verifyRes.data.success) {
              show("Payment successful. Receipt downloading…", "success");
              try {
                const { jsPDF } = await import("jspdf");
                const pdf = new jsPDF();
                const paidAt = new Date();
                pdf.setFontSize(22);
                pdf.text("AETHERIA SOCIETY", 14, 25);
                pdf.setFontSize(10);
                pdf.setTextColor(100);
                pdf.text("Official Payment Receipt", 14, 32);

                pdf.setDrawColor(200);
                pdf.line(14, 38, 196, 38);

                pdf.setFontSize(12);
                pdf.setTextColor(0);
                pdf.text(`Resident: ${userData.name || "-"}`, 14, 50);
                pdf.text(`User ID: ${userData.userId || "-"}`, 14, 58);
                pdf.text(
                  `Amount: ₹${Number(dues.amount).toLocaleString("en-IN")}`,
                  14,
                  66,
                );
                pdf.text(`Order ID: ${response.razorpay_order_id}`, 14, 74);
                pdf.text(`Payment ID: ${response.razorpay_payment_id}`, 14, 82);
                pdf.text(`Paid On: ${paidAt.toLocaleString()}`, 14, 90);

                pdf.setFontSize(10);
                pdf.setTextColor(150);
                pdf.text(
                  "Thank you for your payment. This is a computer generated receipt.",
                  14,
                  110,
                );

                pdf.save(`Receipt_${response.razorpay_order_id}.pdf`);
              } catch (e) {
                console.warn("PDF generation failed:", e);
              }
              const duesRes = await api.get("/api/user/dues");
              setDues(duesRes.data.dues);
            }
          } catch (err) {
            show("Payment verification failed.", "error");
          }
        },
        prefill: {
          name: userData.name || "",
          email: userData.email || "",
          contact: userData.phone || "",
        },
        theme: { color: "#3b82f6" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      show("Failed to initiate payment.", "error");
    }
  };

  const statusInfo = getDuesStatusInfo();
  const displayAmount = !dues || dues.status === "Paid" ? 0 : dues.amount || 0;

  const quickActions = [
    {
      title: "Voting System",
      description: "Participate in key decisions",
      intro: "View active polls and share your voice on community matters.",
      icon: <Vote size={24} />,
      path: "/dashboard/voting",
    },
    {
      title: "Book Amenity",
      description: "Reserve clubhouse or courts",
      icon: <Calendar size={24} />,
      path: "/dashboard/booking",
    },
    {
      title: "Marketplace",
      description: "Buy & sell within society",
      icon: <ShoppingCart size={24} />,
      path: "/dashboard/marketplace",
    },
    {
      title: "Raise Ticket",
      description: "Report maintenance issues",
      icon: <Ticket size={24} />,
      path: "/dashboard/tickets/new",
    },
    {
      title: "Guest Pass",
      description: "Generate entry codes",
      icon: <Key size={24} />,
      path: "/dashboard/request-guest-pass",
    },
    {
      icon: <Users size={24} />,
      path: "/dashboard/community",
    },
    {
      title: "Community Forum",
      description: "Resident discussions",
      icon: <MessageSquare size={24} />,
      path: "/dashboard/forum",
    },
    {
      title: "My Ledger",
      description: "Financial transactions",
      icon: <DollarSign size={24} />,
      path: "/dashboard/ledger",
    },
    {
      title: "Domestic Staff",
      description: "Manage helper entries",
      icon: <ShieldCheck size={24} />,
      path: "/dashboard/staff",
    },
    {
      title: "My Listings",
      description: "Manage your sales",
      icon: <List size={24} />,
      path: "/dashboard/my-listings",
    },
    {
      title: "My Profile",
      description: "Update account info",
      icon: <User size={24} />,
      path: "/dashboard/profile",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto space-y-10 pb-12"
    >
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 pt-4 px-2">
        <motion.div variants={itemVariants}>
          <h1 className="text-5xl font-extrabold tracking-tight mb-2">
            Welcome,{" "}
            <span className="text-gradient">
              {(userData.name || "User").split(" ")[0]}
            </span>
          </h1>
          <p className="text-gray-400 font-medium tracking-wide">
            Your community dashboard highlights and quick actions.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-right hidden md:block"
        >
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl shadow-xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
              Active Resident
            </span>
          </div>
        </motion.div>
      </header>

      {/* Society Map Status */}
      <motion.section variants={itemVariants} className="px-2">
        <SocietyMap />
      </motion.section>

      {/* Primary Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Maintenance Dues Card */}
        <motion.div
          variants={itemVariants}
          onClick={handlePayment}
          className={`p-8 rounded-[32px] glass-card border flex flex-col justify-between relative overflow-hidden group bg-gradient-to-br ${statusInfo.bg} ${statusInfo.glow} shadow-2xl ${
            dues && dues.status !== "Paid"
              ? "cursor-pointer active:scale-95"
              : ""
          }`}
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <DollarSign size={120} strokeWidth={1} />
          </div>

          <div className="flex justify-between items-start relative z-10">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform">
              {statusInfo.icon}
            </div>
            <span
              className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-[0.2em] border shadow-lg bg-black/20 ${statusInfo.statusColor} ${statusInfo.bg}`}
            >
              {statusInfo.statusText}
            </span>
          </div>

          <div className="mt-12 relative z-10">
            <p className="text-sm font-bold text-white/60 mb-1.5 tracking-wide uppercase">
              Maintenance Dues
            </p>
            {isLoading ? (
              <div className="h-12 w-32 bg-white/10 rounded-2xl animate-pulse"></div>
            ) : (
              <p className="text-5xl font-black tracking-tighter">
                ₹{Number(displayAmount).toLocaleString("en-IN")}
              </p>
            )}
            {dues && dues.status !== "Paid" && (
              <div className="flex items-center gap-2 mt-4 text-xs font-bold text-white/80 group-hover:text-white transition-colors">
                <span>Complete Payment</span>
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Support Ticket Summary */}
        <motion.div
          variants={itemVariants}
          className="p-8 bg-gradient-to-br from-indigo-600/20 to-indigo-900/20 glass-card border border-indigo-500/20 rounded-[32px] flex flex-col justify-between shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 text-indigo-400">
            <MessageCircle size={120} strokeWidth={1} />
          </div>

          <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 w-fit group-hover:scale-110 transition-transform">
            <Ticket className="text-indigo-400" size={32} />
          </div>

          <div className="mt-8 relative z-10">
            <p className="text-sm font-bold text-indigo-300/60 mb-4 tracking-wide uppercase">
              Your Support Tickets
            </p>
            {isLoading ? (
              <div className="flex gap-6 animate-pulse">
                <div className="h-10 w-12 bg-white/10 rounded-xl"></div>
                <div className="h-10 w-12 bg-white/10 rounded-xl"></div>
              </div>
            ) : (
              <div className="flex gap-10">
                <div className="group/item">
                  <span className="text-4xl font-black block text-white group-hover/item:text-indigo-400 transition-colors">
                    {ticketSummary.open}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    Open
                  </span>
                </div>
                <div className="w-px bg-white/10 h-10 self-center"></div>
                <div className="group/item">
                  <span className="text-4xl font-black block text-white group-hover/item:text-indigo-400 transition-colors">
                    {ticketSummary.inProgress}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    In Progress
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Notice Board Spanning Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1 h-full">
          <UserNoticeBoard />
        </motion.div>
      </section>

      {/* Quick Actions Grid */}
      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-2xl font-black tracking-tight uppercase">
            Quick Actions
          </h2>
          <div className="h-px flex-1 bg-white/5 mx-6"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {quickActions.map((action, idx) => (
            <DashboardCard key={action.title} {...action} />
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default User_Dashboard;
