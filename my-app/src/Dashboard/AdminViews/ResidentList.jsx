import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../utils/api';

function ResidentList() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResidents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/api/admin/residents');
        setResidents(res.data);
      } catch (err) {
        console.error("Error fetching residents:", err);
        setError(err.response?.data?.msg || "Failed to fetch residents.");
      } finally {
        setLoading(false);
      }
    };
    fetchResidents();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/admin')} 
        className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4">
        <ArrowLeft size={16} className="mr-1" />
        Back to Dashboard
      </button>
      
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Residents</h2>
        {loading && <p className="text-gray-500 dark:text-gray-400">Loading residents...</p>}
        {error && <p className="text-red-500 dark:text-red-300">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b dark:border-slate-700">
                <tr className="text-left text-slate-500 dark:text-slate-400">
                  <th className="pb-3 p-2">Name</th>
                  <th className="pb-3 p-2">User ID / Flat No.</th>
                  <th className="pb-3 p-2">Email</th>
                  <th className="pb-3 p-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {residents.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <td className="py-3 p-2 font-medium text-gray-800 dark:text-gray-200">{user.name}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{user.userId}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{user.email || 'N/A'}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
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

export default ResidentList;