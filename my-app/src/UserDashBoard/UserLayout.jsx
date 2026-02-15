import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react"; // Switched to Lucide icons
import Sidebar from "../Components/Sidebar";

function UserLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    // Removed solid bg colors so body gradient from index.css shows through
    <div className="flex w-full min-h-screen text-gray-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Glass Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white/5 backdrop-blur-md border-b border-white/10 z-10">
          <div className="flex items-center">
            {/* Mobile toggle if needed, or just breadcrumbs/title */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="mr-4 text-gray-400 hover:text-white"
              >
                <Menu size={24} />
              </button>
            )}
            <h2 className="text-lg font-semibold text-white/80">
              Resident Portal
            </h2>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-red-300 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </header>

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
          {/* Optional: Content background glow */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserLayout;
