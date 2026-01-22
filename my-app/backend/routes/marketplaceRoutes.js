import express from 'express';
import mongoose from 'mongoose';
import protect from '../middleware/auth.js';
import MarketplaceItem from '../models/MarketplaceItem.js';

const router = express.Router();

/* 
=========================================
  POST /api/marketplace
  @desc   Create a new marketplace item
  @access Private
=========================================
*/
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, price, category, condition, imageUrl } = req.body;

    const newItem = new MarketplaceItem({
      title,
      description,
      price,
      category,
      condition,
      imageUrl: imageUrl || '',
      seller: req.user.id, // Authenticated user becomes seller
      status: 'Available', // Default status
    });

    const createdItem = await newItem.save();
    res.status(201).json(createdItem);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

/* 
=========================================
  GET /api/marketplace
  @desc   Get all available marketplace items
  @access Private
=========================================
*/
router.get('/', protect, async (req, res) => {
  try {
    const items = await MarketplaceItem.find({ status: 'Available' })
      .populate('seller', 'name userId')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* 
=========================================
  GET /api/marketplace/my-listings
  @desc   Get all items listed by the logged-in user
  @access Private
=========================================
*/
// ⚠️ This must come BEFORE '/:id' route
router.get('/my-listings', protect, async (req, res) => {
  try {
    const items = await MarketplaceItem.find({ seller: req.user.id })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* 
=========================================
  GET /api/marketplace/:id
  @desc   Get a single marketplace item by ID
  @access Private
=========================================
*/
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid item ID format' });
    }

    const item = await MarketplaceItem.findById(id)
      .populate('seller', 'name userId email');

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* 
=========================================
  PUT /api/marketplace/:id
  @desc   Update a marketplace item (e.g., mark as sold)
  @access Private (Seller only)
=========================================
*/
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid item ID format' });
    }

    const { title, description, price, category, condition, imageUrl, status } = req.body;

    let item = await MarketplaceItem.findById(id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Ensure the logged-in user is the seller
    if (item.seller.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update only provided fields
    if (title) item.title = title;
    if (description) item.description = description;
    if (price) item.price = price;
    if (category) item.category = category;
    if (condition) item.condition = condition;
    if (imageUrl) item.imageUrl = imageUrl;
    if (status) item.status = status;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

/* 
=========================================
  DELETE /api/marketplace/:id
  @desc   Delete a marketplace item
  @access Private (Seller only)
=========================================
*/
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid item ID format' });
    }

    const item = await MarketplaceItem.findById(id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Check if the user deleting is the seller
    if (item.seller.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await item.deleteOne();
    res.json({ msg: 'Item removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
