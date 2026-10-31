import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/LanguageProvider';

const KEYS = ['assistant.step1', 'assistant.step2', 'assistant.step3', 'assistant.step4'];

export default function Stepper({ current }) {
  const { t } = useLanguage();

  return (
    <ol className="flex items-center">
      {KEYS.map((key, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={key}
            className={cn('flex items-center', index < KEYS.length - 1 && 'flex-1')}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10.5px] font-semibold transition-colors',
                  done && 'border-accent bg-accent text-accent-foreground',
                  active && 'border-primary bg-primary text-primary-foreground',
                  !done && !active && 'border-border bg-card text-muted-foreground'
                )}
              >
                {done ? <Check className="h-3 w-3" strokeWidth={3} /> : index + 1}
              </span>
              <span
                className={cn(
                  'hidden text-[11.5px] sm:block',
                  active ? 'font-medium text-foreground' : 'text-muted-foreground'
                )}
              >
                {t(key)}
              </span>
            </div>
            {index < KEYS.length - 1 && (
              <span
                className={cn('mx-3 h-px flex-1', done ? 'bg-accent/40' : 'bg-border')}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}