import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return { theme, setTheme };
}

// PUBLIC_INTERFACE
export default function DashboardLayout() {
  /** Dashboard shell: sidebar navigation and top bar actions. */
  const { logout } = useContext(AuthContext);
  const { theme, setTheme } = useTheme();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span role="img" aria-label="logo">📊</span> Kavia Dashboard
        </div>
        <nav className="nav">
          <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : undefined}>Overview</NavLink>
          <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : undefined}>Reports</NavLink>
          <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : undefined}>Users</NavLink>
        </nav>
      </aside>
      <main className="main">
        <div className="topbar">
          <button className="btn secondary" onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
