import { useState } from "react";
import axios from "axios"; // Ensure you are using your configured 'api' instance instead of raw axios if possible, but keeping logic consistent
import api from "../utils/api"; // Using your utility for auth headers
import { MessageSquare, RefreshCw } from "lucide-react";

export default function TicketComments({ ticketId }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const addComment = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await api.post(`/api/tickets/comment`, {
        ticketId,
        message: comment,
      });
      setComment("");
      alert("Comment added successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const reopenTicket = async () => {
    if (!window.confirm("Are you sure you want to reopen this ticket?")) return;
    try {
      await api.put(`/api/tickets/reopen/${ticketId}`);
      alert("Ticket reopened successfully");
      window.location.reload(); // Simple refresh to show new status
    } catch (err) {
      alert("Failed to reopen ticket");
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-white/5">
      <div className="relative">
        <textarea
          placeholder="Add a comment or update..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="2"
          className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
        />
        <div className="absolute bottom-2 right-2 flex gap-2">
          <button
            onClick={addComment}
            disabled={loading || !comment.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send Comment"
          >
            <MessageSquare size={14} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={reopenTicket}
          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          <RefreshCw size={12} /> Reopen Ticket
        </button>
      </div>
    </div>
  );
}
