'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGSAP() {
  const contextRef = useRef<gsap.Context | null>(null);
  useEffect(() => {
    contextRef.current = gsap.context(() => {});
    return () => contextRef.current?.revert();
  }, []);
  return contextRef;
}

export { gsap, ScrollTrigger };