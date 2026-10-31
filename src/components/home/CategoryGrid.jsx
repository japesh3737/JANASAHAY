import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/grievanceMeta';
import { useLanguage } from '@/lib/LanguageProvider';

export default function CategoryGrid() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-24">
        <div className="max-w-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
            {t('cats.title')}
          </p>
          <h2 className="mt-3 font-heading text-[1.9rem] leading-[1.15] tracking-[-0.015em] text-foreground sm:text-[2.35rem]">
            {t('cats.sub')}
          </h2>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.key}
                to={`/assistant?category=${encodeURIComponent(category.key)}`}
                className="group flex items-start gap-3.5 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_22px_45px_-38px_rgba(15,23,42,0.6)]"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                  <Icon className="h-[17px] w-[17px]" strokeWidth={1.7} />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-[13px] font-medium leading-snug text-foreground">
                    {t(`cat.${category.key}`)}
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-50" />
                  </span>
                  <span className="mt-1 block text-[11.5px] leading-relaxed text-muted-foreground">
                    {t(`cat.${category.key}Desc`)}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}