import React from "react";
import { Image as ImageIcon } from "lucide-react";

// Mock data (replace with API call later)
const events = [
  {
    id: 1,
    title: "Diwali Celebration 2025",
    img: "https://source.unsplash.com/random/800x600/?diwali",
    date: "Nov 12, 2025",
  },
  {
    id: 2,
    title: "Annual General Meeting",
    img: "https://source.unsplash.com/random/800x600/?meeting",
    date: "Aug 15, 2025",
  },
  {
    id: 3,
    title: "Holi Festival",
    img: "https://source.unsplash.com/random/800x600/?holi",
    date: "Mar 25, 2025",
  },
];

const CommunityGallery = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <ImageIcon className="text-blue-400" size={32} />
        <div>
          <h1 className="text-3xl font-bold text-white">Community Gallery</h1>
          <p className="text-gray-400 text-sm">
            Highlights from our society events.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="group relative overflow-hidden rounded-3xl border border-white/10 shadow-lg"
          >
            <img
              src={event.img}
              alt={event.title}
              className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <h3 className="text-xl font-bold text-white">{event.title}</h3>
              <p className="text-sm text-blue-300">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityGallery;
