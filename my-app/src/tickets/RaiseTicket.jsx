import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { ArrowLeft, Send, AlertTriangle, Layers, FileText } from "lucide-react";

export default function RaiseTicket() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Maintenance",
    priority: "P3",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/tickets", formData);
      alert("Ticket created successfully!");
      navigate("/tickets");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up p-4">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/tickets")}
          className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to My Tickets
        </button>
        <h1 className="text-3xl font-bold text-white">Raise a Ticket</h1>
        <p className="text-gray-400 text-sm mt-1">
          Report an issue to the facility management team.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subject
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                <FileText size={18} />
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                placeholder="Brief summary of the issue"
              />
            </div>
          </div>

          {/* Category & Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                  <Layers size={18} />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                >
                  <option className="bg-gray-900">Maintenance</option>
                  <option className="bg-gray-900">Electrical</option>
                  <option className="bg-gray-900">Security</option>
                  <option className="bg-gray-900">Billing</option>
                  <option className="bg-gray-900">Amenities</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                  <AlertTriangle size={18} />
                </div>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                >
                  <option value="P1" className="bg-gray-900">
                    P1 - Critical
                  </option>
                  <option value="P2" className="bg-gray-900">
                    P2 - High
                  </option>
                  <option value="P3" className="bg-gray-900">
                    P3 - Medium
                  </option>
                  <option value="P4" className="bg-gray-900">
                    P4 - Low
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
              placeholder="Please provide detailed information about the issue..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl shadow-lg text-sm font-bold text-white tracking-wide transition-all duration-300 transform hover:-translate-y-0.5
            ${
              loading
                ? "bg-gray-600 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30 border border-transparent hover:border-blue-400/30"
            }`}
          >
            {loading ? (
              "Submitting..."
            ) : (
              <>
                Submit Ticket <Send size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
