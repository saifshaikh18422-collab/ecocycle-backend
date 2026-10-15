// Shared care rules for the plantation feature.
// Readings are stored once (baseMoisture / baseHealth at measuredAt) and
// projected forward in time, so values stay realistic without a cron job.

const DAY = 86400000;

// kg CO2 absorbed per mature tree per year (approximate) and ideal watering gap in days
const SPECIES = {
  Neem:     { co2: 22, water: 4 },
  Peepal:   { co2: 30, water: 5 },
  Banyan:   { co2: 35, water: 6 },
  Mango:    { co2: 20, water: 4 },
  Gulmohar: { co2: 18, water: 4 },
  Jamun:    { co2: 24, water: 5 },
  Ashoka:   { co2: 12, water: 3 },
  Arjun:    { co2: 28, water: 5 }
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Set TREE_DECAY_SPEEDUP=60 in .env to make soil dry 60x faster (useful for a live demo).
function speedup() {
  const n = Number(process.env.TREE_DECAY_SPEEDUP);
  return n > 0 ? n : 1;
}

// Moisture and health "right now", projected from the last stored reading.
function project(tree, now = Date.now()) {
  const info = SPECIES[tree.species] || { water: 4 };
  const days = Math.max(0, (now - new Date(tree.measuredAt).getTime()) / DAY) * speedup();
  const rate = 55 / info.water; // % moisture lost per day

  const moisture = clamp(tree.baseMoisture - days * rate, 5, 100);

  // time spent below the 25% "stress" line hurts health
  const daysUntilStress = Math.max(0, (tree.baseMoisture - 25) / rate);
  const stressDays = Math.max(0, days - daysUntilStress);
  const health = clamp(tree.baseHealth - stressDays * 6, 20, 100);

  return { moisture, health };
}

// Shape sent to the browser.
function toClient(tree, now = Date.now()) {
  const { moisture, health } = project(tree, now);
  return {
    id: tree.plantationId,
    species: tree.species,
    qty: tree.qty,
    zone: tree.zone,
    planter: tree.planter,
    ownerId: tree.owner ? String(tree.owner) : null,
    plantedAt: new Date(tree.plantedAt).getTime(),
    wateredAt: new Date(tree.wateredAt).getTime(),
    measuredAt: new Date(tree.measuredAt).getTime(),
    moisture: Math.round(moisture * 10) / 10,
    health: Math.round(health * 10) / 10
  };
}

module.exports = { DAY, SPECIES, clamp, project, toClient };
