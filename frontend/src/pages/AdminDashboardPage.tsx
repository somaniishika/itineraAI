import { Link } from 'react-router-dom';
import type { UserProfile } from '../types/auth';
import { AdminLayout } from './AdminLayout';

function readUser(): UserProfile | null {
  try {
    const savedUser = localStorage.getItem('itineraai_user');
    return savedUser ? (JSON.parse(savedUser) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function AdminDashboardPage() {
  const user = readUser();

  return (
    <AdminLayout>
      <section className="dashboard-content">
        <div className="welcome-row">
          <div>
            <p className="eyebrow">ADMINISTRATION</p>
            <h1>Welcome{user?.full_name ? `, ${user.full_name}` : ' back'}</h1>
            <p className="muted">Your account is signed in with administrator access.</p>
          </div>
        </div>

        <section className="itinerary-section" aria-labelledby="admin-areas-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">AVAILABLE BACKEND AREAS</p>
              <h2 id="admin-areas-heading">Admin workspace</h2>
            </div>
          </div>
          <div className="itinerary-grid">
            <Link to="/admin/users" className="trip-card">
              <span className="trip-card-topline">USER ADMINISTRATION</span>
              <h3>User records and status</h3>
              <p className="trip-destination">Browse user accounts, view details, and change supported status.</p>
            </Link>
            <Link to="/admin/questionnaire" className="trip-card">
              <span className="trip-card-topline">QUESTIONNAIRE</span>
              <h3>Question management</h3>
              <p className="trip-destination">View and manage non-default itinerary questions.</p>
            </Link>
            <Link to="/admin/suspension-requests" className="trip-card">
              <span className="trip-card-topline">REVIEW AND AUDIT</span>
              <h3>Suspension requests</h3>
              <p className="trip-destination">Review paginated user requests. The backend has no decision endpoint.</p>
            </Link>
            <Link to="/admin/audit-logs" className="trip-card">
              <span className="trip-card-topline">API ACTIVITY</span>
              <h3>Audit logs</h3>
              <p className="trip-destination">Browse paginated API activity and error summaries.</p>
            </Link>
          </div>
        </section>
      </section>
    </AdminLayout>
  );
}