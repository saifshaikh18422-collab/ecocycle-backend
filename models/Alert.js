const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  binId: { type: String, required: true },
  severity: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'assigned', 'resolved'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);