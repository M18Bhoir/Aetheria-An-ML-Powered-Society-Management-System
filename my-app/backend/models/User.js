import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please provide a name'], 
    trim: true 
  },
  userId: { 
    type: String, 
    required: [true, 'Please provide a userId'], 
    unique: true, 
    trim: true 
  },
  // Add email, which is required for the seeder
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ]
  },
  password: { 
    type: String, 
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // We removed the old 'currentDues' field.
  // Dues are now in a separate collection.

}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10); // Use genSalt for better security
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', UserSchema);
export default User;