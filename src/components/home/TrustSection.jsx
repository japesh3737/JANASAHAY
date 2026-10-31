import { Check, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageProvider';

export default function TrustSection() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20 lg:px-8 lg:py-24">
        <div className="lg:pt-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
            {t('trust.title')}
          </p>
          <h2 className="mt-3 max-w-md font-heading text-[1.9rem] leading-[1.15] tracking-[-0.015em] text-foreground sm:text-[2.35rem]">
            {t('trust.sub')}
          </h2>
          <div className="mt-8 rounded-xl border border-amber-200/80 bg-amber-50/70 p-4">
            <p className="flex items-start gap-2 text-[12px] font-semibold text-amber-900">
              <ShieldAlert className="mt-px h-4 w-4 shrink-0" strokeWidth={2} />
              {t('trust.notice.title')}
            </p>
            <p className="mt-2 pl-6 text-[11.5px] leading-relaxed text-amber-900/80">
              {t('trust.notice.body')}
            </p>
          </div>
        </div>

        <ul className="divide-y divide-border border-y border-border">
          {[1, 2, 3, 4].map((n) => (
            <li key={n} className="flex gap-4 py-5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <div>
                <p className="text-[13.5px] font-medium text-foreground">{t(`trust.${n}.title`)}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                  {t(`trust.${n}.body`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}