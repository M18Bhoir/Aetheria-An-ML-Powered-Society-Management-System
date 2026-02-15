import React from "react";
import { Circle, CheckCircle2, Clock } from "lucide-react";

export default function TicketTimeline({ ticket }) {
  const steps = [
    {
      label: "Opened",
      date: ticket.createdAt,
      icon: Circle,
      activeColor: "text-blue-400",
    },
    {
      label: "Assigned",
      date: ticket.assignedAt,
      icon: Clock,
      activeColor: "text-yellow-400",
    },
    {
      label: "Resolved",
      date: ticket.resolvedAt,
      icon: CheckCircle2,
      activeColor: "text-green-400",
    },
    {
      label: "Closed",
      date: ticket.closedAt,
      icon: CheckCircle2,
      activeColor: "text-gray-400",
    },
  ];

  // Filter out steps that haven't happened yet for a cleaner view,
  // or show them as grayed out. Let's show valid ones only for compactness.
  const activeSteps = steps.filter((s) => s.date);

  return (
    <div className="relative pl-2 space-y-4">
      {/* Vertical Line */}
      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-white/10 rounded-full"></div>

      {activeSteps.map((s, index) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="relative flex items-center gap-3 z-10">
            <div
              className={`p-1 rounded-full bg-[#1a1a2e] border border-white/10 ${s.activeColor}`}
            >
              <Icon size={12} />
            </div>
            <div>
              <p className={`text-xs font-bold ${s.activeColor}`}>{s.label}</p>
              <p className="text-[10px] text-gray-500 font-mono">
                {new Date(s.date).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        );
      })}

      {activeSteps.length === 0 && (
        <p className="text-xs text-gray-500 italic">No activity yet.</p>
      )}
    </div>
  );
}
