import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../utils/api';

function CreateDues() {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState('Maintenance');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState(null); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/api/admin/dues', {
        userId, amount: parseFloat(amount), dueDate, type, notes
      });
      setMessage({ type: 'success', text: 'Due created successfully!' });
      setUserId(''); setAmount(''); setDueDate(''); setNotes('');
    } catch (err) {
      console.error("Error creating due:", err);
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to create due.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={() => navigate('/admin')} 
        className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4">
        <ArrowLeft size={16} className="mr-1" />
        Back to Dashboard
      </button>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Due</h2>
        {message && (
          <div className={`p-4 rounded-md mb-6 text-sm ${
            message.type === 'error' 
            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
          }`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              User ID (e.g., A-101)
            </label>
            <input
              type="text" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} required
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="A-101"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount (₹)
            </label>
            <input
              type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required
              min="0" step="0.01"
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2500"
            />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
           <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              id="type" value={type} onChange={(e) => setType(e.target.value)}
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Maintenance">Maintenance</option>
              <option value="Event">Event</option>
              <option value="Penalty">Penalty</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="3"
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="e.g., For October 2025"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-blue-500`}
          >
            {loading ? 'Submitting...' : 'Create Due'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateDues;