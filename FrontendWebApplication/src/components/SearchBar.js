import React, { useState } from 'react';

// PUBLIC_INTERFACE
export default function SearchBar({ onSearch, placeholder = 'Search...' }) {
  /** Search bar with debounce trigger on submit. */
  const [q, setQ] = useState('');
  return (
    <form className="row" onSubmit={(e) => { e.preventDefault(); onSearch(q); }}>
      <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} />
      <button className="btn secondary" type="submit">Search</button>
    </form>
  );
}
