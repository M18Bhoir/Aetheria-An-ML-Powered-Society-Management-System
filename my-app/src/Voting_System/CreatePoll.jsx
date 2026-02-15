import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  ArrowLeft,
  Send,
  ListPlus,
  HelpCircle,
  AlertCircle,
} from "lucide-react";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [optionsText, setOptionsText] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const options = optionsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!question.trim()) {
      setMessage({ type: "error", text: "Please enter a question." });
      return;
    }
    if (options.length < 2) {
      setMessage({
        type: "error",
        text: "Please provide at least 2 valid options (one per line).",
      });
      return;
    }

    setLoading(true);

    try {
      await api.post(`/api/polls`, {
        question,
        options: options.map((opt) => ({ text: opt })),
      });
      setMessage({ type: "success", text: "Poll created successfully!" });
      setTimeout(() => navigate("/dashboard/voting"), 1500);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.msg || "Failed to create poll.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up p-4">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/dashboard/voting")}
          className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Polls
        </button>
        <h1 className="text-3xl font-bold text-white">Create Poll</h1>
        <p className="text-gray-400 text-sm mt-1">
          Ask the community for their opinion.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
        {message && (
          <div
            className={`p-4 rounded-xl mb-6 text-sm font-medium border flex items-center gap-2 ${
              message.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-300"
                : "bg-green-500/10 border-green-500/20 text-green-300"
            }`}
          >
            <AlertCircle size={18} />
            {message.text}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Question Input */}
          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Poll Question
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                <HelpCircle size={18} />
              </div>
              <input
                type="text"
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                placeholder="e.g., Should we upgrade the gym equipment?"
              />
            </div>
          </div>

          {/* Options Input */}
          <div>
            <label
              htmlFor="options"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Options{" "}
              <span className="text-gray-500 text-xs">
                (Enter one option per line)
              </span>
            </label>
            <div className="relative group">
              <div className="absolute top-3 left-4 pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                <ListPlus size={18} />
              </div>
              <textarea
                id="options"
                value={optionsText}
                onChange={(e) => setOptionsText(e.target.value)}
                rows={6}
                required
                className="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none leading-relaxed"
                placeholder="Yes&#10;No&#10;Maybe later"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl shadow-lg text-sm font-bold text-white tracking-wide transition-all duration-300 transform hover:-translate-y-0.5
            ${
              loading
                ? "bg-gray-600 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30 border border-transparent hover:border-blue-400/30"
            }`}
          >
            {loading ? (
              "Publishing..."
            ) : (
              <>
                Publish Poll <Send size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
