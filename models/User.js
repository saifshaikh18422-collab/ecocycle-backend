const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'collector', 'admin'], default: 'citizen' },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  ecoPoints: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);