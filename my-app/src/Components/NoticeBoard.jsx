import React from "react";

function NoticeBoard() {
  const notices = [
    {
      id: 1,
      title: "Tower A Maintenance Day",
      date: "Oct 25",
      tag: "Maintenance",
    },
    {
      id: 2,
      title: "Quarterly Community Meeting",
      date: "Oct 28",
      tag: "Meeting",
    },
    { id: 3, title: "Pest Control Service", date: "Nov 02", tag: "Service" },
  ];

  return (
    <aside className="w-80 h-screen bg-[#0a0f1c]/40 backdrop-blur-lg p-6 border-l border-white/5 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-100">Notices</h3>
        <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
      </div>

      <ul className="space-y-4">
        {notices.map((notice) => (
          <li
            key={notice.id}
            className="group p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">
                {notice.tag}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {notice.date}
              </span>
            </div>
            <p className="text-sm text-slate-200 font-medium group-hover:text-white transition-colors">
              {notice.title}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default NoticeBoard;
