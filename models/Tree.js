const mongoose = require('mongoose');
const { SPECIES } = require('../utils/treeCare');

const treeSchema = new mongoose.Schema({
  seq: { type: Number, required: true, unique: true },            // 101, 102, ...
  plantationId: { type: String, required: true, unique: true },   // TREE-101
  species: { type: String, enum: Object.keys(SPECIES), required: true },
  qty: { type: Number, required: true, min: 1, max: 100 },
  zone: { type: String, required: true, trim: true, maxlength: 120 },
  planter: { type: String, required: true, trim: true, maxlength: 80 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  plantedAt: { type: Date, default: Date.now },

  // last stored readings — the API projects these forward (see utils/treeCare.js)
  baseMoisture: { type: Number, default: 85, min: 0, max: 100 },
  baseHealth: { type: Number, default: 92, min: 0, max: 100 },
  measuredAt: { type: Date, default: Date.now },
  wateredAt: { type: Date, default: Date.now },
  readingSource: { type: String, enum: ['registration', 'water', 'sensor', 'seed'], default: 'registration' }
}, { timestamps: true });

module.exports = mongoose.model('Tree', treeSchema);
