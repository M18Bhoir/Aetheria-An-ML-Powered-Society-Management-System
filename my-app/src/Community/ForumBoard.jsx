import React, { useState, useEffect } from "react";
import { MessageSquare, ThumbsUp, MessageCircle, Send, Plus, Filter, User, Calendar } from "lucide-react";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";

const ForumBoard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "General" });
  const { show } = useToast();

  const fetchPosts = async () => {
    try {
      const res = await api.get("/api/forum");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/forum", newPost);
      show("Post created successfully!", "success");
      setNewPost({ title: "", content: "", category: "General" });
      setShowCreate(false);
      fetchPosts();
    } catch (err) {
      show("Failed to create post.", "error");
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await api.post(`/api/forum/${postId}/like`);
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: res.data } : p));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-fade-in-up">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 pt-4">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-2">Community Forum</h1>
          <p className="text-gray-400 font-medium tracking-wide">Discuss, suggest, and engage with fellow residents.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
        >
          {showCreate ? <Filter size={20} /> : <Plus size={20} />}
          {showCreate ? "Cancel Post" : "New Discussion"}
        </button>
      </header>

      {showCreate && (
        <form onSubmit={handleCreate} className="glass-dark p-8 rounded-[32px] border border-blue-500/20 space-y-6 shadow-2xl animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Discussion Title"
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500/50"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              required
            />
            <select
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500/50 [color-scheme:dark]"
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
            >
              <option value="General">General</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Events">Events</option>
              <option value="Safety">Safety</option>
              <option value="Suggestions">Suggestions</option>
            </select>
          </div>
          <textarea
            placeholder="Share your thoughts..."
            rows="4"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500/50 resize-none"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            required
          />
          <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
            Post to Forum
          </button>
        </form>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="text-center p-20 text-gray-500 animate-pulse">Fetching community discussions...</div>
        ) : posts.length === 0 ? (
          <div className="text-center p-20 glass-card rounded-[32px] text-gray-500 italic border border-white/5 shadow-xl">No active discussions. Be the first to start one!</div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="p-8 glass-dark rounded-[32px] border border-white/5 hover:border-white/10 transition-all shadow-xl group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{post.title}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                       {post.author?.name} · <Calendar size={10} /> {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-gray-400 border border-white/10 uppercase tracking-[0.2em]">{post.category}</span>
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed text-sm">{post.content}</p>
              
              <div className="flex items-center gap-6 border-t border-white/5 pt-6">
                <button 
                  onClick={() => handleLike(post._id)}
                  className={`flex items-center gap-2 text-xs font-bold transition-all ${post.likes?.includes(api.defaults.headers.common['Authorization']) ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}
                >
                  <ThumbsUp size={16} /> {post.likes?.length || 0}
                </button>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <MessageSquare size={16} /> {post.comments?.length || 0}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ForumBoard;
