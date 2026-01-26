import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  CreditCard,
  CalendarCheck,
  Bell,
  BarChart,
  Building,
  Menu,
  X,
  Ticket,
  UserCheck,
  ClockAlert,
  BarChart3,
} from "lucide-react";

/* ================= Nav Item ================= */
const NavItem = ({ item, isOpen }) => (
  <li>
    <NavLink
      to={item.path}
      end={item.path === "/admin"}
      className={({ isActive }) =>
        `flex items-center space-x-3 w-full p-3 rounded-lg transition-colors duration-200
        ${isOpen ? "px-4" : "justify-center"}
        ${
          isActive
            ? "bg-blue-600 text-white shadow-md"
            : "text-white hover:bg-gray-700"
        }`
      }
    >
      {item.icon}
      {isOpen && <span className="font-medium">{item.name}</span>}
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
      name: "Rentals",
      icon: <Building size={20} />,
      path: "/admin/manage-rentals",
    },
    /* 📊 ADDED ANALYTICS */
    {
      name: "Analytics",
      icon: <BarChart3 size={20} />,
      path: "/admin/analytics",
    },
    /* 🎫 ADMIN TICKET SYSTEM */
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

  return (
    <nav
      className={`h-screen bg-gray-900 text-white shadow-lg
        flex flex-col
        ${isOpen ? "w-64" : "w-20"}
        transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
        {isOpen && <div className="text-xl font-bold">Aetheria Admin</div>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-700"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <ul className="flex-1 space-y-2 p-3 overflow-y-auto">
        {menu.map((item) => (
          <NavItem key={item.name} item={item} isOpen={isOpen} />
        ))}
      </ul>
    </nav>
  );
}

export default AdminSidebar;
