import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  CreditCard,
  CalendarCheck,
  Bell,
  BarChart,
  Menu,
  X,
  Ticket,
  FileText,
} from "lucide-react";

/* ================= Nav Item ================= */
const NavItem = ({ item, isOpen }) => (
  <li>
    <NavLink
      to={item.path}
      end={item.path === "/admin"}
      className={({ isActive }) =>
        `flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-300 mb-1
        ${isOpen ? "px-4" : "justify-center"}
        ${
          isActive
            ? "bg-blue-600/80 shadow-[0_0_15px_rgba(37,99,235,0.5)] text-white border border-blue-400/30"
            : "text-gray-400 hover:bg-white/10 hover:text-white hover:scale-105"
        }`
      }
    >
      {/* Icon Wrapper for better centering when collapsed */}
      <div className={`${!isOpen && "mx-auto"}`}>{item.icon}</div>

      {isOpen && (
        <span className="font-medium tracking-wide animate-fade-in">
          {item.name}
        </span>
      )}
    </NavLink>
  </li>
);

/* ================= Admin Sidebar ================= */
function AdminSidebar({ isOpen, setIsOpen }) {
  const menu = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/admin" },
    { name: "Residents", icon: <Users size={20} />, path: "/admin/residents" },
    {
      name: "Create Dues",
      icon: <CreditCard size={20} />,
      path: "/admin/create-dues",
    },
    {
      name: "Manage Dues",
      icon: <CreditCard size={20} />,
      path: "/admin/manage-dues",
    },
    {
      name: "Bookings",
      icon: <CalendarCheck size={20} />,
      path: "/admin/manage-bookings",
    },
    { name: "Notices", icon: <Bell size={20} />, path: "/admin/notices" },
    {
      name: "Expenses",
      icon: <BarChart size={20} />,
      path: "/admin/expense-logger",
    },
    {
      name: "Ticket Overview",
      icon: <Ticket size={20} />,
      path: "/admin/tickets/overview",
    },
    {
      name: "NOC Requests",
      icon: <FileText size={20} />,
      path: "/admin/noc",
    },
  ];

  return (
    <nav
      className={`h-screen bg-black/20 backdrop-blur-xl border-r border-white/10 shadow-2xl
        flex flex-col z-50
        ${isOpen ? "w-72" : "w-24"}
        transition-all duration-300 ease-in-out`}
    >
      {/* Header / Toggle */}
      <div className="flex items-center justify-between p-6 h-20 border-b border-white/10">
        {isOpen && (
          <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 whitespace-nowrap overflow-hidden">
            AETHERIA Admin
          </h1>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors ${!isOpen && "mx-auto"}`}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Nav List */}
      <ul className="flex-1 space-y-2 p-4 overflow-y-auto custom-scrollbar">
        {menu.map((item) => (
          <NavItem key={item.name} item={item} isOpen={isOpen} />
        ))}
      </ul>
    </nav>
  );
}

export default AdminSidebar;
