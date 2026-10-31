import { db } from '@/api/base44Client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageProvider';
import { STATUSES } from '@/lib/grievanceMeta';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function StatusUpdateDialog({ grievance, open, onOpenChange, onSaved }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [status, setStatus] = useState('Submitted');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!grievance) return;
    setStatus(grievance.status || 'Submitted');
    setNote('');
    setError('');
  }, [grievance, open]);

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const history = [
        ...(grievance.history || []),
        {
          status,
          note: note.trim(),
          date: new Date().toISOString(),
          by: user?.full_name || 'Authority',
        },
      ];
      await db.entities.Grievance.update(grievance.id, { status, history });
      onSaved();
      onOpenChange(false);
    } catch {
      setError(t('assistant.submitError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-[1.2rem] font-normal">
            {t('dash.update')}
          </DialogTitle>
          <DialogDescription className="text-[12.5px] leading-relaxed">
            {grievance?.grievance_id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div>
            <label
              htmlFor="new-status"
              className="block text-[10.5px] font-semibold uppercase tracking-[0.15em] text-muted-foreground"
            >
              {t('dash.newStatus')}
            </label>
            <select
              id="new-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="mt-2 w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-[13px] text-foreground outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
            >
              {STATUSES.map((option) => (
                <option key={option} value={option}>
                  {t(`status.${option}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status-note"
              className="block text-[10.5px] font-semibold uppercase tracking-[0.15em] text-muted-foreground"
            >
              {t('dash.note')}
            </label>
            <textarea
              id="status-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder={t('dash.notePlaceholder')}
              className="mt-2 w-full resize-none rounded-lg border border-input bg-card px-3.5 py-2.5 text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
            />
          </div>

          {error && <p className="text-[11.5px] text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-primary px-5 text-[12.5px] font-medium text-primary-foreground hover:bg-primary/90"
          >
            {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            {t('dash.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}