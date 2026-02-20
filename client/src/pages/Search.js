import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    from:      searchParams.get('from')      || '',
    to:        searchParams.get('to')        || '',
    date:      searchParams.get('date')      || '',
    seatClass: searchParams.get('seatClass') || 'economy',
  });
  const [flights,  setFlights]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);

  // Booking modal state
  const [selected,   setSelected]   = useState(null);
  const [showModal,  setShowModal]   = useState(false);
  const [passengers, setPassengers]  = useState([{ name: '', age: '' }]);
  const [booking,    setBooking]     = useState(false);
  const [bookMsg,    setBookMsg]     = useState('');

  // Auto-search if params present
  useEffect(() => {
    if (form.from && form.to) doSearch();
    // eslint-disable-next-line
  }, []);

  const doSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const res = await axios.get('/api/flights', { params: form });
      setFlights(res.data);
    } catch {
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const openBooking = (flight) => {
    if (!user) return navigate('/login');
    setSelected(flight);
    setPassengers([{ name: '', age: '' }]);
    setBookMsg('');
    setShowModal(true);
  };

  const addPassenger = () => setPassengers([...passengers, { name: '', age: '' }]);
  const removePassenger = (i) => setPassengers(passengers.filter((_, idx) => idx !== i));

  const handleBook = async (e) => {
    e.preventDefault();
    setBooking(true);
    setBookMsg('');
    try {
      await axios.post('/api/bookings', {
        flightId: selected._id,
        passengers,
        seatClass: form.seatClass,
        seats: passengers.length,
      });
      setBookMsg('success');
      setTimeout(() => { setShowModal(false); navigate('/bookings'); }, 1500);
    } catch (err) {
      setBookMsg(err.response?.data?.message || 'Booking failed.');
    } finally {
      setBooking(false);
    }
  };

  return (
    <>
      <div className="ff-page-header">
        <div className="container">
          <h4 className="fw-bold">✈️ Search Flights</h4>
        </div>
      </div>

      <div className="container py-4">
        {/* Search Form */}
        <div className="ff-search-card mb-4" style={{ marginTop: 0 }}>
          <form onSubmit={doSearch}>
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label fw-semibold small">From</label>
                <input className="form-control ff-input" placeholder="City or airport"
                  value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold small">To</label>
                <input className="form-control ff-input" placeholder="City or airport"
                  value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} required />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-semibold small">Date</label>
                <input type="date" className="form-control ff-input"
                  value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-semibold small">Class</label>
                <select className="form-select ff-input"
                  value={form.seatClass} onChange={(e) => setForm({ ...form, seatClass: e.target.value })}>
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-sky w-100">Search</button>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-muted">Searching flights…</p>
          </div>
        )}

        {!loading && searched && flights.length === 0 && (
          <div className="text-center py-5">
            <div style={{ fontSize: '4rem' }}>😞</div>
            <h5 className="mt-3">No flights found</h5>
            <p className="text-muted">Try different dates or cities.</p>
          </div>
        )}

        {!loading && flights.map((f) => (
          <div className="ff-flight-card" key={f._id}>
            <div className="row align-items-center">
              <div className="col-md-2">
                <span className="ff-airline-badge">{f.airline}</span>
                <div className="text-muted small mt-1">{f.flightNumber}</div>
                <div className="mt-1">
                  <span className="badge" style={{ background: f.stops === 'Direct' ? '#dcfce7' : '#fef9c3', color: f.stops === 'Direct' ? '#166534' : '#854d0e', fontSize: '0.7rem' }}>
                    {f.stops}
                  </span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-center gap-3">
                  <div>
                    <div className="ff-time">{f.departureTime}</div>
                    <div className="text-muted small">{f.from}</div>
                  </div>
                  <div className="ff-route-line flex-grow-1">
                    <hr /><span>✈</span><hr />
                  </div>
                  <div>
                    <div className="ff-time">{f.arrivalTime}</div>
                    <div className="text-muted small">{f.to}</div>
                  </div>
                </div>
                <div className="text-muted small mt-1">Duration: {f.duration} · {f.date}</div>
              </div>
              <div className="col-md-3">
                <div className="text-muted small">Available ({form.seatClass})</div>
                <div className="fw-semibold">{f.availableSeats[form.seatClass]} seats left</div>
              </div>
              <div className="col-md-3 text-end">
                <div className="ff-price">${f.price[form.seatClass]}</div>
                <div className="text-muted small mb-2">per person</div>
                <button
                  className="btn btn-sky btn-sm px-4"
                  onClick={() => openBooking(f)}
                  disabled={f.availableSeats[form.seatClass] === 0}
                >
                  {f.availableSeats[form.seatClass] === 0 ? 'Full' : 'Book Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showModal && selected && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4">
              <div className="modal-header border-0" style={{ background: 'linear-gradient(135deg,#0c1a2e,#0369a1)' }}>
                <h5 className="modal-title text-white fw-bold">✈️ Book Flight</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body p-4">
                {/* Flight summary */}
                <div className="p-3 rounded-3 mb-4" style={{ background: '#f0f9ff' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{selected.airline}</strong> · {selected.flightNumber}
                      <div className="text-muted small">{selected.from} → {selected.to} · {selected.date}</div>
                      <div className="small">{selected.departureTime} → {selected.arrivalTime}</div>
                    </div>
                    <div className="text-end">
                      <div className="ff-price">${selected.price[form.seatClass]}</div>
                      <div className="text-muted small">{form.seatClass} / person</div>
                    </div>
                  </div>
                </div>

                {bookMsg === 'success' && (
                  <div className="alert alert-success">🎉 Booking confirmed! Redirecting…</div>
                )}
                {bookMsg && bookMsg !== 'success' && (
                  <div className="alert alert-danger">{bookMsg}</div>
                )}

                <form onSubmit={handleBook}>
                  <h6 className="fw-bold mb-3">Passenger Details</h6>
                  {passengers.map((p, i) => (
                    <div key={i} className="row g-2 mb-3 align-items-center">
                      <div className="col-auto">
                        <span className="badge bg-primary rounded-circle" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                      </div>
                      <div className="col">
                        <input className="form-control ff-input" placeholder="Full Name"
                          value={p.name} required
                          onChange={(e) => {
                            const arr = [...passengers];
                            arr[i].name = e.target.value;
                            setPassengers(arr);
                          }} />
                      </div>
                      <div className="col-md-3">
                        <input className="form-control ff-input" placeholder="Age" type="number" min="1" max="120"
                          value={p.age} required
                          onChange={(e) => {
                            const arr = [...passengers];
                            arr[i].age = e.target.value;
                            setPassengers(arr);
                          }} />
                      </div>
                      {passengers.length > 1 && (
                        <div className="col-auto">
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removePassenger(i)}>✕</button>
                        </div>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline-primary btn-sm mb-4" onClick={addPassenger}>
                    + Add Passenger
                  </button>

                  <div className="p-3 rounded-3 mb-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total ({passengers.length} passenger{passengers.length > 1 ? 's' : ''})</span>
                      <span style={{ color: '#0369a1', fontSize: '1.2rem' }}>
                        ${selected.price[form.seatClass] * passengers.length}
                      </span>
                    </div>
                    <div className="text-muted small mt-1">Class: {form.seatClass}</div>
                  </div>

                  <button type="submit" className="btn btn-sky w-100" disabled={booking}>
                    {booking ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                    {booking ? 'Processing…' : '✅ Confirm Booking'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
