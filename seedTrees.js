const mongoose = require('mongoose');
require('dotenv').config();
const Tree = require('./models/Tree');

const DAY = 86400000;

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Tree.deleteMany({});
    console.log('Cleared old plantations');

    const now = Date.now();
    // [seq, species, qty, zone, planter, daysAgoPlanted, moisture, health, daysAgoWatered]
    const rows = [
      [101, 'Neem',     12, 'Ward A · Community Park', 'Ward A volunteers',   200, 62, 94, 1],
      [102, 'Peepal',    3, 'Riverside Walk',          'Green Club',          150, 48, 91, 2],
      [103, 'Mango',     6, 'School Campus',           'Eco Club',            120, 27, 78, 5],
      [104, 'Gulmohar',  8, 'Market Road',             'Traders Association',  90, 71, 88, 1],
      [105, 'Banyan',    2, 'Lake Garden',             'Nature Society',       63, 18, 52, 7],
      [106, 'Jamun',     5, 'Housing Society',         'Residents',            42, 55, 86, 2],
      [107, 'Ashoka',   10, 'Hospital Campus',         'Hospital staff',       18, 29, 80, 4],
      [108, 'Arjun',     4, 'Highway Median',          'City team',             5, 83, 96, 0]
    ];

    for (const [seq, species, qty, zone, planter, planted, moisture, health, watered] of rows) {
      await Tree.create({
        seq, plantationId: `TREE-${seq}`, species, qty, zone, planter,
        plantedAt: new Date(now - planted * DAY),
        baseMoisture: moisture, baseHealth: health,
        measuredAt: new Date(now),
        wateredAt: new Date(now - watered * DAY),
        readingSource: 'seed'
      });
      console.log(`Created plantation: TREE-${seq} — ${species} × ${qty}`);
    }

    console.log('🎉 Plantation seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
