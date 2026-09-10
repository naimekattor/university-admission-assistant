'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ChevronsRight,
  GraduationCap,
  Star,
} from 'lucide-react';
import { HeroConfig } from '@/lib/homepage-types';
import { useGsapContext } from '@/hooks/use-gsap-motion';
import {
  heroEntrance,
  countUp,
  subtleFloat,
  isReducedMotion,
} from '@/lib/animations/gsap-motion';

interface HeroSectionProps {
  config?: HeroConfig;
  onFindUniversitiesClick?: () => void;
}

export function HeroSection({ config, onFindUniversitiesClick }: HeroSectionProps) {
  const eyebrow = config?.eyebrow || 'Trusted by over 50,000+ admission aspirants';
  const subheading =
    config?.subheading ||
    'Check university admission dates, GPA requirements, units, and past question trends — all unified with AI guidance in one place.';
  const primaryCtaLabel = config?.primaryCtaLabel || 'Get Started for Free';

  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialProofRef = useRef<HTMLDivElement>(null);
  const tiltedCardLeftRef = useRef<HTMLDivElement>(null);
  const tiltedCardRightRef = useRef<HTMLDivElement>(null);
  const readinessCounterRef = useRef<HTMLDivElement>(null);
  const hoursCounterRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGsapContext(
    () => {
      if (isReducedMotion()) return;

      // 1. Choreographed Hero Entrance
      heroEntrance({
        badge: badgeRef.current,
        heading: headingRef.current,
        subheading: subheadingRef.current,
        cta: ctaRef.current,
        socialProof: socialProofRef.current,
        tiltedCardLeft: tiltedCardLeftRef.current,
        tiltedCardRight: tiltedCardRightRef.current,
      });

      // 2. Numerical counter tweens
      countUp(readinessCounterRef.current, 80, {
        suffix: '%',
        duration: 1.4,
      });

      countUp(hoursCounterRef.current, 13.6, {
        suffix: ' Hours',
        decimals: 1,
        duration: 1.4,
      });

      // 3. Ambient float on radial glow and decorative elements
      if (glowRef.current) {
        subtleFloat(glowRef.current, { y: 8, duration: 6 });
      }
      if (tiltedCardLeftRef.current) {
        subtleFloat(tiltedCardLeftRef.current, { y: 4, duration: 4.5, delay: 0.5 });
      }
      if (tiltedCardRightRef.current) {
        subtleFloat(tiltedCardRightRef.current, { y: 4, duration: 5, delay: 1 });
      }
    },
    sectionRef,
    []
  );

  const handlePrimaryClick = (e: React.MouseEvent) => {
    if (onFindUniversitiesClick) {
      e.preventDefault();
      onFindUniversitiesClick();
    } else {
      const el = document.getElementById('eligibility-checker');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative pt-6 pb-16 container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* ── AMBIENT RADIAL GLOW ── */}
      <div
        ref={glowRef}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-orange-400/10 via-amber-300/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* ── 1. EYEBROW BADGE ── */}
      <div ref={badgeRef} className="flex justify-center mb-5">
        <div className="bg-white border border-orange-200/90 text-slate-700 text-xs font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-2xs">
          <GraduationCap className="w-4 h-4 text-[#FF5500]" />
          <span>{eyebrow}</span>
        </div>
      </div>

      {/* ── 2. HERO HEADLINE & COPY ── */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h1
          ref={headingRef}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]"
        >
          <span className="block font-medium">Your Ultimate Platform for</span>
          <span className="block font-black text-slate-900">Seamless Admission & Growth</span>
        </h1>

        <p
          ref={subheadingRef}
          className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance"
        >
          {subheading}
        </p>

        {/* ── 3. PRIMARY CTA BUTTON WITH DOUBLE ARROW ── */}
        <div ref={ctaRef} className="flex justify-center pt-2">
          <button
            onClick={handlePrimaryClick}
            className="btn-primary-brand pl-2 pr-6 py-2.5 text-sm flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white">
              <ChevronsRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span>{primaryCtaLabel}</span>
          </button>
        </div>

        {/* ── 4. SOCIAL PROOF / REVIEWS ROW ── */}
        <div
          ref={socialProofRef}
          className="pt-5 flex items-center justify-center gap-4 text-xs font-semibold text-slate-700"
        >
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-900">Clutch</span>
            <div className="flex text-amber-400">
              {'★★★★★'.split('').map((star, i) => (
                <span key={i} className="text-xs">{star}</span>
              ))}
            </div>
            <span className="text-slate-600 font-bold ml-0.5">4.5/5</span>
          </div>

          <span className="text-slate-300">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-emerald-600 font-black">★ Trustpilot</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white font-bold text-[10px]">
              ★★★★★
            </span>
            <span className="text-slate-600 font-bold">4.5/5</span>
          </div>
        </div>
      </div>

      {/* ── 5. FLOATING TILTED CARDS (LEFT & RIGHT) ── */}
      <div className="hidden lg:block relative pointer-events-none">
        
        {/* ── LEFT TILTED CARD: PERFORMANCE GAUGE (-12deg) ── */}
        <div
          ref={tiltedCardLeftRef}
          className="absolute -top-64 left-4 xl:left-8 transform -rotate-12 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xl w-56 pointer-events-auto backdrop-blur-sm"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Performance</span>
            <div className="w-5 h-5 rounded-full bg-orange-50 text-[#FF5500] flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Dotted Circular Arc Gauge */}
          <div className="my-3 flex items-center justify-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3"
                  strokeDasharray="1, 3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#FF5500]"
                  strokeDasharray="80, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <div ref={readinessCounterRef} className="text-base font-black text-slate-900 font-mono leading-none">
                  80%
                </div>
                <div className="text-[9px] text-slate-400 font-medium">Readiness</div>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] font-semibold text-slate-600 pt-1 border-t border-slate-100">
            You did a great job!
          </div>
        </div>

        {/* ── RIGHT TILTED CARD: TIME SPENT BAR CHART (+12deg) ── */}
        <div
          ref={tiltedCardRightRef}
          className="absolute -top-64 right-4 xl:right-8 transform rotate-12 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xl w-60 pointer-events-auto backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-medium">Time Spent</span>
              <div ref={hoursCounterRef} className="text-sm font-black text-slate-900 leading-tight">
                13.6 Hours
              </div>
            </div>
            <div className="w-5 h-5 rounded-full bg-orange-50 text-[#FF5500] flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 my-2 text-[10px] text-slate-600 font-medium">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FF5500]" /> Study
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-300" /> Exams
            </div>
          </div>

          {/* Mini Bar Chart with Tooltip */}
          <div className="relative pt-4">
            <div className="absolute top-0 right-12 px-1.5 py-0.5 rounded bg-slate-900 text-white text-[9px] font-mono font-bold shadow-xs">
              12.5 H
            </div>

            <div className="h-16 flex items-end justify-between gap-1 border-b border-slate-100 pb-1">
              {[
                { h: 30, color: 'bg-slate-800' },
                { h: 45, color: 'bg-slate-800' },
                { h: 60, color: 'bg-slate-800' },
                { h: 35, color: 'bg-slate-800' },
                { h: 85, color: 'bg-[#FF5500]' },
                { h: 55, color: 'bg-slate-800' },
                { h: 40, color: 'bg-slate-800' },
                { h: 70, color: 'bg-[#FF5500]' },
                { h: 90, color: 'bg-[#FF5500]' },
                { h: 50, color: 'bg-slate-800' },
              ].map((bar, i) => (
                <div
                  key={i}
                  className={`w-2.5 rounded-t ${bar.color}`}
                  style={{ height: `${bar.h * 0.55}px` }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between text-[8px] font-mono text-slate-400 pt-1">
            <span>J</span>
            <span>F</span>
            <span>M</span>
            <span>A</span>
            <span>M</span>
            <span>J</span>
            <span>J</span>
            <span>A</span>
            <span>S</span>
            <span>D</span>
          </div>
        </div>

      </div>
    </section>
  );
}
