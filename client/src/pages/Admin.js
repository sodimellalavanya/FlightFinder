import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TABS = ['Overview', 'Flights', 'Bookings', 'Users'];

const emptyFlight = {
  flightNumber: '', airline: '', from: '', to: '',
  departureTime: '', arrivalTime: '', date: '', duration: '',
  'price.economy': '', 'price.business': '',
  'totalSeats.economy': 100, 'totalSeats.business': 20,
  stops: 'Direct',
};

export default function Admin() {
  const [tab,      setTab]      = useState('Overview');
  const [stats,    setStats]    = useState({});
  const [flights,  setFlights]  = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(false);

  // Flight form state
  const [flightForm, setFlightForm] = useState(emptyFlight);
  const [editId,     setEditId]     = useState(null);
  const [showForm,   setShowForm]   = useState(false);
  const [formMsg,    setFormMsg]    = useState('');

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, f, b, u] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/flights/all'),
        axios.get('/api/admin/bookings'),
        axios.get('/api/admin/users'),
      ]);
      setStats(s.data); setFlights(f.data); setBookings(b.data); setUsers(u.data);
    } catch { /* handled */ } finally { setLoading(false); }
  };

  const handleFlightSubmit = async (e) => {
    e.preventDefault();
    setFormMsg('');
    const payload = {
      flightNumber: flightForm.flightNumber,
      airline:      flightForm.airline,
      from:         flightForm.from,
      to:           flightForm.to,
      departureTime: flightForm.departureTime,
      arrivalTime:  flightForm.arrivalTime,
      date:         flightForm.date,
      duration:     flightForm.duration,
      stops:        flightForm.stops,
      price:        { economy: Number(flightForm['price.economy']), business: Number(flightForm['price.business']) },
      totalSeats:   { economy: Number(flightForm['totalSeats.economy']), business: Number(flightForm['totalSeats.business']) },
      availableSeats: { economy: Number(flightForm['totalSeats.economy']), business: Number(flightForm['totalSeats.business']) },
    };
    try {
      if (editId) {
        await axios.put(`/api/flights/${editId}`, payload);
        setFormMsg('Flight updated!');
      } else {
        await axios.post('/api/flights', payload);
        setFormMsg('Flight added!');
      }
      setFlightForm(emptyFlight); setEditId(null); setShowForm(false);
      loadAll();
    } catch (err) {
      setFormMsg(err.response?.data?.message || 'Error saving flight.');
    }
  };

  const startEdit = (f) => {
    setFlightForm({
      flightNumber: f.flightNumber, airline: f.airline, from: f.from, to: f.to,
      departureTime: f.departureTime, arrivalTime: f.arrivalTime, date: f.date,
      duration: f.duration, stops: f.stops,
      'price.economy': f.price.economy, 'price.business': f.price.business,
      'totalSeats.economy': f.totalSeats.economy, 'totalSeats.business': f.totalSeats.business,
    });
    setEditId(f._id); setShowForm(true); setFormMsg('');
  };

  const deleteFlight = async (id) => {
    if (!window.confirm('Delete this flight?')) return;
    await axios.delete(`/api/flights/${id}`);
    loadAll();
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await axios.delete(`/api/admin/users/${id}`);
    loadAll();
  };

  const ff = (key, label, type = 'text', opts = {}) => (
    <div className="col-md-4 mb-3" key={key}>
      <label className="form-label fw-semibold small">{label}</label>
      {opts.options ? (
        <select className="form-select ff-input" value={flightForm[key]}
          onChange={(e) => setFlightForm({ ...flightForm, [key]: e.target.value })}>
          {opts.options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} className="form-control ff-input" value={flightForm[key]} required
          onChange={(e) => setFlightForm({ ...flightForm, [key]: e.target.value })} />
      )}
    </div>
  );

  return (
    <>
      <div className="ff-page-header">
        <div className="container">
          <h4 className="fw-bold">⚙️ Admin Dashboard</h4>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 0 }}>Manage flights, bookings and users</p>
        </div>
      </div>

      <div className="container py-4">
        {/* Tab nav */}
        <ul className="nav nav-pills mb-4 gap-2">
          {TABS.map((t) => (
            <li className="nav-item" key={t}>
              <button
                className={`nav-link ${tab === t ? 'active' : ''}`}
                style={tab === t ? { background: '#0369a1' } : { color: '#0369a1' }}
                onClick={() => setTab(t)}
              >{t}</button>
            </li>
          ))}
        </ul>

        {loading && <div className="text-center py-4"><div className="spinner-border text-primary" /></div>}

        {/* ── Overview ── */}
        {tab === 'Overview' && !loading && (
          <>
            <div className="row g-4 mb-4">
              {[
                { label: 'Total Users',    val: stats.totalUsers,    color: '#0ea5e9', icon: '👥' },
                { label: 'Total Flights',  val: stats.totalFlights,  color: '#f59e0b', icon: '✈️' },
                { label: 'Total Bookings', val: stats.totalBookings, color: '#10b981', icon: '🎫' },
                { label: 'Revenue ($)',    val: `$${(stats.revenue || 0).toLocaleString()}`, color: '#a78bfa', icon: '💰' },
              ].map((s) => (
                <div className="col-md-3 col-6" key={s.label}>
                  <div className="ff-stat-card">
                    <div style={{ fontSize: '2rem' }}>{s.icon}</div>
                    <div className="stat-num mt-2" style={{ color: s.color }}>{s.val}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="alert" style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px' }}>
              <strong>👋 Admin Tips:</strong> Use the tabs above to manage flights, view all bookings, and monitor users.
            </div>
          </>
        )}

        {/* ── Flights ── */}
        {tab === 'Flights' && !loading && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">All Flights ({flights.length})</h6>
              <button className="btn btn-sky btn-sm" onClick={() => { setShowForm(!showForm); setEditId(null); setFlightForm(emptyFlight); }}>
                {showForm ? '✕ Close' : '+ Add Flight'}
              </button>
            </div>

            {/* Flight Form */}
            {showForm && (
              <div className="ff-search-card mb-4" style={{ marginTop: 0 }}>
                <h6 className="fw-bold mb-3">{editId ? '✏️ Edit Flight' : '➕ Add New Flight'}</h6>
                {formMsg && <div className={`alert ${formMsg.includes('!') ? 'alert-success' : 'alert-danger'} py-2 small`}>{formMsg}</div>}
                <form onSubmit={handleFlightSubmit}>
                  <div className="row">
                    {ff('flightNumber', 'Flight Number')}
                    {ff('airline', 'Airline')}
                    {ff('from', 'From (City)')}
                    {ff('to', 'To (City)')}
                    {ff('departureTime', 'Departure Time')}
                    {ff('arrivalTime', 'Arrival Time')}
                    {ff('date', 'Date', 'date')}
                    {ff('duration', 'Duration (e.g. 7h 30m)')}
                    {ff('stops', 'Stops', 'text', { options: ['Direct', '1 Stop', '2 Stops'] })}
                    {ff('price.economy', 'Economy Price ($)', 'number')}
                    {ff('price.business', 'Business Price ($)', 'number')}
                    {ff('totalSeats.economy', 'Economy Seats', 'number')}
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-sky">{editId ? 'Update Flight' : 'Add Flight'}</button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th>Flight</th><th>Route</th><th>Date</th><th>Price (Eco/Biz)</th><th>Seats</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map((f) => (
                    <tr key={f._id}>
                      <td><strong>{f.flightNumber}</strong><div className="text-muted small">{f.airline}</div></td>
                      <td>{f.from} → {f.to}<div className="text-muted small">{f.stops}</div></td>
                      <td>{f.date}</td>
                      <td>${f.price.economy} / ${f.price.business}</td>
                      <td>
                        <span className="badge bg-light text-dark me-1">Eco: {f.availableSeats.economy}</span>
                        <span className="badge bg-light text-dark">Biz: {f.availableSeats.business}</span>
                      </td>
                      <td>
                        <button className="btn btn-outline-primary btn-sm me-1" onClick={() => startEdit(f)}>Edit</button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteFlight(f._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {flights.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-4">No flights yet. Add one!</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── Bookings ── */}
        {tab === 'Bookings' && !loading && (
          <>
            <h6 className="fw-bold mb-3">All Bookings ({bookings.length})</h6>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead style={{ background: '#f8fafc' }}>
                  <tr><th>Ref</th><th>User</th><th>Flight</th><th>Class</th><th>Seats</th><th>Total</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td><span className="ff-booking-ref">{b.bookingRef}</span></td>
                      <td>{b.user?.name}<div className="text-muted small">{b.user?.email}</div></td>
                      <td>{b.flight ? `${b.flight.from} → ${b.flight.to}` : 'N/A'}<div className="text-muted small">{b.flight?.date}</div></td>
                      <td className="text-capitalize">{b.seatClass}</td>
                      <td>{b.seats}</td>
                      <td>${b.totalPrice}</td>
                      <td><span className={`badge ${b.status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled'}`}>{b.status}</span></td>
                    </tr>
                  ))}
                  {bookings.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-4">No bookings yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── Users ── */}
        {tab === 'Users' && !loading && (
          <>
            <h6 className="fw-bold mb-3">All Users ({users.length})</h6>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead style={{ background: '#f8fafc' }}>
                  <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="fw-semibold">{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || '—'}</td>
                      <td><span className={`badge ${u.role === 'admin' ? 'badge-confirmed' : 'badge-paid'}`}>{u.role}</span></td>
                      <td className="text-muted small">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        {u.role !== 'admin' && (
                          <button className="btn btn-outline-danger btn-sm" onClick={() => deleteUser(u._id)}>Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-4">No users found.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
