import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { itineraryApi } from '../services/api';
import type { ItineraryRecord } from '../types/itinerary';

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function ItineraryDetailPage() {
  const { id: routeId } = useParams();
  const itineraryId = Number(routeId);
  const token = localStorage.getItem('itineraai_token');
  const [itinerary, setItinerary] = useState<ItineraryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!Number.isInteger(itineraryId) || itineraryId < 1) {
      setError('This itinerary address is not valid.');
      setLoading(false);
      return;
    }

    let active = true;
    itineraryApi.detail(itineraryId)
      .then(({ data }) => { if (active) setItinerary(data); })
      .catch((requestError: Error & { status?: number }) => {
        if (!active) return;
        setError(requestError.status === 401 ? 'Please sign in again to view this itinerary.' : requestError.message || 'We could not load this itinerary.');
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [itineraryId]);

  if (!token) return <Navigate to="/login" replace />;
  const content = itinerary?.content;
  const days = Array.isArray(content?.days) ? content.days : [];

  return (
    <main className="app-shell">
      <header className="app-header">
        <Link to="/dashboard" className="brand-block app-brand">
          <img src="/logo.png" alt="" className="brand-logo" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          <span><span className="brand-name">ItineraAI</span><span className="brand-subtitle">TRAVEL ITINERARY</span></span>
        </Link>
        <nav className="app-nav" aria-label="Main navigation"><Link className="nav-link" to="/dashboard">My trips</Link></nav>
      </header>

      <section className="detail-content">
        <Link to="/dashboard" className="back-link">← Back to My trips</Link>
        {loading ? <div className="state-panel">Loading your itinerary…</div> : null}
        {!loading && error ? <div className="state-panel error-panel" role="alert"><p>{error}</p><Link className="secondary-button compact-button" to="/dashboard">Return to My trips</Link></div> : null}
        {!loading && itinerary && content ? (
          <>
            <section className="itinerary-hero">
              <p className="eyebrow">{itinerary.type === 'CUSTOM' ? 'CUSTOM JOURNEY' : 'YOUR JOURNEY'}</p>
              <h1>{content.itinerary_title || `${itinerary.travel_location}, ${itinerary.country}`}</h1>
              <p className="detail-destination">{content.user_travel_location || itinerary.travel_location}{(content.country_name || itinerary.country) ? `, ${content.country_name || itinerary.country}` : ''}</p>
              {content.description ? <p className="detail-description">{content.description}</p> : null}
              {formatDate(itinerary.created_at) ? <p className="detail-date">Created {formatDate(itinerary.created_at)}</p> : null}
            </section>

            {days.length ? (
              <section className="days-list" aria-label="Day by day itinerary">
                {days.map((day, dayIndex) => (
                  <article className="day-section" key={`${day.day ?? dayIndex}-${dayIndex}`}>
                    <div className="day-heading">
                      <span className="day-number">Day {day.day ?? dayIndex + 1}</span>
                      <div>
                        <h2>{day.day_title || `Day ${day.day ?? dayIndex + 1}`}</h2>
                        {day.tags?.length ? <div className="tag-list">{day.tags.map((tag) => <span className="trip-tag" key={tag}>{tag}</span>)}</div> : null}
                      </div>
                    </div>
                    {day.activities?.length ? (
                      <div className="activity-list">
                        {day.activities.map((activity, activityIndex) => (
                          <article className="activity-row" key={`${activity.title ?? 'activity'}-${activityIndex}`}>
                            <div className="activity-time">{activity.time || 'Flexible'}</div>
                            <div className="activity-copy">
                              <h3>{activity.title || 'Activity'}</h3>
                              {activity.description ? <p>{activity.description}</p> : null}
                              <div className="activity-meta">
                                {activity.duration ? <span>{activity.duration}</span> : null}
                                {activity.cost ? <span>{activity.cost}</span> : null}
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : <p className="muted">No activities were included for this day.</p>}
                  </article>
                ))}
              </section>
            ) : <div className="state-panel">This itinerary does not contain day-by-day details.</div>}
          </>
        ) : null}
      </section>
    </main>
  );
}