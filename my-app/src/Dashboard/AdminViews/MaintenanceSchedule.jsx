import React from 'react';

function MaintenanceSchedule({ schedule }) {
  // If no schedule is provided, show a default message
  if (!schedule || schedule.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Upcoming Maintenance</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">No maintenance tasks scheduled.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Upcoming Maintenance</h3>
      <table className="w-full text-sm">
        <thead className="border-b dark:border-slate-700">
          <tr className="text-left text-slate-500 dark:text-slate-400">
            <th className="pb-2">Task</th>
            <th className="pb-2">Date</th>
            <th className="pb-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((task, i) => (
            <tr key={i} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
              <td className="py-3 font-medium text-gray-800 dark:text-gray-200">{task.name}</td>
              <td className="py-3 text-gray-600 dark:text-gray-300">{task.date}</td>
              <td className="py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  task.status === "Pending" 
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" 
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                }`}>
                  {task.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MaintenanceSchedule;