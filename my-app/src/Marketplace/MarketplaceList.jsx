import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { PlusCircle, RefreshCw, ShoppingBag, Search, Tag, ArrowRight, User, AlertCircle } from "lucide-react";
import { useToast } from "../context/ToastContext";

/* ================= Animation Variants ================= */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

// Placeholder image function
const placeholderImage = (text = "No Image") =>
  `https://placehold.co/600x400/1e293b/cbd5e1?text=${encodeURIComponent(text)}`;

function MarketplaceList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const navigate = useNavigate();
  const { show } = useToast();

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/marketplace");
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to fetch marketplace items:", err);
      if (err.message !== "Unauthorized access - Redirecting to login.") {
        setError(err.response?.data?.message || "Could not load marketplace items.");
        show("Could not load marketplace items.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto space-y-10 p-4 pb-12 min-h-screen"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-2">
        <motion.div variants={itemVariants} className="text-center md:text-left flex-1">
          <h1 className="text-4xl font-black tracking-tight flex items-center justify-center md:justify-start gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
              <ShoppingBag className="text-blue-400" size={32} />
            </div>
            <span className="text-gradient uppercase">Marketplace</span>
          </h1>
          <p className="text-gray-400 font-medium mt-2 tracking-wide max-w-md">
            The community hub to buy, sell, and trade essentials with your neighbors.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
          <button
            onClick={fetchItems}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all hover:rotate-180 duration-700 shadow-xl"
            title="Refresh List"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={() => navigate("/dashboard/marketplace/new")}
            className="flex items-center gap-3 px-8 py-4 bg-blue-600 rounded-2xl text-white font-black uppercase tracking-widest shadow-2xl shadow-blue-900/40 hover:bg-blue-500 hover:-translate-y-1 transition-all border border-blue-400/20"
          >
            <PlusCircle size={20} />
            Sell Item
          </button>
          <button
            onClick={() => navigate("/dashboard/my-listings")}
            className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all shadow-xl"
          >
            My Listings
          </button>
        </motion.div>
      </div>

      {/* Error State */}
      {error && (
        <motion.div variants={itemVariants} className="p-10 glass-dark border border-rose-500/20 text-rose-300 text-center rounded-[32px] shadow-2xl">
          <AlertCircle size={40} className="mx-auto mb-4 opacity-50" />
          <p className="font-bold">{error}</p>
        </motion.div>
      )}

      {/* Loading Grid */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-96 glass-card animate-pulse"></div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-20 glass-card text-gray-500">
          <Search size={64} className="mb-6 opacity-10" />
          <p className="text-xl font-bold tracking-tight">Your digital bazaar is empty</p>
          <p className="text-sm font-medium opacity-60">Be the first to list something interesting!</p>
        </motion.div>
      )}

      {/* Items Grid */}
      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-1">
          {items.slice(0, visibleCount).map((item) => (
            <motion.div
              key={item._id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link to={`/dashboard/marketplace/${item._id}`} className="block h-full">
                <div className="glass-card glass-card-hover rounded-[32px] overflow-hidden flex flex-col h-full shadow-2xl transition-all duration-500">
                  {/* Image Container */}
                  <div className="relative h-60 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
                    <img
                      src={item.imageUrl || placeholderImage(item.title)}
                      alt={item.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderImage(item.title);
                      }}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                       <span className="px-3 py-1 bg-blue-500/20 backdrop-blur-md text-blue-300 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-500/30">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-5 z-20">
                      <p className="text-3xl font-black text-white tracking-tighter drop-shadow-2xl">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors tracking-tight">
                      {item.title}
                    </h2>
                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                           <User size={12} className="text-blue-400" />
                         </div>
                         <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter truncate max-w-[80px]">
                           {item.seller?.name || "Neighbor"}
                         </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-blue-400 group-hover:translate-x-1 transition-transform">
                        <span className="text-[10px] font-black uppercase tracking-widest">View</span>
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {!loading && !error && items.length > visibleCount && (
        <motion.div variants={itemVariants} className="flex justify-center pt-10">
          <button
            onClick={() => setVisibleCount((c) => c + 12)}
            className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all shadow-xl hover:-translate-y-1"
          >
            Show More Treasures
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default MarketplaceList;
