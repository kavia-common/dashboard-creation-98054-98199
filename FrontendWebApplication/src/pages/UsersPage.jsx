import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import '../App.css';

/**
 * PUBLIC_INTERFACE
 * UsersPage provides CRUD operations for users with validation and pagination.
 */
export default function UsersPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await api.get('/users', { q, page, page_size: pageSize });
      if (Array.isArray(data)) setItems(data);
      else if (data.items) setItems(data.items);
      else setItems([]);
    } catch (e) {
      setNotif({ type: 'error', message: e.message || 'Failed to load users' });
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
    if (!form.name) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSave = async () => {
    if (!validate()) return;
    try {
      if (editing) {
        await api.put(`/users/${editing.id}`, form);
        setNotif({ type: 'success', message: 'User updated' });
      } else {
        await api.post('/users', form);
        setNotif({ type: 'success', message: 'User created' });
      }
      setForm({ name: '', email: '' });
      setEditing(null);
      fetchItems();
    } catch (e) {
      setNotif({ type: 'error', message: e.message || 'Operation failed' });
    }
  };

  const onEdit = (it) => {
    setEditing(it);
    setForm({ name: it.name || '', email: it.email || '' });
  };

  const onDelete = async (it) => {
    if (!window.confirm(`Delete user "${it.name}"?`)) return;
    try {
      await api.delete(`/users/${it.id}`);
      setNotif({ type: 'success', message: 'User deleted' });
      fetchItems();
    } catch (e) {
      setNotif({ type: 'error', message: e.message || 'Delete failed' });
    }
  };

  const filtered = useMemo(() => {
    if (!q) return items;
    const term = q.toLowerCase();
    return items.filter((i) => (i.name || '').toLowerCase().includes(term) || (i.email || '').toLowerCase().includes(term));
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
          <h3 style={{ marginTop: 0 }}>{editing ? 'Edit User' : 'New User'}</h3>
          <div className="form-row">
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.name}</span>}
          </div>
          <div className="form-row" style={{ marginTop: 10 }}>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.email}</span>}
          </div>
          <div className="toolbar" style={{ marginTop: 12 }}>
            <button className="btn" onClick={onSave}>Save</button>
            {editing && <button className="btn ghost" onClick={() => { setEditing(null); setForm({ name: '', email: '' }); }}>Cancel</button>}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Users</h3>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4"><span className="loader" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="4" style={{ color: 'var(--muted)' }}>No users found</td></tr>
              ) : (
                filtered.map((it) => (
                  <tr key={it.id}>
                    <td>{it.id}</td>
                    <td>{it.name}</td>
                    <td>{it.email}</td>
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
