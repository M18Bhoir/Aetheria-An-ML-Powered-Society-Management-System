import mongoose from 'mongoose';

const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  body: {
    type: String,
    required: [true, 'Please provide a body text'],
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index to get newest notices first
NoticeSchema.index({ createdAt: -1 });

const Notice = mongoose.model('Notice', NoticeSchema);
export default Notice;