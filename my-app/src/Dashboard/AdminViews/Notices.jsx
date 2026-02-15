import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Send } from "lucide-react";
import api from "../../utils/api";
import NoticeBoard from "../../Components/NoticeBoard"; // Assuming you moved the component above to its own file, or define locally if preferred.

// --- Create Notice Form Component ---
const CreateNoticeForm = ({ onNoticePosted }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await api.post("/api/notices", { title, body });
      setMessage({ type: "success", text: "Notice posted successfully!" });
      setTitle("");
      setBody("");
      onNoticePosted(res.data);
    } catch (err) {
      console.error("Error posting notice:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.msg || "Failed to post notice.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
        <Send size={20} className="text-blue-400" />
        <h2 className="text-xl font-bold text-white">Post New Notice</h2>
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm border ${
            message.type === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-300"
              : "bg-green-500/10 border-green-500/20 text-green-300"
          }`}
        >
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
            placeholder="e.g., Annual General Meeting"
          />
        </div>
        <div>
          <label
            htmlFor="body"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Body *
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows="4"
            className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
            placeholder="Enter the full notice details here..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-white tracking-wide transition-all duration-300 transform hover:-translate-y-0.5
            ${loading ? "bg-gray-600 cursor-not-allowed opacity-50" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30 border border-transparent hover:border-blue-400/30"} 
            `}
        >
          {loading ? "Posting..." : "Post Notice"}
        </button>
      </form>
    </div>
  );
};

// --- Main Page Component ---
function Notices() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/notices/admin");
        // Transform date format if needed to match NoticeBoard expectation
        const formattedData = res.data.map((n) => ({
          ...n,
          date: new Date(n.createdAt).toLocaleDateString(),
        }));
        setNotices(formattedData);
      } catch (err) {
        console.error("Failed to fetch notices:", err);
        setError(err.response?.data?.msg || "Could not load notices.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const handleNoticePosted = (newNotice) => {
    const formattedNotice = {
      ...newNotice,
      date: new Date(newNotice.createdAt).toLocaleDateString(),
    };
    setNotices([formattedNotice, ...notices]);
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bell className="text-blue-400" size={32} />
            Manage Notices
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Broadcast announcements to all residents.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div>
          <CreateNoticeForm onNoticePosted={handleNoticePosted} />
        </div>

        {/* Right: List */}
        <div>
          {loading && (
            <p className="text-center text-gray-400 animate-pulse">
              Loading notices...
            </p>
          )}
          {error && <p className="text-center text-red-400">{error}</p>}
          {!loading && !error && <NoticeBoard notices={notices} />}
        </div>
      </div>
    </div>
  );
}

export default Notices;
