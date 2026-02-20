const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    flight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flight',
      required: true,
    },
    passengers: [
      {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        passport: { type: String, default: '' },
      },
    ],
    seatClass: {
      type: String,
      enum: ['economy', 'business'],
      required: true,
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    bookingRef: {
      type: String,
      unique: true,
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'refunded'],
      default: 'paid',
    },
  },
  { timestamps: true }
);

// Auto-generate booking reference before saving
bookingSchema.pre('save', function (next) {
  if (!this.bookingRef) {
    this.bookingRef = 'FF' + Date.now().toString().slice(-8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
