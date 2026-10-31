import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StatusTimeline({ steps, className }) {
  return (
    <ol className={cn('relative', className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <li key={`${step.label}-${index}`} className={cn('relative flex gap-3', !isLast && 'pb-4')}>
            {!isLast && (
              <span
                className={cn(
                  'absolute left-[9px] top-[22px] h-[calc(100%-14px)] w-px',
                  step.done ? 'bg-accent/35' : 'bg-border'
                )}
              />
            )}
            <span
              className={cn(
                'mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold',
                step.done
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border bg-background text-muted-foreground',
                step.active && 'ring-4 ring-accent/15'
              )}
            >
              {step.done ? <Check className="h-3 w-3" strokeWidth={3} /> : index + 1}
            </span>
            <div className="min-w-0">
              <p
                className={cn(
                  'text-[12.5px] leading-tight',
                  step.done ? 'font-medium text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </p>
              {step.note && (
                <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground">{step.note}</p>
              )}
              {step.date && (
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
                  {step.date}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}