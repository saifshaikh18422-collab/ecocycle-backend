// Sample plantations for demos (used by POST /api/trees/demo-seed).
const DAY = 86400000;

// [seq, species, qty, zone, planter, daysAgoPlanted, moisture, health, daysAgoWatered]
const ROWS = [
  [101, 'Neem',     12, 'Ward A · Community Park', 'Ward A volunteers',   200, 62, 94, 1],
  [102, 'Peepal',    3, 'Riverside Walk',          'Green Club',          150, 48, 91, 2],
  [103, 'Mango',     6, 'School Campus',           'Eco Club',            120, 27, 78, 5],
  [104, 'Gulmohar',  8, 'Market Road',             'Traders Association',  90, 71, 88, 1],
  [105, 'Banyan',    2, 'Lake Garden',             'Nature Society',       63, 18, 52, 7],
  [106, 'Jamun',     5, 'Housing Society',         'Residents',            42, 55, 86, 2],
  [107, 'Ashoka',   10, 'Hospital Campus',         'Hospital staff',       18, 29, 80, 4],
  [108, 'Arjun',     4, 'Highway Median',          'City team',             5, 83, 96, 0]
];

function buildSamples(now = Date.now()) {
  return ROWS.map(([seq, species, qty, zone, planter, planted, moisture, health, watered]) => ({
    seq, plantationId: `TREE-${seq}`, species, qty, zone, planter,
    plantedAt: new Date(now - planted * DAY),
    baseMoisture: moisture, baseHealth: health,
    measuredAt: new Date(now),
    wateredAt: new Date(now - watered * DAY),
    readingSource: 'seed'
  }));
}

module.exports = { buildSamples };
