import React from 'react';

// PUBLIC_INTERFACE
export default function ConfirmDialog({ open, title = 'Confirm', message = 'Are you sure?', onConfirm, onCancel }) {
  /** Minimal inline confirm dialog. */
  if (!open) return null;
  return (
    <div className="card" role="dialog" aria-modal="true">
      <div className="space-between">
        <strong>{title}</strong>
      </div>
      <p className="mt-2">{message}</p>
      <div className="row mt-3">
        <button className="btn danger" onClick={onConfirm}>Delete</button>
        <button className="btn secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
