import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

// ---------------------- Poll List Component (User) ----------------------
export function PollList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/api/polls`); 
        setPolls(res.data); 
      } catch (err) {
        console.error("Failed to fetch polls:", err);
        if (err.message !== "Unauthorized access - Redirecting to login.") {
             setError(err.response?.data?.message || err.response?.data?.msg || "Could not load polls.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  if (loading) return <div className="text-center p-6 text-gray-500 dark:text-gray-400">Loading polls...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Available Polls</h2>
      </div>

      {polls.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No polls have been created yet.</p>
      ) : (
        <ul className="space-y-3">
          {polls.map((p) => (
            <li key={p._id}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex justify-between items-center">
              <div>
                  {/* This link goes to the user's detail page */}
                  <Link to={`/dashboard/poll/${p._id}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg">
                  {p.question}
                  </Link>
                  <span className="block text-gray-500 dark:text-gray-400 text-sm mt-1">
                      Created by {p.createdBy?.name || "Admin"} on {new Date(p.createdAt).toLocaleDateString()}
                  </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {p.options.reduce((sum, opt) => sum + opt.votes, 0)} votes
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------- Poll Detail Component (Shared) ----------------------
export function PollDetail() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteMessage, setVoteMessage] = useState(null);
  const navigate = useNavigate();
  
  // --- 1. CHECK IF THE VIEWER IS AN ADMIN ---
  const isAdmin = !!localStorage.getItem('admin');

  useEffect(() => {
    const fetchPoll = async () => {
      setLoading(true);
      setError(null);
      setVoteMessage(null);
      
      // --- 2. CHOOSE THE CORRECT API ROUTE ---
      const url = isAdmin ? `/api/polls/admin/${id}` : `/api/polls/${id}`;

      try {
        const res = await api.get(url); 
        setPoll(res.data);
        setSelectedOptionIndex(null);
      } catch (err) {
        console.error(`Failed to fetch poll ${id}:`, err);
        if (err.message === "Unauthorized access - Redirecting to login.") { return; }
        if (err.response && err.response.status === 401) { return; } // Let interceptor handle it

        if (err.response && err.response.status === 404) {
          setError("Poll not found.");
        } else if (err.response && err.response.status === 400) {
          setError("Invalid Poll ID format.");
        } else {
          setError(err.response?.data?.message || err.response?.data?.msg || "Could not load poll details.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [id, isAdmin]); // Add isAdmin as a dependency

  const handleVote = async () => {
    if (selectedOptionIndex === null) {
        setVoteMessage({ type: 'error', text: 'Please select an option before voting.' });
        return;
    }
    setVoteMessage(null);

    try {
      await api.post(`/api/polls/vote/${id}`, { optionIndex: selectedOptionIndex }); 
      setVoteMessage({ type: 'success', text: 'Your vote has been recorded!' });
      // Refetch poll data (will use the correct admin/user route)
      const url = isAdmin ? `/api/polls/admin/${id}` : `/api/polls/${id}`;
      const res = await api.get(url);
      setPoll(res.data);
    } catch (err) {
      console.error("Error submitting vote:", err);
      if (err.message === "Unauthorized access - Redirecting to login.") { return; }
      let errMsg = "Error submitting vote.";
       if (err.response) {
            errMsg = err.response.data?.message || err.response.data?.msg || "An error occurred on the server.";
            if (err.response.status === 401) errMsg = "Authentication error. You may need to log in again.";
            if (err.response.data?.msg?.includes('already voted')) {
                 errMsg = "You have already voted in this poll.";
            }
       } else if (err.request) {
           errMsg = "Could not connect to the server.";
       }
      setVoteMessage({ type: 'error', text: errMsg });
    }
  };
  
  // --- 3. SET THE CORRECT "BACK" PATH ---
  const backPath = isAdmin ? '/admin/manage-polls' : '/dashboard/voting';

  if (loading) return <div className="text-center p-6 text-gray-500 dark:text-gray-400">Loading poll details...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
  if (!poll) return <div className="text-center p-6 text-gray-500 dark:text-gray-400">Poll data not available.</div>;

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl mx-auto">
      <button onClick={() => navigate(backPath)} className="mb-4 text-sm text-blue-600 dark:text-blue-400 hover:underline">
          &larr; Back to Poll List
      </button>
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">{poll.question}</h2>
       <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
           Created by {poll.createdBy?.name || "Admin"} on {new Date(poll.createdAt).toLocaleDateString()}
       </p>

        {/* Voting Section (Hidden for Admin) */}
        {!isAdmin && (
            <fieldset className="mb-6">
                <legend className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Cast Your Vote:</legend>
                <div className="space-y-3">
                {poll.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150 has-[:checked]:ring-2 has-[:checked]:ring-blue-500 dark:has-[:checked]:ring-blue-400">
                    <input
                        type="radio"
                        name="pollOption"
                        value={index}
                        checked={selectedOptionIndex === index}
                        onChange={() => setSelectedOptionIndex(index)}
                        className="form-radio h-5 w-5 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-500 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-600"
                    />
                    <span className="text-gray-800 dark:text-gray-200">{option.text}</span>
                    </label>
                ))}
                </div>
            </fieldset>
        )}

        {voteMessage && (
            <div className={`my-4 p-3 rounded-md text-sm ${voteMessage.type === 'error' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'}`}>
            {voteMessage.text}
            </div>
        )}

        {/* Submit Button (Hidden for Admin) */}
        {!isAdmin && (
            <button
                onClick={handleVote}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-7Git 00 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
                Submit Vote
            </button>
        )}

      {/* Results Section */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Results</h3>
        {totalVotes === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No votes cast yet.</p>
        ) : (
            <div className="space-y-4">
            {poll.options.map((option, index) => {
                const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
                return (
                <div key={index} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                    <div className="flex justify-between items-center text-sm mb-1 text-gray-800 dark:text-gray-200">
                    <span className="font-medium">{option.text}</span>
                    <span className="text-gray-600 dark:text-gray-300">{option.votes} votes ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5">
                    <div
                        className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                    ></div>
                    </div>
                </div>
                );
            })}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">Total Votes: {totalVotes}</p>
            </div>
        )}
        </div>
    </div>
  );
}