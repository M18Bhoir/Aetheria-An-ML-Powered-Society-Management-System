import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Use your configured API instance

// Helper to format date and time
const formatBookingTime = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const optionsDate = { year: 'numeric', month: 'short', day: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };

    const dateStr = startDate.toLocaleDateString(undefined, optionsDate);
    const startTimeStr = startDate.toLocaleTimeString(undefined, optionsTime);
    const endTimeStr = endDate.toLocaleTimeString(undefined, optionsTime);

    // Check if start and end date are the same
    if (startDate.toDateString() === endDate.toDateString()) {
        return `${dateStr}, ${startTimeStr} - ${endTimeStr}`;
    } else {
        // If booking spans multiple days (less common for amenities, but possible)
        const endDateStr = endDate.toLocaleDateString(undefined, optionsDate);
        return `${dateStr}, ${startTimeStr} - ${endDateStr}, ${endTimeStr}`;
    }
};

// Helper to get status color
const getStatusColor = (status) => {
    switch (status) {
        case 'Approved': return 'text-green-600 dark:text-green-400';
        case 'Pending': return 'text-yellow-600 dark:text-yellow-400';
        case 'Rejected': return 'text-red-600 dark:text-red-400';
        case 'Cancelled': return 'text-gray-500 dark:text-gray-400';
        default: return 'text-gray-700 dark:text-gray-300';
    }
};

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyBookings = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await api.get('/api/bookings/my');
                setBookings(res.data || []);
            } catch (err) {
                console.error("Failed to fetch user bookings:", err);
                if (err.message !== "Unauthorized access - Redirecting to login.") {
                     setError(err.response?.data?.message || 'Could not load your bookings.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMyBookings();
    }, []); // Fetch once on mount

    return (
        <div className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Amenity Bookings</h1>
                 <button
                    onClick={() => navigate('/dashboard/booking')}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200"
                 >
                    Book New Amenity
                 </button>
            </div>


            {loading && <p className="text-center text-gray-500 dark:text-gray-400">Loading your bookings...</p>}
            {error && <p className="text-center text-red-500 dark:text-red-400">Error: {error}</p>}

            {!loading && !error && bookings.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400">You haven't booked any amenities yet.</p>
            )}

            {!loading && !error && bookings.length > 0 && (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{booking.amenityName}</h2>
                                <span className={`text-sm font-medium ${getStatusColor(booking.status)}`}>
                                    Status: {booking.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                <span className="font-medium">Time:</span> {formatBookingTime(booking.startTime, booking.endTime)}
                            </p>
                            {booking.eventDescription && booking.eventDescription !== 'General Booking' && (
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">Event:</span> {booking.eventDescription}
                                </p>
                            )}
                             <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                            {/* Optional: Add cancel button for Pending bookings */}
                            {/* {booking.status === 'Pending' && (
                                <button
                                    onClick={() => handleCancelBooking(booking._id)} // Implement this function
                                    className="mt-2 text-xs text-red-500 hover:underline"
                                >
                                    Cancel Request
                                </button>
                            )} */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyBookings;
