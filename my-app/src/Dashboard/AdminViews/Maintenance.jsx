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
  const [category, setCategory] = useState("Other");
  const [urgency, setUrgency] = useState(3);
  const [scheduledDate, setScheduledDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/maintenance", { title, description, scheduledDate, category, urgency });
      setMessage({ type: "success", text: "Task added successfully!" });
      setTitle(""); setDescription(""); setScheduledDate(""); setCategory("Other"); setUrgency(3);
      onTaskAdded(res.data);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.msg || "Failed to add task." });
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-6 h-fit">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-300"><PlusCircle size={20} /></div>
        <h2 className="text-xl font-bold text-white">Add New Task</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Task Title" className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white" value={title} onChange={(e)=>setTitle(e.target.value)} required />
        <select className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white [color-scheme:dark]" value={category} onChange={(e)=>setCategory(e.target.value)}>
          {["Plumbing", "Electrical", "Security", "Cleanliness", "Common Area", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex items-center justify-between text-sm text-gray-400 px-1">
          <span>Urgency: {urgency}/5</span>
          <input type="range" min="1" max="5" value={urgency} onChange={(e)=>setUrgency(e.target.value)} className="w-2/3 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500" />
        </div>
        <input type="date" className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white [color-scheme:dark]" value={scheduledDate} onChange={(e)=>setScheduledDate(e.target.value)} required />
        <textarea placeholder="Description" rows="2" className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white resize-none" value={description} onChange={(e)=>setDescription(e.target.value)} />
        <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-bold shadow-xl shadow-blue-500/20">
          {loading ? "Adding..." : "Add Task"}
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
        <button
          onClick={async () => {
            try {
              const res = await api.post("/api/ml/predict", {
                model: "priority",
                data: tasks.map(t => ({
                  id: t._id,
                  category: t.category || "Other",
                  urgency: t.urgency || 3,
                  days_open: Math.floor((new Date() - new Date(t.createdAt)) / (1000 * 60 * 60 * 24))
                }))
              });
              // Merge AI scores into tasks
              const scoredTasks = tasks.map(t => {
                const score = res.data.find(r => r.id === t._id);
                return score ? { ...t, aiScore: score.priority_score, aiLabel: score.label } : t;
              });
              setTasks(scoredTasks.sort((a,b) => (b.aiScore || 0) - (a.aiScore || 0)));
            } catch (err) {
              console.error("AI Prioritization failed", err);
            }
          }}
          className="px-6 py-3 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-2xl font-bold hover:bg-indigo-600/20 transition-all flex items-center gap-2"
        >
          <AlertCircle size={18} /> Run AI Prioritization
        </button>
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
                      <th className="p-4 font-semibold">Priority</th>
                      <th className="p-4 font-semibold">Task</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300 text-sm divide-y divide-white/5">
                    {tasks.map((task) => (
                      <tr
                        key={task._id}
                        className="hover:bg-white/5 transition-colors duration-200 group"
                      >
                        <td className="p-4">
                           {task.aiScore ? (
                             <div className="space-y-1">
                               <div className="text-lg font-black text-white">{Math.round(task.aiScore)}</div>
                               <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border w-fit ${
                                 task.aiLabel === 'High' ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' :
                                 task.aiLabel === 'Medium' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                                 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                               }`}>{task.aiLabel} Priority</div>
                             </div>
                           ) : (
                             <span className="text-gray-600 text-xs italic">Unranked</span>
                           )}
                        </td>
                        <td className="p-4">
                           <div className="font-bold text-white">{task.title}</div>
                           <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{new Date(task.scheduledDate).toLocaleDateString()}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-full text-[10px] font-bold border border-white/10 bg-white/5 text-gray-400">
                             {task.category || 'Other'}
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
                                        bg-white/5 text-white text-xs p-2 rounded-lg border border-white/10 
                                        outline-none focus:border-blue-500 transition-all cursor-pointer
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                    `}
                          >
                            <option className="bg-gray-900" value="Pending">Pending</option>
                            <option className="bg-gray-900" value="In Progress">In Progress</option>
                            <option className="bg-gray-900" value="Completed">Completed</option>
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
