// Central GSAP setup for the Vellmont site.
// Everything animation-related imports from here so plugin registration,
// easing defaults and the reduced-motion guard live in one place.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// House easing and duration defaults, so motion feels consistent site-wide.
gsap.defaults({ ease: 'power3.out', duration: 0.7 });

export const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Shared timing tokens.
export const MOTION = {
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
  stagger: 0.08,
  ease: 'power3.out',
  easeSoft: 'power2.out',
};

// ScrollTrigger defaults: start when the element is comfortably in view and
// only play once, which suits marketing content.
export const TRIGGER = {
  start: 'top 85%',
  toggleActions: 'play none none none',
};

export { gsap, ScrollTrigger };
