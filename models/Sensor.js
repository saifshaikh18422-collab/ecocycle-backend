const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  sensorId: { type: String, required: true, unique: true },
  binId: { type: String, required: true },
  zone: { type: String, required: true },
  status: { type: String, enum: ['online', 'offline', 'warning'], default: 'online' },
  signal: { type: Number, default: 4 },
  fillLevel: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  gasLevel: { type: String, default: 'Normal' },
  battery: { type: Number, default: 100 },
  lastPingMinutes: { type: Number, default: 0 },
  firmwareVersion: { type: String, default: 'v2.4.1' }
}, { timestamps: true });

module.exports = mongoose.model('Sensor', sensorSchema);