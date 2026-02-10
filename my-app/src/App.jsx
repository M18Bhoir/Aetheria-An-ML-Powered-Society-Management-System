import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";

/* ================= ADMIN IMPORTS ================= */
import AdminDashboard from "./Dashboard/admin-dashboard";
import AdminHome from "./Dashboard/AdminHome";
import CreateDues from "./Dashboard/AdminViews/CreateDues";
import ManageDues from "./Dashboard/AdminViews/ManageDues";
import ManageBookings from "./Dashboard/AdminViews/ManageBookings";
import ManageGuestRequests from "./Dashboard/AdminViews/ManageGuestRequests";
import ResidentList from "./Dashboard/AdminViews/ResidentList";
import Maintenance from "./Dashboard/AdminViews/Maintenance";
import Notices from "./Dashboard/AdminViews/Notices";
import ManagePolls from "./Dashboard/AdminViews/ManagePolls";
import CreatePoll from "./Voting_System/CreatePoll";
import ExpenseLogger from "./Dashboard/AdminViews/ExpenseLogger";
import ManageRentals from "./Dashboard/AdminViews/ManageRentals";

/* 🎫 ADMIN TICKETS */
import TicketOverview from "./admin/tickets/TicketOverview.jsx";
import SLAAlerts from "./admin/tickets/SLAAlerts.jsx";
import TicketReports from "./admin/tickets/TicketsReport.jsx";

/* 📊 ADMIN ANALYTICS */
import AdminAnalyticsDashboard from "./pages/AnalyticsDashboard.jsx";

/* ================= USER IMPORTS ================= */
import UserLayout from "./UserDashBoard/UserLayout";
import UserDashboard from "./UserDashBoard/User_Dashboard";
import LandingPage from "./LandingPage/LandingPage";
import Login from "./LoginSignUp/Login";
import Signup from "./LoginSignUp/SignUp";
import Profile from "./Profile/Profile";
import { PollList, PollDetail } from "./Voting_System/VotingSystem";
import AmenityBooking from "./Booking/AmenityBooking";
import MyBookings from "./Booking/MyBookings";
import MarketplaceList from "./Marketplace/MarketplaceList";
import MarketplaceItemDetail from "./Marketplace/MarketplaceItemDetail";
import CreateMarketplaceItem from "./Marketplace/MarketplaceItem";
import MyListings from "./Marketplace/MyListings";
import RequestGuestPass from "./Booking/RequestGuestPass";
import MyGuestPasses from "./Booking/MyGuestPasses";

/* 🎫 USER TICKETS */
import MyTickets from "./tickets/MyTickets";
import RaiseTicket from "./tickets/RaiseTicket";
import TicketComments from "./tickets/TicketComments";
import TrackTicket from "./tickets/TrackTickets";

import "./index.css";

/* ================= PROTECTED ROUTE ================= */
function ProtectedRoute() {
  const location = useLocation();

  // Initialize state directly from localStorage to avoid the 1-second delay/flicker
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("admin");
    const user = localStorage.getItem("user");

    return {
      isAuthenticated: !!token,
      role: admin ? "admin" : user ? "user" : null,
    };
  });

  // 🔒 Not logged in - check immediately
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🛡 Role-based protection
  if (auth.role === "admin" && location.pathname.startsWith("/dashboard")) {
    return <Navigate to="/admin" replace />;
  }

  if (auth.role === "user" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

/* ================= MAIN APP ================= */
function App() {
  return (
    <Router>
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ===== PROTECTED ROUTES ===== */}
        <Route element={<ProtectedRoute />}>
          {/* ===== USER DASHBOARD ===== */}
          <Route path="/dashboard" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="voting" element={<PollList />} />
            <Route path="poll/:id" element={<PollDetail />} />
            <Route path="booking" element={<AmenityBooking />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="request-guest-pass" element={<RequestGuestPass />} />
            <Route path="my-guest-passes" element={<MyGuestPasses />} />
            <Route path="marketplace" element={<MarketplaceList />} />
            <Route path="marketplace/new" element={<CreateMarketplaceItem />} />
            <Route
              path="marketplace/:itemId"
              element={<MarketplaceItemDetail />}
            />
            <Route path="my-listings" element={<MyListings />} />

            {/* 🎫 USER TICKETS */}
            <Route path="tickets">
              <Route index element={<MyTickets />} />
              <Route path="new" element={<RaiseTicket />} />
              <Route path="track" element={<TrackTicket />} />
              <Route path=":ticketId" element={<TicketComments />} />
            </Route>
          </Route>

          {/* ===== ADMIN DASHBOARD ===== */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminHome />} />
            <Route path="residents" element={<ResidentList />} />
            <Route path="create-dues" element={<CreateDues />} />
            <Route path="manage-dues" element={<ManageDues />} />
            <Route path="manage-bookings" element={<ManageBookings />} />
            <Route path="guest-requests" element={<ManageGuestRequests />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="notices" element={<Notices />} />
            <Route path="manage-polls" element={<ManagePolls />} />
            <Route path="create-poll" element={<CreatePoll />} />
            <Route path="poll/:id" element={<PollDetail />} />
            <Route path="expense-logger" element={<ExpenseLogger />} />
            <Route path="manage-rentals" element={<ManageRentals />} />

            {/* 📊 ADMIN ANALYTICS */}
            <Route path="analytics" element={<AdminAnalyticsDashboard />} />

            {/* 🎫 ADMIN TICKETS */}
            <Route path="tickets/overview" element={<TicketOverview />} />
            <Route path="tickets/sla-alerts" element={<SLAAlerts />} />
            <Route path="tickets/reports" element={<TicketReports />} />
          </Route>
        </Route>

        {/* ===== 404 ===== */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen">
              <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
              <Link to="/" className="text-blue-500 hover:underline">
                Go back home
              </Link>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
