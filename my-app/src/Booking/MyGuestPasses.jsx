import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { HiOutlinePlusCircle, HiClock, HiCalendar } from 'react-icons/hi';

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
    const [extendingId, setExtendingId] = useState(null);
    const [newExpiry, setNewExpiry] = useState('');
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

    const handleExtend = async (passId) => {
        if (!newExpiry) {
            alert('Please select a new departure time.');
            return;
        }

        try {
            const res = await api.patch(`/api/guestpass/${passId}/extend`, { newValidUntil: newExpiry });
            setPasses(passes.map(p => p._id === passId ? res.data : p));
            setExtendingId(null);
            setNewExpiry('');
            alert('Guest pass duration extended successfully!');
        } catch (err) {
            console.error("Failed to extend pass:", err);
            alert(err.response?.data?.msg || 'Failed to extend pass.');
        }
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    return (
        <div className="p-4 md:p-6 bg-[#f8fafc] dark:bg-gray-900 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Security Codes</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your guest pre-approvals</p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/request-guest-pass')}
                        className="flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform active:scale-95"
                    >
                        <HiOutlinePlusCircle className="h-5 w-5 mr-1" />
                        Request New
                    </button>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-500 font-bold animate-pulse">Loading passes...</p>
                    </div>
                )}
                
                {error && (
                    <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl text-center">
                        <p className="text-red-600 dark:text-red-400 font-bold">Error: {error}</p>
                    </div>
                )}

                {!loading && !error && passes.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700">
                        <HiCalendar className="h-16 w-16 mx-auto text-gray-200 dark:text-gray-700 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 font-black text-xl">No codes found</p>
                    </div>
                )}

                {!loading && !error && passes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        {passes.map((pass) => (
                            <div key={pass._id} className="group p-8 bg-white dark:bg-gray-800 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                
                                <div className="flex flex-col md:flex-row justify-between relative z-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{pass.guestName}</h2>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(pass.status)} border-current bg-current/5`}>
                                                {pass.status}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-3xl">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400">
                                                    <HiClock size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Arrival</p>
                                                    <p className="font-bold text-sm">{formatDateTime(pass.validFrom || pass.visitDate)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-3xl">
                                                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl text-purple-600 dark:text-purple-400">
                                                    <HiClock size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Departure</p>
                                                    <p className="font-bold text-sm">{formatDateTime(pass.validUntil)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 md:mt-0 md:ml-10 flex flex-col items-center justify-center min-w-[160px]">
                                        {pass.status === 'Approved' && (
                                            <div className="w-full">
                                                <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] text-center shadow-xl shadow-blue-500/20 mb-4 transform hover:scale-105 transition-all">
                                                    <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Pass Code</p>
                                                    <p className="text-3xl font-black text-white tracking-widest">{pass.code}</p>
                                                </div>
                                                
                                                <button
                                                    onClick={() => setExtendingId(extendingId === pass._id ? null : pass._id)}
                                                    className="w-full text-sm font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors uppercase tracking-widest"
                                                >
                                                    {extendingId === pass._id ? 'Close extension' : 'Extend Duration'}
                                                </button>
                                            </div>
                                        )}
                                        {pass.status === 'Pending' && (
                                            <button
                                                onClick={() => handleCancel(pass._id)}
                                                className="px-6 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-black rounded-full border border-red-100 dark:border-red-800 uppercase tracking-widest hover:bg-red-100 transition-all"
                                            >
                                                Cancel Request
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {extendingId === pass._id && (
                                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 animate-fade-in-up">
                                        <div className="flex flex-col sm:flex-row items-end gap-6 bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-[32px] border border-blue-100 dark:border-blue-800">
                                            <div className="flex-1 w-full">
                                                <label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">New Departure Time</label>
                                                <input 
                                                    type="datetime-local" 
                                                    value={newExpiry}
                                                    onChange={(e) => setNewExpiry(e.target.value)}
                                                    className="w-full p-4 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                                                />
                                            </div>
                                            <button 
                                                onClick={() => handleExtend(pass._id)}
                                                className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-black rounded-[20px] shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest text-xs"
                                            >
                                                Confirm Extension
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyGuestPasses;