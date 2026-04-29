'use client';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function CTA() {
  const t = useTranslations('cta');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo('.bl-cta__content > *', { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
    });
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 bg-bg">
      <div className="max-w-3xl mx-auto text-center bl-cta__content">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h2 className="text-[clamp(32px,5vw,56px)] font-black leading-[1.1] tracking-[-0.02em] text-white mb-5">{t('headline')}</h2>
        <p className="text-[17px] text-white/50 mb-10">{t('subhead')}</p>
        <div className="mb-16"><Button href="#contact" variant="primary">{t('cta')}</Button></div>
        <div className="flex flex-wrap justify-center gap-12 pt-12 border-t border-white/[0.08]">
          <div>
            <div className="text-[13px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-3">{t('phone_label')}</div>
            <a href="tel:+3293963388" className="text-base text-white/70 hover:text-accent transition-colors">{t('phone_value')}</a>
          </div>
          <div>
            <div className="text-[13px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-3">{t('email_label')}</div>
            <a href="mailto:info@belinus.com" className="text-base text-white/70 hover:text-accent transition-colors">{t('email_value')}</a>
          </div>
          <div>
            <div className="text-[13px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-3">{t('address_label')}</div>
            <span className="text-base text-white/70">{t('address_value')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}