import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  Tag,
  PlusCircle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import api from "../../utils/api";

// --- Form for logging new expenses ---
const AddExpenseForm = ({ onExpenseAdded }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Maintenance");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await api.post("/api/expenses", {
        title,
        amount,
        category,
        date,
        description,
      });
      setMessage({ type: "success", text: "Expense logged successfully!" });
      setTitle("");
      setAmount("");
      setDescription("");
      setCategory("Maintenance");
      onExpenseAdded(res.data);
    } catch (err) {
      console.error("Error logging expense:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.msg || "Failed to log expense.",
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
        <h2 className="text-xl font-bold text-white">Log New Expense</h2>
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
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            placeholder="e.g., Elevator Repair"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Amount (₹) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <DollarSign size={14} />
              </div>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
                className="w-full pl-9 p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Date *
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Category *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Tag size={14} />
            </div>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-9 p-3 bg-black/20 border border-white/10 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            >
              <option className="bg-gray-900">Maintenance</option>
              <option className="bg-gray-900">Utilities</option>
              <option className="bg-gray-900">Staff Salaries</option>
              <option className="bg-gray-900">Supplies</option>
              <option className="bg-gray-900">Other</option>
            </select>
          </div>
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
            placeholder="Add any notes, vendor names, or invoice numbers..."
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
          {loading ? "Logging..." : "Log Expense"}
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
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/expenses");
        setExpenses(res.data);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
        setError(err.response?.data?.msg || "Could not load expenses.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const handleExpenseAdded = (newExpense) => {
    setExpenses([newExpense, ...expenses]);
  };

  const totalExpense = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

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
            <FileText className="text-blue-400" size={32} />
            Expense Log
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Track society expenditures and maintain financial records.
          </p>
        </div>

        {/* Total Expense Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Total Expenses
            </p>
            <p className="text-2xl font-bold text-white">
              ₹{totalExpense.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Left Column (Form) --- */}
        <div className="lg:col-span-1">
          <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
        </div>

        {/* --- Right Column (List) --- */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden min-h-[500px]">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-lg font-bold text-white">
                Recent Transactions
              </h3>
            </div>

            {loading && (
              <p className="p-8 text-center text-gray-400 animate-pulse">
                Loading records...
              </p>
            )}
            {error && <p className="p-8 text-center text-red-400">{error}</p>}

            {!loading && !error && expenses.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <FileText size={48} className="mb-4 opacity-20" />
                <p>No expenses logged yet.</p>
              </div>
            )}

            {!loading && !error && expenses.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider bg-black/20">
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Title</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300 text-sm divide-y divide-white/5">
                    {expenses.map((expense) => (
                      <tr
                        key={expense._id}
                        className="hover:bg-white/5 transition-colors duration-200 group"
                      >
                        <td className="p-4 text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="opacity-50" />
                            {new Date(expense.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-4 font-medium text-white">
                          {expense.title}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-300">
                            {expense.category}
                          </span>
                        </td>
                        <td className="p-4 text-right font-mono text-white">
                          ₹{expense.amount.toLocaleString("en-IN")}
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

export default ExpenseLogger;
