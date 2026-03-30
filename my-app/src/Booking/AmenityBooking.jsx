import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { 
    Calendar, 
    Clock, 
    Info, 
    ArrowLeft, 
    CheckCircle2, 
    AlertCircle,
    ChevronRight,
    MapPin
} from 'lucide-react';

/* ================= Animation Variants ================= */
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

function AmenityBooking() {
    const [amenities, setAmenities] = useState([]);
    const [selectedAmenity, setSelectedAmenity] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [existingBookings, setExistingBookings] = useState([]);
    
    const [loadingAmenities, setLoadingAmenities] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAmenities = async () => {
            setLoadingAmenities(true);
            try {
                const res = await api.get('/api/bookings/amenities');
                setAmenities(res.data || []);
                if (res.data?.length > 0) {
                    setSelectedAmenity(res.data[0].name);
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

    useEffect(() => {
        const fetchConflicts = async () => {
            if (!selectedAmenity || !startTime) return;
            setLoadingBookings(true);
            try {
                const dateOnly = startTime.split('T')[0];
                const res = await api.get(`/api/bookings?amenityName=${encodeURIComponent(selectedAmenity)}&startDate=${dateOnly}&endDate=${dateOnly}`);
                setExistingBookings(res.data || []);
            } catch (error) {
                setExistingBookings([]);
            } finally {
                setLoadingBookings(false);
            }
        };
        const debounceTimeout = setTimeout(fetchConflicts, 300);
        return () => clearTimeout(debounceTimeout);
    }, [selectedAmenity, startTime]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setIsSubmitting(true);

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (start >= end) {
             setMessage({ type: 'error', text: 'End time must be after start time.' });
             setIsSubmitting(false);
             return;
        }

        try {
            await api.post('/api/bookings', {
                amenityName: selectedAmenity,
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                eventDescription: eventDescription || `${selectedAmenity} Booking`,
            });
            setMessage({ type: 'success', text: 'Booking request sent for approval!' });
            setTimeout(() => navigate('/dashboard/my-bookings'), 1500);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit booking.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={containerVariants}
            className="max-w-4xl mx-auto p-4 py-12"
        >
            <button
                onClick={() => navigate('/dashboard')}
                className="group flex items-center text-sm font-semibold text-gray-500 hover:text-white transition-all mb-8 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-white/10"
            >
                <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </button>

            <div className="grid lg:grid-cols-5 gap-10">
                {/* Main Form Section */}
                <div className="lg:col-span-3 space-y-8">
                    <motion.div variants={itemVariants}>
                        <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                <Calendar className="text-blue-400" size={32} />
                            </div>
                            <span className="text-gradient uppercase">Amenity Booking</span>
                        </h1>
                        <p className="text-gray-400 font-medium mt-2 tracking-wide px-1">
                            Reserve society facilities for your private events.
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                            <Clock size={160} strokeWidth={1} />
                        </div>

                        <AnimatePresence>
                            {message.text && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className={`flex items-center p-4 rounded-2xl text-sm font-black uppercase tracking-wide border overflow-hidden relative z-10 ${
                                        message.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 
                                        message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                        'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                    }`}
                                >
                                    {message.type === 'error' ? <AlertCircle size={18} className="mr-3 shrink-0" /> : <CheckCircle2 size={18} className="mr-3 shrink-0" />}
                                    {message.text}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-6 relative z-10">
                            {/* Amenity Select */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">Choose Facility</label>
                                {loadingAmenities ? (
                                    <div className="h-12 w-full bg-white/5 animate-pulse rounded-xl border border-white/5"></div>
                                ) : (
                                    <div className="relative group">
                                        <select
                                            value={selectedAmenity}
                                            onChange={(e) => setSelectedAmenity(e.target.value)}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white font-bold appearance-none hover:border-blue-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            {amenities.map(a => <option key={a.name} value={a.name} className="bg-gray-900">{a.name}</option>)}
                                        </select>
                                        <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-blue-400 transition-colors pointer-events-none" />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">Start Time</label>
                                    <input
                                        type="datetime-local"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        required
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white font-bold hover:border-blue-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">End Time</label>
                                    <input
                                        type="datetime-local"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        required
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white font-bold hover:border-blue-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">Event Details</label>
                                <textarea
                                    value={eventDescription}
                                    onChange={(e) => setEventDescription(e.target.value)}
                                    placeholder="Purpose of booking (e.g. Birthday Party)"
                                    rows="1"
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white font-bold hover:border-blue-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || loadingAmenities}
                                className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:bg-blue-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                            >
                                {isSubmitting ? <div className="animate-spin w-5 h-5 border-b-2 border-white rounded-full"></div> : <>Confirm Reservation <ChevronRight size={20} /></>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Conflict/Info Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-dark rounded-[32px] p-8 border border-white/5 shadow-2xl h-full">
                        <div className="flex items-center gap-3 mb-8">
                             <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                                <Info size={16} />
                             </div>
                             <h3 className="text-sm font-black text-white uppercase tracking-widest">Availability Status</h3>
                        </div>

                        {!startTime ? (
                             <div className="flex flex-col items-center justify-center h-48 text-center text-gray-500 space-y-4">
                                <Calendar size={48} className="opacity-10" />
                                <p className="text-xs font-bold uppercase tracking-widest px-8">Select a start time to check for conflicts</p>
                             </div>
                        ) : (
                            <div className="space-y-6">
                                {loadingBookings ? (
                                    <div className="animate-pulse space-y-4">
                                        <div className="h-12 bg-white/5 rounded-2xl"></div>
                                        <div className="h-12 bg-white/5 rounded-2xl"></div>
                                    </div>
                                ) : existingBookings.length === 0 ? (
                                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-start gap-4">
                                        <CheckCircle2 size={20} className="text-emerald-500 mt-1" />
                                        <div>
                                            <p className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">No Conflicts</p>
                                            <p className="text-xs text-emerald-400/60 font-medium mt-1 leading-relaxed">This facility is available for the selected date.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest px-1">Booked Slots on {new Date(startTime).toLocaleDateString()}:</p>
                                        {existingBookings.map(b => (
                                            <div key={b._id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center group">
                                                <div className="flex items-center gap-3">
                                                     <Clock size={14} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                                                     <span className="text-xs font-bold text-gray-300">
                                                        {new Date(b.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                                     </span>
                                                </div>
                                                <div className="w-2 h-px bg-white/10"></div>
                                                <span className="text-xs font-bold text-gray-300">
                                                     {new Date(b.endTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard/my-bookings')}
                                    className="w-full group mt-4 flex items-center justify-center gap-2 text-blue-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest bg-blue-500/5 py-4 rounded-2xl border border-blue-500/10 hover:bg-blue-600 hover:border-blue-500 shadow-xl"
                                >
                                    My Booking History <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default AmenityBooking;
