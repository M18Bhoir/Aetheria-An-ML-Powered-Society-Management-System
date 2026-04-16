import React, { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { LogOut, Menu, ChevronsRight, Bell, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";

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

function UserLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  const crumb = useMemo(() => {
    const path = location.pathname.replace("/dashboard", "") || "/";
    if (path === "/") return "Overview";
    return path
      .split("/")
      .filter(Boolean)
      .slice(-1)[0]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <div className="flex w-full min-h-screen text-gray-100 font-outfit overflow-hidden bg-[#020617]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background Glows */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[180px]"></div>
          <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px]"></div>
        </div>

        {/* Floating Premium Header */}
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
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Aetheria</Link>
                <ChevronsRight size={10} className="text-slate-700" />
                <span className="text-blue-400/80">{crumb}</span>
              </nav>
              <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">{crumb}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-2 gap-3 focus-within:border-blue-500/50 transition-all">
                <Search size={16} className="text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search services..." 
                  className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-slate-600"
                />
             </div>

             <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0f172a]"></span>
                </button>
                
                <div className="h-8 w-px bg-white/10 mx-2"></div>
                
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-3 px-5 py-2.5 rounded-2xl text-sm font-bold text-rose-400 bg-rose-400/5 hover:bg-rose-500 hover:text-white transition-all duration-500 border border-rose-400/10 shadow-lg"
                >
                  <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
             </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative flex flex-col">
          <PageTransition key={location.pathname}>
            <div className="flex-1">
              <Outlet />
            </div>
            <Footer />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}

export default UserLayout;
