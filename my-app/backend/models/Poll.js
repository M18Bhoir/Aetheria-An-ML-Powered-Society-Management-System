import mongoose from 'mongoose';

const PollSchema = new mongoose.Schema({
  question: { type: String, required: [true, 'Please provide a question'], trim: true },
  options: [{
    text: { type: String, required: [true, 'Option text is required'] },
    votes: { type: Number, default: 0 }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Poll = mongoose.model('Poll', PollSchema);
export default Poll;
