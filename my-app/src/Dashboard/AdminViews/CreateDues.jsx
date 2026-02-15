import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import api from "../../utils/api";

function CreateDues() {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState("Maintenance");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.post("/api/admin/dues", {
        userId,
        amount: parseFloat(amount),
        dueDate,
        type,
        notes,
      });
      setMessage({ type: "success", text: "Due created successfully!" });
      setUserId("");
      setAmount("");
      setDueDate("");
      setNotes("");
    } catch (err) {
      console.error("Error creating due:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.msg || "Failed to create due.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header & Back Button */}
      <div>
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-white">Create New Due</h1>
        <p className="text-gray-400 text-sm mt-1">
          Assign maintenance or penalty charges to a resident.
        </p>
      </div>

      {/* Glass Form Container */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-8">
        {/* Message Alert */}
        {message && (
          <div
            className={`flex items-center p-4 rounded-xl mb-6 border ${
              message.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-300"
                : "bg-green-500/10 border-green-500/20 text-green-300"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle size={20} className="mr-3 shrink-0" />
            ) : (
              <CheckCircle size={20} className="mr-3 shrink-0" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User ID Field */}
          <div>
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              User ID{" "}
              <span className="text-gray-500 text-xs">(e.g., A-101)</span>
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              placeholder="Enter User ID"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount Field */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Amount (₹)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                placeholder="0.00"
              />
            </div>

            {/* Due Date Field */}
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Type Dropdown */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Type
            </label>
            <div className="relative">
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="Maintenance" className="bg-gray-900">
                  Maintenance
                </option>
                <option value="Event" className="bg-gray-900">
                  Event
                </option>
                <option value="Penalty" className="bg-gray-900">
                  Penalty
                </option>
                <option value="Other" className="bg-gray-900">
                  Other
                </option>
              </select>
              {/* Custom Arrow for select */}
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Notes Field */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Notes <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
              placeholder="Add any relevant details..."
            />
          </div>

          {/* Submit Button */}
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
            {loading ? "Processing..." : "Create Due"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateDues;
