import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
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
  BarChart3,
  Ticket,
  Menu,
  X,
  Search,
  LayoutDashboard,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SidebarSection = ({ title, isOpen }) => (
  <div className={`mt-6 mb-2 px-6 transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
      {title}
    </span>
  </div>
);

const NavItem = ({ item, isOpen }) => (
  <NavLink
    to={item.path}
    end={item.path === "/admin"}
    className={({ isActive }) =>
      `flex items-center space-x-3 w-full p-3 rounded-2xl transition-all duration-500 group relative
      ${isOpen ? "px-5" : "justify-center"}
      ${
        isActive
          ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5 nav-active-glow"
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
      <div className="absolute left-full ml-4 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/5 shadow-2xl">
        {item.name}
      </div>
    )}
  </NavLink>
);

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuSections = [
    {
      title: "Overview",
      items: [
        { name: "Admin Home", icon: <LayoutDashboard size={20} />, path: "/admin" },
        { name: "Residents", icon: <Users size={20} />, path: "/admin/residents" },
      ]
    },
    {
      title: "Finance",
      items: [
        { name: "Create Dues", icon: <DollarSign size={20} />, path: "/admin/create-dues" },
        { name: "Manage Dues", icon: <ClipboardEdit size={20} />, path: "/admin/manage-dues" },
        { name: "Expense Log", icon: <FileText size={20} />, path: "/admin/expense-logger" },
      ]
    },
    {
      title: "Operations",
      items: [
        { name: "Bookings", icon: <CalendarCheck size={20} />, path: "/admin/manage-bookings" },
        { name: "Guest Requests", icon: <Key size={20} />, path: "/admin/guest-requests" },
        { name: "Maintenance", icon: <Wrench size={20} />, path: "/admin/maintenance" },
        { name: "Notices", icon: <Bell size={20} />, path: "/admin/notices" },
      ]
    },
    {
      title: "Systems",
      items: [
        { name: "Polls", icon: <Vote size={20} />, path: "/admin/manage-polls" },
        { name: "Analytics", icon: <BarChart3 size={20} />, path: "/admin/analytics" },
        { name: "Tickets", icon: <Ticket size={20} />, path: "/admin/tickets/overview" },
      ]
    }
  ];

  return (
    <aside className={`h-screen glass-dark text-white border-r border-white/5 
        flex flex-col ${isOpen ? "w-72" : "w-20"} transition-all duration-500 ease-in-out relative z-30`}>
      <div className="flex items-center justify-between px-6 py-10 border-b border-white/5">
        {isOpen && (
          <div className="text-2xl font-black text-gradient tracking-tighter uppercase flex items-center gap-2">
            <ShieldCheck size={24} className="text-indigo-400" />
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

      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {menuSections.map((section, idx) => (
          <React.Fragment key={idx}>
            <SidebarSection title={section.title} isOpen={isOpen} />
            <div className="space-y-1.5">
              {section.items.map((item) => (
                <NavItem key={item.name} item={item} isOpen={isOpen} />
              ))}
            </div>
          </React.Fragment>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className={`group flex items-center space-x-3 w-full p-3.5 rounded-2xl transition-all duration-500 relative
            ${isOpen ? "px-5" : "justify-center"}
            text-rose-400 bg-rose-400/5 hover:bg-rose-500 hover:text-white border border-rose-400/10 shadow-lg`}
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          {isOpen && <span className="font-bold text-sm">Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="h-full"
  >
    {children}
  </motion.div>
);

function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex w-full min-h-screen text-gray-100 font-outfit overflow-hidden bg-[#020617]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background Glows */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[180px]"></div>
          <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px]"></div>
        </div>

        {/* Floating Header */}
        <header className="flex justify-between items-center px-8 py-5 glass-dark z-20 mx-6 mt-6 rounded-[32px] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-6">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-white/5 shadow-inner"
              >
                <Menu size={20} />
              </button>
            )}
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Security Node</span>
              <h2 className="text-xl font-bold tracking-tight text-white mt-0.5 flex items-center gap-2">
                Administrative Control
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-2 gap-3 focus-within:border-indigo-500/50 transition-all">
              <Search size={16} className="text-slate-500" />
              <input 
                type="text" 
                placeholder="Search database..." 
                className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-slate-600 focus:w-64 transition-all"
              />
            </div>
            
            <button className="p-2.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all relative">
              <Activity size={20} className="text-emerald-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse border-2 border-[#0f172a]"></span>
            </button>
            
            <button className="p-2.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative flex flex-col">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <div className="flex-1 pb-10">
                <Outlet />
              </div>
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
