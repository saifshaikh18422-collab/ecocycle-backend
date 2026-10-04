const mongoose = require('mongoose');
require('dotenv').config();
const Sensor = require('./models/Sensor');

const sensors = [
  { sensorId: 'SNS-104', binId: 'BIN-104', zone: 'Mumbai Community Zone', status: 'online', signal: 4, fillLevel: 86, weight: 19.2, gasLevel: 'Normal', battery: 78, lastPingMinutes: 0 },
  { sensorId: 'SNS-087', binId: 'BIN-087', zone: 'Andheri West Sector 3', status: 'online', signal: 3, fillLevel: 61, weight: 13.4, gasLevel: 'Normal', battery: 85, lastPingMinutes: 2 },
  { sensorId: 'SNS-045', binId: 'BIN-045', zone: 'Bandra Market Road', status: 'online', signal: 4, fillLevel: 32, weight: 7.1, gasLevel: 'Normal', battery: 94, lastPingMinutes: 1 },
  { sensorId: 'SNS-019', binId: 'BIN-019', zone: 'Juhu Beach Promenade', status: 'offline', signal: 0, fillLevel: 18, weight: 3.8, gasLevel: 'Normal', battery: 97, lastPingMinutes: 48 },
  { sensorId: 'SNS-063', binId: 'BIN-063', zone: 'Powai Lake Side', status: 'online', signal: 2, fillLevel: 55, weight: 12.0, gasLevel: 'Normal', battery: 81, lastPingMinutes: 3 },
  { sensorId: 'SNS-021', binId: 'BIN-021', zone: 'Colaba Causeway', status: 'offline', signal: 0, fillLevel: 91, weight: 21.6, gasLevel: 'Normal', battery: 64, lastPingMinutes: 40 },
  { sensorId: 'SNS-078', binId: 'BIN-078', zone: 'Dadar Flower Market', status: 'warning', signal: 3, fillLevel: 44, weight: 9.9, gasLevel: 'Normal', battery: 18, lastPingMinutes: 1 },
  { sensorId: 'SNS-055', binId: 'BIN-055', zone: 'Worli Sea Face', status: 'online', signal: 4, fillLevel: 27, weight: 5.5, gasLevel: 'Normal', battery: 92, lastPingMinutes: 0 },
  { sensorId: 'SNS-132', binId: 'BIN-132', zone: 'Malad Industrial Area', status: 'online', signal: 2, fillLevel: 79, weight: 17.8, gasLevel: 'Elevated', battery: 72, lastPingMinutes: 2 },
  { sensorId: 'SNS-096', binId: 'BIN-096', zone: 'Chembur Housing Colony', status: 'online', signal: 4, fillLevel: 8, weight: 1.9, gasLevel: 'Normal', battery: 99, lastPingMinutes: 1 },
  { sensorId: 'SNS-014', binId: 'BIN-014', zone: 'Kurla Bus Depot', status: 'warning', signal: 1, fillLevel: 68, weight: 14.9, gasLevel: 'Normal', battery: 12, lastPingMinutes: 5 },
  { sensorId: 'SNS-201', binId: 'BIN-201', zone: 'Ghatkopar Metro Station', status: 'online', signal: 3, fillLevel: 50, weight: 11.2, gasLevel: 'Normal', battery: 87, lastPingMinutes: 2 },
  { sensorId: 'SNS-033', binId: 'BIN-033', zone: 'Vikhroli Tech Park', status: 'offline', signal: 0, fillLevel: 0, weight: 0, gasLevel: 'Normal', battery: 55, lastPingMinutes: 120 },
  { sensorId: 'SNS-142', binId: 'BIN-142', zone: 'Goregaon Film City', status: 'online', signal: 4, fillLevel: 35, weight: 8.0, gasLevel: 'Normal', battery: 90, lastPingMinutes: 0 },
  { sensorId: 'SNS-076', binId: 'BIN-076', zone: 'Sion Circle', status: 'warning', signal: 2, fillLevel: 60, weight: 13.1, gasLevel: 'Normal', battery: 15, lastPingMinutes: 4 }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    for (const sensor of sensors) {
      await Sensor.findOneAndUpdate(
        { sensorId: sensor.sensorId },
        sensor,
        { upsert: true, new: true }
      );
      console.log(`Inserted/updated: ${sensor.sensorId}`);
    }

    console.log('🎉 Sensor seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();