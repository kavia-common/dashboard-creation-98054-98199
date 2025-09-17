import React from 'react';

// PUBLIC_INTERFACE
export default function Loader({ text = 'Loading...' }) {
  /** Small loading indicator with accessible text. */
  return (
    <div className="row muted mt-3" role="status" aria-live="polite">
      <span>⏳</span>
      <span>{text}</span>
    </div>
  );
}
