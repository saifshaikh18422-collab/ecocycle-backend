const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const binRoutes = require('./routes/bins');
const reportRoutes = require('./routes/reports');
const sensorRoutes = require('./routes/sensors');
const routeRoutes = require('./routes/routes');
const alertRoutes = require('./routes/alerts');
const userRoutes = require('./routes/users');
const statsRoutes = require('./routes/stats');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('EcoCycle backend is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/bins', binRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));