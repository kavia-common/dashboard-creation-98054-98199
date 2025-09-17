import React from 'react';

// PUBLIC_INTERFACE
export default function Toast({ type = 'info', message }) {
  /** Feedback toast component displayed inline. */
  if (!message) return null;
  const bg = type === 'error' ? 'var(--danger)' : type === 'success' ? 'var(--success)' : 'var(--accent)';
  return (
    <div className="mt-3" style={{ background: bg, color: 'white', padding: '8px 12px', borderRadius: 8 }}>
      {message}
    </div>
  );
}
