import { PenLine, Sparkles, ClipboardCheck, Activity } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageProvider';

const ICONS = [PenLine, Sparkles, ClipboardCheck, Activity];

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-24">
        <div className="max-w-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
            {t('steps.title')}
          </p>
          <h2 className="mt-3 font-heading text-[1.9rem] leading-[1.15] tracking-[-0.015em] text-foreground sm:text-[2.35rem]">
            {t('steps.sub')}
          </h2>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => {
            const Icon = ICONS[n - 1];
            return (
              <div key={n} className="group relative bg-card p-6 transition-colors hover:bg-background">
                <div className="flex items-start justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                    <Icon className="h-[16px] w-[16px]" strokeWidth={1.8} />
                  </span>
                  <span className="font-heading text-[24px] leading-none text-border transition-colors group-hover:text-accent/30">
                    0{n}
                  </span>
                </div>
                <h3 className="mt-7 text-[14px] font-semibold leading-snug text-foreground">
                  {t(`steps.${n}.title`)}
                </h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                  {t(`steps.${n}.body`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}