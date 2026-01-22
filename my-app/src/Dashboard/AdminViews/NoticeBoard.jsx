import React from 'react';

function NoticeBoard({ notices }) {
  // If no notices are provided, show a default message
  if (!notices || notices.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Notice Board</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">No notices have been posted.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Notice Board</h3>
      <ul className="space-y-4">
        {notices.map((notice, i) => (
          <li key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{notice.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{notice.date}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{notice.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NoticeBoard;