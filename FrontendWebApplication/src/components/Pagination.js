import React from 'react';

// PUBLIC_INTERFACE
export default function Pagination({ page, pageSize, total, onPageChange }) {
  /** Simple pagination control */
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 10)));
  return (
    <div className="row mt-3">
      <button className="btn secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Prev</button>
      <div className="muted">Page {page} of {totalPages}</div>
      <button className="btn secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
    </div>
  );
}
