import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  Users,
  Wrench,
  Home,
  DollarSign,
  LogOut,
  CalendarCheck,
  Key,
  ClipboardEdit,
  Vote,
  FileText,
  Briefcase,
  BarChart3,
  Ticket,
  ClockAlert,
} from "lucide-react";

/* ================= Nav Item Component ================= */
const NavItem = ({ item }) => (
  <NavLink
    to={item.path}
    end={item.path === "/admin"}
    className={({ isActive }) =>
      `flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-300 mb-1 px-4
      ${
        isActive
          ? "bg-blue-600/80 shadow-[0_0_15px_rgba(37,99,235,0.5)] text-white border border-blue-400/30"
          : "text-gray-400 hover:bg-white/10 hover:text-white hover:scale-105"
      }`
    }
  >
    {item.icon}
    <span className="font-medium tracking-wide">{item.name}</span>
  </NavLink>
);

/* ================= Sidebar Component ================= */
const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/admin" },
    { name: "Residents", icon: <Users size={20} />, path: "/admin/residents" },
    {
      name: "Create Dues",
      icon: <DollarSign size={20} />,
      path: "/admin/create-dues",
    },
    {
      name: "Manage Dues",
      icon: <ClipboardEdit size={20} />,
      path: "/admin/manage-dues",
    },
    {
      name: "Bookings",
      icon: <CalendarCheck size={20} />,
      path: "/admin/manage-bookings",
    },
    {
      name: "Guest Requests",
      icon: <Key size={20} />,
      path: "/admin/guest-requests",
    },
    {
      name: "Manage Polls",
      icon: <Vote size={20} />,
      path: "/admin/manage-polls",
    },
    {
      name: "Maintenance",
      icon: <Wrench size={20} />,
      path: "/admin/maintenance",
    },
    { name: "Notices", icon: <Bell size={20} />, path: "/admin/notices" },
    {
      name: "Expense Log",
      icon: <FileText size={20} />,
      path: "/admin/expense-logger",
    },
    {
      name: "Rentals",
      icon: <Briefcase size={20} />,
      path: "/admin/manage-rentals",
    },
    {
      name: "Analytics",
      icon: <BarChart3 size={20} />,
      path: "/admin/analytics",
    },
    {
      name: "Tickets",
      icon: <Ticket size={20} />,
      path: "/admin/tickets/overview",
    },
    {
      name: "SLA Alerts",
      icon: <ClockAlert size={20} />,
      path: "/admin/tickets/sla-alerts",
    },
    {
      name: "Reports",
      icon: <BarChart3 size={20} />,
      path: "/admin/tickets/reports",
    },
  ];

  return (
    <aside className="w-72 bg-black/20 backdrop-blur-xl border-r border-white/10 shadow-2xl h-screen flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-center p-6 h-20 border-b border-white/10">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Admin
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto custom-scrollbar">
        {menu.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full p-3 rounded-xl px-4
            transition-all duration-300 text-red-400 border border-transparent
            hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/20"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

/* ================= Main Layout ================= */
function AdminDashboard() {
  return (
    <div className="flex h-screen w-full overflow-hidden text-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative">
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}

export default AdminDashboard;
