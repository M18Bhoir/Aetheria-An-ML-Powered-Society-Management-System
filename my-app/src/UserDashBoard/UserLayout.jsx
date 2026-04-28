import React, { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { LogOut, Menu, ChevronsRight } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer"; // Import the Footer component

function UserLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const crumb = useMemo(() => {
    const path = location.pathname.replace("/dashboard", "") || "/";
    if (path === "/") return "Home";
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
    <div className="flex w-full min-h-screen text-gray-100 font-outfit">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Modern Floating Header */}
        <header className="flex justify-between items-center px-8 py-5 glass-dark z-20 mx-4 mt-4 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 mr-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <Menu size={22} />
              </button>
            )}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-3 text-sm font-medium tracking-wide"
            >
              <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <ChevronsRight size={14} className="text-gray-600" />
              <span className="text-blue-400/90">{crumb}</span>
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="group flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-red-400/90 bg-red-400/5 hover:bg-red-500 hover:text-white transition-all duration-500 border border-red-400/20 shadow-lg shadow-red-900/10"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </header>

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative flex flex-col">
          {/* Enhanced content background glow */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px]"></div>
            <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[140px]"></div>
          </div>

          {/* Page Content */}
          <div className="flex-1">
            <Outlet />
          </div>

          {/* Footer added at the bottom */}
          <Footer />
        </div>
      </div>
    </div>

  );
}

export default UserLayout;
