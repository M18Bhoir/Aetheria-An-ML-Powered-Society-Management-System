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

const NavItem = ({ item, isOpen }) => (
  <li>
    <NavLink
      to={item.path}
      end={item.path === "/dashboard"}
      className={({ isActive }) =>
        `flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-300
        ${isOpen ? "px-4" : "justify-center"}
        ${
          isActive
            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_-3px_rgba(59,130,246,0.4)]"
            : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
        }`
      }
    >
      {item.icon}
      {isOpen && <span className="font-medium">{item.name}</span>}
    </NavLink>
  </li>
);

function Sidebar({ isOpen, setIsOpen }) {
  const menu = [
    { name: "Home", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Voting", icon: <Vote size={20} />, path: "/dashboard/voting" },
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
      className={`h-screen bg-[#0a0f1c]/80 backdrop-blur-xl text-white border-r border-white/5 
        flex flex-col ${isOpen ? "w-64" : "w-20"} transition-all duration-300 relative`}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-white/5">
        {isOpen && (
          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Aetheria
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
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

export default Sidebar;
