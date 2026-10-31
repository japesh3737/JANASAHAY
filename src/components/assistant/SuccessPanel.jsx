import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/LanguageProvider';

export default function SuccessPanel({ record, onReset }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(record.grievance_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Check className="h-6 w-6" strokeWidth={2.5} />
      </span>
      <h2 className="mt-5 font-heading text-[1.6rem] leading-tight text-foreground">
        {t('assistant.success.title')}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
        {t('assistant.success.body')}
      </p>

      <div className="mx-auto mt-6 max-w-sm rounded-xl border border-border bg-background px-5 py-4">
        <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {t('assistant.success.idLabel')}
        </p>
        <p className="mt-1.5 font-mono text-[19px] tracking-[0.06em] text-foreground">
          {record.grievance_id}
        </p>
        <button
          type="button"
          onClick={copy}
          className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-accent transition-opacity hover:opacity-80"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? t('assistant.success.copied') : t('assistant.success.copy')}
        </button>
      </div>

      <div className="mt-7 flex flex-col items-stretch gap-2.5 sm:flex-row sm:justify-center">
        <Button
          asChild
          className="rounded-full bg-primary px-5 text-[12.5px] font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Link to={`/grievance/${record.id}`}>
            {t('assistant.success.track')}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button
          variant="outline"
          asChild
          className="rounded-full border-border px-5 text-[12.5px] font-medium text-foreground hover:bg-secondary"
        >
          <Link to="/my-grievances">{t('assistant.success.mine')}</Link>
        </Button>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-4 text-[11.5px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
      >
        {t('assistant.success.another')}
      </button>
    </div>
  );
}