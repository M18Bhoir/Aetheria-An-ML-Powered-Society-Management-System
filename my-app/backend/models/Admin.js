import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AdminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

// Hash password
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
AdminSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
