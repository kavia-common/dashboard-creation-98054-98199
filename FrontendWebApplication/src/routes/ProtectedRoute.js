import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function ProtectedRoute({ children }) {
  /**
   * Ensures only authenticated users can access nested routes. Redirects to /login if not authenticated.
   */
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
