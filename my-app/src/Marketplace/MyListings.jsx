import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  PlusCircle,
  Edit,
  Trash2,
  ArrowLeft,
  Tag,
  ShoppingBag,
} from "lucide-react";

const placeholderImage = (text) =>
  `https://placehold.co/150x100/1e293b/cbd5e1?text=${encodeURIComponent(text)}`;

function MyListings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchMyItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/marketplace/my-listings");
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to fetch user listings:", err);
      if (err.message !== "Unauthorized access - Redirecting to login.") {
        setError(
          err.response?.data?.message ||
            err.response?.data?.msg ||
            "Could not load your listings.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await api.delete(`/api/marketplace/${id}`);
        setItems(items.filter((item) => item._id !== id));
      } catch (err) {
        alert("Failed to delete item.");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    // Optimistic update
    const updatedItems = items.map((item) =>
      item._id === id ? { ...item, status: newStatus } : item,
    );
    setItems(updatedItems);

    try {
      // Assuming you have a patch endpoint, otherwise this part needs backend support
      // For now just updating local state to reflect UI change capability
      console.log(`Updating status of ${id} to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <button
            onClick={() => navigate("/marketplace")}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Marketplace
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Tag className="text-blue-400" size={32} />
            My Listings
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage the items you are selling.
          </p>
        </div>

        <button
          onClick={() => navigate("/marketplace/create")}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30 rounded-xl text-white font-bold shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          <PlusCircle size={18} className="mr-2" />
          Add New Item
        </button>
      </div>

      {/* Content */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Your Items</h3>
          <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
            {items.length} listed
          </span>
        </div>

        {loading && (
          <p className="p-8 text-center text-gray-400 animate-pulse">
            Loading your items...
          </p>
        )}
        {error && <p className="p-8 text-center text-red-400">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <ShoppingBag size={48} className="mb-4 opacity-20" />
            <p>You haven't listed anything yet.</p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="p-6 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="group flex flex-col md:flex-row items-center gap-6 p-4 bg-black/20 border border-white/10 rounded-2xl hover:bg-white/5 transition-all duration-300"
              >
                {/* Image */}
                <div className="w-full md:w-32 h-32 shrink-0 rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={item.imageUrl || placeholderImage(item.title)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderImage(item.title);
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 w-full text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-white">
                      {item.title}
                    </h3>
                    <span className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded-md w-fit mx-auto md:mx-0">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-400">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                    {item.description}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex flex-row md:flex-col items-center gap-3 w-full md:w-auto">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item._id, e.target.value)
                    }
                    className={`text-xs p-2 rounded-lg border border-white/10 outline-none cursor-pointer font-bold w-full md:w-32 text-center
                            ${item.status === "Available" ? "bg-green-500/20 text-green-300" : ""}
                            ${item.status === "Reserved" ? "bg-yellow-500/20 text-yellow-300" : ""}
                            ${item.status === "Sold" ? "bg-gray-500/20 text-gray-400" : ""}
                        `}
                  >
                    <option value="Available" className="bg-gray-900">
                      Available
                    </option>
                    <option value="Reserved" className="bg-gray-900">
                      Reserved
                    </option>
                    <option value="Sold" className="bg-gray-900">
                      Sold
                    </option>
                  </select>

                  <div className="flex gap-2 w-full justify-center">
                    <button
                      className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Edit (Coming Soon)"
                      disabled
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyListings;
