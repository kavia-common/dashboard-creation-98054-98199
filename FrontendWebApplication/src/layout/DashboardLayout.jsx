import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import '../App.css';
import { useAuth } from '../auth/AuthContext';

/**
 * PUBLIC_INTERFACE
 * DashboardLayout renders the shell with sidebar navigation and an outlet for pages.
 */
export default function DashboardLayout({ theme, onToggleTheme }) {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>Dashboard</span>
          <button className="theme-toggle" onClick={onToggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>
        </div>
        <div className="nav">
          <NavLink to="/reports" className={({ isActive }) => isActive || location.pathname.startsWith('/reports') ? 'active' : ''}>
            📄 Reports
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => isActive || location.pathname.startsWith('/users') ? 'active' : ''}>
            👤 Users
          </NavLink>
          <NavLink to="/charts" className={({ isActive }) => isActive || location.pathname.startsWith('/charts') ? 'active' : ''}>
            📊 Charts
          </NavLink>
        </div>
        <div style={{ position: 'absolute', bottom: 16, left: 12, right: 12 }}>
          <div className="card" style={{ padding: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Signed in as</div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>{user?.email || 'User'}</div>
            <button className="btn ghost" onClick={logout}>Log out</button>
          </div>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
