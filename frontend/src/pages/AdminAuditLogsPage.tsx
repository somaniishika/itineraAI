import { useEffect, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { adminApi } from '../services/api';
import type { ApiAuditLog } from '../types/admin';

const PAGE_SIZE = 20;

function displayDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unavailable' : date.toLocaleString();
}

export function AdminAuditLogsPage() {
  const [page, setPage] = useState(1);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [logs, setLogs] = useState<ApiAuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    adminApi.auditLogs({ page, limit: PAGE_SIZE })
      .then(({ data }) => {
        if (!active) return;
        setLogs(data.data);
        setTotal(data.meta.total);
        setTotalPages(data.meta.totalPages);
      })
      .catch((requestError: Error & { status?: number }) => {
        if (!active) return;
        setError(requestError.status === 401
          ? 'Your sign-in was not accepted. Sign in again with an administrator account.'
          : requestError.status === 403
            ? 'Your account does not have administrator access.'
            : requestError.message || 'We could not load API audit logs.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, refreshVersion]);

  return (
    <AdminLayout active="audit">
      <section className="dashboard-content admin-content">
        <div className="form-page-heading">
          <p className="eyebrow">ADMINISTRATION</p>
          <h1>API audit logs</h1>
          <p className="muted">Paginated request outcomes recorded by the backend.</p>
        </div>
        <div className="admin-toolbar"><span className="result-count">{total} records</span><button type="button" className="secondary-button compact-button" onClick={() => setRefreshVersion((current) => current + 1)}>Refresh</button></div>
        {loading ? <div className="state-panel">Loading audit logs…</div> : null}
        {!loading && error ? <div className="state-panel error-panel" role="alert"><p>{error}</p><button className="secondary-button compact-button" type="button" onClick={() => setRefreshVersion((current) => current + 1)}>Try again</button></div> : null}
        {!loading && !error && logs.length === 0 ? <div className="state-panel empty-panel"><h3>No audit logs found</h3></div> : null}
        {!loading && !error && logs.length > 0 ? <>
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Date</th><th>User</th><th>Feature</th><th>Status</th><th>Error</th><th>Response</th></tr></thead><tbody>
            {logs.map((log) => <tr key={log.id}>
              <td>{displayDate(log.created_at)}</td>
              <td>{log.user ? `${log.user.full_name} (${log.user.email})` : `User ${log.user_id}`}</td>
              <td>{log.feature}</td><td>{log.status_code ?? '—'}</td>
              <td className="audit-cell">{log.error_message || '—'}</td><td className="audit-cell">{log.response_text || '—'}</td>
            </tr>)}
          </tbody></table></div>
          {totalPages > 1 ? <div className="pagination-row"><button className="secondary-button compact-button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</button><span>Page {page} of {totalPages}</span><button className="secondary-button compact-button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Next</button></div> : null}
        </> : null}
      </section>
    </AdminLayout>
  );
}
