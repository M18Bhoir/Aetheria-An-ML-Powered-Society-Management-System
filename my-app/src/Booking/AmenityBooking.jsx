import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Use your configured API instance

// Simple Date and Time formatting helper
const formatDateTimeLocal = (date) => {
    if (!date) return '';
    const d = new Date(date);
    // Format: YYYY-MM-DDTHH:mm
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};


function AmenityBooking() {
    const [amenities, setAmenities] = useState([]);
    const [selectedAmenity, setSelectedAmenity] = useState('');
    const [startTime, setStartTime] = useState(''); // Store as ISO string or Date object
    const [endTime, setEndTime] = useState('');   // Store as ISO string or Date object
    const [eventDescription, setEventDescription] = useState('');
    const [existingBookings, setExistingBookings] = useState([]); // To show conflicts (optional)

    const [loadingAmenities, setLoadingAmenities] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(false); // Loading state for conflict check
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' }); // For success/error messages

    const navigate = useNavigate();

    // Fetch available amenities on component mount
    useEffect(() => {
        const fetchAmenities = async () => {
            setLoadingAmenities(true);
            setMessage({ type: '', text: '' });
            try {
                const res = await api.get('/api/bookings/amenities');
                setAmenities(res.data || []);
                if (res.data?.length > 0) {
                    setSelectedAmenity(res.data[0].name); // Default to first amenity
                }
            } catch (error) {
                console.error("Failed to fetch amenities:", error);
                setMessage({ type: 'error', text: 'Could not load amenities.' });
            } finally {
                setLoadingAmenities(false);
            }
        };
        fetchAmenities();
    }, []);

    // --- Optional: Fetch existing bookings when amenity/date changes ---
    // This is basic; a calendar view would need more sophisticated fetching
    useEffect(() => {
        const fetchConflicts = async () => {
            if (!selectedAmenity || !startTime) return; // Only fetch if amenity and start date are set

            setLoadingBookings(true);
            setMessage({ type: '', text: '' }); // Clear messages
            try {
                const dateOnly = startTime.split('T')[0]; // Get YYYY-MM-DD
                if (!dateOnly) return;

                const res = await api.get(`/api/bookings?amenityName=${encodeURIComponent(selectedAmenity)}&startDate=${dateOnly}&endDate=${dateOnly}`);
                setExistingBookings(res.data || []);
            } catch (error) {
                console.error("Failed to fetch existing bookings:", error);
                // Don't show critical error, just inform user
                setMessage({ type: 'info', text: 'Could not check for existing bookings.' });
                setExistingBookings([]); // Clear old conflicts on error
            } finally {
                setLoadingBookings(false);
            }
        };

        // Debounce fetching conflicts slightly to avoid rapid requests
        const debounceTimeout = setTimeout(fetchConflicts, 300);
        return () => clearTimeout(debounceTimeout); // Cleanup timeout on change

    }, [selectedAmenity, startTime]); // Re-fetch when amenity or start date changes


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' }); // Clear previous messages
        setIsSubmitting(true);

        if (!selectedAmenity || !startTime || !endTime) {
            setMessage({ type: 'error', text: 'Please select an amenity and fill in start/end times.' });
            setIsSubmitting(false);
            return;
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (start >= end) {
             setMessage({ type: 'error', text: 'End time must be after start time.' });
             setIsSubmitting(false);
             return;
        }
         if (start < new Date()) {
             setMessage({ type: 'error', text: 'Booking start time cannot be in the past.' });
             setIsSubmitting(false);
             return;
        }


        try {
            const response = await api.post('/api/bookings', {
                amenityName: selectedAmenity,
                startTime: start.toISOString(), // Send ISO strings to backend
                endTime: end.toISOString(),
                eventDescription: eventDescription || `${selectedAmenity} Booking`, // Default description
            });

            setMessage({ type: 'success', text: 'Booking request submitted successfully!' });
            // Optionally clear form or redirect
            // setStartTime('');
            // setEndTime('');
            // setEventDescription('');
            setExistingBookings([]); // Clear conflicts view

            // Redirect to 'My Bookings' page after a short delay
            setTimeout(() => {
                navigate('/dashboard/my-bookings');
            }, 1500);

        } catch (error) {
            console.error("Booking submission error:", error);
            if (error.response && error.response.status === 409) {
                 // Specific conflict error
                 setMessage({ type: 'error', text: error.response.data.message || 'Time slot conflict detected.' });
            } else {
                 setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit booking request.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Book an Amenity</h1>

            {message.text && (
                <div className={`mb-4 p-3 rounded-md text-sm ${
                    message.type === 'error' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                    message.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                    'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' // Info
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Amenity Selection */}
                <div>
                    <label htmlFor="amenity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Amenity</label>
                    {loadingAmenities ? (
                        <p className="text-gray-500 dark:text-gray-400">Loading amenities...</p>
                    ) : amenities.length > 0 ? (
                        <select
                            id="amenity"
                            value={selectedAmenity}
                            onChange={(e) => setSelectedAmenity(e.target.value)}
                            required
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {amenities.map(amenity => (
                                <option key={amenity.id || amenity.name} value={amenity.name}>
                                    {amenity.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                         <p className="text-red-500 dark:text-red-400">No amenities available.</p>
                    )}
                </div>

                {/* Start Time */}
                <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                    <input
                        type="datetime-local"
                        id="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* End Time */}
                <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                    <input
                        type="datetime-local"
                        id="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Event Description (Optional) */}
                <div>
                    <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Description (Optional)</label>
                    <input
                        type="text"
                        id="eventDescription"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        placeholder="e.g., Birthday Party, Engagement Ceremony"
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                 {/* Display Conflicts (Optional) */}
                 {startTime && existingBookings.length > 0 && (
                     <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-md text-yellow-800 dark:text-yellow-300 text-sm">
                         <h4 className="font-semibold mb-1">Existing Bookings for {selectedAmenity} on {new Date(startTime).toLocaleDateString()}:</h4>
                         {loadingBookings ? <p>Checking availability...</p> : (
                             <ul className="list-disc list-inside">
                                 {existingBookings.map(b => (
                                     <li key={b._id}>
                                         {new Date(b.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - {new Date(b.endTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} ({b.status})
                                     </li>
                                 ))}
                             </ul>
                         )}
                     </div>
                 )}


                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || loadingAmenities || !selectedAmenity}
                    className={`w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                        isSubmitting || loadingAmenities || !selectedAmenity
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-blue-700'
                    }`}
                >
                    {isSubmitting ? (
                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                    ) : (
                         'Request Booking'
                    )}
                </button>
                 <button
                      type="button"
                      onClick={() => navigate('/dashboard/my-bookings')}
                      className="w-full mt-2 text-center text-blue-600 dark:text-blue-400 hover:underline"
                    >
                    View My Bookings
                </button>
            </form>
        </div>
    );
}

export default AmenityBooking;
