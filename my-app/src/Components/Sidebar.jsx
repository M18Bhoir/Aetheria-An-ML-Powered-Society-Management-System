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
  Users,
  MessageSquare,
  ShieldCheck,
  DollarSign,
  FileText,
} from "lucide-react";

const NavItem = ({ item, isOpen }) => (
  <li>
    <NavLink
      to={item.path}
      end={item.path === "/dashboard"}
      className={({ isActive }) =>
        `flex items-center space-x-3 w-full p-3.5 rounded-2xl transition-all duration-500 group
        ${isOpen ? "px-5" : "justify-center"}
        ${
          isActive
            ? "bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5"
            : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
        }`
      }
    >
      <div className="group-hover:scale-110 transition-transform duration-300">
        {item.icon}
      </div>
      {isOpen && <span className="font-semibold tracking-tight">{item.name}</span>}
    </NavLink>
  </li>
);

function Sidebar({ isOpen, setIsOpen }) {
  const menu = [
    { name: "Home", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Voting", icon: <Vote size={20} />, path: "/dashboard/voting" },
    {
      name: "Community",
      icon: <Users size={20} />,
      path: "/dashboard/community",
    },
    {
      name: "Forum",
      icon: <MessageSquare size={20} />,
      path: "/dashboard/forum",
    },
    {
      name: "My Ledger",
      icon: <DollarSign size={20} />,
      path: "/dashboard/ledger",
    },
    {
      name: "NOC Requests",
      icon: <FileText size={20} />,
      path: "/dashboard/noc",
    },
    {
      name: "Staff",
      icon: <ShieldCheck size={20} />,
      path: "/dashboard/staff",
    },
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
      name: "Guest Pass",
      icon: <Key size={20} />,
      path: "/dashboard/request-guest-pass",
    },
    {
      name: "My Passes",
      icon: <Ticket size={20} />,
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
    {
      name: "Tickets",
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
      className={`h-screen glass-dark text-white border-r border-white/5 
        flex flex-col ${isOpen ? "w-72" : "w-20"} transition-all duration-500 ease-in-out relative z-30`}
    >
      <div className="flex items-center justify-between px-6 py-8 border-b border-white/5">
        {isOpen && (
          <div className="text-2xl font-bold text-gradient tracking-tighter">
            AETHERIA
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-xl hover:bg-white/10 transition-all ${!isOpen && "mx-auto"}`}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <ul className="flex-1 space-y-1.5 p-4 overflow-y-auto custom-scrollbar">
        {menu.map((item) => (
          <NavItem key={item.name} item={item} isOpen={isOpen} />
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;
