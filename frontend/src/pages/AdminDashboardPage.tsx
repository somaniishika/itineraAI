import { Link, useNavigate } from 'react-router-dom';
import type { UserProfile } from '../types/auth';

function readUser(): UserProfile | null {
  try {
    const savedUser = localStorage.getItem('itineraai_user');
    return savedUser ? (JSON.parse(savedUser) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const user = readUser();

  const logout = () => {
    localStorage.removeItem('itineraai_token');
    localStorage.removeItem('itineraai_user');
    navigate('/login', { replace: true });
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <Link to="/dashboard" className="brand-block app-brand" aria-label="ItineraAI admin dashboard">
          <img src="/logo.png" alt="" className="brand-logo" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          <span>
            <span className="brand-name">ItineraAI</span>
            <span className="brand-subtitle">ADMIN WORKSPACE</span>
          </span>
        </Link>
        <nav className="app-nav" aria-label="Main navigation">
          <span className="nav-link active">Admin overview</span>
          <button type="button" className="nav-link" onClick={logout}>Log out</button>
        </nav>
      </header>

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
            <article className="trip-card">
              <span className="trip-card-topline">USER ADMINISTRATION</span>
              <h3>User records and status</h3>
              <p className="trip-destination">Verified APIs: GET /admin/users, GET /admin/users/:id, PUT /admin/user-status</p>
            </article>
            <article className="trip-card">
              <span className="trip-card-topline">QUESTIONNAIRE</span>
              <h3>Question management</h3>
              <p className="trip-destination">Verified APIs: GET, POST, PUT, and DELETE /admin/questionnaire</p>
            </article>
            <article className="trip-card">
              <span className="trip-card-topline">REVIEW AND AUDIT</span>
              <h3>Requests and API activity</h3>
              <p className="trip-destination">Verified APIs: GET /admin/suspension-requests and GET /admin/api-audit-logs</p>
            </article>
          </div>
          <p className="muted admin-note">This is an access landing page. Admin data-management screens are not implemented yet.</p>
        </section>
      </section>
    </main>
  );
}