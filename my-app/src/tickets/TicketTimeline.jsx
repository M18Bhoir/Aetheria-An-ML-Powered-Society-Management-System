export default function TicketTimeline({ ticket }) {
  const steps = [
    { label: "Opened", date: ticket.createdAt },
    { label: "Assigned", date: ticket.assignedAt },
    { label: "Resolved", date: ticket.resolvedAt },
    { label: "Closed", date: ticket.closedAt },
  ];

  return (
    <div className="mt-4 border-l-2 border-blue-500 pl-4 space-y-2">
      {steps.map(
        (s) =>
          s.date && (
            <div key={s.label}>
              <p className="text-blue-400 font-semibold">{s.label}</p>
              <p className="text-gray-400 text-sm">
                {new Date(s.date).toLocaleString()}
              </p>
            </div>
          ),
      )}
    </div>
  );
}
