import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [cancelId, setCancelId] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings/my');
      setBookings(res.data);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelId(id);
    try {
      await axios.put(`/api/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Cancel failed.');
    } finally {
      setCancelId(null);
    }
  };

  if (loading) return (
    <div className="text-center mt-5 py-5">
      <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
      <p className="mt-3 text-muted">Loading your bookings…</p>
    </div>
  );

  return (
    <>
      <div className="ff-page-header">
        <div className="container">
          <h4 className="fw-bold">🎫 My Bookings</h4>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 0 }}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      <div className="container py-4">
        {bookings.length === 0 && (
          <div className="text-center py-5">
            <div style={{ fontSize: '4rem' }}>🎫</div>
            <h5 className="mt-3">No bookings yet</h5>
            <p className="text-muted">Search for flights and book your first trip!</p>
            <a href="/search" className="btn btn-sky mt-2">Search Flights</a>
          </div>
        )}

        {bookings.map((b) => (
          <div className="ff-booking-card" key={b._id}>
            <div className="row align-items-center">
              <div className="col-md-1 text-center d-none d-md-block">
                <div style={{ fontSize: '2rem' }}>✈️</div>
              </div>
              <div className="col-md-5">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="ff-booking-ref">{b.bookingRef}</span>
                  <span className={`badge ${b.status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled'}`}>
                    {b.status}
                  </span>
                  <span className={`badge badge-paid`}>{b.paymentStatus}</span>
                </div>
                {b.flight ? (
                  <>
                    <div className="fw-bold">{b.flight.from} ✈ {b.flight.to}</div>
                    <div className="text-muted small">
                      {b.flight.airline} · {b.flight.flightNumber} · {b.flight.date}
                    </div>
                    <div className="text-muted small">
                      {b.flight.departureTime} → {b.flight.arrivalTime}
                    </div>
                  </>
                ) : (
                  <div className="text-muted small">Flight details unavailable</div>
                )}
              </div>
              <div className="col-md-3">
                <div className="text-muted small mb-1">Passengers</div>
                {b.passengers.map((p, i) => (
                  <div key={i} className="small fw-semibold">{p.name} (Age {p.age})</div>
                ))}
                <div className="text-muted small mt-1">Class: <strong>{b.seatClass}</strong> · {b.seats} seat{b.seats > 1 ? 's' : ''}</div>
              </div>
              <div className="col-md-3 text-md-end mt-3 mt-md-0">
                <div className="ff-price">${b.totalPrice}</div>
                <div className="text-muted small mb-2">Total paid</div>
                {b.status === 'confirmed' && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleCancel(b._id)}
                    disabled={cancelId === b._id}
                  >
                    {cancelId === b._id ? 'Cancelling…' : 'Cancel Booking'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
