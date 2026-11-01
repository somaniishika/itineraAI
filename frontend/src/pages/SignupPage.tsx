import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

export function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.full_name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Full name, email, and password are required.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await authApi.signup({
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        username: form.username.trim() || undefined,
        password: form.password,
        address: form.address.trim() || undefined,
      });

      navigate('/verify-email', {
        state: { email: form.email.trim().toLowerCase(), purpose: 'VERIFY_EMAIL' },
      });
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card large-card">
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

        <h1>Create your account</h1>
        <p className="muted">Sign up to save and organize upcoming trips.</p>

        {error ? <div className="form-message error">{error}</div> : null}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Full name</span>
            <input
              type="text"
              value={form.full_name}
              onChange={(event) => handleChange('full_name', event.target.value)}
              placeholder="Jane Traveler"
            />
          </label>

          <div className="two-column">
            <label>
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label>
              <span>Username</span>
              <input
                type="text"
                value={form.username}
                onChange={(event) => handleChange('username', event.target.value)}
                placeholder="Optional"
                autoComplete="username"
              />
            </label>
          </div>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => handleChange('password', event.target.value)}
              placeholder="Create a password"
              autoComplete="new-password"
            />
          </label>

          <label>
            <span>Confirm password</span>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(event) => handleChange('confirmPassword', event.target.value)}
              placeholder="Repeat your password"
              autoComplete="new-password"
            />
          </label>

          <label>
            <span>Address</span>
            <input
              type="text"
              value={form.address}
              onChange={(event) => handleChange('address', event.target.value)}
              placeholder="Optional address"
            />
          </label>

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="switch-copy">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
