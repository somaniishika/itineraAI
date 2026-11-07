import { FormEvent, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import type { ProfileDetails } from '../types/auth';

type ProfileForm = {
  full_name: string;
  username: string;
  address: string;
};

function formattedDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unavailable' : date.toLocaleDateString();
}

export function ProfilePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('itineraai_token');
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [form, setForm] = useState<ProfileForm>({ full_name: '', username: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError('');

    userApi.getProfile()
      .then(({ data }) => {
        if (!active) return;
        setProfile(data.data);
        setForm({
          full_name: data.data.full_name ?? '',
          username: data.data.username ?? '',
          address: data.data.address ?? '',
        });
      })
      .catch((requestError: Error & { status?: number }) => {
        if (!active) return;
        setLoadError(requestError.status === 401
          ? 'Your sign-in was not accepted. Sign in again to view your profile.'
          : requestError.status === 403
            ? 'Your account does not have permission to view this profile.'
            : !requestError.status
              ? 'We could not reach the API. Check that the backend is running and try again.'
              : requestError.message || 'We could not load your profile.');
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [reloadVersion]);

  if (!token) return <Navigate to="/login" replace />;

  const logout = () => {
    localStorage.removeItem('itineraai_token');
    localStorage.removeItem('itineraai_user');
    navigate('/login', { replace: true });
  };

  const beginEditing = () => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name,
      username: profile.username ?? '',
      address: profile.address ?? '',
    });
    setSaveError('');
    setSavedMessage('');
    setEditing(true);
  };

  const cancelEditing = () => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name,
      username: profile.username ?? '',
      address: profile.address ?? '',
    });
    setEditing(false);
    setSaveError('');
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setSaveError('');
    setSavedMessage('');

    try {
      const { data } = await userApi.updateProfile({
        full_name: form.full_name.trim(),
        username: form.username.trim(),
        address: form.address.trim(),
      });
      setProfile((current) => current ? { ...current, ...data.data } : current);
      try {
        const savedUser = localStorage.getItem('itineraai_user');
        if (savedUser) {
          localStorage.setItem('itineraai_user', JSON.stringify({ ...JSON.parse(savedUser), ...data.data }));
        }
      } catch {
        // The API response remains the source of truth if local display data cannot be updated.
      }
      setEditing(false);
      setSavedMessage('Your profile was updated.');
    } catch (requestError) {
      const apiError = requestError as Error & { status?: number };
      setSaveError(apiError.status === 401
        ? 'Your sign-in was not accepted. Sign in again before saving.'
        : apiError.status === 403
          ? 'Your account does not have permission to update this profile.'
          : apiError.message || 'We could not save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <Link to="/dashboard" className="brand-block app-brand" aria-label="ItineraAI dashboard">
          <img src="/logo.png" alt="" className="brand-logo" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          <span><span className="brand-name">ItineraAI</span><span className="brand-subtitle">TRAVEL ITINERARY</span></span>
        </Link>
        <nav className="app-nav" aria-label="Main navigation">
          <Link className="nav-link" to="/dashboard">My trips</Link>
          <Link className="nav-link active" to="/profile">Profile</Link>
          <button type="button" className="nav-link" onClick={logout}>Log out</button>
        </nav>
      </header>

      <section className="form-page-content profile-content">
        <Link to="/dashboard" className="back-link">← Back to My trips</Link>
        <div className="form-page-heading">
          <p className="eyebrow">YOUR ACCOUNT</p>
          <h1>Profile</h1>
          <p className="muted">View and update your account details.</p>
        </div>

        {loading ? <div className="state-panel">Loading your profile…</div> : null}
        {!loading && loadError ? (
          <div className="state-panel error-panel" role="alert">
            <p>{loadError}</p>
            <button type="button" className="secondary-button compact-button" onClick={() => setReloadVersion((current) => current + 1)}>Try again</button>
          </div>
        ) : null}
        {!loading && profile ? (
          editing ? (
            <form className="questionnaire-panel profile-panel" onSubmit={saveProfile}>
              {saveError ? <div className="form-message error" role="alert">{saveError}</div> : null}
              <div className="question-list">
                <label className="question-field">
                  <span>Full name</span>
                  <input required minLength={3} maxLength={40} value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))} />
                </label>
                <label className="question-field">
                  <span>Username</span>
                  <input required minLength={3} maxLength={20} value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} />
                </label>
                <label className="question-field">
                  <span>Address</span>
                  <input required minLength={3} value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
                </label>
                <div className="question-field">
                  <span>Email</span>
                  <p className="profile-readonly">{profile.email}</p>
                  <small>Email editing is not supported by this profile endpoint.</small>
                </div>
              </div>
              <div className="questionnaire-actions">
                <button type="button" className="secondary-button compact-button" disabled={saving} onClick={cancelEditing}>Cancel</button>
                <button type="submit" className="primary-button compact-button" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
              </div>
            </form>
          ) : (
            <section className="questionnaire-panel profile-panel" aria-labelledby="profile-details-heading">
              {savedMessage ? <div className="form-message success" role="status">{savedMessage}</div> : null}
              <div className="section-heading profile-heading">
                <div>
                  <p className="eyebrow">ACCOUNT DETAILS</p>
                  <h2 id="profile-details-heading">{profile.full_name}</h2>
                </div>
                <button type="button" className="primary-button compact-button" onClick={beginEditing}>Edit profile</button>
              </div>
              <dl className="profile-details">
                <div><dt>Email</dt><dd>{profile.email}</dd></div>
                <div><dt>Username</dt><dd>{profile.username || 'Not set'}</dd></div>
                <div><dt>Address</dt><dd>{profile.address || 'Not set'}</dd></div>
                <div><dt>Account type</dt><dd>{profile.role}</dd></div>
                <div><dt>Email status</dt><dd>{profile.email_verified ? 'Verified' : 'Not verified'}</dd></div>
                <div><dt>Member since</dt><dd>{formattedDate(profile.created_at)}</dd></div>
              </dl>
            </section>
          )
        ) : null}
      </section>
    </main>
  );
}