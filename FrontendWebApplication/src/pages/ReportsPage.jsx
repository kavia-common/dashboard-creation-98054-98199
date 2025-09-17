import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import '../App.css';

/**
 * PUBLIC_INTERFACE
 * ReportsPage provides CRUD operations for reports with search and pagination.
 */
export default function ReportsPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', status: 'open' });
  const [errors, setErrors] = useState({});

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await api.get('/reports', { q, page, page_size: pageSize });
      // Support {items, total} or array fallback
      if (Array.isArray(data)) {
        setItems(data);
      } else if (data.items) {
        setItems(data.items);
      } else {
        setItems([]);
      }
    } catch (e) {
      setNotif({ type: 'error', message: e.message || 'Failed to load reports' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, page]);

  const validate = () => {
    const e = {};
    if (!form.title) e.title = 'Title is required';
    if (!form.status) e.status = 'Status is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSave = async () => {
    if (!validate()) return;
    try {
      if (editing) {
        await api.put(`/reports/${editing.id}`, form);
        setNotif({ type: 'success', message: 'Report updated' });
      } else {
        await api.post('/reports', form);
        setNotif({ type: 'success', message: 'Report created' });
      }
      setForm({ title: '', status: 'open' });
      setEditing(null);
      fetchItems();
    } catch (e) {
      setNotif({ type: 'error', message: e.message || 'Operation failed' });
    }
  };

  const onEdit = (it) => {
    setEditing(it);
    setForm({ title: it.title || '', status: it.status || 'open' });
  };

  const onDelete = async (it) => {
    if (!window.confirm(`Delete report "${it.title}"?`)) return;
    try {
      await api.delete(`/reports/${it.id}`);
      setNotif({ type: 'success', message: 'Report deleted' });
      fetchItems();
    } catch (e) {
      setNotif({ type: 'error', message: e.message || 'Delete failed' });
    }
  };

  const filtered = useMemo(() => {
    if (!q) return items;
    const term = q.toLowerCase();
    return items.filter((i) => (i.title || '').toLowerCase().includes(term));
  }, [items, q]);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="toolbar">
        <input className="input" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn ghost" onClick={() => fetchItems()}>{loading ? <span className="loader" /> : 'Refresh'}</button>
      </div>

      {notif && <div className={`alert ${notif.type === 'error' ? 'error' : 'success'}`}>{notif.message}</div>}

      <div className="grid cols-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>{editing ? 'Edit Report' : 'New Report'}</h3>
          <div className="form-row">
            <label className="label">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            {errors.title && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.title}</span>}
          </div>
          <div className="form-row" style={{ marginTop: 10 }}>
            <label className="label">Status</label>
            <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            {errors.status && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.status}</span>}
          </div>
          <div className="toolbar" style={{ marginTop: 12 }}>
            <button className="btn" onClick={onSave}>Save</button>
            {editing && <button className="btn ghost" onClick={() => { setEditing(null); setForm({ title: '', status: 'open' }); }}>Cancel</button>}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Reports</h3>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4"><span className="loader" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="4" style={{ color: 'var(--muted)' }}>No reports found</td></tr>
              ) : (
                filtered.map((it) => (
                  <tr key={it.id}>
                    <td>{it.id}</td>
                    <td>{it.title}</td>
                    <td>{it.status}</td>
                    <td>
                      <div className="toolbar">
                        <button className="btn ghost" onClick={() => onEdit(it)}>Edit</button>
                        <button className="btn danger" onClick={() => onDelete(it)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button className="btn ghost" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
            <div style={{ display: 'grid', placeItems: 'center', minWidth: 60 }}>Page {page}</div>
            <button className="btn ghost" onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
