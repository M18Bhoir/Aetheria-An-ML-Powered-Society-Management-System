import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import PredictionCard from "../ML/PredictionCard";
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

/* ================= Dashboard Card ================= */
const DashboardCard = ({ title, description, icon, path }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="group p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left text-white"
    >
      <div className="flex items-start justify-between">
        <div className="p-3 bg-blue-600 rounded-lg text-white">{icon}</div>
        <ArrowRight
          className="text-gray-300 group-hover:text-white transition-colors"
          size={20}
        />
      </div>
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-1 text-sm text-gray-300">{description}</p>
    </button>
  );
};

/* ================= Notice Board ================= */
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
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg text-white">
      <h3 className="text-lg font-bold mb-4">Notice Board</h3>
      {loading && <p className="text-gray-300">Loading notices...</p>}
      {!loading && notices.length === 0 && (
        <p className="text-gray-300">No notices posted.</p>
      )}
      {!loading && notices.length > 0 && (
        <ul className="space-y-3">
          {notices.map((notice) => (
            <li key={notice._id} className="p-3 bg-gray-700 rounded-md">
              <p className="font-semibold text-blue-400">{notice.title}</p>
              <p className="text-xs text-gray-400">
                {new Date(notice.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-200">{notice.body}</p>
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

  /* 🎫 Ticket Summary */
  const [ticketSummary, setTicketSummary] = useState({
    open: 0,
    inProgress: 0,
  });

  /* 🔮 ML STATES */
  const [prediction, setPrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(true);
  const [predictionError, setPredictionError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUserData(JSON.parse(storedUser));

    const initializePage = async () => {
      try {
        await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        /* --- Fetch dues --- */
        const duesRes = await api.get("/api/user/dues");
        setDues(duesRes.data.dues);

        /* --- 🎫 Fetch ticket summary --- */
        const ticketRes = await api.get("/api/tickets/summary");
        setTicketSummary(ticketRes.data);

        /* --- 🔮 ML Prediction --- */
        const mlPayload = {
          model: "linear_regression",
          data: {
            flat_size: userData.flatSize || 1200,
            past_dues: duesRes.data.dues?.amount || 1500,
            delay_days: duesRes.data.dues?.delayDays || 10,
          },
        };

        const predRes = await api.post("/api/ml/predict", mlPayload);
        const predictedAmount = predRes.data.prediction;

        setPrediction({
          predicted_amount: predictedAmount,
          risk_level:
            predictedAmount > 3000
              ? "High"
              : predictedAmount > 2000
                ? "Medium"
                : "Low",
          confidence: 0.85,
        });
      } catch (err) {
        console.error(err);
        setPredictionError("Unable to load AI prediction");
      } finally {
        setIsLoading(false);
        setPredictionLoading(false);
      }
    };

    initializePage();
  }, []);

  const getDuesCardStyle = () => {
    if (!dues || dues.status === "Paid") {
      return {
        bg: "bg-green-600",
        icon: <CheckCircle className="text-white" />,
      };
    }
    if (dues.status === "Overdue") {
      return {
        bg: "bg-red-600",
        icon: <AlertTriangle className="text-white" />,
      };
    }
    return { bg: "bg-yellow-600", icon: <DollarSign className="text-white" /> };
  };

  const duesStyle = getDuesCardStyle();

  const actions = [
    {
      title: "Voting System",
      description: "Cast votes",
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
      description: "View bookings",
      icon: <CalendarCheck />,
      path: "/dashboard/my-bookings",
    },
    {
      title: "Marketplace",
      description: "Buy & sell",
      icon: <ShoppingCart />,
      path: "/dashboard/marketplace",
    },
    {
      title: "My Listings",
      description: "Manage listings",
      icon: <List />,
      path: "/dashboard/my-listings",
    },
    {
      title: "My Profile",
      description: "Update profile",
      icon: <User />,
      path: "/dashboard/profile",
    },

    /* 🎫 Ticket System */
    {
      title: "Raise Ticket",
      description: "Report an issue",
      icon: <Ticket />,
      path: "/dashboard/tickets/new",
    },
    {
      title: "My Tickets",
      description: "Track & manage tickets",
      icon: <MessageCircle />,
      path: "/dashboard/tickets",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">
        Welcome, {userData.name || "User"}!
      </h1>

      <h2 className="text-2xl font-semibold mb-4">Overview</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Maintenance Dues */}
        <div className={`p-6 rounded-lg shadow-lg ${duesStyle.bg}`}>
          <div className="flex items-center gap-4">
            {duesStyle.icon}
            <div>
              <p className="text-sm">Maintenance Dues</p>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <p className="text-3xl font-bold">
                  ₹{dues?.amount?.toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 🎫 Ticket Summary */}
        <div className="p-6 bg-blue-700 rounded-lg shadow-lg">
          <div className="flex items-center gap-4">
            <Ticket className="text-white" />
            <div>
              <p className="text-sm">Support Tickets</p>
              <p className="text-lg font-bold">
                Open: {ticketSummary.open} | In Progress:{" "}
                {ticketSummary.inProgress}
              </p>
            </div>
          </div>
        </div>

        {/* Notices */}
        <div className="lg:col-span-1">
          <UserNoticeBoard />
        </div>
      </div>

      {/* -------- AI INSIGHTS -------- */}
      <h2 className="text-2xl font-semibold mb-4">AI Insights</h2>
      <div className="mb-8 max-w-md">
        {predictionLoading && (
          <p className="text-gray-300">Loading AI prediction...</p>
        )}
        {predictionError && <p className="text-red-400">{predictionError}</p>}
        {!predictionLoading && prediction && (
          <PredictionCard prediction={prediction} />
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action) => (
          <DashboardCard key={action.title} {...action} />
        ))}
      </div>
    </div>
  );
}

export default User_Dashboard;
