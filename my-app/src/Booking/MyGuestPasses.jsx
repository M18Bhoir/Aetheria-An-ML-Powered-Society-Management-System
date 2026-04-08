import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { HiOutlinePlusCircle } from 'react-icons/hi';

// Helper to get status color
const getStatusColor = (status) => {
    switch (status) {
        case 'Approved': return 'text-green-600 dark:text-green-400';
        case 'Pending': return 'text-yellow-600 dark:text-yellow-400';
        case 'Rejected': return 'text-red-600 dark:text-red-400';
        case 'Cancelled':
        case 'Expired': 
            return 'text-gray-500 dark:text-gray-400';
        default: return 'text-gray-700 dark:text-gray-300';
    }
};

function MyGuestPasses() {
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchMyPasses = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/api/guestpass/my');
            setPasses(res.data || []);
        } catch (err) {
            console.error("Failed to fetch user passes:", err);
            setError(err.response?.data?.message || 'Could not load your guest passes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyPasses();
    }, []);

    const handleCancel = async (passId) => {
        if (window.confirm('Are you sure you want to cancel this request?')) {
            try {
                const res = await api.patch(`/api/guestpass/${passId}/cancel`);
                setPasses(passes.map(p => p._id === passId ? res.data : p));
                alert('Request cancelled.');
            } catch (err) {
                console.error("Failed to cancel pass:", err);
                alert(err.response?.data?.msg || 'Failed to cancel request.');
            }
        }
    };

    return (
        <div className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Guest Passes</h1>
                 <button
                    onClick={() => navigate('/dashboard/request-guest-pass')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200"
                 >
                    <HiOutlinePlusCircle className="h-5 w-5 mr-1" />
                    New Request
                 </button>
            </div>

            {loading && <p className="text-center text-gray-500 dark:text-gray-400">Loading your passes...</p>}
            {error && <p className="text-center text-red-500 dark:text-red-400">Error: {error}</p>}

            {!loading && !error && passes.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400">You haven't requested any guest passes yet.</p>
            )}

            {!loading && !error && passes.length > 0 && (
                <div className="space-y-4">
                    {passes.map((pass) => (
                        <div key={pass._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-2">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{pass.guestName}</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        For: {new Date(pass.visitDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`text-sm font-medium ${getStatusColor(pass.status)}`}>
                                    Status: {pass.status}
                                </span>
                            </div>
                            
                            {pass.status === 'Approved' && (
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded my-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Code: </span>
                                    <span className="text-lg font-bold text-blue-700 dark:text-blue-300 ml-2">{pass.code}</span>
                                </div>
                            )}

                            {pass.status === 'Pending' && (
                                <button
                                    onClick={() => handleCancel(pass._id)}
                                    className="mt-2 text-xs text-red-500 hover:underline"
                                >
                                    Cancel Request
                                </button>
                            )}
                             <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                Requested on: {new Date(pass.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyGuestPasses;