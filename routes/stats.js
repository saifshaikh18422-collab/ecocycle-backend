const express = require('express');
const Bin = require('../models/Bin');
const Sensor = require('../models/Sensor');
const Report = require('../models/Report');
const Route = require('../models/Route');
const User = require('../models/User');

const router = express.Router();

// GET dashboard-wide stats (used by admin.html and reports.html)
router.get('/overview', async (req, res) => {
  try {
    const totalBins = await Bin.countDocuments();
    const activeBins = await Bin.countDocuments({ status: 'active' });
    const maintenanceBins = await Bin.countDocuments({ status: 'maintenance' });
    const offlineBins = await Bin.countDocuments({ status: 'offline' });

    const totalSensors = await Sensor.countDocuments();
    const onlineSensors = await Sensor.countDocuments({ status: 'online' });
    const offlineSensors = await Sensor.countDocuments({ status: 'offline' });
    const warningSensors = await Sensor.countDocuments({ status: 'warning' });

    const totalUsers = await User.countDocuments();
    const citizens = await User.countDocuments({ role: 'citizen' });
    const collectors = await User.countDocuments({ role: 'collector' });
    const admins = await User.countDocuments({ role: 'admin' });

    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });

    const bins = await Bin.find();
    const avgFill = bins.length ? Math.round(bins.reduce((sum, b) => sum + b.fillLevel, 0) / bins.length) : 0;

    const routes = await Route.find();
    const completedRoutes = routes.filter(r => r.status === 'completed').length;
    const totalRoutes = routes.length;
    const collectionEfficiency = totalRoutes ? Math.round((completedRoutes / totalRoutes) * 100) : 0;

    res.json({
      bins: { total: totalBins, active: activeBins, maintenance: maintenanceBins, offline: offlineBins, avgFill },
      sensors: { total: totalSensors, online: onlineSensors, offline: offlineSensors, warning: warningSensors },
      users: { total: totalUsers, citizens, collectors, admins },
      reports: { total: totalReports, pending: pendingReports, resolved: resolvedReports },
      collectionEfficiency
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET report breakdown by issue type (for reports.html category chart)
router.get('/reports-by-type', async (req, res) => {
  try {
    const breakdown = await Report.aggregate([
      { $group: { _id: '$issueType', count: { $sum: 1 } } }
    ]);
    res.json(breakdown);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;