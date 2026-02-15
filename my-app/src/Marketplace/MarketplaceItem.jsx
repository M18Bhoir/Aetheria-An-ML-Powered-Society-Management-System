import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  ArrowLeft,
  Image as ImageIcon,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const CATEGORIES = [
  "Furniture",
  "Electronics",
  "Clothing",
  "Books",
  "Vehicle",
  "Other",
];
const CONDITIONS = [
  "New",
  "Like New",
  "Used - Good",
  "Used - Fair",
  "Parts Only",
];
const MAX_FILE_SIZE_MB = 5;

function CreateMarketplaceItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[5]);
  const [condition, setCondition] = useState(CONDITIONS[2]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setMessage({
          type: "error",
          text: `Image size should be less than ${MAX_FILE_SIZE_MB}MB.`,
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("condition", condition);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await api.post("/api/marketplace", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({ type: "success", text: "Item listed successfully!" });
      setTimeout(() => navigate("/marketplace"), 1500);
    } catch (err) {
      console.error("Error creating item:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to list item.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 animate-fade-in-up">
      <button
        onClick={() => navigate("/marketplace")}
        className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Marketplace
      </button>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold text-white">Sell an Item</h1>
          <p className="text-gray-400 mt-2">
            Create a new listing for your community.
          </p>
        </div>

        {message.text && (
          <div
            className={`flex items-center p-4 rounded-xl mb-6 border ${
              message.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-300"
                : "bg-green-500/10 border-green-500/20 text-green-300"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle size={20} className="mr-2" />
            ) : (
              <CheckCircle size={20} className="mr-2" />
            )}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              placeholder="What are you selling?"
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-gray-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
            >
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond} className="bg-gray-900">
                  {cond}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
              placeholder="Describe your item..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Photo
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:bg-white/5 hover:border-blue-500/50 transition-all group">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-3 bg-white/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-400" />
                    </div>
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      SVG, PNG, JPG or GIF (MAX. {MAX_FILE_SIZE_MB}MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl shadow-lg text-lg font-bold text-white tracking-wide transition-all duration-300 transform hover:-translate-y-0.5
                            ${
                              loading
                                ? "bg-gray-600 cursor-not-allowed opacity-50"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30"
                            }`}
          >
            {loading ? "Publishing..." : "List Item Now"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateMarketplaceItem;
