import React, { useEffect, useMemo, useState } from 'react';
import { createReport, deleteReport, listReports, updateReport } from '../services/api';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import { useForm } from 'react-hook-form';

function ReportForm({ onSubmit, defaultValues, onCancel }) {
  const { register, handleSubmit, reset } = useForm({ defaultValues: defaultValues || { title: '', status: 'draft' } });
  useEffect(() => { reset(defaultValues || { title: '', status: 'draft' }); }, [defaultValues, reset]);

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label>Title</label>
        <input className="input" {...register('title', { required: true, minLength: 3 })} placeholder="Monthly Report" />
      </div>
      <div className="field">
        <label>Status</label>
        <select className="select" {...register('status', { required: true })}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
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
export default function ReportsPage() {
  /** Reports management page: list, search, create, edit, delete with feedback. */
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
      const data = await listReports({ page: opts.page || page, page_size: pageSize, q: search || undefined });
      setItems(data?.items || data || []);
      setTotal(data?.total ?? (data?.items?.length ?? 0));
    } catch (e) {
      setError(e.message || 'Failed to load reports.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleCreate = async (values) => {
    try {
      await createReport(values);
      setToast({ type: 'success', message: 'Report created.' });
      await refresh();
    } catch (e) {
      setToast({ type: 'error', message: e.message || 'Create failed.' });
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateReport(editing.id, values);
      setToast({ type: 'success', message: 'Report updated.' });
      setEditing(null);
      await refresh();
    } catch (e) {
      setToast({ type: 'error', message: e.message || 'Update failed.' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReport(confirmDelete.id);
      setToast({ type: 'success', message: 'Report deleted.' });
      setConfirmDelete(null);
      await refresh();
    } catch (e) {
      setToast({ type: 'error', message: e.message || 'Delete failed.' });
    }
  };

  return (
    <div>
      <div className="space-between">
        <h2>Reports</h2>
        <SearchBar onSearch={(q) => { setSearch(q); setPage(1); }} placeholder="Search reports" />
      </div>

      {loading && <Loader text="Loading reports..." />}
      <ErrorMessage error={error} />
      <Toast type={toast.type} message={toast.message} />

      <div className="row mt-4" style={{ alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 2, minWidth: 320 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th className="muted">Status</th>
                <th className="muted" style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id || r.title}>
                  <td>{r.title}</td>
                  <td className="muted">{r.status}</td>
                  <td>
                    <div className="row">
                      <button className="btn secondary" onClick={() => setEditing(r)}>Edit</button>
                      <button className="btn danger" onClick={() => setConfirmDelete(r)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!items || items.length === 0) && !loading && (
                <tr><td colSpan={3} className="muted">No reports found.</td></tr>
              )}
            </tbody>
          </table>

          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={(p) => { setPage(p); refresh({ page: p }); }} />
        </div>

        <div className="card" style={{ flex: 1, minWidth: 320 }}>
          <strong>{editing ? 'Edit Report' : 'Create Report'}</strong>
          <div className="mt-3">
            <ReportForm
              defaultValues={editing}
              onSubmit={editing ? handleUpdate : handleCreate}
              onCancel={editing ? () => setEditing(null) : undefined}
            />
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Delete report?"
        message={`Delete "${confirmDelete?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
