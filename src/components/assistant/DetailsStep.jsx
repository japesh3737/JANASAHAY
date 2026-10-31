import { useRef } from 'react';
import { AlertTriangle, ArrowLeft, ImagePlus, Loader2, Lock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/LanguageProvider';

const fieldClass =
  'w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-[13px] text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-accent/50 focus:ring-4 focus:ring-accent/10';

const labelClass =
  'block text-[10.5px] font-semibold uppercase tracking-[0.15em] text-muted-foreground';

export default function DetailsStep({
  contact,
  setContact,
  attachments,
  onAddFiles,
  onRemoveFile,
  uploading,
  privacy,
  setPrivacy,
  onSubmit,
  submitting,
  error,
  isAuthenticated,
  onSignIn,
  onBack,
}) {
  const { t } = useLanguage();
  const fileRef = useRef(null);
  const update = (patch) => setContact({ ...contact, ...patch });

  return (
    <div>
      <h2 className="font-heading text-[1.45rem] leading-tight text-foreground">
        {t('assistant.details.title')}
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        {t('assistant.details.sub')}
      </p>

      <div className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="name">
              {t('assistant.details.name')}
            </label>
            <input
              id="name"
              value={contact.name}
              onChange={(event) => update({ name: event.target.value })}
              className={cn(fieldClass, 'mt-2')}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">
              {t('assistant.details.phone')}
            </label>
            <input
              id="phone"
              value={contact.phone}
              onChange={(event) => update({ phone: event.target.value })}
              inputMode="tel"
              className={cn(fieldClass, 'mt-2')}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="email">
              {t('assistant.details.email')}{' '}
              <span className="font-normal normal-case tracking-normal text-muted-foreground/70">
                ({t('common.optional')})
              </span>
            </label>
            <input
              id="email"
              type="email"
              value={contact.email}
              onChange={(event) => update({ email: event.target.value })}
              className={cn(fieldClass, 'mt-2')}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="location">
              {t('assistant.details.location')}
            </label>
            <input
              id="location"
              value={contact.location}
              onChange={(event) => update({ location: event.target.value })}
              placeholder={t('assistant.details.locationPlaceholder')}
              className={cn(fieldClass, 'mt-2')}
            />
          </div>
        </div>

        <div>
          <p className={labelClass}>
            {t('assistant.details.photos')}{' '}
            <span className="font-normal normal-case tracking-normal text-muted-foreground/70">
              ({t('assistant.details.photosHint')})
            </span>
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              onAddFiles(event.target.files);
              event.target.value = '';
            }}
          />
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {attachments.map((uri, index) => (
              <span
                key={uri}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground"
              >
                {t('assistant.details.photos')} {index + 1}
                <button
                  type="button"
                  onClick={() => onRemoveFile(uri)}
                  className="text-muted-foreground/70 transition-colors hover:text-destructive"
                  aria-label={t('common.close')}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              disabled={uploading || attachments.length >= 3}
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              {uploading ? t('assistant.photoUploading') : t('assistant.photoAdd')}
            </button>
          </div>
        </div>

        <label
          htmlFor="privacy"
          className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background/70 p-3.5"
        >
          <Checkbox
            id="privacy"
            checked={privacy}
            onCheckedChange={(value) => setPrivacy(Boolean(value))}
            className="mt-0.5"
          />
          <span className="text-[11.5px] leading-relaxed text-muted-foreground">
            {t('assistant.details.privacy')}
          </span>
        </label>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/[0.06] px-3.5 py-3 text-[11.5px] leading-relaxed text-destructive">
            <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" />
            {error}
          </div>
        )}

        {!isAuthenticated && (
          <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/60 px-3.5 py-3">
            <Lock className="mt-px h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <p className="text-[11.5px] leading-relaxed text-muted-foreground">
              {t('assistant.details.signinBody')}
            </p>
          </div>
        )}
      </div>

      <div className="mt-7 flex flex-col-reverse items-stretch gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="rounded-full px-4 text-[12.5px] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          {t('assistant.back')}
        </Button>
        <Button
          onClick={isAuthenticated ? onSubmit : onSignIn}
          disabled={isAuthenticated ? submitting || !privacy : false}
          className="rounded-full bg-primary px-5 text-[12.5px] font-medium text-primary-foreground hover:bg-primary/90"
        >
          {submitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
          {isAuthenticated
            ? submitting
              ? t('assistant.details.submitting')
              : t('assistant.details.submit')
            : t('assistant.details.signin')}
        </Button>
      </div>
    </div>
  );
}