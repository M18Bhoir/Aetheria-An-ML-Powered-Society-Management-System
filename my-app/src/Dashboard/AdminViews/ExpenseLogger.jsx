import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import api from '../../utils/api';

// --- Form for logging new expenses ---
const AddExpenseForm = ({ onExpenseAdded }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Maintenance');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post('/api/expenses', { title, amount, category, date, description });
      setMessage({ type: 'success', text: 'Expense logged successfully!' });
      setTitle(''); setAmount(''); setDescription(''); setCategory('Maintenance');
      onExpenseAdded(res.data); // Pass the new expense to parent
    } catch (err) {
      console.error("Error logging expense:", err);
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to log expense.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Log New Expense</h2>
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
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md"
            placeholder="e.g., Elevator Repair" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₹) *</label>
            <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required min="0"
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md"
              placeholder="e.g., 5000" />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date *</label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md" />
          </div>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md">
            <option>Maintenance</option>
            <option>Utilities</option>
            <option>Staff Salaries</option>
            <option>Supplies</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3"
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md resize-none"
            placeholder="Add any notes, vendor names, or invoice numbers here." />
        </div>
        <button type="submit" disabled={loading}
          className={`w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white 
            ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
          {loading ? 'Logging...' : 'Log Expense'}
        </button>
      </form>
    </div>
  );
};

// --- Main Page Component ---
function ExpenseLogger() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/expenses');
        setExpenses(res.data);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
        setError(err.response?.data?.msg || 'Could not load expenses.');
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const handleExpenseAdded = (newExpense) => {
    setExpenses([newExpense, ...expenses]); // Add new expense to the top of the list
  };

  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

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
        <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
      </div>

      {/* --- Right Column (List) --- */}
      <div className="lg:col-span-2">
        <div className="flex items-center mb-6">
            <FileText size={32} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white ml-3">Expense Log</h1>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">All Logged Expenses</h3>
            <div className="text-right">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ₹{totalExpense.toLocaleString('en-IN')}
                </p>
            </div>
          </div>
          
          {loading && <p className="text-gray-500 dark:text-gray-400">Loading expenses...</p>}
          {error && <p className="text-red-500 dark:text-red-300">{error}</p>}

          {!loading && !error && expenses.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">No expenses logged yet.</p>
          )}

          {!loading && !error && expenses.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b dark:border-slate-700">
                  <tr className="text-left text-slate-500 dark:text-slate-400">
                    <th className="pb-2 p-2">Date</th>
                    <th className="pb-2 p-2">Title</th>
                    <th className="pb-2 p-2">Category</th>
                    <th className="pb-2 p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense._id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 align-middle">
                      <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="py-3 p-2 font-medium text-gray-800 dark:text-gray-200">{expense.title}</td>
                      <td className="py-3 p-2 text-gray-600 dark:text-gray-300">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200">
                            {expense.category}
                        </span>
                      </td>
                      <td className="py-3 p-2 text-right font-medium text-gray-800 dark:text-gray-200">
                        ₹{expense.amount.toLocaleString('en-IN')}
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

export default ExpenseLogger;