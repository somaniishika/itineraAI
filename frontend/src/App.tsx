import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { VerifyOtpPage } from './pages/VerifyOtpPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateItineraryPage } from './pages/CreateItineraryPage';
import { ItineraryDetailPage } from './pages/ItineraryDetailPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminQuestionnairePage } from './pages/AdminQuestionnairePage';
import { AdminSuspensionRequestsPage } from './pages/AdminSuspensionRequestsPage';
import { AdminAuditLogsPage } from './pages/AdminAuditLogsPage';

function readUserRole(): string | null {
  try {
    const savedUser = localStorage.getItem('itineraai_user');
    return savedUser ? JSON.parse(savedUser).role ?? null : null;
  } catch {
    return null;
  }
}

function DashboardRoute() {
  if (!localStorage.getItem('itineraai_token')) return <Navigate to="/login" replace />;

  const role = readUserRole();
  if (role === 'ADMIN') return <AdminDashboardPage />;
  if (role === 'USER') return <DashboardPage />;
  return <Navigate to="/login" replace />;
}

function UserRoute({ children }: { children: React.ReactNode }) {
  if (!localStorage.getItem('itineraai_token')) return <Navigate to="/login" replace />;
  if (readUserRole() !== 'USER') return <Navigate to="/dashboard" replace />;
  return children;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  if (!localStorage.getItem('itineraai_token')) return <Navigate to="/login" replace />;
  if (readUserRole() !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/" element={<Navigate to={localStorage.getItem('itineraai_token') ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<VerifyOtpPage />} />
      <Route path="/dashboard" element={<DashboardRoute />} />
      <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
      <Route path="/admin/questionnaire" element={<AdminRoute><AdminQuestionnairePage /></AdminRoute>} />
      <Route path="/admin/suspension-requests" element={<AdminRoute><AdminSuspensionRequestsPage /></AdminRoute>} />
      <Route path="/admin/audit-logs" element={<AdminRoute><AdminAuditLogsPage /></AdminRoute>} />
      <Route path="/profile" element={<UserRoute><ProfilePage /></UserRoute>} />
      <Route path="/itinerary/new" element={<UserRoute><CreateItineraryPage /></UserRoute>} />
      <Route path="/itinerary/:id" element={<UserRoute><ItineraryDetailPage /></UserRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
