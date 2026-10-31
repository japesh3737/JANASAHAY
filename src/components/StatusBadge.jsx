import { cn } from '@/lib/utils';
import { statusStyles } from '@/lib/grievanceMeta';
import { useLanguage } from '@/lib/LanguageProvider';

export default function StatusBadge({ status, className }) {
  const { t } = useLanguage();
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-medium',
        statusStyles[status] || 'border-transparent bg-secondary text-secondary-foreground',
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {t(`status.${status}`)}
    </span>
  );
}