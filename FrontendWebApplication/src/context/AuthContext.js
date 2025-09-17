import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api, { setToken as saveToken, clearToken as purgeToken, getToken } from '../services/api';

export const AuthContext = createContext({
  isAuthenticated: false,
  token: null,
  user: null,
  login: async (_email, _password) => {},
  logout: () => {},
});

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provides authentication state and actions to the app, including login/logout and token persistence.
   */
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const isAuthenticated = Boolean(token);
  const navigate = useNavigate?.() ?? (() => {});
  const location = useLocation?.() ?? { pathname: '/' };

  useEffect(() => {
    // In a real app we might decode JWT to get user info; placeholder:
    if (token && !user) {
      setUser({ email: 'user@example.com' });
    }
  }, [token, user]);

  const login = useCallback(async (email, password) => {
    const response = await api.login(email, password);
    // expect response to contain access_token or token
    const t = response?.access_token || response?.token;
    if (!t) throw new Error('Invalid token response from server.');
    setToken(t);
    saveToken(t);
    setUser({ email });
    const redirectTo = (location.state && location.state.from) || '/';
    navigate(redirectTo);
  }, [navigate, location.state]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    purgeToken();
    navigate('/login');
  }, [navigate]);

  const value = useMemo(() => ({ isAuthenticated, token, user, login, logout }), [isAuthenticated, token, user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
