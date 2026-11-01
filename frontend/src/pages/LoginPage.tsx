import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    (location.state as { successMessage?: string } | null)?.successMessage ?? null,
  );

  useEffect(() => {
    if (location.state && 'successMessage' in location.state) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!emailOrUsername.trim() || !password.trim()) {
      setError('Please enter your email or username and password.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await authApi.login({
        emailOrUsername: emailOrUsername.trim(),
        password,
      });

      const token = response.data.data?.accessToken;
      const user = response.data.data?.user;

      if (token) {
        localStorage.setItem('itineraai_token', token);
      }

      if (user) {
        localStorage.setItem('itineraai_user', JSON.stringify(user));
      }

      setSuccessMessage('Login successful. Your session is ready.');
      setError('');
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : 'Login failed. Please try again.';

      if (message.toLowerCase().includes('not verified')) {
        setError('Your email is not verified yet. Please finish the OTP verification step.');
        navigate('/verify-email', { state: { email: emailOrUsername.includes('@') ? emailOrUsername : '' } });
        return;
      }

      setError(message);
      setSuccessMessage(null);
    } finally {
      setIsSubmitting(false);
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

        <h1>Welcome back</h1>
        <p className="muted">Plan your next trip with clarity and confidence.</p>

        {error ? <div className="form-message error">{error}</div> : null}
        {successMessage ? <div className="form-message success">{successMessage}</div> : null}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Email or username</span>
            <input
              type="text"
              value={emailOrUsername}
              onChange={(event) => setEmailOrUsername(event.target.value)}
              placeholder="you@example.com"
              autoComplete="username"
            />
          </label>

          <label>
            <span>Password</span>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <div className="inline-row">
            <Link to="/reset-password" className="text-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <button type="button" className="secondary-button" onClick={authApi.googleLogin}>
          Continue with Google
        </button>

        <p className="switch-copy">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
