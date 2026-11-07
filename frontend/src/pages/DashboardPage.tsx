import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { featureApi, itineraryApi } from '../services/api';
import type { ItineraryListItem, ItineraryListResponse } from '../types/itinerary';
import type { UserProfile } from '../types/auth';

const PAGE_SIZE = 6;

function readUser(): UserProfile | null {
  try {
    const savedUser = localStorage.getItem('itineraai_user');
    return savedUser ? (JSON.parse(savedUser) as UserProfile) : null;
  } catch {
    return null;
  }
}

function formatDate(value?: string) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString();
}

function requestRequiresSignIn(message: string) {
  return message.startsWith('The API did not accept your sign-in.');
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [itineraryResult, setItineraryResult] = useState<ItineraryListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creditRefreshVersion, setCreditRefreshVersion] = useState(0);
  const [itineraryCredits, setItineraryCredits] = useState<number | null>(null);
  const [creditLoading, setCreditLoading] = useState(true);
  const [creditError, setCreditError] = useState('');
  const [itineraryPrice, setItineraryPrice] = useState<{ amount: number; currency: string } | null>(null);
  const [priceError, setPriceError] = useState('');
  const user = readUser();
  const token = localStorage.getItem('itineraai_token');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    itineraryApi.list(page, PAGE_SIZE)
      .then((response) => {
        if (active) setItineraryResult(response.data);
      })
      .catch((requestError: Error & { status?: number }) => {
        if (active) {
          if (requestError.status === 401) {
            setError('The API did not accept your sign-in. Your session may be expired or invalid. Sign in again to retry.');
          } else if (requestError.status === 403) {
            setError('Your account does not have permission to access itineraries.');
          } else if (!requestError.status) {
            setError('We could not reach the API. Check that the backend is running and try again.');
          } else {
            setError(requestError.message || 'We could not load your itineraries.');
          }
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [page, refreshVersion]);

  useEffect(() => {
    let active = true;
    setCreditLoading(true);
    setCreditError('');
    setPriceError('');

    featureApi.credits()
      .then(({ data }) => {
        if (active) setItineraryCredits(data.data.feature_balances.ITINERARY ?? 0);
      })
      .catch((requestError: Error & { status?: number }) => {
        if (!active) return;
        setCreditError(requestError.status === 401
          ? 'Your sign-in was not accepted. Sign in again to check your credits.'
          : requestError.status === 403
            ? 'Your account cannot access its credit balance.'
            : requestError.message || 'We could not load your credit balance.');
      })
      .finally(() => { if (active) setCreditLoading(false); });

    featureApi.price('ITINERARY')
      .then(({ data }) => {
        if (active) setItineraryPrice({ amount: data.data.priceAmount, currency: data.data.currency });
      })
      .catch((requestError: Error) => {
        if (active) setPriceError(requestError.message || 'Current itinerary pricing is unavailable.');
      });

    return () => { active = false; };
  }, [creditRefreshVersion]);

  if (!token) return <Navigate to="/login" replace />;

  const logout = () => {
    localStorage.removeItem('itineraai_token');
    localStorage.removeItem('itineraai_user');
    navigate('/login', { replace: true });
  };

  const itineraries: ItineraryListItem[] = itineraryResult?.data ?? [];

  return (
    <main className="app-shell">
      <header className="app-header">
        <Link to="/dashboard" className="brand-block app-brand" aria-label="ItineraAI dashboard">
          <img src="/logo.png" alt="" className="brand-logo" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          <span>
            <span className="brand-name">ItineraAI</span>
            <span className="brand-subtitle">TRAVEL ITINERARY</span>
          </span>
        </Link>
        <nav className="app-nav" aria-label="Main navigation">
          <Link className="nav-link active" to="/dashboard">My trips</Link>
          <Link className="nav-link" to="/profile">Profile</Link>
          <button type="button" className="nav-link" onClick={logout}>Log out</button>
        </nav>
      </header>

      <section className="dashboard-content">
        <div className="welcome-row">
          <div>
            <p className="eyebrow">YOUR TRAVEL DESK</p>
            <h1>Welcome{user?.full_name ? `, ${user.full_name}` : ' back'}</h1>
            <p className="muted">Your plans, all in one place.</p>
          </div>
          <Link className="primary-button create-button" to="/itinerary/new">+ Create new itinerary</Link>
        </div>

        <section className="credit-summary" aria-label="Itinerary credits">
          <div>
            <p className="eyebrow">ITINERARY CREDITS</p>
            {creditLoading ? <p className="credit-value">Checking balance…</p> : null}
            {!creditLoading && creditError ? (
              <div className="credit-error" role="alert">
                <p>{creditError}</p>
                <button type="button" className="text-button" onClick={() => setCreditRefreshVersion((current) => current + 1)}>Try again</button>
              </div>
            ) : null}
            {!creditLoading && !creditError && itineraryCredits !== null ? (
              <>
                <p className="credit-value">{itineraryCredits} <span>available</span></p>
                {itineraryCredits === 0 ? <p className="credit-note">You are out of itinerary credits. Purchases are not available yet.</p> : null}
              </>
            ) : null}
          </div>
          <div className="credit-pricing">
            <p className="eyebrow">PRICE PER CREDIT</p>
            {itineraryPrice ? <p className="credit-value">{itineraryPrice.currency} {itineraryPrice.amount}</p> : null}
            {priceError ? <p className="credit-note">{priceError}</p> : null}
            <p className="credit-note">Payment checkout is not enabled yet.</p>
          </div>
        </section>

        <section className="itinerary-section" aria-labelledby="my-itineraries-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR JOURNEYS</p>
              <h2 id="my-itineraries-heading">My itineraries</h2>
            </div>
            {itineraryResult?.meta.total ? <span className="result-count">{itineraryResult.meta.total} trips</span> : null}
          </div>

          {loading ? <div className="state-panel">Loading your itineraries…</div> : null}
          {!loading && error ? (
            <div className="state-panel error-panel" role="alert">
              <p>{error}</p>
              {requestRequiresSignIn(error) ? <button className="secondary-button compact-button" onClick={logout}>Sign in again</button> : <button className="secondary-button compact-button" onClick={() => setRefreshVersion((current) => current + 1)}>Try again</button>}
            </div>
          ) : null}
          {!loading && !error && itineraries.length === 0 ? (
            <div className="state-panel empty-panel">
              <div className="empty-mark" aria-hidden="true">✦</div>
              <h3>Your next journey starts here</h3>
              <p>There are no saved itineraries yet.</p>
              <Link className="secondary-button compact-button" to="/itinerary/new">Plan your first trip</Link>
            </div>
          ) : null}
          {!loading && !error && itineraries.length > 0 ? (
            <div className="itinerary-grid">
              {itineraries.map((itinerary) => (
                <Link to={`/itinerary/${itinerary.itinerary_id}`} className="trip-card" key={itinerary.itinerary_id}>
                  <span className="trip-card-topline">{itinerary.country || 'Destination'}</span>
                  <h3>{itinerary.title || itinerary.travel_location || 'Untitled itinerary'}</h3>
                  <p className="trip-destination">{itinerary.travel_location}{itinerary.country ? `, ${itinerary.country}` : ''}</p>
                  <span className="trip-date">Created {formatDate(itinerary.created_at)}</span>
                  <span className="trip-open">Open itinerary <span aria-hidden="true">→</span></span>
                </Link>
              ))}
            </div>
          ) : null}

          {!loading && !error && itineraryResult && itineraryResult.meta.totalPages > 1 ? (
            <div className="pagination-row">
              <button type="button" className="secondary-button compact-button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
              <span>Page {itineraryResult.meta.page} of {itineraryResult.meta.totalPages}</span>
              <button type="button" className="secondary-button compact-button" disabled={page >= itineraryResult.meta.totalPages} onClick={() => setPage((current) => current + 1)}>Next</button>
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}