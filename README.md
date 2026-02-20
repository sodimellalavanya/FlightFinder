# ✈️ FlightFinder — MERN Stack Flight Booking App

A full-stack flight booking application built with **MongoDB, Express.js, React.js, Node.js**.

---

## 📋 Features

### 👤 User Features
- Register & Login (JWT Authentication)
- Search flights by From, To, Date, Class
- View flight details (price, airline, stops, seats)
- Book a flight (with passenger details)
- View all personal bookings
- Cancel a booking (auto-refund)

### ⚙️ Admin Features
- Admin Dashboard with stats (users, flights, revenue)
- Add / Edit / Delete flights
- View all bookings across all users
- View and delete users

---

## 🛠️ Tech Stack

| Layer    | Technology          |
|----------|---------------------|
| Frontend | React.js, Bootstrap |
| Backend  | Node.js, Express.js |
| Database | MongoDB, Mongoose   |
| Auth     | JWT, bcryptjs       |

---

## 🚀 How to Run (Step by Step)

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally) OR use MongoDB Atlas

---

### Step 1 — Clone / Download the Project

If using Git:
```bash
git clone <your-repo-url>
cd FlightFinder
```

Or just unzip the folder you downloaded.

---

### Step 2 — Install All Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

---

### Step 3 — Configure Environment

Open `server/.env` and update if needed:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/flightfinder
JWT_SECRET=flightfinder_super_secret_key_2024
```

> If using MongoDB Atlas, replace MONGO_URI with your Atlas connection string.

---

### Step 4 — Seed the Database

This creates sample flights + an admin account:
```bash
cd server
node seed.js
cd ..
```

You will see:
```
✅ Connected to MongoDB
✈️  6 flights seeded!
👑 Admin created: admin@ff.com / admin123
🎉 Seed complete!
```

---

### Step 5 — Start the Application

Open **two terminals**:

**Terminal 1 — Start Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 — Start Frontend:**
```bash
cd client
npm start
# App opens on http://localhost:3000
```

---

### Step 6 — Open the App

Go to: **http://localhost:3000**

---

## 🔑 Login Credentials

| Role  | Email          | Password |
|-------|----------------|----------|
| Admin | admin@ff.com   | admin123 |
| User  | Register a new account via /register |

---

## 📁 Project Structure

```
FlightFinder/
├── package.json              ← Root scripts
├── server/                   ← Backend (Node.js + Express)
│   ├── index.js              ← Server entry point
│   ├── seed.js               ← Database seeder
│   ├── .env                  ← Environment variables
│   ├── models/
│   │   ├── User.js           ← User schema
│   │   ├── Flight.js         ← Flight schema
│   │   └── Booking.js        ← Booking schema
│   ├── routes/
│   │   ├── auth.js           ← /api/auth (register, login)
│   │   ├── flights.js        ← /api/flights (CRUD)
│   │   ├── bookings.js       ← /api/bookings (book, cancel)
│   │   └── admin.js          ← /api/admin (dashboard)
│   └── middleware/
│       └── auth.js           ← JWT protect + adminOnly
└── client/                   ← Frontend (React.js)
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js            ← Routes + providers
        ├── App.css           ← Global styles
        ├── index.js          ← Entry point
        ├── context/
        │   └── AuthContext.js ← Global auth state
        ├── components/
        │   └── Navbar.js     ← Navigation bar
        └── pages/
            ├── Home.js       ← Landing + search
            ├── Login.js      ← Login form
            ├── Register.js   ← Register form
            ├── Search.js     ← Search + book modal
            ├── Bookings.js   ← My bookings + cancel
            └── Admin.js      ← Admin dashboard
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint           | Description     |
|--------|--------------------|-----------------|
| POST   | /api/auth/register | Register user   |
| POST   | /api/auth/login    | Login user      |

### Flights
| Method | Endpoint           | Auth     | Description        |
|--------|--------------------|----------|--------------------|
| GET    | /api/flights       | Public   | Search flights     |
| GET    | /api/flights/all   | Admin    | All flights        |
| POST   | /api/flights       | Admin    | Add flight         |
| PUT    | /api/flights/:id   | Admin    | Update flight      |
| DELETE | /api/flights/:id   | Admin    | Delete flight      |

### Bookings
| Method | Endpoint                   | Auth  | Description     |
|--------|----------------------------|-------|-----------------|
| POST   | /api/bookings              | User  | Create booking  |
| GET    | /api/bookings/my           | User  | My bookings     |
| PUT    | /api/bookings/:id/cancel   | User  | Cancel booking  |

### Admin
| Method | Endpoint             | Auth  | Description     |
|--------|----------------------|-------|-----------------|
| GET    | /api/admin/stats     | Admin | Dashboard stats |
| GET    | /api/admin/bookings  | Admin | All bookings    |
| GET    | /api/admin/users     | Admin | All users       |
| DELETE | /api/admin/users/:id | Admin | Delete user     |

---

## ⚠️ Troubleshooting

**MongoDB not connecting?**
- Make sure MongoDB is running: `mongod` in terminal (Mac/Linux) or start MongoDB service (Windows)
- Or use MongoDB Atlas and update MONGO_URI in `.env`

**Port already in use?**
- Change PORT in `server/.env`
- For React: set PORT=3001 before `npm start`

**npm install fails?**
- Make sure Node.js v16+ is installed: `node --version`
- Try deleting `node_modules` and running `npm install` again

---

Built with ❤️ using the MERN stack.
