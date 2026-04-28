import React from 'react';

// Hero section for resident dashboard
export default function UserHero({ userName }) {
  return (
    <section className="relative overflow-hidden rounded-3xl mb-8 glass-card bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-white/10 shadow-xl">
      {/* Background decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="flex flex-col md:flex-row items-center p-8 md:p-12 relative z-10">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Welcome back, <span className="text-gradient">{userName}</span>!
          </h1>
          <p className="text-gray-300 max-w-lg">
            Explore your community, manage dues, book amenities, and stay updated with the latest notices.
          </p>
        </div>
      </div>
    </section>
  );
}
