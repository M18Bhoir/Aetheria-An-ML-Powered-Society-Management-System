import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { PlusCircle, RefreshCw, ShoppingBag, Search, Tag } from "lucide-react";

// Placeholder image function
const placeholderImage = (text = "No Image") =>
  `https://placehold.co/600x400/1e293b/cbd5e1?text=${encodeURIComponent(text)}`;

function MarketplaceList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/marketplace");
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to fetch marketplace items:", err);
      if (err.message !== "Unauthorized access - Redirecting to login.") {
        setError(
          err.response?.data?.message || "Could not load marketplace items.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up min-h-screen p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-lg">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-white flex items-center justify-center md:justify-start gap-3">
            <ShoppingBag className="text-blue-400" size={40} />
            Marketplace
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Buy, sell, and trade with your neighbors.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={fetchItems}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all hover:rotate-180 duration-500"
            title="Refresh List"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={() => navigate("/dashboard/marketplace/new")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
          >
            Sell Item
          </button>
          <button
            onClick={() => navigate("/dashboard/my-listings")}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
          >
            My Listings
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-center">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-96 bg-white/5 rounded-3xl animate-pulse border border-white/5"
            ></div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
          <Search size={64} className="mb-4 opacity-20" />
          <p className="text-xl font-semibold">No items found</p>
          <p className="text-sm">Be the first to list something!</p>
        </div>
      )}

      {/* Items Grid */}
      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {items.map((item) => (
            <Link
              to={`/dashboard/marketplace/${item._id}`}
              key={item._id}
              className="group block"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:bg-white/10 transition-all duration-300 h-full flex flex-col hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img
                    src={item.imageUrl || placeholderImage(item.title)}
                    alt={item.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderImage(item.title);
                    }}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/10">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 z-20">
                    <p className="text-2xl font-bold text-white drop-shadow-md">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-white mb-2 truncate group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h2>
                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-sm text-gray-400">
                    <span>By {item.seller?.name || "Unknown"}</span>
                    <span className="text-xs bg-white/5 px-2 py-1 rounded">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MarketplaceList;
