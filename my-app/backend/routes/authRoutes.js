import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js'; // Added Admin model import

const router = express.Router();

// @route   POST api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, userId, password } = req.body;
  try {
    let userExists = await User.findOne({ $or: [{ userId }, { email }] });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists with that ID or Email' });
    }
    
    const user = await User.create({ name, email, userId, password });
    
    // Consistency Fix: payload matches protect middleware
    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ 
        token, 
        user: { 
            id: user._id, 
            name: user.name, 
            userId: user.userId, 
            email: user.email 
        } 
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
        return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
  const { userId, password, role } = req.body; // Added role to distinguish Admin/User
  try {
    let account;
    let payload;

    if (role === 'admin') {
      // Find Admin using adminId from Admin Schema
      account = await Admin.findOne({ adminId: userId });
      if (!account) return res.status(400).json({ msg: 'Invalid Admin credentials' });
      
      const isMatch = await account.matchPassword(password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      payload = { admin: { id: account._id } }; // Matches adminAuth middleware
    } else {
      // Standard User Login
      account = await User.findOne({ userId });
      if (!account) return res.status(400).json({ msg: 'Invalid credentials' });

      const isMatch = await account.matchPassword(password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      payload = { user: { id: account._id } }; // Matches protect middleware
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
        token, 
        role,
        user: { 
            id: account._id, 
            name: account.name || 'Admin', 
            userId: role === 'admin' ? account.adminId : account.userId,
            email: account.email || ''
        } 
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;