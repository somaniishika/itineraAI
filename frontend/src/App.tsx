import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { VerifyOtpPage } from './pages/VerifyOtpPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateItineraryPage } from './pages/CreateItineraryPage';
import { ItineraryDetailPage } from './pages/ItineraryDetailPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

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

function UserItineraryRoute({ children }: { children: React.ReactNode }) {
  if (!localStorage.getItem('itineraai_token')) return <Navigate to="/login" replace />;
  if (readUserRole() !== 'USER') return <Navigate to="/dashboard" replace />;
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
      <Route path="/itinerary/new" element={<UserItineraryRoute><CreateItineraryPage /></UserItineraryRoute>} />
      <Route path="/itinerary/:id" element={<UserItineraryRoute><ItineraryDetailPage /></UserItineraryRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
