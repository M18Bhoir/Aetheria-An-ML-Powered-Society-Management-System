import React from "react";
import { Bell, Calendar } from "lucide-react";

function NoticeBoard({ notices }) {
  if (!notices || notices.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center text-center h-full">
        <Bell size={40} className="text-gray-500 opacity-30 mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Notice Board</h3>
        <p className="text-sm text-gray-400">No notices have been posted.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-white/10 bg-white/5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Bell size={20} className="text-blue-400" />
          Notice Board
        </h3>
      </div>
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 max-h-[500px]">
        {notices.map((notice, i) => (
          <div
            key={i}
            className="p-5 bg-black/20 backdrop-blur-sm border border-white/5 rounded-2xl hover:bg-white/5 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-md font-bold text-blue-300">{notice.title}</p>
              {notice.date && (
                <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-full flex items-center">
                  <Calendar size={10} className="mr-1" />
                  {notice.date}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              {notice.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NoticeBoard;
