import { db } from '@/api/base44Client';

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageProvider';
import { analyzeComplaint } from '@/lib/analyzeComplaint';
import { CATEGORIES, categoryByLabel, createGrievanceId } from '@/lib/grievanceMeta';
import Stepper from '@/components/assistant/Stepper';
import DescribeStep from '@/components/assistant/DescribeStep';
import ReviewStep from '@/components/assistant/ReviewStep';
import DetailsStep from '@/components/assistant/DetailsStep';
import SuccessPanel from '@/components/assistant/SuccessPanel';

function normalizeCategory(value) {
  if (!value) return '';
  const match = CATEGORIES.find(
    (category) => category.key === value || category.label === value
  );
  return match ? match.key : '';
}

export default function Assistant() {
  const { t, lang } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(0);
  const [description, setDescription] = useState('');
  const [categoryKey, setCategoryKey] = useState(normalizeCategory(searchParams.get('category')));
  const [draft, setDraft] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiError, setAiError] = useState('');
  const [contact, setContact] = useState({ name: '', phone: '', email: '', location: '' });
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    if (!user) return;
    setContact((current) => ({
      ...current,
      name: current.name || user.full_name || '',
      email: current.email || user.email || '',
    }));
  }, [user]);

  const runAnalysis = async () => {
    if (description.trim().length < 12) {
      setFormError(t('assistant.missing'));
      return;
    }
    setFormError('');
    setAnalyzing(true);
    setAiError('');

    try {
      const result = await analyzeComplaint({ description, categoryKey, lang });
      const category = categoryByLabel(result?.category) || CATEGORIES[8];
      setDraft({
        title: result?.title || description.trim().slice(0, 90),
        categoryKey: category.key,
        category: category.label,
        department: result?.department || category.department,
        summary: result?.summary || description.trim(),
        priority: result?.priority || 'Medium',
        reasoning: result?.reasoning || '',
      });
    } catch {
      const category = CATEGORIES.find((item) => item.key === categoryKey) || CATEGORIES[8];
      setDraft({
        title: description.trim().split(/[.\n]/)[0].slice(0, 90),
        categoryKey: category.key,
        category: category.label,
        department: category.department,
        summary: description.trim().slice(0, 600),
        priority: 'Medium',
        reasoning: '',
      });
      setAiError(t('assistant.aiError'));
    } finally {
      setAnalyzing(false);
      setStep(1);
    }
  };

  const addFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const remaining = 3 - attachments.length;
      const selected = Array.from(files).slice(0, Math.max(remaining, 0));
      const uploaded = [];
      for (const file of selected) {
        const result = await db.integrations.Core.UploadPrivateFile({ file });
        if (result?.file_uri) uploaded.push(result.file_uri);
      }
      setAttachments((current) => [...current, ...uploaded].slice(0, 3));
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (uri) => {
    setAttachments((current) => current.filter((item) => item !== uri));
  };

  const submit = async () => {
    setFormError('');
    if (!contact.name.trim() || !contact.phone.trim()) {
      setFormError(t('assistant.details.required'));
      return;
    }

    setSubmitting(true);
    try {
      const record = await db.entities.Grievance.create({
        grievance_id: createGrievanceId(),
        title: draft.title.trim(),
        description: description.trim(),
        category: draft.category,
        department: draft.department.trim(),
        summary: draft.summary.trim(),
        priority: draft.priority,
        status: 'Submitted',
        location: contact.location.trim(),
        contact_name: contact.name.trim(),
        contact_phone: contact.phone.trim(),
        contact_email: contact.email.trim(),
        language: lang === 'te' ? 'Telugu' : 'English',
        reasoning: draft.reasoning || '',
        attachments,
        history: [
          {
            status: 'Submitted',
            note: '',
            date: new Date().toISOString(),
            by: contact.name.trim(),
          },
        ],
      });
      db.analytics.track({ eventName: 'grievance_submitted', properties: { category: draft.category } });
      setSaved(record);
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setFormError(t('assistant.submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(0);
    setDescription('');
    setCategoryKey('');
    setDraft(null);
    setAiError('');
    setAttachments([]);
    setPrivacy(false);
    setSaved(null);
    setFormError('');
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:py-16">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t('detail.back')}
      </Link>

      <h1 className="mt-4 font-heading text-[2rem] leading-tight tracking-[-0.02em] text-foreground sm:text-[2.35rem]">
        {t('assistant.title')}
      </h1>
      <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-muted-foreground">
        {t('assistant.sub')}
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-[0_30px_70px_-60px_rgba(15,23,42,0.6)] sm:p-8">
        <Stepper current={step} />
        <div className="mt-8">
          {step === 0 && (
            <DescribeStep
              description={description}
              setDescription={setDescription}
              categoryKey={categoryKey}
              setCategoryKey={setCategoryKey}
              onContinue={runAnalysis}
              analyzing={analyzing}
            />
          )}
          {step === 1 && draft && (
            <ReviewStep
              draft={draft}
              setDraft={setDraft}
              description={description}
              aiError={aiError}
              onBack={() => setStep(0)}
              onContinue={() => setStep(2)}
            />
          )}
          {step === 2 && draft && (
            <DetailsStep
              contact={contact}
              setContact={setContact}
              attachments={attachments}
              onAddFiles={addFiles}
              onRemoveFile={removeFile}
              uploading={uploading}
              privacy={privacy}
              setPrivacy={setPrivacy}
              onSubmit={submit}
              submitting={submitting}
              error={formError}
              isAuthenticated={isAuthenticated}
              onSignIn={() => db.auth.redirectToLogin(window.location.href)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && saved && <SuccessPanel record={saved} onReset={reset} />}
        </div>
      </div>

      {step === 0 && formError && (
        <p className="mt-4 text-center text-[11.5px] text-destructive">{formError}</p>
      )}
    </div>
  );
}