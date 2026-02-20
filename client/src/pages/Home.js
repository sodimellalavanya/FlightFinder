import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroBg from '../assets/hero-bg.png';

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [returnJourney, setReturnJourney] = useState(false);
  const [form, setForm] = useState({
    from: '', to: '', date: '', returnDate: '', seatClass: 'economy',
  });

  const cities = [
    'New York', 'London', 'Paris', 'Dubai', 'Singapore',
    'Mumbai', 'Delhi', 'Tokyo', 'Sydney', 'Toronto',
    'Los Angeles', 'Frankfurt', 'Amsterdam', 'Bangkok', 'Istanbul','Benguluru', 'Hong Kong', 'Barcelona', 'Rome', 'Moscow','Shimla', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Jaipur', 'Lucknow', 'Ahmedabad', 'Goa', 'Cochin', 'Vishakhapatnam', 'Thiruvananthapuram', 'Indore', 'Bhopal', 'Nagpur', 'Patna',
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ from: form.from, to: form.to, date: form.date, seatClass: form.seatClass }).toString();
    navigate(`/search?${params}`);
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Navbar */}
      <nav style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 48px',
        background: 'rgba(15, 55, 110, 0.55)',
        backdropFilter: 'blur(12px)',
        borderBottom: 'none',
      }}>
        <div style={{ color: 'white', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.3px' }}>
          ✈ FlightFinder
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 500 }}>Home</a>
          {user ? (
            <>
              {user.role !== 'admin' && <a href="/bookings" style={{ color: 'white', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 500 }}>My Bookings</a>}
              {user.role === 'admin' && <a href="/admin" style={{ color: 'white', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 500 }}>Admin</a>}
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Hi, {user.name}</span>
              <button onClick={logout} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '6px 18px', cursor: 'pointer', fontSize: '0.88rem' }}>Logout</button>
            </>
          ) : (
            <>
              <a href="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 500 }}>Login</a>
              <a href="/register" style={{ background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '8px', padding: '7px 20px', fontSize: '0.88rem', fontWeight: 600 }}>Register</a>
            </>
          )}
        </div>
      </nav>

      {/* Hero - with your plane image as background */}
      <div style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        {/* Dark overlay for text readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(5,15,40,0.72) 0%, rgba(5,15,40,0.45) 55%, rgba(5,15,40,0.2) 100%)' }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, padding: '100px 48px 60px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

          {/* Hero Text */}
          <div style={{ maxWidth: '560px', marginBottom: '40px' }}>
            <h1 style={{
              color: 'white',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '20px',
              letterSpacing: '-1px',
              textShadow: '0 2px 24px rgba(0,0,0,0.5)',
            }}>
              Embark on an<br />Extraordinary Flight<br />Booking Adventure!
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.82)',
              fontSize: '0.97rem',
              lineHeight: 1.65,
              maxWidth: '420px',
              fontWeight: 300,
              textShadow: '0 1px 8px rgba(0,0,0,0.4)',
            }}>
              Unleash your travel desires and book extraordinary flight journeys
              that will transport you to unforgettable destinations, igniting
              a sense of adventure like never before.
            </p>
          </div>

          {/* Search Card */}
          <div style={{
            background: 'rgba(255,255,255,0.13)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '28px 32px',
            border: '1px solid rgba(255,255,255,0.25)',
            maxWidth: '740px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          }}>
            {/* Return Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div
                onClick={() => setReturnJourney(!returnJourney)}
                style={{
                  width: '44px', height: '24px',
                  background: returnJourney ? '#2563eb' : 'rgba(255,255,255,0.3)',
                  borderRadius: '99px', cursor: 'pointer',
                  position: 'relative', transition: 'background 0.25s',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                <div style={{
                  position: 'absolute', top: '2px',
                  left: returnJourney ? '22px' : '2px',
                  width: '18px', height: '18px',
                  background: 'white', borderRadius: '50%',
                  transition: 'left 0.25s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }} />
              </div>
              <span style={{ color: 'white', fontSize: '0.88rem', fontWeight: 500 }}>Return journey</span>
            </div>

            <form onSubmit={handleSearch}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>

                {/* Departure */}
                <div style={{ flex: '1', minWidth: '150px' }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', marginBottom: '6px', fontWeight: 500 }}>Departure City</label>
                  <select value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} required
                    style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '10px', fontSize: '0.9rem', color: form.from ? '#1e293b' : '#94a3b8', cursor: 'pointer', outline: 'none' }}>
                    <option value="">Select</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Destination */}
                <div style={{ flex: '1', minWidth: '150px' }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', marginBottom: '6px', fontWeight: 500 }}>Destination City</label>
                  <select value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} required
                    style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '10px', fontSize: '0.9rem', color: form.to ? '#1e293b' : '#94a3b8', cursor: 'pointer', outline: 'none' }}>
                    <option value="">Select</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Journey Date */}
                <div style={{ flex: '1', minWidth: '140px' }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', marginBottom: '6px', fontWeight: 500 }}>Journey date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '10px', fontSize: '0.9rem', color: '#1e293b', outline: 'none' }} />
                </div>

                {/* Return Date (conditional) */}
                {returnJourney && (
                  <div style={{ flex: '1', minWidth: '140px' }}>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', marginBottom: '6px', fontWeight: 500 }}>Return date</label>
                    <input type="date" value={form.returnDate} onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                      min={form.date || new Date().toISOString().split('T')[0]}
                      style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '10px', fontSize: '0.9rem', color: '#1e293b', outline: 'none' }} />
                  </div>
                )}

                {/* Search Button */}
                <div>
                  <button type="submit" style={{
                    background: '#2563eb', color: 'white', border: 'none',
                    borderRadius: '10px', padding: '11px 28px',
                    fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(37,99,235,0.5)',
                    whiteSpace: 'nowrap',
                  }}>Search</button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ background: '#f8fafc', padding: '72px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '2rem', color: '#0f172a', marginBottom: '8px' }}>Why Choose FlightFinder?</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '48px' }}>Everything you need for a perfect journey</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { icon: '🛡️', title: 'Safe & Secure', desc: 'Bank-grade security protects your data and payments.' },
              { icon: '💸', title: 'Best Prices', desc: 'We compare hundreds of airlines to find the best deal.' },
              { icon: '🌍', title: 'Global Coverage', desc: 'Flights to 500+ destinations across the world.' },
              { icon: '📱', title: 'Easy Booking', desc: 'Book, manage and cancel flights in a few clicks.' },
            ].map(f => (
              <div key={f.title} style={{ background: 'white', borderRadius: '16px', padding: '28px 24px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '2.4rem', marginBottom: '12px' }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginBottom: '8px' }}>{f.title}</div>
                <div style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Routes */}
      <div style={{ background: 'white', padding: '72px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontWeight: 800, fontSize: '2rem', color: '#0f172a', marginBottom: '8px' }}>🔥 Popular Routes</h2>
          <p style={{ color: '#64748b', marginBottom: '32px' }}>Most booked destinations this month</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { from: 'New York', to: 'London',    price: '$499', flag: '🇬🇧' },
              { from: 'New York', to: 'Paris',     price: '$520', flag: '🇫🇷' },
              { from: 'Dubai',    to: 'Singapore', price: '$320', flag: '🇸🇬' },
              { from: 'Mumbai',   to: 'Delhi',     price: '$80',  flag: '🇮🇳' },
            ].map(r => (
              <div key={r.to} onClick={() => navigate(`/search?from=${r.from}&to=${r.to}`)}
                style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderRadius: '14px', padding: '20px', cursor: 'pointer', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{r.flag}</div>
                <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.95rem' }}>{r.from} → {r.to}</div>
                <div style={{ color: '#2563eb', fontWeight: 800, fontSize: '1.3rem', marginTop: '6px' }}>{r.price}</div>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Starting from</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#0c1a2e', color: 'rgba(255,255,255,0.5)', padding: '28px 48px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.88rem' }}>✈ FlightFinder — Your trusted travel companion · 2025</p>
      </footer>
    </div>
  );
}
