import React, { useEffect, useMemo, useState } from 'react';
import { createUser, deleteUser, listUsers, updateUser } from '../services/api';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import { useForm } from 'react-hook-form';

function UserForm({ onSubmit, defaultValues, onCancel }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: defaultValues || { email: '', name: '', role: 'user' }
  });
  useEffect(() => { reset(defaultValues || { email: '', name: '', role: 'user' }); }, [defaultValues, reset]);

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field">
        <label>Name</label>
        <input className="input" {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} placeholder="Jane Doe" />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </div>
      <div className="field">
        <label>Email</label>
        <input className="input" type="email" {...register('email', { required: 'Email is required' })} placeholder="jane@example.com" />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>
      <div className="field">
        <label>Role</label>
        <select className="select" {...register('role', { required: true })}>
          <option value="user">User</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="row">
        <button className="btn" type="submit">Save</button>
        {onCancel && <button className="btn secondary" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

// PUBLIC_INTERFACE
export default function UsersPage() {
  /** Users management page: list, search, create, edit, delete with validation and feedback. */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState({ type: 'info', message: '' });

  const refresh = useMemo(() => async (opts = {}) => {
    try {
      setLoading(true);
      setError('');
      const data = await listUsers({ page: opts.page || page, page_size: pageSize, q: search || undefined });
      setItems(data?.items || data || []);
      setTotal(data?.total ?? (data?.items?.length ?? 0));
    } catch (e) {
      setError(e.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleCreate = async (values) => {
    try {
      await createUser(values);
      setToast({ type: 'success', message: 'User created.' });
      await refresh();
    } catch (e) {
      setToast({ type: 'error', message: e.message || 'Create failed.' });
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateUser(editing.id, values);
      setToast({ type: 'success', message: 'User updated.' });
      setEditing(null);
      await refresh();
    } catch (e) {
      setToast({ type: 'error', message: e.message || 'Update failed.' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(confirmDelete.id);
      setToast({ type: 'success', message: 'User deleted.' });
      setConfirmDelete(null);
      await refresh();
    } catch (e) {
      setToast({ type: 'error', message: e.message || 'Delete failed.' });
    }
  };

  return (
    <div>
      <div className="space-between">
        <h2>Users</h2>
        <SearchBar onSearch={(q) => { setSearch(q); setPage(1); }} placeholder="Search users" />
      </div>

      {loading && <Loader text="Loading users..." />}
      <ErrorMessage error={error} />
      <Toast type={toast.type} message={toast.message} />

      <div className="row mt-4" style={{ alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 2, minWidth: 320 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th className="muted">Email</th>
                <th className="muted">Role</th>
                <th className="muted" style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id || u.email}>
                  <td>{u.name}</td>
                  <td className="muted">{u.email}</td>
                  <td className="muted">{u.role}</td>
                  <td>
                    <div className="row">
                      <button className="btn secondary" onClick={() => setEditing(u)}>Edit</button>
                      <button className="btn danger" onClick={() => setConfirmDelete(u)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!items || items.length === 0) && !loading && (
                <tr><td colSpan={4} className="muted">No users found.</td></tr>
              )}
            </tbody>
          </table>

          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={(p) => { setPage(p); refresh({ page: p }); }} />
        </div>

        <div className="card" style={{ flex: 1, minWidth: 320 }}>
          <strong>{editing ? 'Edit User' : 'Create User'}</strong>
          <div className="mt-3">
            <UserForm
              defaultValues={editing}
              onSubmit={editing ? handleUpdate : handleCreate}
              onCancel={editing ? () => setEditing(null) : undefined}
            />
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Delete user?"
        message={`Delete "${confirmDelete?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
