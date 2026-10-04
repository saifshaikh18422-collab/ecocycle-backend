const express = require('express');
const Route = require('../models/Route');

const router = express.Router();

// GET the active (not completed) route — for route.html
router.get('/active', async (req, res) => {
  try {
    const route = await Route.findOne({ status: { $ne: 'completed' } }).sort({ date: -1 });
    if (!route) return res.status(404).json({ message: 'No active route found' });
    res.json(route);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET all routes (history), optional status filter
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    const routes = await Route.find(filter).sort({ date: -1 });
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// CREATE a new route
router.post('/', async (req, res) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json(route);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// MARK a stop as collected
router.put('/:routeId/stops/:binId/collect', async (req, res) => {
  try {
    const route = await Route.findById(req.params.routeId);
    if (!route) return res.status(404).json({ message: 'Route not found' });

    const stop = route.stops.find(s => s.binId === req.params.binId);
    if (!stop) return res.status(404).json({ message: 'Stop not found' });

    stop.status = 'collected';

    const allCollected = route.stops.every(s => s.status === 'collected');
    if (allCollected) route.status = 'completed';

    await route.save();
    res.json(route);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;