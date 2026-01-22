import express from 'express';
import Booking from '../models/Booking.js';
import User from '../models/User.js'; // Needed to populate user info
import protect from '../middleware/auth.js'; // Middleware for users
import adminAuth from '../middleware/adminAuth.js'; // <-- 1. IMPORT ADMIN AUTH

const router = express.Router();

// --- Hardcoded list of amenities (Replace with DB query if needed) ---
const AVAILABLE_AMENITIES = [
    { id: 'clubhouse', name: 'Clubhouse' },
    { id: 'pool', name: 'Swimming Pool Area' },
    { id: 'gym', name: 'Gymnasium' },
    { id: 'tennis', name: 'Tennis Court' },
    // Add more amenities here
];

// --- GET /api/bookings/amenities --- (User Route)
router.get('/amenities', protect, (req, res) => {
    res.json(AVAILABLE_AMENITIES);
});

// --- GET /api/bookings --- (User Route)
router.get('/', protect, async (req, res) => {
    // ... (existing code for users fetching bookings)
    try {
        const { amenityName, startDate, endDate } = req.query;
        const query = {};

        if (amenityName) {
            query.amenityName = amenityName;
        }

        if (startDate || endDate) {
            query.startTime = {};
             if (startDate) {
                query.startTime.$gte = new Date(startDate);
             }
             if (endDate) {
                 const endOfDay = new Date(endDate);
                 endOfDay.setDate(endOfDay.getDate() + 1);
                 query.startTime.$lt = endOfDay;
            }
        }
        
        // --- This route is for users, so we add the user ID to the query ---
        query.bookedBy = req.user.id; 

        const bookings = await Booking.find(query)
                                     .populate('bookedBy', 'name userId') 
                                     .sort({ startTime: 1 }); 

        res.json(bookings);
    } catch (err) {
        console.error('Error fetching bookings:', err.message);
        res.status(500).json({ message: 'Server error fetching bookings' });
    }
});

// --- GET /api/bookings/my --- (User Route)
router.get('/my', protect, async (req, res) => {
    // ... (existing code)
    try {
        const userId = req.user.id; 
        const bookings = await Booking.find({ bookedBy: userId })
                                     .sort({ startTime: -1 }); 
        res.json(bookings);
    } catch (err) {
        console.error('Error fetching user bookings:', err.message);
        res.status(500).json({ message: 'Server error fetching your bookings' });
    }
});


// --- POST /api/bookings --- (User Route)
router.post('/', protect, async (req, res) => {
    // ... (existing code for users creating bookings)
    const { amenityName, eventDescription, startTime, endTime } = req.body;
    const userId = req.user.id; 

    if (!amenityName || !startTime || !endTime) {
        return res.status(400).json({ message: 'Amenity name, start time, and end time are required' });
    }
    // ... (rest of validation and conflict check code)
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
         return res.status(400).json({ message: 'Invalid date/time format' });
    }
    if (start >= end) {
        return res.status(400).json({ message: 'End time must be after start time' });
    }
    if (start < new Date()) {
         return res.status(400).json({ message: 'Booking start time cannot be in the past' });
    }

    try {
        const existingBooking = await Booking.findOne({
            amenityName: amenityName,
            status: { $in: ['Pending', 'Approved'] }, 
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } },
            ]
        });

        if (existingBooking) {
            return res.status(409).json({
                 message: `Time slot conflict detected.`,
                 //...
            });
        }

        const newBooking = new Booking({
            amenityName,
            bookedBy: userId,
            eventDescription,
            startTime: start,
            endTime: end,
            status: 'Pending'
        });

        await newBooking.save();
        const populatedBooking = await Booking.findById(newBooking._id)
                                             .populate('bookedBy', 'name userId');
        res.status(201).json(populatedBooking);

    } catch (err) {
        console.error('Error creating booking:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error creating booking' });
    }
});


// -----------------------------------------------------------------
// --- 2. ADD ADMIN ROUTES ---
// -----------------------------------------------------------------

// @route   GET /api/bookings/all
// @desc    Admin gets all bookings from all users
// @access  Private (Admin Only)
router.get('/all', adminAuth, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('bookedBy', 'name userId') // Get user info
            .sort({ startTime: -1 }); // Show newest first
        res.json(bookings);
    } catch (err) {
        console.error('Error fetching all bookings:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/bookings/:id/status
// @desc    Admin updates a booking's status
// @access  Private (Admin Only)
router.put('/:id/status', adminAuth, async (req, res) => {
    const { status } = req.body;
    const bookingId = req.params.id;

    // Validate status
    if (!['Pending', 'Approved', 'Rejected', 'Cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
    }

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        booking.status = status;
        await booking.save();
        
        // Re-populate user info for the response so frontend can update
        const updatedBooking = await Booking.findById(bookingId)
                                            .populate('bookedBy', 'name userId');

        res.json(updatedBooking);
    } catch (err) {
        console.error(`Error updating booking ${bookingId}:`, err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;