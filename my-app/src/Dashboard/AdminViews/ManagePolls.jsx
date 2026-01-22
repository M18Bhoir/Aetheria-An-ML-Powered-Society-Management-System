import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Eye } from 'lucide-react';
import api from '../../utils/api';

function ManagePolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPolls = async () => {
    setLoading(true);
    setError(null);
    try {
      // --- THIS IS THE FIX ---
      // Call the new admin-specific route
      const res = await api.get('/api/polls/admin/all'); 
      setPolls(res.data);
    } catch (err) {
      console.error("Error fetching polls:", err);
      setError(err.response?.data?.msg || "Failed to fetch polls.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleDelete = async (pollId) => {
    if (window.confirm("Are you sure you want to delete this poll? This action cannot be undone.")) {
      try {
        await api.delete(`/api/polls/${pollId}`);
        fetchPolls(); // Refetch polls
      } catch (err) {
        console.error("Error deleting poll:", err);
        alert(err.response?.data?.msg || 'Failed to delete poll.');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <button 
        onClick={() => navigate('/admin')} 
        className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4">
        <ArrowLeft size={16} className="mr-1" />
        Back to Dashboard
      </button>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Polls</h1>
        <button
          onClick={() => navigate('/admin/create-poll')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus size={18} className="mr-1" />
          Create New Poll
        </button>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
        {loading && <p className="text-gray-500 dark:text-gray-400">Loading polls...</p>}
        {error && <p className="text-red-500 dark:text-red-300">{error}</p>}
        
        {!loading && !error && polls.length === 0 && (
           <p className="text-center text-gray-500 dark:text-gray-400">No polls have been created yet.</p>
        )}

        {!loading && !error && polls.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b dark:border-slate-700">
                <tr className="text-left text-slate-500 dark:text-slate-400">
                  <th className="pb-3 p-2">Question</th>
                  <th className="pb-3 p-2">Created By</th>
                  <th className="pb-3 p-2">Total Votes</th>
                  <th className="pb-3 p-2">Created On</th>
                  <th className="pb-3 p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {polls.map((poll) => (
                  <tr key={poll._id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 align-middle">
                    <td className="py-3 p-2 font-medium text-gray-800 dark:text-gray-200">{poll.question}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{poll.createdBy?.name || 'Admin'}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">
                        {poll.options.reduce((sum, opt) => sum + opt.votes, 0)}
                    </td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{new Date(poll.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 p-2 text-center">
                        <div className="flex justify-center space-x-2">
                            {/* This Link uses the /admin/poll/:id route from App.jsx */}
                            <Link to={`/admin/poll/${poll._id}`} className="p-1 text-blue-600 hover:text-blue-800" title="View Details">
                                <Eye size={18} />
                            </Link>
                            <button 
                                onClick={() => handleDelete(poll._id)}
                                className="p-1 text-red-600 hover:text-red-800" title="Delete Poll">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagePolls;