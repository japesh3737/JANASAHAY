import { db } from '@/api/base44Client';

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, MapPin, Paperclip } from 'lucide-react';

import { useLanguage } from '@/lib/LanguageProvider';
import { formatDate, historySteps } from '@/lib/grievanceMeta';
import { useAttachmentUrls } from '@/lib/useAttachmentUrls';
import StatusBadge from '@/components/StatusBadge';
import PriorityLabel from '@/components/PriorityLabel';
import StatusTimeline from '@/components/StatusTimeline';
import { Image } from '@/components/ui/image';

export default function GrievanceDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const attachmentUrls = useAttachmentUrls(record?.attachments || []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await db.entities.Grievance.get(id);
        if (active) setRecord(data);
      } catch {
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!notFound) return undefined;
    const meta = document.createElement('meta');
    meta.name = 'prerender-status-code';
    meta.content = '404';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, [notFound]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !record) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <p className="font-heading text-[1.5rem] text-foreground">{t('detail.notFound')}</p>
        <Link to="/track" className="mt-4 inline-block text-[12px] font-medium text-accent">
          {t('track.title')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 lg:py-16">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t('detail.back')}
      </button>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground">
          {record.grievance_id}
        </span>
        <StatusBadge status={record.status} />
      </div>

      <h1 className="mt-3 font-heading text-[1.7rem] leading-tight tracking-[-0.015em] text-foreground sm:text-[2rem]">
        {record.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] text-muted-foreground">
        <span>{record.category}</span>
        <span className="h-1 w-1 rounded-full bg-border" />
        <span>{record.department}</span>
        <PriorityLabel priority={record.priority} className="ml-auto" />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
          {t('detail.aiSummary')}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-foreground/85">{record.summary}</p>
      </div>

      <dl className="mt-4 grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
        <div>
          <dt className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t('detail.submittedOn')}
          </dt>
          <dd className="mt-1 text-[12.5px] text-foreground">{formatDate(record.created_date)}</dd>
        </div>
        <div>
          <dt className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t('detail.contact')}
          </dt>
          <dd className="mt-1 text-[12.5px] text-foreground">
            {record.contact_name}
            {record.contact_phone ? ` · ${record.contact_phone}` : ''}
          </dd>
        </div>
        {record.location && (
          <div className="sm:col-span-2">
            <dt className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t('detail.location')}
            </dt>
            <dd className="mt-1 flex items-center gap-1.5 text-[12.5px] text-foreground">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.8} />
              {record.location}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-4 rounded-xl border border-border bg-card p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {t('detail.history')}
        </p>
        <StatusTimeline steps={historySteps(record, t)} className="mt-3.5" />
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-border p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {t('detail.original')}
        </p>
        <p className="mt-2 whitespace-pre-line text-[12.5px] leading-relaxed text-foreground/80">
          {record.description}
        </p>
      </div>

      {attachmentUrls.length > 0 && (
        <div className="mt-4">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Paperclip className="h-3 w-3" />
            {t('detail.attachments')}
          </p>
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {attachmentUrls.map((url, index) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-lg border border-border bg-secondary"
              >
                <Image
                  src={url}
                  alt={`${t('detail.attachments')} ${index + 1}`}
                  className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}