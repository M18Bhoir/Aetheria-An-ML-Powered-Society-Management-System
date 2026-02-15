import React from "react";
import { Wrench, Calendar, Clock, AlertCircle } from "lucide-react";

function MaintenanceSchedule({ schedule }) {
  // Helper for Status Badge Styling
  const getStatusStyle = (status) => {
    return status === "Pending"
      ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      : "bg-blue-500/20 text-blue-300 border-blue-500/30";
  };

  // If no schedule is provided, show a styled default message
  if (!schedule || schedule.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-8 h-full flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-white/5 rounded-full mb-4">
          <Wrench size={32} className="text-gray-500 opacity-50" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          Upcoming Maintenance
        </h3>
        <p className="text-sm text-gray-400">
          No maintenance tasks scheduled at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <Wrench className="text-blue-400" size={20} />
        <h3 className="text-lg font-bold text-white">Upcoming Maintenance</h3>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
              <th className="pb-3 pl-2 font-semibold">Task</th>
              <th className="pb-3 font-semibold">Date</th>
              <th className="pb-3 font-semibold text-right pr-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {schedule.map((task, i) => (
              <tr
                key={i}
                className="group hover:bg-white/5 transition-colors duration-200"
              >
                <td className="py-4 pl-2 font-medium text-white group-hover:text-blue-200 transition-colors">
                  {task.name}
                </td>
                <td className="py-4 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="opacity-50" />
                    {task.date}
                  </div>
                </td>
                <td className="py-4 text-right pr-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusStyle(
                      task.status,
                    )}`}
                  >
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MaintenanceSchedule;
