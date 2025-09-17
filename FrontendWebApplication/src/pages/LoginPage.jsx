import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../App.css';

/**
 * PUBLIC_INTERFACE
 * LoginPage renders the login form and triggers authentication.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (evt) => {
    evt.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', padding: 16 }}>
      <div className="card" style={{ width: 380, maxWidth: '100%' }}>
        <h2 style={{ marginTop: 0 }}>Welcome back</h2>
        <p style={{ marginTop: 0, color: 'var(--muted)' }}>Sign in to access your dashboard</p>
        {serverError && <div className="alert error">{serverError}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="username"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.email}</span>}
          </div>
          <div className="form-row" style={{ marginTop: 10 }}>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.password}</span>}
          </div>
          <div className="toolbar" style={{ marginTop: 16, justifyContent: 'space-between' }}>
            <button className="btn" disabled={submitting} type="submit">
              {submitting ? <span className="loader" /> : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
