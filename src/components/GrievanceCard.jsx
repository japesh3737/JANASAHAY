import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import PriorityLabel from '@/components/PriorityLabel';
import { formatDate } from '@/lib/grievanceMeta';
import { useLanguage } from '@/lib/LanguageProvider';

export default function GrievanceCard({ grievance }) {
  const { t } = useLanguage();

  return (
    <Link
      to={`/grievance/${grievance.id}`}
      className="group block rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_22px_45px_-38px_rgba(15,23,42,0.6)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground">
          {grievance.grievance_id}
        </span>
        <StatusBadge status={grievance.status} />
      </div>

      <h3 className="mt-2.5 text-[13.5px] font-medium leading-snug text-foreground transition-colors group-hover:text-accent">
        {grievance.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
        {grievance.summary || grievance.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-border/70 pt-3 text-[11px] text-muted-foreground">
        <span>{grievance.category}</span>
        <span className="h-1 w-1 rounded-full bg-border" />
        <span>{formatDate(grievance.created_date)}</span>
        <PriorityLabel priority={grievance.priority} className="ml-auto" />
        <ArrowRight className="h-3.5 w-3.5 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  );
}