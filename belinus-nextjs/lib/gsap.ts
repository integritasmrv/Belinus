'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGSAP() {
  const contextRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    contextRef.current = gsap.context(() => {});

    return () => {
      contextRef.current?.revert();
    };
  }, []);

  return contextRef;
}

export function animateOnScroll(
  selector: string,
  options: {
    y?: number;
    opacity?: number;
    duration?: number;
    stagger?: number;
    scrollTrigger?: boolean;
  } = {}
) {
  const {
    y = 30,
    opacity = 0,
    duration = 0.5,
    stagger = 0.08,
    scrollTrigger = true,
  } = options;

  gsap.fromTo(
    selector,
    { y, opacity },
    {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      ease: 'power3.out',
      scrollTrigger: scrollTrigger
        ? {
            trigger: selector,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        : undefined,
    }
  );
}

export function parallaxElement(selector: string, speed: number = 0.3) {
  gsap.to(selector, {
    yPercent: -30 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: selector,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

export { gsap, ScrollTrigger };
