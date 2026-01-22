import React from 'react';

function NoticeBoard() {
  // This is mock data. You would fetch this from your API.
  const notices = [
    { id: 1, title: 'Tower A Maintenance Day', date: 'Oct 25' },
    { id: 2, title: 'Quarterly Community Meeting', date: 'Oct 28' },
    { id: 3, title: 'Pest Control Service', date: 'Nov 02' },
  ];

  return (
    // Notice Board Container:
    // w-80 = fixed 80-unit width (320px)
    // h-screen = full viewport height
    // bg-gray-50 = very light gray background
    // p-6 = padding
    // border-l = left border
    <aside className="w-80 h-screen bg-gray-50 p-6 border-l border-gray-200">
      
      {/* Header */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        Notices 📣
      </h3>

      {/* List of Notices */}
      <ul className="space-y-4">
        {notices.map(notice => (
          // Notice Item Card
          <li 
            key={notice.id} 
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <strong className="block text-md font-medium text-gray-700">
              {notice.title}
            </strong>
            <span className="text-sm text-gray-500">
              {notice.date}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default NoticeBoard;