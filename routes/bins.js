const express = require('express');
const Bin = require('../models/Bin');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    const bins = await Bin.find(filter).sort({ fillLevel: -1 });
    res.json(bins);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/:binId', async (req, res) => {
  try {
    const bin = await Bin.findOne({ binId: req.params.binId });
    if (!bin) return res.status(404).json({ message: 'Bin not found' });
    res.json(bin);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const bin = await Bin.create(req.body);
    res.status(201).json(bin);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:binId', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const bin = await Bin.findOneAndUpdate(
      { binId: req.params.binId },
      { ...req.body, lastUpdated: Date.now() },
      { new: true }
    );
    if (!bin) return res.status(404).json({ message: 'Bin not found' });
    res.json(bin);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:binId', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const bin = await Bin.findOneAndDelete({ binId: req.params.binId });
    if (!bin) return res.status(404).json({ message: 'Bin not found' });
    res.json({ message: 'Bin deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;