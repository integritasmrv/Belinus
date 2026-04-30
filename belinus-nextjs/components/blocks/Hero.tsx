'use client';

import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/Button';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function Hero() {
  const t = (key: string) => key;
  const videoRef = useRef<HTMLVideoElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      eyebrowRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      0.3
    )
      .fromTo(
        headlineRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.5
      )
      .fromTo(
        subheadRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.7
      )
      .fromTo(
        ctasRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.9
      )
      .fromTo(
        trustRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        1.1
      );

    gsap.to('.bl-hero__video', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.bl-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const trustItems = [
    t('trust_1'),
    t('trust_2'),
    t('trust_3'),
    t('trust_4'),
  ];

  return (
    <section className="bl-hero relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="bl-hero__video absolute inset-0 w-full h-full object-cover opacity-45 z-0"
        autoPlay
        muted
        loop
        playsInline
        poster="/videos/hero-poster.jpg"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-black/10 to-black/80" />

      <div className="relative z-20 text-center px-6 max-w-3xl mx-auto">
        <p
          ref={eyebrowRef}
          className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent mb-6 opacity-0"
        >
          {t('eyebrow')}
        </p>

        <h1
          ref={headlineRef}
          className="text-[clamp(48px,8vw,96px)] font-black leading-[1.0] tracking-[-0.02em] text-white mb-6 whitespace-pre-line opacity-0"
        >
          {t('headline')}
        </h1>

        <p
          ref={subheadRef}
          className="text-[clamp(16px,2.5vw,22px)] font-normal leading-relaxed text-white/75 max-w-xl mx-auto mb-12 opacity-0"
        >
          {t('subhead')}
        </p>

        <div ref={ctasRef} className="flex flex-wrap gap-4 justify-center mb-16 opacity-0">
          <Button href="#contact" variant="primary">
            {t('cta_primary')}
          </Button>
          <Button href="#specs" variant="secondary">
            {t('cta_secondary')}
          </Button>
        </div>

        <div ref={trustRef} className="flex flex-wrap gap-10 justify-center opacity-0">
          {trustItems.map((item) => (
            <span
              key={item}
              className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
