import { db } from '@/api/base44Client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Search } from 'lucide-react';

import { useLanguage } from '@/lib/LanguageProvider';
import { historySteps } from '@/lib/grievanceMeta';
import StatusBadge from '@/components/StatusBadge';
import PriorityLabel from '@/components/PriorityLabel';
import StatusTimeline from '@/components/StatusTimeline';

export default function Track() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [record, setRecord] = useState(null);

  const search = async (event) => {
    event.preventDefault();
    const code = query.trim().toUpperCase();
    if (!code) return;

    setLoading(true);
    setSearched(false);
    setRecord(null);
    try {
      const page = await db.entities.Grievance.filter({ grievance_id: code }, { limit: 1 });
      setRecord(page.items?.[0] || null);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 lg:py-16">
      <h1 className="font-heading text-[2rem] leading-tight tracking-[-0.02em] text-foreground sm:text-[2.35rem]">
        {t('track.title')}
      </h1>
      <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">
        {t('track.sub')}
      </p>

      <form onSubmit={search} className="mt-8 flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('track.placeholder')}
            className="w-full rounded-full border border-input bg-card py-3 pl-10 pr-4 font-mono text-[13px] tracking-[0.04em] text-foreground shadow-sm outline-none transition placeholder:font-body placeholder:tracking-normal placeholder:text-muted-foreground/70 focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-6 py-3 text-[12.5px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {t('track.button')}
        </button>
      </form>

      {searched && !record && (
        <div className="mt-8 rounded-xl border border-border bg-card p-6 text-center">
          <p className="text-[13.5px] font-medium text-foreground">{t('track.notFound')}</p>
          <p className="mx-auto mt-1.5 max-w-sm text-[12px] leading-relaxed text-muted-foreground">
            {t('track.notFoundBody')}
          </p>
          <Link
            to="/my-grievances"
            className="mt-4 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-accent"
          >
            {t('nav.mine')}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {record && (
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-[0_28px_65px_-58px_rgba(15,23,42,0.6)]">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground">
              {record.grievance_id}
            </span>
            <StatusBadge status={record.status} />
          </div>
          <h2 className="mt-2.5 font-heading text-[1.2rem] leading-snug text-foreground">
            {record.title}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] text-muted-foreground">
            <span>{record.category}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{record.department}</span>
            <PriorityLabel priority={record.priority} className="ml-auto" />
          </div>

          <div className="mt-5 border-t border-border pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {t('detail.history')}
            </p>
            <StatusTimeline steps={historySteps(record, t)} className="mt-3.5" />
          </div>

          <Link
            to={`/grievance/${record.id}`}
            className="mt-5 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-accent"
          >
            {t('assistant.success.track')}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}