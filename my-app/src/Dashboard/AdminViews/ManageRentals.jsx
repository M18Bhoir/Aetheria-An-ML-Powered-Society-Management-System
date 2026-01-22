import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase } from 'lucide-react';

function ManageRentals() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">
      <button 
        onClick={() => navigate('/admin')} 
        className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4">
        <ArrowLeft size={16} className="mr-1" />
        Back to Dashboard
      </button>
      
      <div className="flex items-center mb-6">
          <Briefcase size={32} className="text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white ml-3">Rental Applications</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Coming Soon</h2>
        <p className="text-gray-600 dark:text-gray-300">
          This feature to manage resident rental applications is currently under development.
        </p>
      </div>
    </div>
  );
}

export default ManageRentals;
