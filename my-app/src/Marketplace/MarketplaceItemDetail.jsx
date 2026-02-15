import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "lucide-react";

const placeholderImage = (text) =>
  `https://placehold.co/600x400/1e293b/cbd5e1?text=${encodeURIComponent(text)}`;

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
        navigate("/marketplace");
      } catch (err) {
        alert("Failed to delete item.");
      }
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-400 py-20 animate-pulse">
        Loading details...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-400 py-20 bg-red-500/10 rounded-xl mx-auto max-w-lg mt-10 border border-red-500/20">
        {error}
      </div>
    );
  if (!item) return null;

  return (
    <div className="max-w-6xl mx-auto p-4 animate-fade-in-up">
      <button
        onClick={() => navigate("/marketplace")}
        className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Marketplace
      </button>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left: Image */}
        <div className="lg:w-1/2 relative bg-black/40 h-96 lg:h-auto">
          <img
            src={item.imageUrl || placeholderImage(item.title)}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-contain p-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImage(item.title);
            }}
          />
          <div className="absolute top-4 left-4">
            <span
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-lg ${item.status === "Available" ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"}`}
            >
              {item.status}
            </span>
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col">
          <div className="mb-6">
            <p className="text-blue-400 font-medium mb-1 flex items-center gap-2">
              <Tag size={16} /> {item.category}
            </p>
            <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
              {item.title}
            </h1>
            <p className="text-3xl font-bold text-green-400 flex items-center gap-1">
              <DollarSign size={24} className="text-green-500" />
              {item.price.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="space-y-6 mb-8 flex-1">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">
                Description
              </h3>
              <p className="text-gray-200 leading-relaxed font-light">
                {item.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-500 uppercase">Condition</p>
                <p className="text-white font-medium flex items-center gap-2 mt-1">
                  <Layers size={16} className="text-purple-400" />{" "}
                  {item.condition}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-500 uppercase">Listed Date</p>
                <p className="text-white font-medium mt-1">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-blue-500/10 rounded-2xl p-6 border border-blue-500/20">
              <h3 className="text-sm font-bold text-blue-300 uppercase tracking-wide mb-4">
                Seller Information
              </h3>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-white font-bold">
                    {item.seller?.name || "Unknown"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {item.seller?.userId || "N/A"}
                  </p>
                </div>
              </div>
              {item.seller?.email && (
                <div className="flex items-center gap-2 text-gray-300 text-sm mt-3 ml-1">
                  <Mail size={14} className="opacity-50" />
                  <a
                    href={`mailto:${item.seller.email}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {item.seller.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {isSeller && (
            <div className="flex gap-4 pt-6 border-t border-white/10">
              <button
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all border border-white/10"
                title="Edit (Coming Soon)"
                disabled
              >
                <Edit size={18} /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 shadow-lg hover:shadow-red-500/20"
              >
                <Trash2 size={18} /> Delete Listing
              </button>
            </div>
          )}

          {!isSeller && (
            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all">
              Contact Seller
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarketplaceItemDetail;
