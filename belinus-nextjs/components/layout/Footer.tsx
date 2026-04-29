import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getLocale } from '@/lib/i18n';

export function Footer() {
  const t = useTranslations('footer');
  const locale = getLocale();

  return (
    <footer className="bg-black border-t border-white/[0.08] pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/30 mb-5">{t('solutions_title')}</h3>
            <ul className="space-y-2.5">
              <li><Link href="#" className="text-sm text-white/55 hover:text-accent transition-colors">{t('solutions_1')}</Link></li>
              <li><Link href="#" className="text-sm text-white/55 hover:text-accent transition-colors">{t('solutions_2')}</Link></li>
              <li><Link href="#" className="text-sm text-white/55 hover:text-accent transition-colors">{t('solutions_3')}</Link></li>
              <li><Link href="#" className="text-sm text-white/55 hover:text-accent transition-colors">{t('solutions_4')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/30 mb-5">{t('company_title')}</h3>
            <ul className="space-y-2.5">
              <li><Link href={`/${locale}/about`} className="text-sm text-white/55 hover:text-accent transition-colors">{t('company_1')}</Link></li>
              <li><Link href="#" className="text-sm text-white/55 hover:text-accent transition-colors">{t('company_2')}</Link></li>
              <li><Link href="#" className="text-sm text-white/55 hover:text-accent transition-colors">{t('company_3')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="text-sm text-white/55 hover:text-accent transition-colors">{t('company_4')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/30 mb-5">{t('legal_title')}</h3>
            <ul className="space-y-2.5">
              <li><Link href="#" className="text-sm text-white/55 hover:text-accent transition-colors">{t('legal_1')}</Link></li>
              <li><Link href="#" className="text-sm text-white/55 hover:text-accent transition-colors">{t('legal_2')}</Link></li>
              <li><Link href="#" className="text-sm text-white/55 hover:text-accent transition-colors">{t('legal_3')}</Link></li>
              <li><Link href="#" className="text-sm text-white/55 hover:text-accent transition-colors">{t('legal_4')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/30 mb-5">{t('connect_title')}</h3>
            <ul className="space-y-2.5">
              <li><Link href="#" className="text-sm text-white/55 hover:text-accent transition-colors">{t('connect_1')}</Link></li>
              <li><Link href="#" className="text-sm text-white/55 hover:text-accent transition-colors">{t('connect_2')}</Link></li>
              <li><Link href="#" className="text-sm text-white/55 hover:text-accent transition-colors">{t('connect_3')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.08] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">{t('copyright')}</p>
          <div className="flex gap-6">
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/40">CE Certified</span>
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/40">Energyville Partner</span>
          </div>
        </div>
      </div>
    </footer>
  );
}