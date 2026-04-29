'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function Nav() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const lang = pathname.split('/')[1] || 'en';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/[0.08]' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href={`/${lang}`} className="text-white font-bold text-xl tracking-widest uppercase">Belinus</Link>

        <ul className="hidden md:flex items-center gap-8">
          <li><Link href={`/${lang}/#solutions`} className="text-white/70 hover:text-accent text-sm font-medium transition-colors">{t('solutions')}</Link></li>
          <li><Link href={`/${lang}/about`} className="text-white/70 hover:text-accent text-sm font-medium transition-colors">{t('about')}</Link></li>
          <li><Link href={`/${lang}/blog`} className="text-white/70 hover:text-accent text-sm font-medium transition-colors">{t('blog')}</Link></li>
          <li><Link href={`/${lang}/contact`} className="text-white/70 hover:text-accent text-sm font-medium transition-colors">{t('contact')}</Link></li>
        </ul>

        <Link href={`/${lang}/#contact`} className="hidden md:inline-flex bg-accent text-black text-xs font-bold tracking-widest uppercase px-6 py-3 hover:bg-transparent hover:text-accent border-2 border-accent transition-all">
          {t('quote')}
        </Link>

        <button className="md:hidden text-white p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen
              ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-bg border-t border-white/[0.08] px-6 py-8">
          <ul className="flex flex-col gap-6">
            <li><Link href={`/${lang}/#solutions`} className="text-white text-lg font-medium" onClick={() => setMobileOpen(false)}>{t('solutions')}</Link></li>
            <li><Link href={`/${lang}/about`} className="text-white text-lg font-medium" onClick={() => setMobileOpen(false)}>{t('about')}</Link></li>
            <li><Link href={`/${lang}/blog`} className="text-white text-lg font-medium" onClick={() => setMobileOpen(false)}>{t('blog')}</Link></li>
            <li><Link href={`/${lang}/contact`} className="text-white text-lg font-medium" onClick={() => setMobileOpen(false)}>{t('contact')}</Link></li>
            <li><Link href={`/${lang}/#contact`} className="inline-flex bg-accent text-black text-sm font-bold tracking-widest uppercase px-6 py-3" onClick={() => setMobileOpen(false)}>{t('quote')}</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
}