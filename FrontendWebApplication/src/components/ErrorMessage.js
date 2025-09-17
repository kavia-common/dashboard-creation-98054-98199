import React from 'react';

// PUBLIC_INTERFACE
export default function ErrorMessage({ error }) {
  /** Displays an error message block. */
  if (!error) return null;
  const message = typeof error === 'string' ? error : error.message || 'Something went wrong.';
  return <div className="card" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>⚠️ {message}</div>;
}
