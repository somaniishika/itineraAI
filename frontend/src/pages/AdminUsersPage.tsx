import { FormEvent, useEffect, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { adminApi } from '../services/api';
import type { AdminUser, AdminUserDetails } from '../types/admin';

const PAGE_SIZE = 10;

type UserFilters = { name: string; email: string; username: string; active: string };

function displayDate(value?: string | null) {
  if (!value) return 'Unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unavailable' : date.toLocaleDateString();
}

export function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [filters, setFilters] = useState<UserFilters>({ name: '', email: '', username: '', active: '' });
  const [draftFilters, setDraftFilters] = useState<UserFilters>(filters);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [details, setDetails] = useState<AdminUserDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [statusError, setStatusError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    const params: { page: number; limit: number; name?: string; email?: string; username?: string; is_active?: boolean } = {
      page,
      limit: PAGE_SIZE,
    };
    if (filters.name.trim()) params.name = filters.name.trim();
    if (filters.email.trim()) params.email = filters.email.trim();
    if (filters.username.trim()) params.username = filters.username.trim();
    if (filters.active) params.is_active = filters.active === 'active';

    adminApi.users(params)
      .then(({ data }) => {
        if (!active) return;
        setUsers(data.data);
        setTotal(data.meta.total);
        setTotalPages(data.meta.totalPages);
      })
      .catch((requestError: Error & { status?: number }) => {
        if (!active) return;
        setError(requestError.status === 401
          ? 'Your sign-in was not accepted. Sign in again with an administrator account.'
          : requestError.status === 403
            ? 'Your account does not have administrator access.'
            : requestError.message || 'We could not load users.');
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [page, filters, refreshVersion]);

  const openUser = async (id: number) => {
    setSelectedId(id);
    setDetails(null);
    setDetailsLoading(true);
    setDetailsError('');
    setStatusError('');
    setStatusMessage('');
    try {
      const { data } = await adminApi.userDetails(id);
      setDetails(data.data);
    } catch (requestError) {
      const apiError = requestError as Error & { status?: number };
      setDetailsError(apiError.status === 404 ? 'This user could not be found.' : apiError.message || 'We could not load user details.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setFilters(draftFilters);
    setSelectedId(null);
    setDetails(null);
  };

  const clearFilters = () => {
    const emptyFilters = { name: '', email: '', username: '', active: '' };
    setDraftFilters(emptyFilters);
    setFilters(emptyFilters);
    setPage(1);
    setSelectedId(null);
    setDetails(null);
  };

  const updateStatus = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!details || !selectedId || statusReason.trim().length < 5) return;

    setUpdatingStatus(true);
    setStatusError('');
    setStatusMessage('');
    const action = details.user.is_suspended ? 'reactivate' : 'suspend';
    try {
      const { data } = await adminApi.updateUserStatus(action, { userId: selectedId, reason: statusReason.trim() });
      setStatusMessage(data.message);
      setStatusReason('');
      setRefreshVersion((current) => current + 1);
      await openUser(selectedId);
      setStatusMessage(data.message);
    } catch (requestError) {
      const apiError = requestError as Error & { status?: number };
      setStatusError(apiError.message || 'We could not update this account status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <AdminLayout active="users">
      <section className="dashboard-content admin-content">
        <div className="form-page-heading">
          <p className="eyebrow">ADMINISTRATION</p>
          <h1>User management</h1>
          <p className="muted">Search accounts, inspect details, and update supported USER status.</p>
        </div>

        <form className="admin-filter-panel" onSubmit={applyFilters}>
          <label><span>Name</span><input value={draftFilters.name} onChange={(event) => setDraftFilters((current) => ({ ...current, name: event.target.value }))} /></label>
          <label><span>Email</span><input type="email" value={draftFilters.email} onChange={(event) => setDraftFilters((current) => ({ ...current, email: event.target.value }))} /></label>
          <label><span>Username</span><input value={draftFilters.username} onChange={(event) => setDraftFilters((current) => ({ ...current, username: event.target.value }))} /></label>
          <label><span>Account status</span><select value={draftFilters.active} onChange={(event) => setDraftFilters((current) => ({ ...current, active: event.target.value }))}><option value="">All</option><option value="active">Active</option><option value="suspended">Suspended</option></select></label>
          <div className="admin-filter-actions"><button className="primary-button compact-button" type="submit">Search</button><button className="secondary-button compact-button" type="button" onClick={clearFilters}>Clear</button></div>
        </form>

        {loading ? <div className="state-panel">Loading users…</div> : null}
        {!loading && error ? <div className="state-panel error-panel" role="alert"><p>{error}</p><button className="secondary-button compact-button" type="button" onClick={() => setRefreshVersion((current) => current + 1)}>Try again</button></div> : null}
        {!loading && !error ? (
          <section className="admin-section" aria-labelledby="users-table-heading">
            <div className="section-heading"><h2 id="users-table-heading">Users</h2><span className="result-count">{total} accounts</span></div>
            {users.length === 0 ? <div className="state-panel empty-panel"><h3>No matching users</h3><p>Adjust your filters and try again.</p></div> : (
              <div className="admin-table-wrap"><table className="admin-table">
                <thead><tr><th>Name</th><th>Email</th><th>Username</th><th>Role</th><th>Status</th><th>Verified</th><th></th></tr></thead>
                <tbody>{users.map((user) => <tr key={user.id}>
                  <td>{user.full_name}</td><td>{user.email}</td><td>{user.username || '—'}</td><td>{user.role}</td>
                  <td>{user.is_deleted ? 'Deleted' : user.is_suspended ? 'Suspended' : 'Active'}</td><td>{user.email_verified ? 'Yes' : 'No'}</td>
                  <td><button className="text-button" type="button" onClick={() => void openUser(user.id)}>View details</button></td>
                </tr>)}</tbody>
              </table></div>
            )}
            {totalPages > 1 ? <div className="pagination-row"><button className="secondary-button compact-button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</button><span>Page {page} of {totalPages}</span><button className="secondary-button compact-button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Next</button></div> : null}
          </section>
        ) : null}

        {selectedId !== null ? <section className="admin-section admin-detail" aria-labelledby="user-detail-heading">
          <div className="section-heading"><h2 id="user-detail-heading">User details</h2><button className="text-button" type="button" onClick={() => { setSelectedId(null); setDetails(null); }}>Close</button></div>
          {detailsLoading ? <p className="muted">Loading details…</p> : null}
          {!detailsLoading && detailsError ? <div className="form-message error" role="alert">{detailsError}</div> : null}
          {details ? <>
            <dl className="admin-detail-grid">
              <div><dt>Name</dt><dd>{details.user.full_name}</dd></div><div><dt>Email</dt><dd>{details.user.email}</dd></div>
              <div><dt>Username</dt><dd>{details.user.username || '—'}</dd></div><div><dt>Address</dt><dd>{details.user.address || '—'}</dd></div>
              <div><dt>Role</dt><dd>{details.user.role}</dd></div><div><dt>Status</dt><dd>{details.user.is_deleted ? 'Deleted' : details.user.is_suspended ? 'Suspended' : 'Active'}</dd></div>
              <div><dt>Email verified</dt><dd>{details.user.email_verified ? 'Yes' : 'No'}</dd></div><div><dt>Created</dt><dd>{displayDate(details.user.created_at)}</dd></div>
            </dl>
            <h3>Feature credit balances</h3>
            {details.featureCredits.length ? details.featureCredits.map((record) => <p key={record.id}>{Object.entries(record.feature_balances).map(([feature, credits]) => `${feature}: ${credits}`).join(' · ')}</p>) : <p className="muted">No balance record.</p>}
            <h3>Payment history</h3>
            {details.paymentHistory.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Status</th><th>Amount</th><th>Date</th></tr></thead><tbody>{details.paymentHistory.map((payment) => <tr key={payment.id}><td>{payment.order_id}</td><td>{payment.status}</td><td>{payment.total_amount}</td><td>{displayDate(payment.created_at)}</td></tr>)}</tbody></table></div> : <p className="muted">No payment records.</p>}
            {!details.user.is_deleted && details.user.role === 'USER' ? <form className="status-action" onSubmit={updateStatus}>
              <h3>{details.user.is_suspended ? 'Reactivate account' : 'Suspend account'}</h3>
              <label><span>Reason (required by the API)</span><input minLength={5} maxLength={100} required value={statusReason} onChange={(event) => setStatusReason(event.target.value)} /></label>
              {statusError ? <div className="form-message error" role="alert">{statusError}</div> : null}
              {statusMessage ? <div className="form-message success" role="status">{statusMessage}</div> : null}
              <button className={details.user.is_suspended ? 'primary-button compact-button' : 'secondary-button compact-button'} disabled={updatingStatus}>{updatingStatus ? 'Updating…' : details.user.is_suspended ? 'Reactivate user' : 'Suspend user'}</button>
            </form> : null}
          </> : null}
        </section> : null}
      </section>
    </AdminLayout>
  );
}
