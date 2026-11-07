import { FormEvent, useEffect, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { adminApi } from '../services/api';
import type { AdminQuestionnaire, AdminQuestionnaireRequest } from '../types/admin';

type QuestionnaireForm = {
  question_text: string;
  field_type: AdminQuestionnaire['field_type'];
  options_text: string;
  image_url: string;
};

const emptyForm: QuestionnaireForm = {
  question_text: '',
  field_type: 'dropdown',
  options_text: '',
  image_url: '',
};

export function AdminQuestionnairePage() {
  const [questions, setQuestions] = useState<AdminQuestionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [form, setForm] = useState<QuestionnaireForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingOriginalType, setEditingOriginalType] = useState<AdminQuestionnaire['field_type'] | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError('');
    adminApi.questionnaire()
      .then(({ data }) => { if (active) setQuestions(data); })
      .catch((requestError: Error & { status?: number }) => {
        if (!active) return;
        setLoadError(requestError.status === 401
          ? 'Your sign-in was not accepted. Sign in again with an administrator account.'
          : requestError.status === 403
            ? 'Your account does not have administrator access.'
            : requestError.message || 'We could not load questionnaire questions.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refreshVersion]);

  const editQuestion = (question: AdminQuestionnaire) => {
    if (question.is_default) return;
    setEditingId(question.id);
    setEditingOriginalType(question.field_type);
    setForm({
      question_text: question.question_text,
      field_type: question.field_type,
      options_text: (question.options ?? []).join('\n'),
      image_url: question.image_url ?? '',
    });
    setFormError('');
    setMessage('');
  };

  const resetForm = () => {
    setEditingId(null);
    setEditingOriginalType(null);
    setForm(emptyForm);
    setFormError('');
  };

  const submitQuestion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    setMessage('');
    const options = form.options_text.split('\n').map((option) => option.trim()).filter(Boolean);
    if (form.field_type === 'dropdown' && options.length === 0) {
      setFormError('Dropdown questions need at least one option.');
      setSaving(false);
      return;
    }

    try {
      if (editingId === null) {
        const payload: AdminQuestionnaireRequest = {
          question_text: form.question_text.trim(),
          field_type: form.field_type,
          ...(options.length ? { options } : {}),
          ...(form.image_url.trim() ? { image_url: form.image_url.trim() } : {}),
        };
        await adminApi.createQuestionnaire(payload);
        setMessage('Question created.');
      } else {
        const payload: Partial<AdminQuestionnaireRequest> = {
          question_text: form.question_text.trim(),
          image_url: form.image_url.trim(),
          ...(editingOriginalType !== form.field_type ? { field_type: form.field_type } : {}),
          ...(options.length ? { options } : {}),
        };
        await adminApi.updateQuestionnaire(editingId, payload);
        setMessage('Question updated.');
      }
      resetForm();
      setRefreshVersion((current) => current + 1);
    } catch (requestError) {
      const apiError = requestError as Error & { status?: number };
      setFormError(apiError.message || 'We could not save this question.');
    } finally {
      setSaving(false);
    }
  };

  const deleteQuestion = async (question: AdminQuestionnaire) => {
    if (question.is_default || !window.confirm(`Delete “${question.question_text}”?`)) return;
    setDeletingId(question.id);
    setFormError('');
    setMessage('');
    try {
      await adminApi.deleteQuestionnaire(question.id);
      setMessage('Question deleted.');
      if (editingId === question.id) resetForm();
      setRefreshVersion((current) => current + 1);
    } catch (requestError) {
      const apiError = requestError as Error & { status?: number };
      setFormError(apiError.message || 'We could not delete this question.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout active="questionnaire">
      <section className="dashboard-content admin-content">
        <div className="form-page-heading">
          <p className="eyebrow">ADMINISTRATION</p>
          <h1>Questionnaire</h1>
          <p className="muted">Manage itinerary questions. Default questions are protected. The backend validator currently accepts new type changes only for dropdown and multi-select.</p>
        </div>

        {message ? <div className="form-message success" role="status">{message}</div> : null}
        {formError ? <div className="form-message error" role="alert">{formError}</div> : null}

        <form className="questionnaire-panel admin-form-panel" onSubmit={submitQuestion}>
          <div className="section-heading"><h2>{editingId === null ? 'Add a question' : 'Edit question'}</h2>{editingId !== null ? <button className="text-button" type="button" onClick={resetForm}>Cancel edit</button> : null}</div>
          <div className="question-list">
            <label className="question-field"><span>Question</span><input required minLength={5} maxLength={500} value={form.question_text} onChange={(event) => setForm((current) => ({ ...current, question_text: event.target.value }))} /></label>
            <label className="question-field"><span>Field type</span><select value={form.field_type} onChange={(event) => setForm((current) => ({ ...current, field_type: event.target.value as AdminQuestionnaire['field_type'] }))}>{editingOriginalType === 'text' ? <option value="text">Text (existing)</option> : null}{editingOriginalType === 'date' ? <option value="date">Date (existing)</option> : null}<option value="dropdown">Dropdown</option><option value="multi-select">Multi-select</option></select></label>
            {(form.field_type === 'dropdown' || form.field_type === 'multi-select') ? <label className="question-field"><span>Options (one per line){form.field_type === 'dropdown' ? ' *' : ''}</span><textarea rows={5} required={form.field_type === 'dropdown'} value={form.options_text} onChange={(event) => setForm((current) => ({ ...current, options_text: event.target.value }))} /></label> : null}
            <label className="question-field"><span>Image URL (optional)</span><input type="url" value={form.image_url} onChange={(event) => setForm((current) => ({ ...current, image_url: event.target.value }))} /></label>
          </div>
          <div className="questionnaire-actions"><span /> <button className="primary-button compact-button" disabled={saving}>{saving ? 'Saving…' : editingId === null ? 'Add question' : 'Save question'}</button></div>
        </form>

        <section className="admin-section">
          <div className="section-heading"><h2>Questions</h2><button className="text-button" type="button" onClick={() => setRefreshVersion((current) => current + 1)}>Refresh</button></div>
          {loading ? <div className="state-panel">Loading questions…</div> : null}
          {!loading && loadError ? <div className="state-panel error-panel" role="alert"><p>{loadError}</p><button className="secondary-button compact-button" type="button" onClick={() => setRefreshVersion((current) => current + 1)}>Try again</button></div> : null}
          {!loading && !loadError && questions.length === 0 ? <div className="state-panel empty-panel"><h3>No questionnaire questions</h3></div> : null}
          {!loading && !loadError && questions.length > 0 ? <div className="admin-table-wrap"><table className="admin-table">
            <thead><tr><th>Question</th><th>Type</th><th>Options</th><th>Kind</th><th>Actions</th></tr></thead>
            <tbody>{questions.map((question) => <tr key={question.id}>
              <td>{question.question_text}</td><td>{question.field_type}</td><td>{question.options?.join(', ') || '—'}</td><td>{question.is_default ? 'Default' : 'Custom'}</td>
              <td className="admin-actions">{question.is_default ? <span className="muted">Protected</span> : <><button className="text-button" type="button" onClick={() => editQuestion(question)}>Edit</button><button className="text-button danger-link" type="button" disabled={deletingId === question.id} onClick={() => void deleteQuestion(question)}>{deletingId === question.id ? 'Deleting…' : 'Delete'}</button></>}</td>
            </tr>)}</tbody>
          </table></div> : null}
        </section>
      </section>
    </AdminLayout>
  );
}
