const mongoose = require('mongoose');
require('dotenv').config();
const Alert = require('./models/Alert');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Alert.deleteMany({});
    console.log('Cleared old alerts');

    const alerts = [
      { binId: 'BIN-104', severity: 'high', title: 'Overflow imminent', message: 'Fill level at 86% and rising' },
      { binId: 'BIN-021', severity: 'medium', title: 'Sensor offline', message: 'No data received for 40 minutes' },
      { binId: 'BIN-078', severity: 'medium', title: 'Battery low (18%)', message: 'Schedule maintenance visit' },
      { binId: 'BIN-132', severity: 'high', title: 'Overflow imminent', message: 'Fill level at 79% and rising' },
      { binId: 'BIN-014', severity: 'low', title: 'Gas level abnormal', message: 'Reading above normal threshold' }
    ];

    for (const a of alerts) {
      await Alert.create(a);
      console.log(`Created alert: ${a.binId} — ${a.title}`);
    }

    console.log('🎉 Alert seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();