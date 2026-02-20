/**
 * FlightFinder - Database Seed Script
 * Run: node seed.js
 * This creates an admin user + sample flights in MongoDB
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
require('dotenv').config();

const User    = require('./models/User');
const Flight  = require('./models/Flight');
const Booking = require('./models/Booking');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/flightfinder';

const flights = [
  {
    flightNumber: 'FF101', airline: 'FlightFinder Air',
    from: 'New York', to: 'London',
    departureTime: '08:00', arrivalTime: '20:00',
    date: '2025-04-10', duration: '7h 00m', stops: 'Direct',
    price: { economy: 499, business: 1200 },
    totalSeats: { economy: 100, business: 20 },
    availableSeats: { economy: 100, business: 20 },
  },
  {
    flightNumber: 'FF202', airline: 'Sky Wings',
    from: 'New York', to: 'Paris',
    departureTime: '10:30', arrivalTime: '23:00',
    date: '2025-04-10', duration: '7h 30m', stops: 'Direct',
    price: { economy: 520, business: 1350 },
    totalSeats: { economy: 120, business: 24 },
    availableSeats: { economy: 120, business: 24 },
  },
  {
    flightNumber: 'FF303', airline: 'Emirates',
    from: 'Dubai', to: 'Singapore',
    departureTime: '02:00', arrivalTime: '14:30',
    date: '2025-04-15', duration: '7h 30m', stops: 'Direct',
    price: { economy: 320, business: 850 },
    totalSeats: { economy: 200, business: 40 },
    availableSeats: { economy: 200, business: 40 },
  },
  {
    flightNumber: 'FF404', airline: 'IndiGo',
    from: 'Mumbai', to: 'Delhi',
    departureTime: '06:00', arrivalTime: '08:00',
    date: '2025-04-12', duration: '2h 00m', stops: 'Direct',
    price: { economy: 80, business: 200 },
    totalSeats: { economy: 180, business: 20 },
    availableSeats: { economy: 180, business: 20 },
  },
  {
    flightNumber: 'FF505', airline: 'British Airways',
    from: 'London', to: 'New York',
    departureTime: '14:00', arrivalTime: '17:00',
    date: '2025-04-20', duration: '8h 00m', stops: 'Direct',
    price: { economy: 580, business: 1500 },
    totalSeats: { economy: 150, business: 30 },
    availableSeats: { economy: 150, business: 30 },
  },
  {
    flightNumber: 'FF606', airline: 'Air France',
    from: 'Paris', to: 'Tokyo',
    departureTime: '11:00', arrivalTime: '06:30',
    date: '2025-04-18', duration: '11h 30m', stops: '1 Stop',
    price: { economy: 750, business: 2100 },
    totalSeats: { economy: 160, business: 28 },
    availableSeats: { economy: 160, business: 28 },
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Flight.deleteMany({});
    await Booking.deleteMany({});
    console.log('🗑️  Cleared existing flights and bookings');

    // Create admin user (if not exists)
    let admin = await User.findOne({ email: 'admin@ff.com' });
    if (!admin) {
      const hashed = await bcrypt.hash('admin123', 10);
      admin = await User.create({
        name: 'Admin', email: 'admin@ff.com',
        password: hashed, role: 'admin',
      });
      console.log('👑 Admin created: admin@ff.com / admin123');
    } else {
      console.log('👑 Admin already exists: admin@ff.com');
    }

    // Seed flights
    await Flight.insertMany(flights);
    console.log(`✈️  ${flights.length} flights seeded!`);

    console.log('\n🎉 Seed complete! You can now start the server.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
