const mongoose = require('mongoose');
require('dotenv').config();
const Route = require('./models/Route');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Route.deleteMany({});
    console.log('Cleared old routes');

    await Route.create({
      collectorName: 'Manoj Chauhan',
      routeName: 'Mumbai Zone Route A',
      status: 'assigned',
      totalDistance: 11.8,
      totalDuration: '1h 20m',
      stopsTotal: 6,
      stopsCompleted: 0,
      stops: [
        { order: 1, binId: 'BIN-104', zone: 'Mumbai Community Zone', priority: 'high', fillLevel: 86, distance: 0, eta: '9:00 AM', status: 'pending' },
        { order: 2, binId: 'BIN-132', zone: 'Malad Industrial Area', priority: 'high', fillLevel: 79, distance: 2.3, eta: '9:15 AM', status: 'pending' },
        { order: 3, binId: 'BIN-078', zone: 'Dadar Flower Market', priority: 'medium', fillLevel: 65, distance: 1.8, eta: '9:32 AM', status: 'pending' },
        { order: 4, binId: 'BIN-014', zone: 'Kurla Bus Depot', priority: 'medium', fillLevel: 58, distance: 3.1, eta: '9:50 AM', status: 'pending' },
        { order: 5, binId: 'BIN-063', zone: 'Powai Lake Side', priority: 'medium', fillLevel: 52, distance: 2.0, eta: '10:05 AM', status: 'pending' },
        { order: 6, binId: 'BIN-201', zone: 'Ghatkopar Metro Station', priority: 'low', fillLevel: 44, distance: 2.6, eta: '10:20 AM', status: 'pending' }
      ]
    });
    console.log('Created active route');

    const history = [
      { collectorName: 'Manoj Chauhan', routeName: 'Andheri West Route B', status: 'completed', totalDistance: 9.4, totalDuration: '1h 05m', stopsTotal: 5, stopsCompleted: 5, date: new Date('2026-09-13') },
      { collectorName: 'Manoj Chauhan', routeName: 'Bandra Route C', status: 'partial', totalDistance: 10.1, totalDuration: '1h 18m', stopsTotal: 6, stopsCompleted: 4, date: new Date('2026-09-12') },
      { collectorName: 'Manoj Chauhan', routeName: 'Juhu Coastal Route', status: 'completed', totalDistance: 8.7, totalDuration: '58m', stopsTotal: 5, stopsCompleted: 5, date: new Date('2026-09-11') },
      { collectorName: 'Manoj Chauhan', routeName: 'Powai Lake Route', status: 'completed', totalDistance: 12.3, totalDuration: '1h 30m', stopsTotal: 6, stopsCompleted: 6, date: new Date('2026-09-10') },
      { collectorName: 'Manoj Chauhan', routeName: 'Colaba Route D', status: 'partial', totalDistance: 7.9, totalDuration: '52m', stopsTotal: 6, stopsCompleted: 3, date: new Date('2026-09-09') }
    ];

    for (const r of history) {
      await Route.create({ ...r, stops: [] });
      console.log(`Created historical route: ${r.routeName}`);
    }

    console.log('🎉 Route seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();