const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

/**
 * Retrieves the current JWT token from localStorage.
 */
export function getToken() {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

/**
 * Stores JWT token in localStorage.
 * @param {string} token
 */
export function setToken(token) {
  try {
    localStorage.setItem('token', token);
  } catch {
    /* ignore */
  }
}

/**
 * Clears JWT token from storage.
 */
export function clearToken() {
  try {
    localStorage.removeItem('token');
  } catch {
    /* ignore */
  }
}

/**
 * Internal helper for fetch with auth headers and error handling.
 * @param {string} path
 * @param {RequestInit} options
 * @returns {Promise<any>}
 */
async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const text = await res.text();
  const data = text ? JSON.parse(text).catch(() => ({ raw: text })) : null;

  if (!res.ok) {
    const message = (data && (data.detail || data.message)) || `Request failed with ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export function login(email, password) {
  /** Authenticate with backend and return token payload. */
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

// PUBLIC_INTERFACE
export function getDashboardData() {
  /** Fetch dashboard metrics and chart data. */
  return apiFetch('/dashboard', { method: 'GET' });
}

// PUBLIC_INTERFACE
export function getChartData() {
  /** Fetch chart data for Line/Pie/Bar charts. */
  return apiFetch('/charts/data', { method: 'GET' });
}

// PUBLIC_INTERFACE
export function listUsers(params = {}) {
  const q = new URLSearchParams(params).toString();
  return apiFetch(`/users${q ? `?${q}` : ''}`, { method: 'GET' });
}

// PUBLIC_INTERFACE
export function createUser(payload) {
  return apiFetch('/users', { method: 'POST', body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export function updateUser(id, payload) {
  return apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export function deleteUser(id) {
  return apiFetch(`/users/${id}`, { method: 'DELETE' });
}

// PUBLIC_INTERFACE
export function listReports(params = {}) {
  const q = new URLSearchParams(params).toString();
  return apiFetch(`/reports${q ? `?${q}` : ''}`, { method: 'GET' });
}

// PUBLIC_INTERFACE
export function createReport(payload) {
  return apiFetch('/reports', { method: 'POST', body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export function updateReport(id, payload) {
  return apiFetch(`/reports/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export function deleteReport(id) {
  return apiFetch(`/reports/${id}`, { method: 'DELETE' });
}

export default {
  login,
  getDashboardData,
  getChartData,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  listReports,
  createReport,
  updateReport,
  deleteReport,
  getToken,
  setToken,
  clearToken
};
