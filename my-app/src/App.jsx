import React, { useContext, Suspense, lazy } from "react";
import { ToastProvider, Toaster } from "./context/ToastContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";

/* ================= CONTEXT IMPORT ================= */
import { AuthProvider, AuthContext } from "./context/AuthContext";

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
import ChangePassword from "./Profile/ChangePassword";
import { PollList, PollDetail } from "./Voting_System/VotingSystem";
import AmenityBooking from "./Booking/AmenityBooking";
import MyBookings from "./Booking/MyBookings";
const MarketplaceList = lazy(() => import("./Marketplace/MarketplaceList"));
const MarketplaceItemDetail = lazy(
  () => import("./Marketplace/MarketplaceItemDetail"),
);
const CreateMarketplaceItem = lazy(
  () => import("./Marketplace/MarketplaceItem"),
);
const MyListings = lazy(() => import("./Marketplace/MyListings"));
import RequestGuestPass from "./Booking/RequestGuestPass";
import MyGuestPasses from "./Booking/MyGuestPasses";

/* 🎫 USER TICKETS */
import MyTickets from "./tickets/MyTickets";
import RaiseTicket from "./tickets/RaiseTicket";
import TicketComments from "./tickets/TicketComments";
import TrackTicket from "./tickets/TrackTickets";

/* 🏙️ NEW COMMUNITY PAGES */
import CommunityGallery from "./pages/CommunityGallery";
import CommitteeMembers from "./pages/CommitteeMembers";
import SocietyRules from "./pages/SocietyRules";
import ContactUs from "./pages/ContactUs";
const ResidentsDirectory = lazy(() => import("./Community/ResidentsDirectory"));
import ForumBoard from "./Community/ForumBoard";
import UserLedger from "./UserDashBoard/UserLedger";
import StaffManagement from "./UserDashBoard/StaffManagement";
import NOCDashboard from "./UserDashBoard/NOCDashboard";
import AdminNOCManager from "./Dashboard/AdminViews/AdminNOCManager";

import "./index.css";

/* ================= PROTECTED ROUTE (UPDATED) ================= */
// Now uses AuthContext to prevent flickering and handle state globally
function ProtectedRoute({ role }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    // Show a glass-morphic loader while checking session
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-pulse">Loading Aetheria...</div>
      </div>
    );
  }

  // 🔒 Not logged in
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🛡 Role-based protection
  // If route requires a specific role (e.g. 'admin') and user doesn't have it
  if (role && user.role !== role) {
    // Redirect to their appropriate dashboard
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />
    );
  }

  return <Outlet />;
}

/* ================= MAIN APP ================= */
function App() {
  return (
    // 1. Wrap entire app in AuthProvider
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                  <div className="animate-pulse">Loading…</div>
                </div>
              }
            >
              <Routes>
                {/* ===== PUBLIC ROUTES ===== */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/contact" element={<ContactUs />} />

                {/* ===== USER ROUTES (Protected) ===== */}
                <Route element={<ProtectedRoute role="user" />}>
                  <Route path="/dashboard" element={<UserLayout />}>
                    <Route index element={<UserDashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route
                      path="change-password"
                      element={<ChangePassword />}
                    />

                    {/* Voting */}
                    <Route path="voting" element={<PollList />} />
                    <Route path="poll/:id" element={<PollDetail />} />
                    <Route path="create-poll" element={<CreatePoll />} />

                    {/* Booking */}
                    <Route path="booking" element={<AmenityBooking />} />
                    <Route path="my-bookings" element={<MyBookings />} />
                    <Route
                      path="request-guest-pass"
                      element={<RequestGuestPass />}
                    />
                    <Route path="my-guest-passes" element={<MyGuestPasses />} />

                    {/* Marketplace */}
                    <Route path="marketplace" element={<MarketplaceList />} />
                    <Route
                      path="marketplace/new"
                      element={<CreateMarketplaceItem />}
                    />
                    <Route
                      path="marketplace/:itemId"
                      element={<MarketplaceItemDetail />}
                    />
                    <Route path="my-listings" element={<MyListings />} />

                    {/* Tickets */}
                    <Route path="tickets">
                      <Route index element={<MyTickets />} />
                      <Route path="new" element={<RaiseTicket />} />
                      <Route path="track" element={<TrackTicket />} />
                      <Route path=":ticketId" element={<TicketComments />} />
                    </Route>

                    {/* 🌟 NEW COMMUNITY ROUTES */}
                    <Route path="gallery" element={<CommunityGallery />} />
                    <Route path="members" element={<CommitteeMembers />} />
                    <Route path="rules" element={<SocietyRules />} />
                    <Route path="contact" element={<ContactUs />} />
                    <Route path="community" element={<ResidentsDirectory />} />
                    <Route path="forum" element={<ForumBoard />} />
                    <Route path="ledger" element={<UserLedger />} />
                    <Route path="staff" element={<StaffManagement />} />
          <Route path="noc" element={<NOCDashboard />} />
                  </Route>
                </Route>

                {/* ===== ADMIN ROUTES (Protected) ===== */}
                <Route element={<ProtectedRoute role="admin" />}>
                  <Route path="/admin" element={<AdminDashboard />}>
                    <Route index element={<AdminHome />} />
                    <Route path="residents" element={<ResidentList />} />

                    {/* Dues & Finance */}
                    <Route path="create-dues" element={<CreateDues />} />
                    <Route path="manage-dues" element={<ManageDues />} />
                    <Route path="expense-logger" element={<ExpenseLogger />} />

                    {/* Operations */}
                    <Route
                      path="manage-bookings"
                      element={<ManageBookings />}
                    />
                    <Route
                      path="guest-requests"
                      element={<ManageGuestRequests />}
                    />
                    <Route path="maintenance" element={<Maintenance />} />
            <Route path="noc" element={<AdminNOCManager />} />
                    <Route path="notices" element={<Notices />} />
                    <Route path="manage-rentals" element={<ManageRentals />} />

                    {/* Voting */}
                    <Route path="manage-polls" element={<ManagePolls />} />
                    <Route path="create-poll" element={<CreatePoll />} />
                    <Route path="poll/:id" element={<PollDetail />} />

                    {/* Analytics */}
                    <Route
                      path="analytics"
                      element={<AdminAnalyticsDashboard />}
                    />

                    {/* Tickets */}
                    <Route
                      path="tickets/overview"
                      element={<TicketOverview />}
                    />
                    <Route path="tickets/sla-alerts" element={<SLAAlerts />} />
                    <Route path="tickets/reports" element={<TicketReports />} />
                  </Route>
                </Route>

                {/* ===== 404 ===== */}
                <Route
                  path="*"
                  element={
                    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f1e] text-white">
                      <h1 className="text-4xl font-bold mb-4">
                        404 - Page Not Found
                      </h1>
                      <Link
                        to="/"
                        className="text-blue-400 hover:text-blue-300 transition-colors underline"
                      >
                        Go back home
                      </Link>
                    </div>
                  }
                />
              </Routes>
            </Suspense>
            <Toaster />
          </ErrorBoundary>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f1e] text-white p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-gray-400 mb-6">
            Please try refreshing the page or going back home.
          </p>
          <a
            href="/"
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition"
          >
            Go Home
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}
