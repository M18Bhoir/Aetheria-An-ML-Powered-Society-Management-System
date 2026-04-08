import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wrench,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  PlusCircle,
} from "lucide-react";
import api from "../../utils/api";

// --- 1. Form Component for adding tasks ---
const AddMaintenanceForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await api.post("/api/maintenance", {
        title,
        description,
        scheduledDate,
      });
      setMessage({ type: "success", text: "Task added successfully!" });
      setTitle("");
      setDescription("");
      setScheduledDate("");
      onTaskAdded(res.data);
    } catch (err) {
      console.error("Error posting task:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.msg || "Failed to add task.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-6 h-fit">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-300">
          <PlusCircle size={20} />
        </div>
        <h2 className="text-xl font-bold text-white">Add New Task</h2>
      </div>

      {message.text && (
        <div
          className={`flex items-center p-3 rounded-xl mb-6 border text-sm ${
            message.type === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-300"
              : "bg-green-500/10 border-green-500/20 text-green-300"
          }`}
        >
          {message.type === "error" ? (
            <AlertCircle size={16} className="mr-2" />
          ) : (
            <CheckCircle size={16} className="mr-2" />
          )}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            placeholder="e.g., Elevator Service (Tower A)"
          />
        </div>
        <div>
          <label
            htmlFor="scheduledDate"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Scheduled Date *
          </label>
          <input
            type="date"
            id="scheduledDate"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
            className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all [color-scheme:dark]"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
            placeholder="e.g., Annual servicing for Tower A lift."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-white tracking-wide transition-all duration-300 transform hover:-translate-y-0.5
            ${
              loading
                ? "bg-gray-600 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30 border border-transparent hover:border-blue-400/30"
            }`}
        >
          {loading ? "Adding Task..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

// --- 2. Main Maintenance Page Component ---
function Maintenance() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  // Helper for Status Badge Styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "In Progress":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/maintenance");
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch maintenance tasks:", err);
        setError(err.response?.data?.msg || "Could not load tasks.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleTaskAdded = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdating(taskId);
    try {
      const res = await api.patch(`/api/maintenance/${taskId}/status`, {
        status: newStatus,
      });
      setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
    } catch (err) {
      console.error("Error updating task status:", err);
      alert(err.response?.data?.msg || "Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Wrench className="text-blue-400" size={32} />
            Maintenance Schedule
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Plan and track society maintenance activities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Left Column (Form) --- */}
        <div className="lg:col-span-1">
          <AddMaintenanceForm onTaskAdded={handleTaskAdded} />
        </div>

        {/* --- Right Column (List) --- */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden min-h-[500px]">
            <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Scheduled Tasks</h3>
              <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                {tasks.length} total
              </span>
            </div>

            {loading && (
              <p className="p-8 text-center text-gray-400 animate-pulse">
                Loading tasks...
              </p>
            )}
            {error && (
              <p className="p-8 text-center text-red-400 bg-red-500/10 m-4 rounded-xl">
                {error}
              </p>
            )}

            {!loading && !error && tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Calendar size={48} className="mb-4 opacity-20" />
                <p>No maintenance tasks scheduled.</p>
              </div>
            )}

            {!loading && !error && tasks.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider bg-black/20">
                      <th className="p-4 font-semibold">Task</th>
                      <th className="p-4 font-semibold">Scheduled Date</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300 text-sm divide-y divide-white/5">
                    {tasks.map((task) => (
                      <tr
                        key={task._id}
                        className="hover:bg-white/5 transition-colors duration-200 group"
                      >
                        <td className="p-4 font-medium text-white">
                          {task.title}
                          {task.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {task.description}
                            </p>
                          )}
                        </td>
                        <td className="p-4 text-gray-400">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="opacity-50" />
                            {new Date(task.scheduledDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusStyle(task.status)}`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <select
                            value={task.status}
                            disabled={updating === task._id}
                            onChange={(e) =>
                              handleStatusChange(task._id, e.target.value)
                            }
                            className={`
                                        bg-black/40 text-white text-xs p-2 rounded-lg border border-white/20 
                                        outline-none focus:border-blue-500 transition-all cursor-pointer
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                    `}
                          >
                            <option className="bg-gray-900" value="Pending">
                              Pending
                            </option>
                            <option className="bg-gray-900" value="In Progress">
                              In Progress
                            </option>
                            <option className="bg-gray-900" value="Completed">
                              Completed
                            </option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Maintenance;
