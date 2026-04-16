import React from "react";
import { Bell, Calendar, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

function NoticeBoard({ notices }) {
  if (!notices || notices.length === 0) {
    return (
      <div className="glass-card border-white/5 p-10 flex flex-col items-center justify-center text-center h-[350px]">
        <div className="p-5 bg-white/5 rounded-full mb-6 relative">
           <Bell size={48} className="text-slate-700 animate-pulse" />
           <div className="absolute top-4 right-4 w-2 h-2 bg-slate-500 rounded-full"></div>
        </div>
        <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Bulletin Board</h3>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed max-w-[200px]">
           Deployment cycle complete. No active broadcasts found in society buffers.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-dark border-white/5 rounded-[32px] overflow-hidden flex flex-col h-full shadow-2xl">
      <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
        <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
          <MessageSquare size={22} className="text-indigo-400" />
          Live Bulletins
        </h3>
        <span className="text-[10px] font-black text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full border border-indigo-400/20 uppercase tracking-widest">
           {notices.length} ACTIVE
        </span>
      </div>
      <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-4 max-h-[500px]">
        {notices.map((notice, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all"></div>
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{notice.title}</p>
              {notice.date && (
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar size={12} className="text-slate-700" />
                  {notice.date}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {notice.body}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default NoticeBoard;
