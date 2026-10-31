import { cn } from '@/lib/utils';
import { priorityStyles } from '@/lib/grievanceMeta';
import { useLanguage } from '@/lib/LanguageProvider';

export default function PriorityLabel({ priority, className }) {
  const { t } = useLanguage();
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[11.5px] font-medium',
        priorityStyles[priority] || 'text-muted-foreground',
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {t(`priority.${priority}`)}
    </span>
  );
}