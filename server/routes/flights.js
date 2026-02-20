const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const { protect, adminOnly } = require('../middleware/auth');

// ─── GET /api/flights ─── Search flights ─────────────────────
router.get('/', async (req, res) => {
  try {
    const { from, to, date, seatClass } = req.query;
    let query = { status: 'active' };

    if (from) query.from = { $regex: from, $options: 'i' };
    if (to)   query.to   = { $regex: to,   $options: 'i' };
    if (date) query.date = date;

    const flights = await Flight.find(query);
    res.json(flights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/flights/all ─── All flights (admin) ────────────
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const flights = await Flight.find().sort({ createdAt: -1 });
    res.json(flights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/flights/:id ─────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Flight not found.' });
    res.json(flight);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/flights ─── Add flight (admin) ─────────────────
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json({ message: 'Flight added successfully!', flight });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─── PUT /api/flights/:id ─── Update flight (admin) ──────────
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flight) return res.status(404).json({ message: 'Flight not found.' });
    res.json({ message: 'Flight updated!', flight });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─── DELETE /api/flights/:id ─── Delete flight (admin) ───────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Flight.findByIdAndDelete(req.params.id);
    res.json({ message: 'Flight deleted!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
