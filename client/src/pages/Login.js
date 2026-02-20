import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0c1a2e,#0369a1)', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="bg-white rounded-4 p-4 shadow-lg">
              <div className="text-center mb-4">
                <div style={{ fontSize: '3rem' }}>✈️</div>
                <h4 className="fw-bold mt-2" style={{ color: '#0369a1' }}>Welcome Back</h4>
                <p className="text-muted small">Login to your FlightFinder account</p>
              </div>

              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Email</label>
                  <input
                    type="email"
                    className="form-control ff-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold small">Password</label>
                  <input
                    type="password"
                    className="form-control ff-input"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-sky w-100" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                  {loading ? 'Logging in…' : 'Login'}
                </button>
              </form>

              {/* Demo credentials hint */}
              <div className="mt-3 p-2 rounded" style={{ background: '#f0f9ff', fontSize: '0.78rem', color: '#0369a1' }}>
                <strong>Demo Admin:</strong> admin@ff.com / admin123
              </div>

              <p className="text-center text-muted small mt-3">
                No account? <Link to="/register" style={{ color: '#0ea5e9' }}>Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
