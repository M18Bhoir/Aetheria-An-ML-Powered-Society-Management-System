import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { HiOutlineArrowLeft } from 'react-icons/hi';

function RequestGuestPass() {
    const [guestName, setGuestName] = useState('');
    const [visitDate, setVisitDate] = useState('');
    const [reason, setReason] = useState('');
    
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/api/guestpass/request', {
                guestName,
                visitDate,
                reason
            });
            setMessage({ type: 'success', text: 'Guest pass request submitted!' });
            setTimeout(() => {
                navigate('/dashboard/my-guest-passes');
            }, 1500);
        } catch (err) {
            console.error("Error requesting pass:", err);
            setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to submit request.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-lg mx-auto dark:text-gray-100">
             <button onClick={() => navigate(-1)} className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4">
                 <HiOutlineArrowLeft className="h-4 w-4 mr-1" />
                 Back
             </button>
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Request Guest Pass</h1>

             {message.text && (
                 <div className={`mb-4 p-3 rounded-md text-sm ${
                     message.type === 'error' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                     'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                 }`}>
                     {message.text}
                 </div>
             )}

            <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                {/* Guest Name */}
                <div>
                    <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guest Name *</label>
                    <input type="text" id="guestName" value={guestName} onChange={(e) => setGuestName(e.target.value)} required
                           className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
                
                {/* Visit Date */}
                <div>
                    <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visit Date *</label>
                    <input type="date" id="visitDate" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} required
                           min={new Date().toISOString().split('T')[0]} // Prevent past dates
                           className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                {/* Reason */}
                <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason (Optional)</label>
                    <input type="text" id="reason" value={reason} onChange={(e) => setReason(e.target.value)}
                           placeholder="e.g., Delivery, Family Visit"
                           className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={loading}
                        className={`w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                        }`}
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                     ) : (
                         'Submit Request'
                    )}
                </button>
            </form>
        </div>
    );
}

export default RequestGuestPass;