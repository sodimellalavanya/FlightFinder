const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const { protect } = require('../middleware/auth');

// ─── POST /api/bookings ─── Create booking ────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const { flightId, passengers, seatClass, seats } = req.body;

    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ message: 'Flight not found.' });

    // Check seat availability
    if (flight.availableSeats[seatClass] < seats) {
      return res.status(400).json({
        message: `Only ${flight.availableSeats[seatClass]} ${seatClass} seats available.`,
      });
    }

    const totalPrice = flight.price[seatClass] * seats;

    const booking = await Booking.create({
      user: req.user._id,
      flight: flightId,
      passengers,
      seatClass,
      seats,
      totalPrice,
    });

    // Reduce available seats
    flight.availableSeats[seatClass] -= seats;
    await flight.save();

    const populated = await Booking.findById(booking._id)
      .populate('flight')
      .populate('user', 'name email');

    res.status(201).json({ message: 'Booking confirmed! ✈️', booking: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/bookings/my ─── Get my bookings ─────────────────
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('flight')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PUT /api/bookings/:id/cancel ─── Cancel booking ─────────
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized.' });

    if (booking.status === 'cancelled')
      return res.status(400).json({ message: 'Booking already cancelled.' });

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Restore seats
    const flight = await Flight.findById(booking.flight);
    if (flight) {
      flight.availableSeats[booking.seatClass] += booking.seats;
      await flight.save();
    }

    res.json({ message: 'Booking cancelled. Refund initiated.', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
