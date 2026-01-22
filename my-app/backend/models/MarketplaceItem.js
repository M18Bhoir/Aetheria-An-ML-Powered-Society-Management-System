import mongoose from 'mongoose';

const MarketplaceItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the item.'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description.'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price.'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    trim: true,
    // Example categories, adjust as needed
    enum: ['Furniture', 'Electronics', 'Clothing', 'Books', 'Vehicle', 'Other'],
    default: 'Other'
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Used - Good', 'Used - Fair', 'Parts Only'],
    default: 'Used - Good'
  },
  imageUrl: {
    type: String,
    trim: true,
    // --- FIX: REMOVED THE 'match' VALIDATION ---
    // This field is now truly optional and can be an empty string.
    // match: [/^https?:\/\/.+/i, 'Please use a valid URL starting with http:// or https://']
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Reserved'],
    default: 'Available',
  },
  // Optional: Add location hint like wing/floor if relevant
  // locationHint: String,

}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexing for faster searching/filtering (optional)
MarketplaceItemSchema.index({ category: 1, status: 1 });
MarketplaceItemSchema.index({ title: 'text', description: 'text' }); // For text search

const MarketplaceItem = mongoose.model('MarketplaceItem', MarketplaceItemSchema);

export default MarketplaceItem;