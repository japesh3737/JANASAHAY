import { Link } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageProvider';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-card/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Landmark className="h-3.5 w-3.5" strokeWidth={1.9} />
            </span>
            <span className="text-[11.5px] font-semibold tracking-[0.2em] text-foreground">
              JANASAHAY
            </span>
          </div>
          <p className="mt-4 text-[12.5px] leading-relaxed text-muted-foreground">
            {t('footer.note')}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-3 text-[12.5px] text-muted-foreground">
          <Link to="/assistant" className="transition-colors hover:text-foreground">
            {t('nav.submit')}
          </Link>
          <Link to="/track" className="transition-colors hover:text-foreground">
            {t('nav.track')}
          </Link>
          <Link to="/my-grievances" className="transition-colors hover:text-foreground">
            {t('nav.mine')}
          </Link>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 text-[11px] text-muted-foreground/80 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>{t('footer.rights')}</span>
          <span>{t('trust.notice.title')}</span>
        </div>
      </div>
    </footer>
  );
}