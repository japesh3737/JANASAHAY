import { AlertTriangle, ArrowLeft, ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CATEGORIES, PRIORITIES, priorityStyles } from '@/lib/grievanceMeta';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/LanguageProvider';

const fieldClass =
  'w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-[13px] text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-accent/50 focus:ring-4 focus:ring-accent/10';

const labelClass =
  'block text-[10.5px] font-semibold uppercase tracking-[0.15em] text-muted-foreground';

export default function ReviewStep({ draft, setDraft, description, onBack, onContinue, aiError }) {
  const { t } = useLanguage();
  const update = (patch) => setDraft({ ...draft, ...patch });

  const changeCategory = (key) => {
    const category = CATEGORIES.find((item) => item.key === key);
    update({ categoryKey: key, category: category.label, department: category.department });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-[1.45rem] leading-tight text-foreground">
            {t('assistant.review.title')}
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            {t('assistant.review.sub')}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/[0.07] px-2.5 py-1 text-[10.5px] font-medium text-accent">
          <Sparkles className="h-3 w-3" strokeWidth={2.2} />
          {t('assistant.review.aiNote')}
        </span>
      </div>

      {aiError && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-[11.5px] leading-relaxed text-amber-900">
          <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" />
          {t('assistant.aiError')}
        </div>
      )}

      <div className="mt-6 space-y-5">
        <div>
          <label className={labelClass} htmlFor="subject">
            {t('assistant.review.subject')}
          </label>
          <input
            id="subject"
            value={draft.title}
            onChange={(event) => update({ title: event.target.value })}
            maxLength={140}
            className={cn(fieldClass, 'mt-2 font-medium')}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="category">
              {t('assistant.review.category')}
            </label>
            <div className="relative mt-2">
              <select
                id="category"
                value={draft.categoryKey}
                onChange={(event) => changeCategory(event.target.value)}
                className={cn(fieldClass, 'appearance-none pr-9')}
              >
                {CATEGORIES.map((category) => (
                  <option key={category.key} value={category.key}>
                    {t(`cat.${category.key}`)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="priority">
              {t('assistant.review.priority')}
            </label>
            <div className="relative mt-2">
              <select
                id="priority"
                value={draft.priority}
                onChange={(event) => update({ priority: event.target.value })}
                className={cn(fieldClass, 'appearance-none pr-9 font-medium', priorityStyles[draft.priority])}
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {t(`priority.${priority}`)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="department">
            {t('assistant.review.department')}
          </label>
          <input
            id="department"
            value={draft.department}
            onChange={(event) => update({ department: event.target.value })}
            className={cn(fieldClass, 'mt-2')}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="summary">
            {t('assistant.review.summary')}
          </label>
          <textarea
            id="summary"
            value={draft.summary}
            onChange={(event) => update({ summary: event.target.value })}
            rows={4}
            className={cn(fieldClass, 'mt-2 resize-none leading-relaxed')}
          />
        </div>

        <div className="rounded-xl border border-border bg-background/70 p-4">
          <p className={labelClass}>{t('assistant.review.reasoning')}</p>
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            {draft.reasoning || '—'}
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-border p-4">
          <p className={labelClass}>{t('assistant.review.original')}</p>
          <p className="mt-2 whitespace-pre-line text-[12.5px] leading-relaxed text-foreground/80">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-7 flex flex-col-reverse items-stretch gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="rounded-full px-4 text-[12.5px] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          {t('assistant.back')}
        </Button>
        <Button
          onClick={onContinue}
          disabled={!draft.title.trim() || !draft.summary.trim()}
          className="rounded-full bg-primary px-5 text-[12.5px] font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t('assistant.continue')}
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}