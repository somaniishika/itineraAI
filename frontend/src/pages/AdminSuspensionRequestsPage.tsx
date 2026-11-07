import { useEffect, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { adminApi } from '../services/api';
import type { SuspensionRequest } from '../types/admin';

const PAGE_SIZE = 10;

function displayDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unavailable' : date.toLocaleString();
}

export function AdminSuspensionRequestsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [requests, setRequests] = useState<SuspensionRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    const params: { page: number; limit: number; status?: 'PENDING' | 'APPROVED' } = { page, limit: PAGE_SIZE };
    if (status) params.status = status as 'PENDING' | 'APPROVED';

    adminApi.suspensionRequests(params)
      .then(({ data }) => {
        if (!active) return;
        setRequests(data.data);
        setTotal(data.total);
      })
      .catch((requestError: Error & { status?: number }) => {
        if (!active) return;
        if (requestError.status === 404 && status) {
          setRequests([]);
          setTotal(0);
          return;
        }
        setError(requestError.status === 401
          ? 'Your sign-in was not accepted. Sign in again with an administrator account.'
          : requestError.status === 403
            ? 'Your account does not have administrator access.'
            : requestError.message || 'We could not load suspension requests.');
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [page, status, refreshVersion]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminLayout active="requests">
      <section className="dashboard-content admin-content">
        <div className="form-page-heading">
          <p className="eyebrow">ADMINISTRATION</p>
          <h1>Suspension requests</h1>
          <p className="muted">Review request details. The backend does not expose an approve/reject operation for requests.</p>
        </div>
        <div className="admin-toolbar">
          <label><span>Request status</span><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="">All requests</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option></select></label>
          <button type="button" className="secondary-button compact-button" onClick={() => setRefreshVersion((current) => current + 1)}>Refresh</button>
        </div>
        {loading ? <div className="state-panel">Loading suspension requests…</div> : null}
        {!loading && error ? <div className="state-panel error-panel" role="alert"><p>{error}</p><button className="secondary-button compact-button" type="button" onClick={() => setRefreshVersion((current) => current + 1)}>Try again</button></div> : null}
        {!loading && !error && requests.length === 0 ? <div className="state-panel empty-panel"><h3>No suspension requests found</h3><p>There are no requests matching this filter.</p></div> : null}
        {!loading && !error && requests.length > 0 ? <>
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>User</th><th>Email</th><th>Request</th><th>Suspension reason</th><th>Status</th><th>Date</th></tr></thead><tbody>
            {requests.map((request) => <tr key={request.id}><td>{request.username || `User ${request.user_id}`}</td><td>{request.email}</td><td>{request.user_request_message || 'No message provided'}</td><td>{request.suspension_reason}</td><td>{request.status}</td><td>{displayDate(request.suspension_date)}</td></tr>)}
          </tbody></table></div>
          {totalPages > 1 ? <div className="pagination-row"><button className="secondary-button compact-button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</button><span>Page {page} of {totalPages}</span><button className="secondary-button compact-button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Next</button></div> : null}
        </> : null}
      </section>
    </AdminLayout>
  );
}
