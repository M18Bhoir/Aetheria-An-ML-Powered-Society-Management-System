import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../utils/api';

function ManageDues() {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const navigate = useNavigate();

  const getStatusColor = (status) => {
      switch (status) {
          case 'Paid': return 'text-green-600 dark:text-green-400';
          case 'Pending': return 'text-yellow-600 dark:text-yellow-400';
          case 'Overdue': return 'text-red-600 dark:text-red-400';
          default: return 'text-gray-700 dark:text-gray-300';
      }
  };
  
  const fetchAllDues = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/all-dues');
      setDues(res.data);
    } catch (err) {
      console.error("Error fetching all dues:", err);
      setError(err.response?.data?.msg || "Failed to fetch dues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDues();
  }, []);

  const handleStatusChange = async (dueId, newStatus) => {
    setUpdating(dueId);
    try {
      const res = await api.patch(`/api/admin/dues/${dueId}/status`, { status: newStatus });
      setDues(dues.map(d => d._id === dueId ? res.data : d));
    } catch (err) {
      console.error("Error updating due status:", err);
      alert(err.response?.data?.msg || 'Failed to update status.');
    } finally {
      setUpdating(null);
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
      
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage All Dues</h2>

        {loading && <p className="text-gray-500 dark:text-gray-400">Loading dues...</p>}
        {error && <p className="text-red-500 dark:text-red-300">{error}</p>}
        
        {!loading && !error && dues.length === 0 && (
           <p className="text-center text-gray-500 dark:text-gray-400">No dues have been created yet.</p>
        )}

        {!loading && !error && dues.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b dark:border-slate-700">
                <tr className="text-left text-slate-500 dark:text-slate-400">
                  <th className="pb-3 p-2">Resident</th>
                  <th className="pb-3 p-2">Flat (User ID)</th>
                  <th className="pb-3 p-2">Amount</th>
                  <th className="pb-3 p-2">Due Date</th>
                  <th className="pb-3 p-2">Type</th>
                  <th className="pb-3 p-2">Status</th>
                  <th className="pb-3 p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {dues.map((due) => (
                  <tr key={due._id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 align-middle">
                    <td className="py-3 p-2 font-medium text-gray-800 dark:text-gray-200">{due.user?.name || 'N/A'}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{due.user?.userId || 'N/A'}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">₹{due.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{new Date(due.dueDate).toLocaleDateString()}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{due.type}</td>
                    <td className={`py-3 p-2 font-medium ${getStatusColor(due.status)}`}>{due.status}</td>
                    <td className="py-3 p-2 text-center">
                      <select 
                        value={due.status}
                        disabled={updating === due._id || due.status === 'Paid'} 
                        onChange={(e) => handleStatusChange(due._id, e.target.value)}
                        className={`text-xs p-1.5 rounded border dark:bg-slate-700 font-medium ${getStatusColor(due.status)}
                                    disabled:opacity-70 disabled:cursor-not-allowed`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
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
  );
}

export default ManageDues;