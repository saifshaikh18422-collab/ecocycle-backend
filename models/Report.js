const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  binId: { type: String },
  location: { type: String, required: true },
  issueType: { type: String, enum: ['overflow', 'damage', 'sensor', 'other'], default: 'overflow' },
  description: { type: String, required: true },
  reporterEmail: { type: String },
  reporterUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'in-progress', 'resolved'], default: 'pending' },
  referenceId: { type: String, required: true, unique: true },
  photoUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);