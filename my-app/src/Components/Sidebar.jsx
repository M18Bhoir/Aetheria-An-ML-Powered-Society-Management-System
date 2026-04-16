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
  LayoutDashboard,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";

const SidebarSection = ({ title, isOpen }) => (
  <div className={`mt-8 mb-2 px-6 transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
      {title}
    </span>
  </div>
);

const NavItem = ({ item, isOpen }) => (
  <li>
    <NavLink
      to={item.path}
      end={item.path === "/dashboard"}
      className={({ isActive }) =>
        `flex items-center space-x-3 w-full p-3.5 rounded-2xl transition-all duration-500 group relative
        ${isOpen ? "px-5" : "justify-center"}
        ${
          isActive
            ? "bg-blue-600/10 text-blue-400 border border-blue-500/10 shadow-lg shadow-blue-500/5 nav-active-glow"
            : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
        }`
      }
      title={!isOpen ? item.name : ""}
    >
      <div className="group-hover:scale-110 transition-transform duration-300">
        {item.icon}
      </div>
      {isOpen && <span className="font-semibold tracking-tight text-sm">{item.name}</span>}
      {!isOpen && (
        <div className="absolute left-full ml-4 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/5">
          {item.name}
        </div>
      )}
    </NavLink>
  </li>
);

function Sidebar({ isOpen, setIsOpen }) {
  const sections = [
    {
      title: "Main",
      items: [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
        { name: "Residents", icon: <Users size={20} />, path: "/dashboard/community" },
      ]
    },
    {
      title: "Services",
      items: [
        { name: "Voting", icon: <Vote size={20} />, path: "/dashboard/voting" },
        { name: "Amenity Booking", icon: <Calendar size={20} />, path: "/dashboard/booking" },
        { name: "Guest Pass", icon: <Key size={20} />, path: "/dashboard/request-guest-pass" },
        { name: "Maintenance", icon: <Ticket size={20} />, path: "/dashboard/tickets/new" },
      ]
    },
    {
      title: "Community",
      items: [
        { name: "Marketplace", icon: <ShoppingCart size={20} />, path: "/dashboard/marketplace" },
      ]
    },
    {
      title: "Personal",
      items: [
        { name: "My Stuff", icon: <List size={20} />, path: "/dashboard/my-listings" },
        { name: "Profile", icon: <User size={20} />, path: "/dashboard/profile" },
      ]
    }
  ];

  return (
    <nav
      className={`h-screen glass-dark text-white border-r border-white/5 
        flex flex-col ${isOpen ? "w-72" : "w-20"} transition-all duration-500 ease-in-out relative z-30`}
    >
      <div className="flex items-center justify-between px-6 py-10 border-b border-white/5">
        {isOpen && (
          <div className="text-2xl font-black text-gradient tracking-tighter uppercase">
            Aetheria
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all ${!isOpen && "mx-auto shadow-xl"}`}
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <ul className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {sections.map((section, sIdx) => (
          <React.Fragment key={sIdx}>
            <SidebarSection title={section.title} isOpen={isOpen} />
            <div className="space-y-1.5">
              {section.items.map((item) => (
                <NavItem key={item.name} item={item} isOpen={isOpen} />
              ))}
            </div>
          </React.Fragment>
        ))}
      </ul>
      
      <div className="p-4 border-t border-white/5">
         <NavLink
            to="/contact"
            className={({ isActive }) =>
              `flex items-center space-x-3 w-full p-3.5 rounded-2xl transition-all duration-500 group relative
              ${isOpen ? "px-5" : "justify-center"}
              ${isActive ? "bg-white/10" : "text-slate-400 hover:text-slate-100"}`
            }
          >
           <HelpCircle size={20} />
           {isOpen && <span className="font-semibold text-sm">Help & Support</span>}
         </NavLink>
      </div>
    </nav>
  );
}

export default Sidebar;
