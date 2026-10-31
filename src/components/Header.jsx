import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Landmark, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/LanguageProvider';
import { useAuth } from '@/lib/AuthContext';
import { languageOptions } from '@/lib/i18n';

function LanguageToggle({ className }) {
  const { lang, setLang } = useLanguage();
  return (
    <div
      className={cn(
        'flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5',
        className
      )}
    >
      {languageOptions.map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => setLang(option.code)}
          className={cn(
            'rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors',
            lang === option.code
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {option.short}
        </button>
      ))}
    </div>
  );
}

export default function Header() {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', key: 'nav.home' },
    { to: '/assistant', key: 'nav.submit' },
    { to: '/track', key: 'nav.track' },
    { to: '/my-grievances', key: 'nav.mine' },
  ];
  if (user?.role === 'admin') links.push({ to: '/dashboard', key: 'nav.dashboard' });

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[70px] max-w-6xl items-center justify-between gap-6 px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-primary text-primary-foreground">
            <Landmark className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </span>
          <span className="leading-none">
            <span className="block text-[12.5px] font-semibold tracking-[0.2em] text-foreground">
              JANASAHAY
            </span>
            <span className="mt-1.5 block text-[10.5px] tracking-[0.02em] text-muted-foreground">
              {t('brand.tagline')}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative py-2 text-[13px] transition-colors',
                  isActive
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {t(item.key)}
                  <span
                    className={cn(
                      'absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-300',
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <LanguageToggle className="hidden sm:flex" />
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => logout(true)}
              className="hidden text-[12.5px] text-muted-foreground transition-colors hover:text-foreground md:block"
            >
              {t('nav.signout')}
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden text-[12.5px] text-muted-foreground transition-colors hover:text-foreground md:block"
            >
              {t('nav.signin')}
            </Link>
          )}
          <Link
            to="/assistant"
            className="hidden rounded-full bg-primary px-4 py-2.5 text-[12.5px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
          >
            {t('nav.submit')}
          </Link>
          <button
            type="button"
            aria-label={open ? t('common.close') : 'Menu'}
            onClick={() => setOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/70 bg-background lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'border-b border-border/60 py-3 text-sm last:border-0',
                    isActive ? 'font-medium text-foreground' : 'text-muted-foreground'
                  )
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
            <div className="flex items-center justify-between py-3">
              <LanguageToggle />
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => logout(true)}
                  className="text-xs text-muted-foreground"
                >
                  {t('nav.signout')}
                </button>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="text-xs text-muted-foreground">
                  {t('nav.signin')}
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}