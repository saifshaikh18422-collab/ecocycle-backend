const express = require('express');
const Sensor = require('../models/Sensor');

const router = express.Router();

// GET all sensors (optional status filter)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    const sensors = await Sensor.find(filter);
    res.json(sensors);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET one sensor
router.get('/:sensorId', async (req, res) => {
  try {
    const sensor = await Sensor.findOne({ sensorId: req.params.sensorId });
    if (!sensor) return res.status(404).json({ message: 'Sensor not found' });
    res.json(sensor);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// CREATE a sensor
router.post('/', async (req, res) => {
  try {
    const sensor = await Sensor.create(req.body);
    res.status(201).json(sensor);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PING a sensor (resets lastPingMinutes to 0 — simulates a real ping)
router.post('/:sensorId/ping', async (req, res) => {
  try {
    const sensor = await Sensor.findOneAndUpdate(
      { sensorId: req.params.sensorId },
      { lastPingMinutes: 0, status: 'online' },
      { new: true }
    );
    if (!sensor) return res.status(404).json({ message: 'Sensor not found' });
    res.json(sensor);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// RESTART a sensor (simulated — resets status to online)
router.post('/:sensorId/restart', async (req, res) => {
  try {
    const sensor = await Sensor.findOneAndUpdate(
      { sensorId: req.params.sensorId },
      { status: 'online', lastPingMinutes: 0 },
      { new: true }
    );
    if (!sensor) return res.status(404).json({ message: 'Sensor not found' });
    res.json(sensor);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// UPDATE a sensor (general edit)
router.put('/:sensorId', async (req, res) => {
  try {
    const sensor = await Sensor.findOneAndUpdate(
      { sensorId: req.params.sensorId },
      req.body,
      { new: true }
    );
    if (!sensor) return res.status(404).json({ message: 'Sensor not found' });
    res.json(sensor);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;