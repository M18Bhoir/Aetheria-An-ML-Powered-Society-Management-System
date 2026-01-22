import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Vote,
  Calendar,
  CalendarCheck,
  Key,
  ShoppingCart,
  List,
  User,
  Menu,
  X,
  LogOut,
  Ticket,
  MessageCircle,
} from "lucide-react";

/* ================= Nav Item ================= */
const NavItem = ({ item, isOpen }) => (
  <li>
    <NavLink
      to={item.path}
      end={item.path === "/dashboard"}
      className={({ isActive }) =>
        `flex items-center space-x-3 w-full p-3 rounded-lg transition-colors duration-200
        ${isOpen ? "px-4" : "justify-center"}
        ${
          isActive
            ? "bg-blue-600 text-white shadow-md"
            : "text-white hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      {item.icon}
      {isOpen && <span className="font-medium text-white">{item.name}</span>}
    </NavLink>
  </li>
);

/* ================= Sidebar ================= */
function Sidebar({ isOpen, setIsOpen }) {
  const menu = [
    { name: "Home", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Voting", icon: <Vote size={20} />, path: "/dashboard/voting" },
    {
      name: "Book Amenity",
      icon: <Calendar size={20} />,
      path: "/dashboard/booking",
    },
    {
      name: "My Bookings",
      icon: <CalendarCheck size={20} />,
      path: "/dashboard/my-bookings",
    },
    {
      name: "Request Guest Pass",
      icon: <Key size={20} />,
      path: "/dashboard/request-guest-pass",
    },
    {
      name: "My Guest Passes",
      icon: <Key size={20} />,
      path: "/dashboard/my-guest-passes",
    },
    {
      name: "Marketplace",
      icon: <ShoppingCart size={20} />,
      path: "/dashboard/marketplace",
    },
    {
      name: "My Listings",
      icon: <List size={20} />,
      path: "/dashboard/my-listings",
    },

    /* 🎫 Ticket System */
    {
      name: "Raise Ticket",
      icon: <Ticket size={20} />,
      path: "/dashboard/tickets/new",
    },
    {
      name: "My Tickets",
      icon: <MessageCircle size={20} />,
      path: "/dashboard/tickets",
    },

    { name: "Profile", icon: <User size={20} />, path: "/dashboard/profile" },
  ];

  return (
    <nav
      className={`h-screen bg-gray-900 text-white shadow-lg
        flex flex-col
        ${isOpen ? "w-64" : "w-20"}
        transition-all duration-300 relative`}
    >
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
        {isOpen && <div className="text-xl font-bold text-white">Aetheria</div>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-white hover:bg-gray-700"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ===== Navigation ===== */}
      <ul className="flex-1 space-y-2 p-3 overflow-y-auto">
        {menu.map((item) => (
          <NavItem key={item.name} item={item} isOpen={isOpen} />
        ))}
      </ul>

      {/* ===== Spacer (layout symmetry) ===== */}
      <div className="p-3 border-t border-transparent" style={{ opacity: 0 }}>
        <div className="flex items-center space-x-3 w-full p-3 text-white">
          <LogOut size={20} />
          {isOpen && <span className="font-medium">Logout</span>}
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
