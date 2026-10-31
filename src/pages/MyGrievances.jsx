import { db } from '@/api/base44Client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Plus } from 'lucide-react';

import { STATUSES } from '@/lib/grievanceMeta';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/LanguageProvider';
import GrievanceCard from '@/components/GrievanceCard';

const PAGE_SIZE = 9;

export default function MyGrievances() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const options = (extra) => ({ sort: '-created_date', limit: PAGE_SIZE, ...extra });

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      const page =
        filter === 'all'
          ? await db.entities.Grievance.list(options())
          : await db.entities.Grievance.filter({ status: filter }, options());
      if (!active) return;
      setItems(page.items || []);
      setCursor(page.next_cursor || null);
      setHasMore(Boolean(page.has_more));
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [filter]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const page =
        filter === 'all'
          ? await db.entities.Grievance.list(options({ cursor }))
          : await db.entities.Grievance.filter({ status: filter }, options({ cursor }));
      setItems((current) => [...current, ...(page.items || [])]);
      setCursor(page.next_cursor || null);
      setHasMore(Boolean(page.has_more));
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-[2rem] leading-tight tracking-[-0.02em] text-foreground sm:text-[2.35rem]">
            {t('mine.title')}
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{t('mine.sub')}</p>
        </div>
        <Link
          to="/assistant"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[12.5px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          {t('mine.new')}
        </Link>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {['all', ...STATUSES].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-[11.5px] transition-colors',
              filter === status
                ? 'border-primary bg-primary font-medium text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground'
            )}
          >
            {status === 'all' ? t('mine.all') : t(`status.${status}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
          <p className="font-heading text-[1.25rem] text-foreground">{t('mine.empty')}</p>
          <p className="mx-auto mt-2 max-w-sm text-[12.5px] leading-relaxed text-muted-foreground">
            {t('mine.emptyBody')}
          </p>
          <Link
            to="/assistant"
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[12.5px] font-medium text-primary-foreground"
          >
            {t('mine.new')}
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((grievance) => (
              <GrievanceCard key={grievance.id} grievance={grievance} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-7 text-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {loadingMore && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {t('dash.loadMore')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}