const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    airline: {
      type: String,
      required: true,
      trim: true,
    },
    from: {
      type: String,
      required: true,
      trim: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    arrivalTime: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    price: {
      economy: { type: Number, required: true },
      business: { type: Number, required: true },
    },
    totalSeats: {
      economy: { type: Number, default: 100 },
      business: { type: Number, default: 20 },
    },
    availableSeats: {
      economy: { type: Number, default: 100 },
      business: { type: Number, default: 20 },
    },
    stops: {
      type: String,
      enum: ['Direct', '1 Stop', '2 Stops'],
      default: 'Direct',
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Flight', flightSchema);
