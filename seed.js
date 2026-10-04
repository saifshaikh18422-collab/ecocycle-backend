const mongoose = require('mongoose');
require('dotenv').config();
const Bin = require('./models/Bin');

const bins = [
  { binId: 'BIN-104', zone: 'Mumbai Community Zone', mapX: 22, mapY: 28, fillLevel: 86, weight: 19.2, temperature: 31, gasLevel: 'Normal', battery: 78, status: 'active' },
  { binId: 'BIN-087', zone: 'Andheri West Sector 3', mapX: 48, mapY: 18, fillLevel: 61, weight: 13.4, temperature: 29, gasLevel: 'Normal', battery: 85, status: 'active' },
  { binId: 'BIN-045', zone: 'Bandra Market Road', mapX: 70, mapY: 32, fillLevel: 32, weight: 7.1, temperature: 27, gasLevel: 'Normal', battery: 94, status: 'active' },
  { binId: 'BIN-019', zone: 'Juhu Beach Promenade', mapX: 30, mapY: 55, fillLevel: 18, weight: 3.8, temperature: 26, gasLevel: 'Normal', battery: 97, status: 'offline' },
  { binId: 'BIN-063', zone: 'Powai Lake Side', mapX: 62, mapY: 58, fillLevel: 55, weight: 12.0, temperature: 28, gasLevel: 'Normal', battery: 81, status: 'active' },
  { binId: 'BIN-021', zone: 'Colaba Causeway', mapX: 12, mapY: 68, fillLevel: 91, weight: 21.6, temperature: 33, gasLevel: 'Normal', battery: 64, status: 'offline' },
  { binId: 'BIN-078', zone: 'Dadar Flower Market', mapX: 82, mapY: 62, fillLevel: 44, weight: 9.9, temperature: 28, gasLevel: 'Normal', battery: 18, status: 'maintenance' },
  { binId: 'BIN-055', zone: 'Worli Sea Face', mapX: 40, mapY: 78, fillLevel: 27, weight: 5.5, temperature: 26, gasLevel: 'Normal', battery: 92, status: 'active' },
  { binId: 'BIN-132', zone: 'Malad Industrial Area', mapX: 58, mapY: 40, fillLevel: 79, weight: 17.8, temperature: 31, gasLevel: 'Elevated', battery: 72, status: 'active' },
  { binId: 'BIN-096', zone: 'Chembur Housing Colony', mapX: 88, mapY: 20, fillLevel: 8, weight: 1.9, temperature: 25, gasLevel: 'Normal', battery: 99, status: 'active' },
  { binId: 'BIN-014', zone: 'Kurla Bus Depot', mapX: 15, mapY: 42, fillLevel: 68, weight: 14.9, temperature: 30, gasLevel: 'Normal', battery: 80, status: 'maintenance' },
  { binId: 'BIN-201', zone: 'Ghatkopar Metro Station', mapX: 74, mapY: 82, fillLevel: 50, weight: 11.2, temperature: 28, gasLevel: 'Normal', battery: 87, status: 'active' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    for (const bin of bins) {
      await Bin.findOneAndUpdate(
        { binId: bin.binId },
        bin,
        { upsert: true, new: true }
      );
      console.log(`Inserted/updated: ${bin.binId}`);
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();