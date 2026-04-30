'use client';

import { useEffect, useRef } from 'react';

import { Eyebrow } from '@/components/ui/Eyebrow';
import { Card } from '@/components/ui/Card';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function UseCases() {
  const t = (key: string) => key;
  const sectionRef = useRef<HTMLElement>(null);

  const cards = [
    { title: t('card_1_title'), text: t('card_1_text') },
    { title: t('card_2_title'), text: t('card_2_text') },
    { title: t('card_3_title'), text: t('card_3_text') },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      '.bl-usecase__card',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="py-24 md:py-32 px-6 bg-bg"
    >
      <div className="max-w-6xl mx-auto text-center mb-16">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h2 className="text-[clamp(32px,5vw,56px)] font-black leading-[1.1] tracking-[-0.02em] text-white">
          {t('headline')}
        </h2>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <Card key={i} hover className="text-left bl-usecase__card">
            <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
            <p className="text-[15px] leading-relaxed text-white/55">{card.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
