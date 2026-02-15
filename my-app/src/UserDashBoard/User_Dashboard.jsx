import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { loadScript } from "../utils/loadScript";

/* ================= Glass Card Component ================= */
const DashboardCard = ({
  title,
  description,
  icon,
  path,
  colorClass = "bg-white/5",
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className={`group relative p-6 ${colorClass} backdrop-blur-md border border-white/10 rounded-3xl shadow-lg hover:shadow-2xl hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 text-left text-white overflow-hidden`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <ArrowRight size={48} />
      </div>

      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="p-3 bg-white/10 w-fit rounded-2xl text-white mb-4 border border-white/10 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-wide">{title}</h3>
          <p className="text-sm text-gray-300 mt-1">{description}</p>
        </div>
      </div>
    </button>
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
    <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-lg text-white h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">📢 Notice Board</h3>
        <span className="text-xs px-2 py-1 bg-white/10 rounded-full">
          Recent
        </span>
      </div>

      {loading && (
        <p className="text-gray-300 animate-pulse">Loading notices...</p>
      )}
      {!loading && notices.length === 0 && (
        <p className="text-gray-400 italic">No notices posted.</p>
      )}
      {!loading && notices.length > 0 && (
        <ul className="space-y-3 flex-1 overflow-auto pr-2 custom-scrollbar">
          {notices.map((notice) => (
            <li
              key={notice._id}
              className="p-4 bg-black/20 hover:bg-black/30 transition-colors rounded-2xl border border-white/5"
            >
              <div className="flex justify-between items-start mb-1">
                <p className="font-semibold text-blue-300 text-sm">
                  {notice.title}
                </p>
                <p className="text-[10px] text-gray-400">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-xs text-gray-300 line-clamp-2">
                {notice.body}
              </p>
            </li>
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

  /* Ticket Summary */
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

        /* --- Fetch dues --- */
        const duesRes = await api.get("/api/user/dues");
        setDues(duesRes.data.dues);

        /* --- Fetch ticket summary --- */
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

  const getDuesCardStyle = () => {
    if (!dues || dues.status === "Paid") {
      return {
        // Gradient for glass effect
        bg: "bg-gradient-to-br from-green-500/20 to-green-900/20 border-green-500/30",
        icon: <CheckCircle className="text-green-400" size={32} />,
        statusText: "Paid",
        statusColor: "text-green-400",
      };
    }
    if (dues.status === "Overdue") {
      return {
        bg: "bg-gradient-to-br from-red-500/20 to-red-900/20 border-red-500/30",
        icon: <AlertTriangle className="text-red-400" size={32} />,
        statusText: "Overdue",
        statusColor: "text-red-400",
      };
    }
    return {
      bg: "bg-gradient-to-br from-yellow-500/20 to-yellow-900/20 border-yellow-500/30",
      icon: <DollarSign className="text-yellow-400" size={32} />,
      statusText: "Pending",
      statusColor: "text-yellow-400",
    };
  };

  const handlePayment = async () => {
    if (!dues || dues.status === "Paid") return;

    try {
      // Create order
      const orderRes = await api.post("/api/payment/create-order", {
        amount: dues.amount,
        dueId: dues._id,
      });

      const { orderId, amount } = orderRes.data;

      // Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_your_key_id",
        amount: amount,
        currency: "INR",
        name: "Aetheria Society",
        description: "Maintenance Dues Payment",
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyRes = await api.post("/api/payment/verify-payment", {
              order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dueId: dues._id,
            });

            if (verifyRes.data.success) {
              alert("Payment successful! Your dues have been paid.");
              // Refresh dues data
              const duesRes = await api.get("/api/user/dues");
              setDues(duesRes.data.dues);
            }
          } catch (err) {
            console.error("Payment verification failed:", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: userData.name || "",
          email: userData.email || "",
          contact: userData.phone || "",
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert(
        err.response?.data?.message ||
          "Failed to initiate payment. Please try again.",
      );
    }
  };

  const duesStyle = getDuesCardStyle();

  const actions = [
    {
      title: "Voting System",
      description: "Participate in decisions",
      icon: <Vote />,
      path: "/dashboard/voting",
    },
    {
      title: "Book Amenity",
      description: "Reserve facilities",
      icon: <Calendar />,
      path: "/dashboard/booking",
    },
    {
      title: "My Bookings",
      description: "Track reservations",
      icon: <CalendarCheck />,
      path: "/dashboard/my-bookings",
    },
    {
      title: "Marketplace",
      description: "Buy & sell community items",
      icon: <ShoppingCart />,
      path: "/dashboard/marketplace",
      // Bento span example: make this card wider if desired, but keeping grid uniform for now
    },
    {
      title: "My Listings",
      description: "Manage your sales",
      icon: <List />,
      path: "/dashboard/my-listings",
    },
    {
      title: "Raise Ticket",
      description: "Report an issue",
      icon: <Ticket />,
      path: "/dashboard/tickets/new",
    },
    {
      title: "My Tickets",
      description: "Track support requests",
      icon: <MessageCircle />,
      path: "/dashboard/tickets",
    },
    {
      title: "My Profile",
      description: "Update personal info",
      icon: <User />,
      path: "/dashboard/profile",
    },
  ];

  return (
    // Global container handled by index.css body background, but we add padding
    <div className="min-h-screen text-white p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 animate-fade-in-down">
        <div>
          <h1 className="text-4xl font-extrabold mb-1">
            Hello,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {userData.name || "User"}
            </span>{" "}
            👋
          </h1>
          <p className="text-gray-400 text-sm">
            Welcome back to your community dashboard.
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
            Current Status
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Active Resident</span>
          </div>
        </div>
      </div>

      {/* BENTO GRID: Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Maintenance Dues (Glass) - Clickable for payment */}
        <div
          onClick={handlePayment}
          className={`p-6 rounded-3xl backdrop-blur-md border shadow-lg flex flex-col justify-between ${duesStyle.bg} ${
            dues && dues.status !== "Paid"
              ? "cursor-pointer hover:scale-[1.02] transition-transform"
              : ""
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-white/10 rounded-2xl">{duesStyle.icon}</div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border border-white/10 bg-black/20 ${duesStyle.statusColor}`}
            >
              {duesStyle.statusText}
            </span>
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-300 mb-1">Maintenance Dues</p>
            {isLoading ? (
              <div className="h-8 w-24 bg-white/10 rounded animate-pulse"></div>
            ) : (
              <p className="text-4xl font-bold tracking-tight">
                ₹{dues?.amount?.toLocaleString("en-IN") || "0"}
              </p>
            )}
            {dues && dues.status !== "Paid" && (
              <p className="text-xs text-gray-400 mt-2">Click to pay →</p>
            )}
          </div>
        </div>

        {/* Card 2: Ticket Summary (Glass - Blue Tint) */}
        <div className="p-6 bg-gradient-to-br from-blue-600/30 to-blue-900/30 backdrop-blur-md border border-blue-500/30 rounded-3xl shadow-lg flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-blue-500/20 rounded-2xl">
              <Ticket className="text-blue-300" size={32} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-blue-200 mb-2">Support Tickets</p>
            <div className="flex gap-4">
              <div>
                <span className="text-2xl font-bold text-white block">
                  {ticketSummary.open}
                </span>
                <span className="text-xs text-blue-300">Open</span>
              </div>
              <div className="w-px bg-blue-500/30"></div>
              <div>
                <span className="text-2xl font-bold text-white block">
                  {ticketSummary.inProgress}
                </span>
                <span className="text-xs text-blue-300">In Progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Notices (Spans row in mobile, 1 col in desktop) */}
        <div className="md:col-span-2 lg:col-span-1 h-full">
          <UserNoticeBoard />
        </div>
      </div>

      {/* Quick Actions Grid */}
      <h2 className="text-xl font-bold mb-4 text-gray-200">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <DashboardCard key={action.title} {...action} />
        ))}
      </div>
    </div>
  );
}

export default User_Dashboard;
