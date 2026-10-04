const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  binId: { type: String, required: true },
  zone: { type: String, required: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  fillLevel: { type: Number, default: 0 },
  distance: { type: Number, default: 0 },
  eta: { type: String },
  status: { type: String, enum: ['pending', 'collected'], default: 'pending' }
}, { _id: false });

const routeSchema = new mongoose.Schema({
  collectorName: { type: String, required: true },
  routeName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['assigned', 'in-progress', 'completed', 'partial'], default: 'assigned' },
  totalDistance: { type: Number, default: 0 },
  totalDuration: { type: String, default: '' },
  stopsCompleted: { type: Number, default: 0 },
  stopsTotal: { type: Number, default: 0 },
  stops: [stopSchema]
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);