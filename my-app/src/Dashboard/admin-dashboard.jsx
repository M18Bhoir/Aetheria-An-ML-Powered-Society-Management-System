import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  Users,
  Wrench,
  Menu,
  X,
  Home,
  DollarSign,
  LogOut,
  CalendarCheck,
  Key,
  ClipboardEdit,
  Vote,
  FileText,
  Briefcase,

  // 🎫 Ticket Icons
  Ticket,
  UserCheck,
  ClockAlert,
  BarChart3,
} from "lucide-react";

/* ================= Sidebar ================= */
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* ================= MENU ================= */
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
      name: "Manage Bookings",
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
      name: "Expense Logger",
      icon: <FileText size={20} />,
      path: "/admin/expense-logger",
    },
    {
      name: "Rental Applications",
      icon: <Briefcase size={20} />,
      path: "/admin/manage-rentals",
    },

    /* ================= 🎫 TICKET SYSTEM ================= */
    {
      name: "Ticket Overview",
      icon: <Ticket size={20} />,
      path: "/admin/tickets/overview",
    },
    {
      name: "Assign Tickets",
      icon: <UserCheck size={20} />,
      path: "/admin/tickets/assign",
    },
    {
      name: "SLA Alerts",
      icon: <ClockAlert size={20} />,
      path: "/admin/tickets/sla-alerts",
    },
    {
      name: "Ticket Reports",
      icon: <BarChart3 size={20} />,
      path: "/admin/tickets/reports",
    },
  ];

  /* ================= Nav Item ================= */
  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      end={item.path === "/admin"}
      className={({ isActive }) =>
        `flex items-center space-x-3 w-full p-3 rounded-lg transition-colors duration-200
        ${isOpen ? "px-4" : "justify-center"}
        ${
          isActive
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      {item.icon}
      {isOpen && <span className="font-medium">{item.name}</span>}
    </NavLink>
  );

  return (
    <aside
      className={`${isOpen ? "w-64" : "w-20"}
        bg-gray-900 text-gray-200 shadow-lg
        transition-all duration-300 h-screen flex flex-col`}
    >
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
        {isOpen && <div className="text-xl font-bold text-white">🏢 Admin</div>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ===== Navigation ===== */}
      <nav className="flex-1 space-y-2 p-3 overflow-y-auto">
        {menu.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>

      {/* ===== Logout ===== */}
      <div className="p-3 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className={`flex items-center space-x-3 w-full p-3 rounded-lg
            transition-colors duration-200 text-red-400
            hover:bg-red-900 hover:text-red-300
            ${isOpen ? "px-4" : "justify-center"}`}
        >
          <LogOut size={20} />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

/* ================= Main Admin Dashboard ================= */
function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminDashboard;
