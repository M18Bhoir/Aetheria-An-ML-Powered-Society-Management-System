import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import api from '../../utils/api';

// --- (CreateNoticeForm component is unchanged) ---
const CreateNoticeForm = ({ onNoticePosted }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post('/api/notices', { title, body });
      setMessage({ type: 'success', text: 'Notice posted successfully!' });
      setTitle('');
      setBody('');
      onNoticePosted(res.data); // Pass the new notice up to the parent list
    } catch (err) {
      console.error("Error posting notice:", err);
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to post notice.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Post a New Notice</h2>
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
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Annual General Meeting"
          />
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Body *</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows="4"
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Enter the full notice details here..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
            focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-blue-500`}
        >
          {loading ? 'Posting...' : 'Post Notice'}
        </button>
      </form>
    </div>
  );
};

// --- (NoticeBoard component is unchanged) ---
const NoticeBoard = ({ notices }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Posted Notices</h3>
      {notices.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">No notices have been posted yet.</p>
      )}
      <ul className="space-y-4">
        {notices.map((notice) => (
          <li key={notice._id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{notice.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Posted on: {new Date(notice.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{notice.body}</p>
          </li>
        ))}
      </ul>
    </div>
);

// --- Main Notices Page Component ---
function Notices() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all notices on component load
  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      setError('');
      try {
        // --- THIS IS THE FIX ---
        // Changed route to the new admin-specific one
        const res = await api.get('/api/notices/admin');
        setNotices(res.data);
      } catch (err) {
        console.error("Failed to fetch notices:", err);
        setError(err.response?.data?.msg || 'Could not load notices.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  // Callback function to add the new notice to the top of the list
  const handleNoticePosted = (newNotice) => {
    setNotices([newNotice, ...notices]);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
            <Bell size={32} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white ml-3">Manage Notices</h1>
        </div>
        <button 
            onClick={() => navigate('/admin')} 
            className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
        </button>
      </div>
      
      {/* 1. The Form */}
      <CreateNoticeForm onNoticePosted={handleNoticePosted} />

      {/* 2. The List */}
      {loading && <p className="text-center text-gray-500 dark:text-gray-400">Loading notices...</p>}
      {error && <p className="text-center text-red-500 dark:text-red-400">{error}</p>}
      {!loading && !error && <NoticeBoard notices={notices} />}
    </div>
  );
}

export default Notices;