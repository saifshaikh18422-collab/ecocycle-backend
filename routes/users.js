const express = require('express');
const User = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// GET all users — admin only
router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const filter = {};
    if (req.query.role && req.query.role !== 'all') {
      filter.role = req.query.role;
    }
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// TOGGLE suspend/reactivate — admin only
router.put('/:id/status', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;