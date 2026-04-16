import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Droplet,
  Zap,
  MapPin,
  Users,
  Activity,
  AlertCircle,
  Clock,
} from "lucide-react";
import api from "../utils/api";

const SocietyMap = () => {
  const [status, setStatus] = useState({ wings: {}, amenities: {} });
  const [hovered, setHovered] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await api.get("/api/map/status");
      setStatus(res.data);
    } catch (err) {
      console.error("Map fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const wings = [
    {
      id: "A",
      name: "Wing A",
      x: 100,
      y: 50,
      w: 120,
      h: 180,
      color: "rgba(37, 99, 235, 0.4)",
    },
    {
      id: "B",
      name: "Wing B",
      x: 240,
      y: 50,
      w: 120,
      h: 180,
      color: "rgba(79, 70, 229, 0.4)",
    },
    {
      id: "C",
      name: "Wing C",
      x: 100,
      y: 250,
      w: 120,
      h: 180,
      color: "rgba(124, 58, 237, 0.4)",
    },
    {
      id: "D",
      name: "Wing D",
      x: 240,
      y: 250,
      w: 120,
      h: 180,
      color: "rgba(147, 51, 234, 0.4)",
    },
  ];

  const amenities = [
    {
      id: "Swimming Pool",
      name: "Pool",
      cx: 480,
      cy: 120,
      r: 60,
      color: "rgba(14, 165, 233, 0.4)",
    },
    {
      id: "Gym",
      name: "Health Club",
      x: 400,
      y: 240,
      w: 160,
      h: 100,
      color: "rgba(16, 185, 129, 0.4)",
    },
    {
      id: "Clubhouse",
      name: "The Lounge",
      x: 400,
      y: 360,
      w: 160,
      h: 70,
      color: "rgba(245, 158, 11, 0.4)",
    },
  ];

  const renderWing = (wing) => {
    const wingData = status.wings[wing.id] || { openTickets: 0 };
    const hasIssues = wingData.openTickets > 2;

    return (
      <motion.g
        key={wing.id}
        onMouseEnter={() => setHovered({ type: "wing", ...wing, ...wingData })}
        onMouseLeave={() => setHovered(null)}
        whileHover={{ scale: 1.02 }}
        className="cursor-pointer"
      >
        {/* Shadow / Glow */}
        {hasIssues && (
          <rect
            x={wing.x - 5}
            y={wing.y - 5}
            width={wing.w + 10}
            height={wing.h + 10}
            rx={20}
            fill="none"
            stroke="rgba(239, 68, 68, 0.3)"
            strokeWidth={2}
            opacity="0.5"
          />
        )}

        <rect
          x={wing.x}
          y={wing.y}
          width={wing.w}
          height={wing.h}
          rx={20}
          fill={wing.color}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
        />

        <text
          x={wing.x + wing.w / 2}
          y={wing.y + 30}
          textAnchor="middle"
          fill="white"
          className="text-[14px] font-black uppercase tracking-widest opacity-80"
        >
          {wing.id}
        </text>

        {wingData.openTickets > 0 && (
          <g
            transform={`translate(${wing.x + wing.w / 2 - 10}, ${wing.y + wing.h - 40})`}
          >
            <circle
              r={12}
              fill={
                hasIssues ? "rgba(239, 68, 68, 0.8)" : "rgba(245, 158, 11, 0.8)"
              }
            />
            <text
              textAnchor="middle"
              dy=".3em"
              fill="white"
              className="text-[10px] font-bold"
            >
              {wingData.openTickets}
            </text>
          </g>
        )}
      </motion.g>
    );
  };

  const renderAmenity = (amen) => {
    const amenData = status.amenities[amen.id] || { occupied: false };
    const isOccupied = amenData.occupied;

    return (
      <motion.g
        key={amen.id}
        onMouseEnter={() =>
          setHovered({ type: "amenity", ...amen, ...amenData })
        }
        onMouseLeave={() => setHovered(null)}
        whileHover={{ scale: 1.05 }}
        className="cursor-pointer"
      >
        {amen.r ? (
          <circle
            cx={amen.cx}
            cy={amen.cy}
            r={amen.r}
            fill={amen.color}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={1}
          />
        ) : (
          <rect
            x={amen.x}
            y={amen.y}
            width={amen.w}
            height={amen.h}
            rx={16}
            fill={amen.color}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={1}
          />
        )}

        {isOccupied && (
          <circle
            cx={amen.cx || amen.x + amen.w / 2}
            cy={amen.cy || amen.y + amen.h / 2}
            r={10}
            fill="rgba(16, 185, 129, 0.9)"
          />
        )}

        <text
          x={amen.cx || amen.x + amen.w / 2}
          y={amen.cy ? amen.cy + 5 : amen.y + amen.h / 2 + 5}
          textAnchor="middle"
          fill="white"
          className="text-[10px] font-black uppercase tracking-tighter opacity-70 pointer-events-none"
        >
          {amen.name}
        </text>
      </motion.g>
    );
  };

  return (
    <div className="relative glass-dark rounded-[48px] p-8 border border-white/5 shadow-2xl overflow-hidden aspect-[4/3] max-h-[600px]">
      <div className="absolute top-8 left-8 z-20">
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
          <Activity className="text-blue-500" />
          Society Pulse
        </h3>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
          Live Operational Map
        </p>
      </div>

      <svg viewBox="0 0 600 500" className="w-full h-full drop-shadow-2xl">
        {/* Background Gradients/Aesthetics */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* The Base Map */}
        <rect
          x="50"
          y="20"
          width="520"
          height="460"
          rx="32"
          fill="rgba(255,255,255,0.02)"
          stroke="rgba(255,255,255,0.05)"
        />

        {/* Render Sections */}
        {wings.map(renderWing)}
        {amenities.map(renderAmenity)}

        {/* Legend */}
        <g transform="translate(420, 30)">
          <circle cx="0" cy="0" r="5" fill="rgba(16, 185, 129, 1)" />
          <text
            x="12"
            y="4"
            fill="gray"
            className="text-[10px] font-bold uppercase"
          >
            Active Occupancy
          </text>
          <circle cx="0" cy="20" r="5" fill="rgba(239, 68, 68, 1)" />
          <text
            x="12"
            y="24"
            fill="gray"
            className="text-[10px] font-bold uppercase"
          >
            High Ticket Volume
          </text>
        </g>
      </svg>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-8 right-8 w-64 glass-dark p-6 rounded-[32px] border border-blue-500/30 shadow-2xl z-30 pointer-events-none"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">
                {hovered.type}
              </span>
              <Activity size={16} className="text-blue-500" />
            </div>
            <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">
              {hovered.name}
            </h4>

            <div className="space-y-3">
              {hovered.type === "wing" ? (
                <>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <AlertCircle
                      size={16}
                      className={
                        hovered.openTickets > 0
                          ? "text-amber-500"
                          : "text-emerald-500"
                      }
                    />
                    <span className="font-bold">
                      {hovered.openTickets} Open Complaints
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Users size={16} className="text-blue-400" />
                    <span className="font-bold">Building Registered</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Clock size={16} className="text-blue-400" />
                    <span className="font-bold">
                      {hovered.occupied ? "Currently Booked" : "Available Now"}
                    </span>
                  </div>
                  {hovered.occupied && (
                    <div className="text-[10px] bg-emerald-500/10 text-emerald-400 p-2 rounded-xl border border-emerald-500/20 font-bold uppercase tracking-widest">
                      Occupancy Verified
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(SocietyMap);
