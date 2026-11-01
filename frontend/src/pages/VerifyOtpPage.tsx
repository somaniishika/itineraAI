import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import type { AuthPurpose } from '../types/auth';

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state as { email?: string; purpose?: AuthPurpose } | null) ?? null;
  const initialPurpose: AuthPurpose =
    routeState?.purpose ?? (location.pathname === '/reset-password' ? 'PASSWORD_RESET' : 'VERIFY_EMAIL');

  const [purpose, setPurpose] = useState<AuthPurpose>(initialPurpose);
  const [email, setEmail] = useState(routeState?.email ?? '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError('Please enter the email address connected to your account.');
      return;
    }

    setError('');
    setSendingOtp(true);

    try {
      await authApi.sendOtp({ email: email.trim().toLowerCase(), purpose });
      setStatusMessage('A new verification code was sent to your email.');
    } catch (sendError) {
      setStatusMessage('');
      setError(sendError instanceof Error ? sendError.message : 'Unable to send the code right now.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerify = async (event: FormEvent) => {
    event.preventDefault();

    if (!email.trim() || !otp.trim()) {
      setError('Email and OTP are required.');
      return;
    }

    if (purpose === 'PASSWORD_RESET' && newPassword.trim().length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setError('');
    setVerifying(true);

    try {
      await authApi.verifyOtp({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        purpose,
        ...(purpose === 'PASSWORD_RESET' ? { newPassword } : {}),
      });

      setStatusMessage(
        purpose === 'VERIFY_EMAIL'
          ? 'Email verification successful. You can now log in.'
          : 'Your password was reset successfully.',
      );

      navigate('/login', {
        state: {
          successMessage:
            purpose === 'VERIFY_EMAIL'
              ? 'Your email is verified. You can now log in.'
              : 'Password reset successful. Please sign in with your new password.',
        },
      });
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : 'Verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="brand-block">
          <img
            src="/logo.png"
            alt="ItineraAI logo"
            className="brand-logo"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <p className="brand-name">ItineraAI</p>
            <p className="brand-subtitle">TRAVEL ITINERARY</p>
          </div>
        </div>

        <h1>{purpose === 'VERIFY_EMAIL' ? 'Verify your email' : 'Reset your password'}</h1>
        <p className="muted">
          {purpose === 'VERIFY_EMAIL'
            ? 'Enter the code sent to your inbox to confirm your account.'
            : 'Enter your email and the reset code to choose a new password.'}
        </p>

        {error ? <div className="form-message error">{error}</div> : null}
        {statusMessage ? <div className="form-message success">{statusMessage}</div> : null}

        <div className="segmented-tabs">
          <button
            type="button"
            className={purpose === 'VERIFY_EMAIL' ? 'tab active' : 'tab'}
            onClick={() => setPurpose('VERIFY_EMAIL')}
          >
            Verify email
          </button>
          <button
            type="button"
            className={purpose === 'PASSWORD_RESET' ? 'tab active' : 'tab'}
            onClick={() => setPurpose('PASSWORD_RESET')}
          >
            Reset password
          </button>
        </div>

        <form onSubmit={handleVerify} className="auth-form">
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <div className="otp-row">
            <label>
              <span>OTP code</span>
              <input
                type="text"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="123456"
                maxLength={6}
              />
            </label>

            <button type="button" className="secondary-button small-button" onClick={handleSendOtp} disabled={sendingOtp}>
              {sendingOtp ? 'Sending...' : 'Send code'}
            </button>
          </div>

          {purpose === 'PASSWORD_RESET' ? (
            <label>
              <span>New password</span>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Create a new password"
              />
            </label>
          ) : null}

          <button type="submit" className="primary-button" disabled={verifying}>
            {verifying ? 'Checking code...' : purpose === 'VERIFY_EMAIL' ? 'Verify email' : 'Reset password'}
          </button>
        </form>

        <p className="switch-copy">
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
