import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './auth/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layout/DashboardLayout';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import ChartsPage from './pages/ChartsPage';

// PUBLIC_INTERFACE
function ProtectedRoute({ children }) {
  /** Ensures that only authenticated users can access the route. */
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// PUBLIC_INTERFACE
function AppRoutes() {
  /** Defines application routes including protected sections. */
  const defaultTheme = process.env.REACT_APP_DEFAULT_THEME || 'light';
  const [theme, setTheme] = useState(defaultTheme);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  const shell = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <div className="app" data-shell={JSON.stringify(shell)}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout theme={theme} onToggleTheme={toggleTheme} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="reports" replace />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="charts" element={<ChartsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Main application entry with providers and router. */
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
