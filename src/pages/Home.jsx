import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Search } from 'lucide-react';
import GrievancePreviewCard from '@/components/GrievancePreviewCard';
import HowItWorks from '@/components/home/HowItWorks';
import CategoryGrid from '@/components/home/CategoryGrid';
import TrustSection from '@/components/home/TrustSection';
import { useLanguage } from '@/lib/LanguageProvider';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] paper-grid opacity-[0.55] [mask-image:radial-gradient(75%_60%_at_50%_0%,black,transparent)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-14 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
            <div className="fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.07] px-3 py-1.5 text-[10.5px] font-medium text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t('hero.badge')}
              </span>

              <h1 className="mt-6 max-w-xl font-heading text-[2.6rem] font-normal leading-[1.05] tracking-[-0.025em] text-foreground sm:text-[3.1rem] lg:text-[3.4rem]">
                {t('hero.titleLead')}{' '}
                <span className="relative inline-block text-accent">
                  {t('hero.titleAccent')}
                  <svg
                    className="absolute -bottom-1.5 left-0 h-2 w-full text-accent/30"
                    viewBox="0 0 200 8"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path
                      d="M2 5.5C40 2 90 2 198 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="mt-8 max-w-lg text-[14px] leading-[1.75] text-muted-foreground">
                {t('hero.body')}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  to="/assistant"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {t('hero.cta')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/track"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-[13px] font-medium text-foreground transition-colors hover:border-foreground/20"
                >
                  <Search className="h-4 w-4" strokeWidth={1.9} />
                  {t('hero.secondary')}
                </Link>
              </div>

              <p className="mt-7 flex max-w-md items-start gap-2 text-[11.5px] leading-relaxed text-muted-foreground">
                <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2} />
                {t('hero.note')}
              </p>
            </div>

            <div className="fade-up lg:pl-2" style={{ animationDelay: '120ms' }}>
              <GrievancePreviewCard />
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <CategoryGrid />
      <TrustSection />

      <section className="mx-auto max-w-6xl px-5 pb-20 lg:px-8 lg:pb-24">
        <div className="relative overflow-hidden rounded-[26px] bg-primary px-7 py-14 sm:px-12 lg:px-16">
          <div className="pointer-events-none absolute inset-0 paper-grid-light opacity-70" aria-hidden />
          <div className="relative max-w-2xl">
            <h2 className="font-heading text-[1.9rem] leading-[1.12] tracking-[-0.015em] text-primary-foreground sm:text-[2.4rem]">
              {t('cta.title')}
            </h2>
            <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-primary-foreground/70">
              {t('cta.body')}
            </p>
            <Link
              to="/assistant"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-[13px] font-medium text-foreground transition-colors hover:bg-background/90"
            >
              {t('cta.button')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}