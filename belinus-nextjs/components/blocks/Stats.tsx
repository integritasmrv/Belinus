'use client';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { StatCard } from '@/components/ui/StatCard';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function Stats() {
  const t = useTranslations('stats');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo('.bl-stat__item', { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
    });
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  const stats = [
    { value: t('stat_1_value'), label: t('stat_1_label') },
    { value: t('stat_2_value'), label: t('stat_2_label') },
    { value: t('stat_3_value'), label: t('stat_3_label') },
    { value: t('stat_4_value'), label: t('stat_4_label') },
  ];
  const trustItems = [t('trust_1'), t('trust_2'), t('trust_3'), t('trust_4')];

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 bg-[#111111]">
      <div className="max-w-6xl mx-auto text-center">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h2 className="text-[clamp(32px,5vw,56px)] font-black leading-[1.1] tracking-[-0.02em] text-white mb-16">{t('headline')}</h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 py-10 border-t border-b border-white/[0.08] mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bl-stat__item"><StatCard value={stat.value} label={stat.label} /></div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          {trustItems.map((item) => (
            <span key={item} className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/35">{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}