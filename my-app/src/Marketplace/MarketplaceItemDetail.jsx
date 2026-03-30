import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Mail,
  Tag,
  DollarSign,
  Layers,
  ShoppingBag,
  Clock,
  ArrowRight,
} from "lucide-react";

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

const placeholderImage = (text) =>
  `https://placehold.co/800x600/1e293b/cbd5e1?text=${encodeURIComponent(text)}`;

function MarketplaceItemDetail() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUserId(JSON.parse(user).id);
    }
  }, []);

  const isSeller =
    item && currentUserId && item.seller && item.seller._id === currentUserId;

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/api/marketplace/${itemId}`);
        setItem(res.data);
      } catch (err) {
        console.error("Error fetching item details:", err);
        setError("Item not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await api.delete(`/api/marketplace/${itemId}`);
        navigate("/dashboard/marketplace");
      } catch (err) {
        alert("Failed to delete item.");
      }
    }
  };

  if (loading) return <div className="text-center text-gray-400 py-32 animate-pulse font-black uppercase tracking-widest">Loading Details...</div>;
  if (error) return <div className="max-w-lg mx-auto mt-20 p-8 glass-card border-rose-500/20 text-rose-400 text-center font-bold shadow-2xl">{error}</div>;
  if (!item) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto p-4 py-12"
    >
      <button
        onClick={() => navigate("/dashboard/marketplace")}
        className="group flex items-center text-sm font-semibold text-gray-500 hover:text-white transition-all mb-8 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-white/10"
      >
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Marketplace
      </button>

      <div className="glass-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col lg:flex-row relative">
        <div className="absolute top-0 right-0 p-12 opacity-[0.01] pointer-events-none">
           <ShoppingBag size={400} strokeWidth={1} />
        </div>

        {/* Left: Image Section */}
        <div className="lg:w-1/2 relative bg-black/40 h-[400px] lg:h-auto overflow-hidden group">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            src={item.imageUrl || placeholderImage(item.title)}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImage(item.title);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
          <div className="absolute top-6 left-6 z-20">
            <span
              className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl border shadow-2xl ${
                item.status === "Available" 
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10" 
                : "bg-rose-500/20 text-rose-400 border-rose-500/30 shadow-rose-500/10"
              }`}
            >
              {item.status}
            </span>
          </div>
        </div>

        {/* Right: Details Section */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col relative z-10">
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
              <Tag size={14} className="animate-pulse" /> {item.category}
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight tracking-tighter">
              {item.title}
            </h1>
            <div className="flex items-baseline gap-2">
               <span className="text-4xl font-black text-emerald-400 tracking-tighter">
                ₹{item.price.toLocaleString("en-IN")}
               </span>
               <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Fixed Price</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-8 mb-10 flex-1">
            <div className="bg-white/5 rounded-[32px] p-8 border border-white/5 shadow-inner">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">
                Marketplace Description
              </h3>
              <p className="text-gray-300 leading-relaxed font-medium text-lg">
                {item.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Condition</p>
                <p className="text-white font-black flex items-center gap-3 mt-2">
                  <Layers size={18} className="text-purple-400" />
                  {item.condition}
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Listed On</p>
                <p className="text-white font-black flex items-center gap-3 mt-2">
                  <Clock size={18} className="text-blue-400" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-blue-600/10 rounded-[32px] p-8 border border-blue-500/20 shadow-2xl shadow-blue-500/5">
              <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6">
                Verified Seller
              </h3>
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                  <User size={28} />
                </div>
                <div>
                  <p className="text-xl font-black text-white tracking-tight">
                    {item.seller?.name || "Neighbor"}
                  </p>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                    Resident ID: {item.seller?.userId || "S-782"}
                  </p>
                </div>
              </div>
              {item.seller?.email && (
                <div className="mt-6 pt-6 border-t border-blue-500/10 flex items-center gap-3 text-blue-300 text-sm font-bold">
                  <Mail size={16} className="opacity-60" />
                  <a href={`mailto:${item.seller.email}`} className="hover:text-white transition-colors">
                    {item.seller.email}
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={itemVariants} className="flex gap-6 pt-8 border-t border-white/5">
            {isSeller ? (
              <>
                <button
                  className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 text-gray-500 cursor-not-allowed border border-white/5 font-black uppercase tracking-widest text-xs"
                  disabled
                >
                  <Edit size={18} /> Edit Listing
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 font-black uppercase tracking-widest text-xs shadow-2xl shadow-rose-500/10 active:scale-95"
                >
                  <Trash2 size={18} /> Delete Listing
                </button>
              </>
            ) : (
              <button className="flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:bg-blue-500 hover:-translate-y-1 transition-all group active:scale-95">
                Message Seller <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default MarketplaceItemDetail;
