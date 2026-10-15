const express = require('express');
const Tree = require('../models/Tree');
const { verifyToken, requireRole, optionalAuth } = require('../middleware/authMiddleware');
const { SPECIES, clamp, project, toClient } = require('../utils/treeCare');

const router = express.Router();

async function nextSeq() {
  const last = await Tree.findOne().sort({ seq: -1 }).select('seq');
  return last ? last.seq + 1 : 101;
}

// LIST all plantations (public) — moisture/health are projected to "now"
router.get('/', async (req, res) => {
  try {
    const trees = await Tree.find().sort({ createdAt: -1 }).limit(500);
    res.json(trees.map(t => toClient(t)));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// REGISTER a plantation (public; linked to the account if a valid token is sent)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const species = String(req.body.species || '');
    const zone = String(req.body.zone || '').trim();
    const planter = String(req.body.planter || '').trim();
    const qty = Number(req.body.qty);

    if (!SPECIES[species]) return res.status(400).json({ message: 'Unknown tree species' });
    if (!planter) return res.status(400).json({ message: 'Planter name is required' });
    if (!zone) return res.status(400).json({ message: 'Location is required' });
    if (!Number.isInteger(qty) || qty < 1 || qty > 100) {
      return res.status(400).json({ message: 'Quantity must be a whole number from 1 to 100' });
    }

    // planting date: default today, never in the future
    let plantedAt = req.body.plantedAt ? new Date(req.body.plantedAt) : new Date();
    if (isNaN(plantedAt.getTime())) plantedAt = new Date();
    if (plantedAt.getTime() > Date.now()) plantedAt = new Date();

    // sequential ID; retry if two people register at the same instant
    for (let attempt = 0; attempt < 5; attempt++) {
      const seq = await nextSeq();
      try {
        const tree = await Tree.create({
          seq,
          plantationId: `TREE-${seq}`,
          species, qty, zone, planter,
          owner: req.user ? req.user.id : undefined,
          plantedAt,
          readingSource: 'registration'
        });
        return res.status(201).json(toClient(tree));
      } catch (err) {
        if (err && err.code === 11000) continue; // duplicate id → try the next number
        if (err && err.name === 'ValidationError') return res.status(400).json({ message: err.message });
        throw err;
      }
    }
    res.status(409).json({ message: 'Could not allocate an ID, please try again' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// WATER a plantation — restores soil moisture (public: volunteers don't need an account)
router.put('/:plantationId/water', async (req, res) => {
  try {
    const tree = await Tree.findOne({ plantationId: req.params.plantationId });
    if (!tree) return res.status(404).json({ message: 'Plantation not found' });

    const now = Date.now();
    const cur = project(tree, now);
    tree.baseMoisture = clamp(cur.moisture + 45, 0, 100);
    tree.baseHealth = clamp(cur.health + 3, 0, 98);
    tree.measuredAt = new Date(now);
    tree.wateredAt = new Date(now);
    tree.readingSource = 'water';
    await tree.save();

    res.json(toClient(tree, now));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// SENSOR / INSPECTION reading — staff only. Body: { moisture?: 0-100, health?: 0-100 }
router.put('/:plantationId/reading', verifyToken, requireRole('admin', 'collector'), async (req, res) => {
  try {
    const tree = await Tree.findOne({ plantationId: req.params.plantationId });
    if (!tree) return res.status(404).json({ message: 'Plantation not found' });

    const hasM = req.body.moisture !== undefined;
    const hasH = req.body.health !== undefined;
    if (!hasM && !hasH) return res.status(400).json({ message: 'Send moisture and/or health' });

    const m = Number(req.body.moisture), h = Number(req.body.health);
    if ((hasM && !(m >= 0 && m <= 100)) || (hasH && !(h >= 0 && h <= 100))) {
      return res.status(400).json({ message: 'Values must be numbers from 0 to 100' });
    }

    const now = Date.now();
    const cur = project(tree, now);
    tree.baseMoisture = hasM ? m : cur.moisture;
    tree.baseHealth = hasH ? h : cur.health;
    tree.measuredAt = new Date(now);
    tree.readingSource = 'sensor';
    await tree.save();

    res.json(toClient(tree, now));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// REMOVE a plantation — the account that registered it, or an admin
router.delete('/:plantationId', verifyToken, async (req, res) => {
  try {
    const tree = await Tree.findOne({ plantationId: req.params.plantationId });
    if (!tree) return res.status(404).json({ message: 'Plantation not found' });

    const isOwner = tree.owner && String(tree.owner) === String(req.user.id);
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Only the owner or an admin can remove this plantation' });
    }
    await tree.deleteOne();
    res.json({ message: 'Plantation removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
