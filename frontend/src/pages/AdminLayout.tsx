import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type AdminLayoutProps = {
  children: ReactNode;
  active?: 'overview' | 'users' | 'questionnaire' | 'requests' | 'audit';
};

export function AdminLayout({ children, active = 'overview' }: AdminLayoutProps) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('itineraai_token');
    localStorage.removeItem('itineraai_user');
    navigate('/login', { replace: true });
  };

  return (
    <main className="app-shell">
      <header className="app-header admin-header">
        <Link to="/admin" className="brand-block app-brand" aria-label="ItineraAI admin workspace">
          <img src="/logo.png" alt="" className="brand-logo" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          <span><span className="brand-name">ItineraAI</span><span className="brand-subtitle">ADMIN WORKSPACE</span></span>
        </Link>
        <nav className="app-nav admin-nav" aria-label="Admin navigation">
          <Link className={`nav-link${active === 'overview' ? ' active' : ''}`} to="/admin">Overview</Link>
          <Link className={`nav-link${active === 'users' ? ' active' : ''}`} to="/admin/users">Users</Link>
          <Link className={`nav-link${active === 'questionnaire' ? ' active' : ''}`} to="/admin/questionnaire">Questionnaire</Link>
          <Link className={`nav-link${active === 'requests' ? ' active' : ''}`} to="/admin/suspension-requests">Suspensions</Link>
          <Link className={`nav-link${active === 'audit' ? ' active' : ''}`} to="/admin/audit-logs">Audit logs</Link>
          <button type="button" className="nav-link" onClick={logout}>Log out</button>
        </nav>
      </header>
      {children}
    </main>
  );
}
