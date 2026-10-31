import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/lib/grievanceMeta';
import { useLanguage } from '@/lib/LanguageProvider';

const chipClass = (active) =>
  cn(
    'rounded-full border px-3 py-1.5 text-[11.5px] transition-colors',
    active
      ? 'border-accent bg-accent/10 font-medium text-accent'
      : 'border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground'
  );

export default function DescribeStep({
  description,
  setDescription,
  categoryKey,
  setCategoryKey,
  onContinue,
  analyzing,
}) {
  const { t } = useLanguage();
  const canContinue = description.trim().length >= 12 && !analyzing;

  return (
    <div>
      <h2 className="font-heading text-[1.45rem] leading-tight text-foreground">
        {t('assistant.describe.title')}
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        {t('assistant.describe.sub')}
      </p>

      <div className="relative mt-6">
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={6}
          maxLength={2000}
          placeholder={t('assistant.describe.placeholder')}
          className="w-full resize-none rounded-xl border border-input bg-card px-4 py-3.5 text-[13.5px] leading-relaxed text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
        />
        <span className="pointer-events-none absolute bottom-2.5 right-3.5 text-[10.5px] text-muted-foreground/70">
          {description.length}/2000
        </span>
      </div>

      <div className="mt-5">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {t('assistant.describe.category')}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <button type="button" onClick={() => setCategoryKey('')} className={chipClass(!categoryKey)}>
            {t('assistant.describe.chooseCategory')}
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category.key}
              type="button"
              onClick={() => setCategoryKey(category.key)}
              className={chipClass(categoryKey === category.key)}
            >
              {t(`cat.${category.key}`)}
            </button>
          ))}
        </div>
      </div>

      {analyzing ? (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-accent/25 bg-accent/[0.06] px-4 py-3.5">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-accent" />
          <div>
            <p className="text-[12.5px] font-medium text-accent">{t('assistant.analyzing')}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {t('assistant.analyzingHint')}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-7 flex flex-col-reverse items-stretch gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-muted-foreground">{t('assistant.describe.hint')}</p>
          <Button
            onClick={onContinue}
            disabled={!canContinue}
            className="rounded-full bg-primary px-5 text-[12.5px] font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t('assistant.continue')}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}