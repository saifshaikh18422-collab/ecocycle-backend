const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  binId: { type: String, required: true, unique: true },
  zone: { type: String, required: true },
  mapX: { type: Number, default: 50 },
  mapY: { type: Number, default: 50 },
  fillLevel: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  temperature: { type: Number, default: 0 },
  gasLevel: { type: String, default: 'Normal' },
  battery: { type: Number, default: 100 },
  status: { type: String, enum: ['active', 'maintenance', 'offline'], default: 'active' },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Bin', binSchema);