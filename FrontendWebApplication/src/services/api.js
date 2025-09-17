import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Configure axios instance
const client = axios.create({
  baseURL: BASE_URL,
  timeout: 20000
});

// Attach JWT if exists
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Backend expects Bearer token
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response normalization
const normalize = (r) => r.data ?? r;

// PUBLIC_INTERFACE
export const api = {
  /** Perform a POST request with standardized error handling. */
  post: async (path, data) => {
    try {
      const res = await client.post(path, data);
      return normalize(res);
    } catch (e) {
      throw extractError(e);
    }
  },
  /** Perform a GET request with standardized error handling. */
  get: async (path, params) => {
    try {
      const res = await client.get(path, { params });
      return normalize(res);
    } catch (e) {
      throw extractError(e);
    }
  },
  /** Perform a PUT request with standardized error handling. */
  put: async (path, data) => {
    try {
      const res = await client.put(path, data);
      return normalize(res);
    } catch (e) {
      throw extractError(e);
    }
  },
  /** Perform a DELETE request with standardized error handling. */
  delete: async (path) => {
    try {
      const res = await client.delete(path);
      return normalize(res);
    } catch (e) {
      throw extractError(e);
    }
  }
};

function extractError(error) {
  const fallback = { message: 'Unexpected error', status: 0 };
  if (!error) return fallback;
  if (error.response) {
    return {
      message: error.response.data?.detail || error.response.data?.message || `Request failed (${error.response.status})`,
      status: error.response.status,
      data: error.response.data
    };
  }
  if (error.request) {
    return { message: 'Network error: server did not respond', status: 0 };
  }
  return { message: error.message || fallback.message, status: 0 };
}
