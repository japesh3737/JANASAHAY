import { db } from '@/api/base44Client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';

import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageProvider';
import { CLOSED_STATUSES, formatDate } from '@/lib/grievanceMeta';
import StatusBadge from '@/components/StatusBadge';
import StatusUpdateDialog from '@/components/dashboard/StatusUpdateDialog';

const PAGE_SIZE = 10;

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0, high: 0 });
  const [byCategory, setByCategory] = useState([]);
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    const [total, open, resolved, high, groups, page] = await Promise.all([
      db.entities.Grievance.count({}),
      db.entities.Grievance.count({ status: { $nin: CLOSED_STATUSES } }),
      db.entities.Grievance.count({ status: 'Resolved' }),
      db.entities.Grievance.count({ priority: { $in: ['High', 'Critical'] } }),
      db.entities.Grievance
        .aggregate({ groupBy: 'category' })
        .catch(() => ({ rows: [] })),
      db.entities.Grievance.list({ sort: '-created_date', limit: PAGE_SIZE }),
    ]);

    setStats({ total, open, resolved, high });
    setByCategory(
      (groups?.rows || [])
        .filter((row) => row.category)
        .sort((a, b) => b.count - a.count)
    );
    setItems(page.items || []);
    setCursor(page.next_cursor || null);
    setHasMore(Boolean(page.has_more));
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const page = await db.entities.Grievance.list({
        sort: '-created_date',
        limit: PAGE_SIZE,
        cursor,
      });
      setItems((current) => [...current, ...(page.items || [])]);
      setCursor(page.next_cursor || null);
      setHasMore(Boolean(page.has_more));
    } finally {
      setLoadingMore(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <Lock className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <h1 className="mt-5 font-heading text-[1.5rem] text-foreground">{t('dash.adminOnly')}</h1>
        <p className="mx-auto mt-2 max-w-sm text-[12.5px] leading-relaxed text-muted-foreground">
          {t('dash.adminOnlyBody')}
        </p>
        <Link
          to="/my-grievances"
          className="mt-5 inline-block rounded-full bg-primary px-5 py-2.5 text-[12.5px] font-medium text-primary-foreground"
        >
          {t('nav.mine')}
        </Link>
      </div>
    );
  }

  const kpis = [
    { label: t('dash.total'), value: stats.total },
    { label: t('dash.open'), value: stats.open },
    { label: t('dash.resolved'), value: stats.resolved },
    { label: t('dash.high'), value: stats.high },
  ];

  const maxCount = Math.max(...byCategory.map((row) => row.count), 1);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <h1 className="font-heading text-[2rem] leading-tight tracking-[-0.02em] text-foreground sm:text-[2.35rem]">
        {t('dash.title')}
      </h1>
      <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-muted-foreground">{t('dash.sub')}</p>

      <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-card px-5 py-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {kpi.label}
            </p>
            <p className="mt-2 font-heading text-[2rem] leading-none text-foreground">
              {loading ? '—' : kpi.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t('dash.byCategory')}
          </p>
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : byCategory.length === 0 ? (
            <p className="mt-4 text-[12px] text-muted-foreground">{t('dash.empty')}</p>
          ) : (
            <div className="mt-4 space-y-3.5">
              {byCategory.map((row) => (
                <div key={row.category}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-[11.5px] text-foreground">{row.category}</span>
                    <span className="text-[11px] tabular-nums text-muted-foreground">{row.count}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: `${Math.max((row.count / maxCount) * 100, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t('dash.table.subject')}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t('dash.table.status')}
            </p>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <p className="px-5 py-10 text-center text-[12px] text-muted-foreground">{t('dash.empty')}</p>
          ) : (
            <div className="divide-y divide-border">
              {items.map((grievance) => (
                <div
                  key={grievance.id}
                  className="flex flex-col gap-2.5 px-5 py-3.5 sm:flex-row sm:items-center sm:gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/grievance/${grievance.id}`}
                      className="block truncate text-[12.5px] font-medium text-foreground transition-colors hover:text-accent"
                    >
                      {grievance.title}
                    </Link>
                    <p className="mt-0.5 truncate font-mono text-[10px] tracking-[0.06em] text-muted-foreground">
                      {grievance.grievance_id} · {grievance.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={grievance.status} />
                    <span className="hidden text-[11px] text-muted-foreground sm:block">
                      {formatDate(grievance.created_date)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelected(grievance)}
                      className="rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      {t('dash.update')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="border-t border-border px-5 py-3 text-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {loadingMore && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {t('dash.loadMore')}
              </button>
            </div>
          )}
        </div>
      </div>

      <StatusUpdateDialog
        grievance={selected}
        open={Boolean(selected)}
        onOpenChange={(value) => {
          if (!value) setSelected(null);
        }}
        onSaved={load}
      />
    </div>
  );
}