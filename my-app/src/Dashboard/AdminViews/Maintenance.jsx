import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench } from 'lucide-react';
import api from '../../utils/api';

// --- 1. Form Component for adding tasks ---
const AddMaintenanceForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post('/api/maintenance', { title, description, scheduledDate });
      setMessage({ type: 'success', text: 'Task added successfully!' });
      setTitle('');
      setDescription('');
      setScheduledDate('');
      onTaskAdded(res.data); // Pass the new task up to the parent
    } catch (err) {
      console.error("Error posting task:", err);
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to add task.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Maintenance Task</h2>
      {message.text && (
        <div className={`mb-4 p-3 rounded-md text-sm ${
          message.type === 'error' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
          'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
        }`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Elevator Service (Tower A)"
          />
        </div>
        <div>
          <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scheduled Date *</label>
          <input
            type="date"
            id="scheduledDate"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="e.g., Annual servicing for Tower A lift."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
            focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-blue-500`}
        >
          {loading ? 'Adding Task...' : 'Add Task'}
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
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  // --- 3. Helper to get status color ---
  const getStatusColor = (status) => {
      switch (status) {
          case 'Completed': return 'text-green-600 dark:text-green-400';
          case 'In Progress': return 'text-blue-600 dark:text-blue-400';
          case 'Pending': return 'text-yellow-600 dark:text-yellow-400';
          default: return 'text-gray-700 dark:text-gray-300';
      }
  };

  // --- 4. Fetch tasks from API ---
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/maintenance');
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch maintenance tasks:", err);
        setError(err.response?.data?.msg || 'Could not load tasks.');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // --- 5. Handler to add new task to the list ---
  const handleTaskAdded = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  // --- 6. Handler to update task status ---
  const handleStatusChange = async (taskId, newStatus) => {
    setUpdating(taskId);
    try {
      const res = await api.patch(`/api/maintenance/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? res.data : t));
    } catch (err) {
      console.error("Error updating task status:", err);
      alert(err.response?.data?.msg || 'Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* --- Left Column (Form) --- */}
      <div className="lg:col-span-1">
        <button 
          onClick={() => navigate('/admin')} 
          className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </button>
        <AddMaintenanceForm onTaskAdded={handleTaskAdded} />
      </div>

      {/* --- Right Column (List) --- */}
      <div className="lg:col-span-2">
        <div className="flex items-center mb-6">
            <Wrench size={32} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white ml-3">Maintenance Schedule</h1>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">All Tasks</h3>
          
          {loading && <p className="text-gray-500 dark:text-gray-400">Loading tasks...</p>}
          {error && <p className="text-red-500 dark:text-red-300">{error}</p>}

          {!loading && !error && tasks.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">No maintenance tasks scheduled.</p>
          )}

          {!loading && !error && tasks.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b dark:border-slate-700">
                  <tr className="text-left text-slate-500 dark:text-slate-400">
                    <th className="pb-2 p-2">Task</th>
                    <th className="pb-2 p-2">Date</th>
                    <th className="pb-2 p-2">Status</th>
                    <th className="pb-2 p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 align-middle">
                      <td className="py-3 p-2 font-medium text-gray-800 dark:text-gray-200">{task.title}</td>
                      <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{new Date(task.scheduledDate).toLocaleDateString()}</td>
                      <td className={`py-3 p-2 font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </td>
                      <td className="py-3 p-2 text-center">
                        <select
                          value={task.status}
                          disabled={updating === task._id}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          className={`text-xs p-1.5 rounded border dark:bg-slate-700 font-medium ${getStatusColor(task.status)}
                                      disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
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
  );
}

export default Maintenance;