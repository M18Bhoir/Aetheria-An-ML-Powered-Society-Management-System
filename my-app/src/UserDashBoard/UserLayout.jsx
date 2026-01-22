import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { HiLogout } from 'react-icons/hi';
import Sidebar from '../Components/Sidebar'; // The USER sidebar

function UserLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('admin');
      navigate('/login'); // Redirect to login page
  };
  
  return (
    <div className="flex w-full bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col h-screen">
        {/* --- Header Bar --- */}
        <header className="flex justify-end items-center p-4 bg-white dark:bg-gray-800 shadow-sm">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-900 dark:hover:text-blue-400 transition-colors duration-200"
          >
            <HiLogout size="1.25rem" />
            <span>Logout</span>
          </button>
        </header>
        {/* --- Main Content --- */}
        <main className="flex-grow overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default UserLayout;