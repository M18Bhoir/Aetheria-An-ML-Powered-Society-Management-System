import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Clock } from "lucide-react";

function ManageRentals() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <div className="flex items-center mb-1">
            <Briefcase size={32} className="text-blue-400 mr-3" />
            <h1 className="text-3xl font-bold text-white">
              Rental Applications
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            Manage resident rental agreements and approvals.
          </p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="p-6 bg-white/5 rounded-full mb-6 animate-pulse">
          <Clock size={64} className="text-blue-300 opacity-80" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Coming Soon</h2>
        <p className="text-gray-400 max-w-md text-lg">
          The Rental Management module is currently under development. Stay
          tuned for updates!
        </p>
      </div>
    </div>
  );
}

export default ManageRentals;
