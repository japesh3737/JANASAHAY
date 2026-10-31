import { Sparkles } from 'lucide-react';
import StatusTimeline from '@/components/StatusTimeline';
import { useLanguage } from '@/lib/LanguageProvider';

export default function GrievancePreviewCard() {
  const { t } = useLanguage();

  const steps = [
    { label: t('status.Submitted'), done: true },
    { label: t('status.Under Review'), done: true },
    { label: t('status.Assigned'), done: true },
    { label: t('status.In Progress'), done: false, active: true },
  ];

  return (
    <div className="relative">
      <div
        className="absolute -inset-4 rounded-[30px] bg-gradient-to-br from-accent/10 via-transparent to-primary/[0.06] blur-xl"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-[22px] border border-border bg-card shadow-[0_36px_80px_-52px_rgba(15,23,42,0.55)]">
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-3.5">
          <span className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {t('preview.label')}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[10.5px] font-medium text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t('preview.status')}
          </span>
        </div>

        <div className="px-5 py-4">
          <p className="font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground">
            {t('preview.id')}
          </p>
          <h3 className="mt-2 font-heading text-[19px] leading-snug text-foreground">
            {t('preview.title')}
          </h3>

          <div className="mt-4 rounded-xl border border-border/80 bg-background/70 p-3.5">
            <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-accent">
              <Sparkles className="h-3 w-3" strokeWidth={2.2} />
              {t('preview.aiLabel')}
            </p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-foreground/80">
              {t('preview.aiBody')}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-dashed border-border pt-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                {t('preview.department')}
              </p>
              <p className="mt-1 text-[11.5px] font-medium leading-snug text-foreground">
                {t('preview.departmentValue')}
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                {t('preview.priority')}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-[11.5px] font-medium text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {t('preview.priorityValue')}
              </p>
            </div>
          </div>

          <StatusTimeline steps={steps} className="mt-5" />
        </div>

        <div className="border-t border-border/70 bg-background/60 px-5 py-2.5">
          <p className="text-[10.5px] text-muted-foreground">{t('preview.footnote')}</p>
        </div>
      </div>
    </div>
  );
}