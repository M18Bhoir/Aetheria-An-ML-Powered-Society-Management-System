import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../utils/api';

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatDateTime = (isoDate) => {
      const date = new Date(isoDate);
      return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const getStatusColor = (status) => {
      switch (status) {
          case 'Approved': return 'text-green-600 dark:text-green-400 border-green-300 dark:border-green-600';
          case 'Pending': return 'text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-600';
          case 'Rejected': return 'text-red-600 dark:text-red-400 border-red-300 dark:border-red-600';
          case 'Cancelled': return 'text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-500';
          default: return 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
      }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/api/bookings/all');
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err.response?.data?.msg || "Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/api/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(prevBookings => 
        prevBookings.map(b => 
          b._id === bookingId ? res.data : b 
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again."); 
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <button 
        onClick={() => navigate('/admin')} 
        className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4">
        <ArrowLeft size={16} className="mr-1" />
        Back to Dashboard
      </button>
      
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Amenity Bookings</h2>
        {loading && <p className="text-gray-500 dark:text-gray-400">Loading bookings...</p>}
        {error && <p className="text-red-500 dark:text-red-300">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b dark:border-slate-700">
                <tr className="text-left text-slate-500 dark:text-slate-400">
                  <th className="pb-3 p-2">Amenity</th>
                  <th className="pb-3 p-2">User (Flat)</th>
                  <th className="pb-3 p-2">Event</th>
                  <th className="pb-3 p-2">Start Time</th>
                  <th className="pb-3 p-2">End Time</th>
                  <th className="pb-3 p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <td className="py-3 p-2 font-medium text-gray-800 dark:text-gray-200">{booking.amenityName}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">
                      {booking.bookedBy?.name} ({booking.bookedBy?.userId || 'N/A'})
                    </td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{booking.eventDescription}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{formatDateTime(booking.startTime)}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{formatDateTime(booking.endTime)}</td>
                    <td className="py-3 p-2 text-center">
                      <select 
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        className={`text-xs p-1.5 rounded border dark:bg-slate-700 font-medium ${getStatusColor(booking.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageBookings;