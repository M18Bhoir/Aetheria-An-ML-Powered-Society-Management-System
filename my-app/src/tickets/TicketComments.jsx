import { useState } from "react";
import axios from "axios";

export default function TicketComments({ ticketId }) {
  const [comment, setComment] = useState("");

  const addComment = async () => {
    await axios.post(`/api/tickets/comment`, {
      ticketId,
      message: comment,
    });
    setComment("");
    alert("Comment added");
  };

  const reopenTicket = async () => {
    await axios.put(`/api/tickets/reopen/${ticketId}`);
    alert("Ticket reopened");
  };

  return (
    <div className="mt-4">
      <textarea
        placeholder="Add a comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <div className="flex gap-3 mt-2">
        <button
          onClick={addComment}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Comment
        </button>
        <button
          onClick={reopenTicket}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Reopen Ticket
        </button>
        <p className="text-yellow-400">
          {" "}
          Share this OTP with admin to close ticket:{" "}
        </p>{" "}
        <h2 className="text-3xl font-bold">{otp}</h2>
      </div>
    </div>
  );
}
