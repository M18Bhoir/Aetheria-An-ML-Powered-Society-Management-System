import { useState } from "react";
import axios from "axios";

export default function RaiseTicket() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Maintenance",
    priority: "P3",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/tickets/create", formData);
      alert("Ticket created successfully!");
      setFormData({
        title: "",
        description: "",
        category: "Maintenance",
        priority: "P3",
      });
    } catch (err) {
      alert("Failed to create ticket");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-6 text-white">Raise a Ticket</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Ticket Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Describe your issue"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {/* Category */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option className="bg-gray-800">Maintenance</option>
          <option className="bg-gray-800">Electrical</option>
          <option className="bg-gray-800">Security</option>
          <option className="bg-gray-800">Billing</option>
          <option className="bg-gray-800">Amenities</option>
        </select>

        {/* Priority */}
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="P1" className="bg-gray-800">
            P1 - Critical
          </option>
          <option value="P2" className="bg-gray-800">
            P2 - High
          </option>
          <option value="P3" className="bg-gray-800">
            P3 - Medium
          </option>
          <option value="P4" className="bg-gray-800">
            P4 - Low
          </option>
        </select>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition-colors"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
}
