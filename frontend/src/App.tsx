import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { VerifyOtpPage } from './pages/VerifyOtpPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateItineraryPage } from './pages/CreateItineraryPage';
import { ItineraryDetailPage } from './pages/ItineraryDetailPage';

export default function App() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/" element={<Navigate to={localStorage.getItem('itineraai_token') ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<VerifyOtpPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/itinerary/new" element={<CreateItineraryPage />} />
      <Route path="/itinerary/:id" element={<ItineraryDetailPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
