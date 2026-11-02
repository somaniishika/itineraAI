import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { itineraryApi } from '../services/api';
import type { CreateItineraryRequest, ItineraryQuestion } from '../types/itinerary';

type AnswerValue = string | string[];
type QuestionRole = 'destination' | 'country' | 'duration' | null;
const QUESTIONS_PER_STEP = 4;

function questionRole(questionText: string): QuestionRole {
  const text = questionText.toLowerCase();
  if (/destination|travel location|city or location/.test(text)) return 'destination';
  if (/which country|country.*visit|country.*travel/.test(text)) return 'country';
  if (/how many days|number of days|trip duration|travel duration/.test(text)) return 'duration';
  return null;
}

function answerList(value: AnswerValue | undefined): string[] {
  if (Array.isArray(value)) return value;
  return value ? value.split(',').map((item) => item.trim()).filter(Boolean) : [];
}

export function CreateItineraryPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('itineraai_token');
  const [questions, setQuestions] = useState<ItineraryQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [step, setStep] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [creationSucceeded, setCreationSucceeded] = useState(false);
  const submissionStarted = useRef(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    itineraryApi.questions()
      .then(({ data }) => {
        if (!active) return;
        setQuestions(data);
        setAnswers(Object.fromEntries(
          data
            .filter((question) => question.answer !== null && question.answer !== undefined)
            .map((question) => [question.question_text, question.answer as AnswerValue]),
        ));
      })
      .catch((requestError: Error & { status?: number }) => {
        if (!active) return;
        setError(requestError.status === 401 ? 'Please sign in again to load the trip questionnaire.' : requestError.message);
      })
      .finally(() => { if (active) setLoadingQuestions(false); });

    return () => { active = false; };
  }, []);

  if (!token) return <Navigate to="/login" replace />;

  const stepCount = Math.max(1, Math.ceil(questions.length / QUESTIONS_PER_STEP));
  const visibleQuestions = questions.slice(step * QUESTIONS_PER_STEP, (step + 1) * QUESTIONS_PER_STEP);
  const updateAnswer = (questionText: string, value: AnswerValue) => {
    setAnswers((current) => ({ ...current, [questionText]: value }));
  };

  const validateQuestions = (questionSet: ItineraryQuestion[]) => {
    const missing = questionSet.find((question) => {
      if (!questionRole(question.question_text)) return false;
      const value = answers[question.question_text];
      return Array.isArray(value) ? value.length === 0 : !value?.trim();
    });

    if (missing) {
      setError(`${missing.question_text} is required.`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submissionStarted.current) return;
    if (!validateQuestions(questions)) return;

    const destinationQuestion = questions.find((question) => questionRole(question.question_text) === 'destination');
    const countryQuestion = questions.find((question) => questionRole(question.question_text) === 'country');
    const durationQuestion = questions.find((question) => questionRole(question.question_text) === 'duration');
    const travelLocation = destinationQuestion ? answers[destinationQuestion.question_text] : '';
    const country = countryQuestion ? answers[countryQuestion.question_text] : '';
    const tripDuration = durationQuestion ? Number(answers[durationQuestion.question_text]) : NaN;

    if (typeof travelLocation !== 'string' || !travelLocation.trim() || typeof country !== 'string' || !country.trim()) {
      setError('The questionnaire must include destination and country questions before a trip can be generated.');
      return;
    }
    if (!Number.isInteger(tripDuration) || tripDuration < 1 || tripDuration > 10) {
      setError('Choose a trip length from 1 to 10 days.');
      return;
    }

    const sourceQuestionsAnswers = Object.fromEntries(
      questions
        .filter((question) => answers[question.question_text] !== undefined)
        .map((question) => [question.question_text, answers[question.question_text]]),
    );
    const payload: CreateItineraryRequest = {
      travel_location: travelLocation.trim(),
      country: country.trim(),
      trip_duration: tripDuration,
      source_questions_answers: sourceQuestionsAnswers,
    };

    setError('');
    setNotice('');
    submissionStarted.current = true;
    setSubmitting(true);
    try {
      await itineraryApi.create(payload);
      setCreationSucceeded(true);
    } catch (requestError) {
      const apiError = requestError as Error & { status?: number };
      if (apiError.status === 401) {
        setError('Your session is no longer valid. Sign in again before creating an itinerary.');
      } else if (apiError.status === 403) {
        setError(apiError.message || 'You do not have enough itinerary credits to generate a trip.');
      } else {
        setError(`${apiError.message || 'We could not confirm itinerary creation.'} Check My trips before trying again.`);
      }
      submissionStarted.current = false;
      setSubmitting(false);
      return;
    }

    try {
      const latestItinerary = await itineraryApi.list(1, 1);
      const createdId = latestItinerary.data.data[0]?.itinerary_id;
      if (createdId) {
        navigate(`/itinerary/${createdId}`, { replace: true });
      } else {
        setNotice('The generation request succeeded, but the new itinerary could not be found in your list. Open My trips to check again.');
      }
    } catch {
      setNotice('The itinerary was generated, but its saved record could not be loaded. Open My trips and check before trying again.');
    } finally {
      submissionStarted.current = false;
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: ItineraryQuestion) => {
    const value = answers[question.question_text];
    const required = questionRole(question.question_text) !== null;
    const options = question.options ?? [];

    if (question.field_type === 'dropdown') {
      return (
        <label className="question-field" key={question.id}>
          <span>{question.question_text}{required ? ' *' : ''}</span>
          <select required={required} value={typeof value === 'string' ? value : ''} onChange={(event) => updateAnswer(question.question_text, event.target.value)}>
            <option value="">Choose an option</option>
            {options.map((option) => <option value={option} key={option}>{option}</option>)}
          </select>
        </label>
      );
    }

    if (question.field_type === 'multi-select') {
      const selectedOptions = answerList(value);
      return (
        <fieldset className="question-field option-field" key={question.id}>
          <legend>{question.question_text}{required ? ' *' : ''}</legend>
          <div className="option-grid">
            {options.map((option) => (
              <label className="option-choice" key={option}>
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={(event) => updateAnswer(
                    question.question_text,
                    event.target.checked ? [...selectedOptions, option] : selectedOptions.filter((item) => item !== option),
                  )}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
      );
    }

    return (
      <label className="question-field" key={question.id}>
        <span>{question.question_text}{required ? ' *' : ''}</span>
        <input
          type={question.field_type === 'date' ? 'date' : 'text'}
          required={required}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => updateAnswer(question.question_text, event.target.value)}
          placeholder={question.field_type === 'date' ? undefined : 'Your answer'}
        />
      </label>
    );
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <Link to="/dashboard" className="brand-block app-brand">
          <img src="/logo.png" alt="" className="brand-logo" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          <span><span className="brand-name">ItineraAI</span><span className="brand-subtitle">TRAVEL ITINERARY</span></span>
        </Link>
        <nav className="app-nav" aria-label="Main navigation"><Link className="nav-link" to="/dashboard">My trips</Link></nav>
      </header>

      <section className="form-page-content">
        <Link to="/dashboard" className="back-link">← Back to My trips</Link>
        <div className="form-page-heading">
          <p className="eyebrow">A TRIP MADE FOR YOU</p>
          <h1>Create an itinerary</h1>
          <p className="muted">Tell us a little about the journey you have in mind.</p>
        </div>

        {loadingQuestions ? <div className="state-panel">Loading your trip questions…</div> : null}
        {!loadingQuestions && error && questions.length === 0 ? <div className="state-panel error-panel" role="alert">{error}</div> : null}
        {!loadingQuestions && questions.length > 0 ? (
          <form className="questionnaire-panel" onSubmit={handleSubmit}>
            <div className="step-heading">
              <span>Step {step + 1} of {stepCount}</span>
              <div className="step-track"><span style={{ width: `${((step + 1) / stepCount) * 100}%` }} /></div>
            </div>
            {error ? <div className="form-message error" role="alert">{error}</div> : null}
            {notice ? <div className="form-message success" role="status">{notice} <Link to="/dashboard">Go to My trips</Link></div> : null}
            <div className="question-list">{visibleQuestions.map(renderQuestion)}</div>
            <div className="questionnaire-actions">
              <button type="button" className="secondary-button compact-button" disabled={step === 0 || submitting} onClick={() => { setError(''); setStep((current) => current - 1); }}>Back</button>
              {step < stepCount - 1 ? (
                <button type="button" className="primary-button compact-button" onClick={() => { if (validateQuestions(visibleQuestions)) { setError(''); setStep((current) => current + 1); } }}>Continue</button>
              ) : (
                <button type="submit" className="primary-button compact-button" disabled={submitting || creationSucceeded}>{submitting ? 'Creating itinerary…' : creationSucceeded ? 'Itinerary submitted' : 'Generate itinerary'}</button>
              )}
            </div>
          </form>
        ) : null}
      </section>
    </main>
  );
}