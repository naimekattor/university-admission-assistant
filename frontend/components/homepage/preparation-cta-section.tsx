'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Sparkles,
  Zap,
  ChevronsRight,
  ArrowRight,
  BookOpen,
  Target,
  Award,
  Play,
} from 'lucide-react';
import { PreparationConfig } from '@/lib/homepage-types';
import { useScrollTriggerReveal } from '@/hooks/use-gsap-motion';

interface PreparationCtaSectionProps {
  config?: PreparationConfig;
}

export function PreparationCtaSection({ config }: PreparationCtaSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollTriggerReveal(sectionRef, { y: 24 });
  const badgeText = config?.badgeText || 'THE PREPARATION PLATFORM';
  const headline = config?.headline || 'Know where to apply. Now prepare to get in.';
  const description =
    config?.description ||
    'Turn your target university and admission unit into a personalized preparation plan with visual lessons, chapter-wise MCQs, and past 15 years question bank.';
  const features = config?.features && config.features.length > 0
    ? config.features
    : [
        'Visual interactive lessons',
        'Chapter-wise MCQ practice drills',
        'Past 15 years solved admission questions',
        'Full-length timed mock test simulator',
        '24/7 AI Admission Tutor with step-by-step derivations',
        'Personalized mistake notebook & revision queue',
      ];
  const ctaText = config?.ctaText || 'Start Preparing';
  const ctaUrl = config?.ctaUrl || '/prepare';
  const secondaryCtaText = config?.secondaryCtaText;
  const secondaryCtaUrl = config?.secondaryCtaUrl || '/mock-tests';
  const imageUrl = config?.imageUrl || '/images/study-platform-mockup.svg';
  const imageAlt = config?.imageAlt || 'EduGuide Study Platform';
  const gradientTheme = config?.gradientTheme || 'executive-flame';

  // Dynamic theme gradients
  let bgGradientClass =
    'bg-gradient-to-br from-[#1C120C] via-[#2A170B] to-[#140D08] border-orange-500/35 shadow-[0_25px_60px_-15px_rgba(255,85,0,0.35)]';
  if (gradientTheme === 'warm-sunset') {
    bgGradientClass =
      'bg-gradient-to-br from-[#FF5500] via-[#E64D00] to-[#8C2300] border-orange-400/40 shadow-[0_25px_60px_-15px_rgba(255,85,0,0.45)]';
  } else if (gradientTheme === 'obsidian-orange') {
    bgGradientClass =
      'bg-gradient-to-br from-[#0F172A] via-[#1A1829] to-[#25130A] border-orange-500/30 shadow-[0_25px_60px_-15px_rgba(255,85,0,0.25)]';
  } else if (gradientTheme === 'charcoal-glow') {
    bgGradientClass =
      'bg-gradient-to-r from-[#18181B] via-[#27272A] to-[#18181B] border-orange-500/30 shadow-2xl';
  }

  return (
    <section ref={sectionRef} id="preparation-cta" className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className={`rounded-3xl ${bgGradientClass} text-white p-8 sm:p-12 relative overflow-hidden border transition-all duration-300`}>
        {/* ── AMBIENT GLOW ORBS ── */}
        <div
          className="absolute top-0 right-0 w-96 h-96 pointer-events-none rounded-full blur-3xl opacity-35"
          style={{
            background: 'radial-gradient(circle, #FF5500 0%, rgba(255,107,0,0.4) 50%, transparent 80%)',
          }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-80 h-80 pointer-events-none rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)',
          }}
        />

        {/* Subtle modern cyber grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* ── LEFT COLUMN: CONTENT (7 cols) ── */}
          <div className="lg:col-span-7 space-y-5">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-bold uppercase tracking-wider font-mono shadow-xs backdrop-blur-xs">
              <Zap className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>{badgeText}</span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
              {headline}
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
              {description}
            </p>

            {/* 6 Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs font-medium text-slate-100">
                  <div className="w-4 h-4 rounded-full bg-orange-500/25 text-[#FF5500] flex items-center justify-center shrink-0 mt-0.5 border border-orange-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                  </div>
                  <span className="leading-snug">{feature}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link href={ctaUrl}>
                <button className="bg-gradient-to-r from-[#FF5500] to-[#FF6B00] hover:from-[#E64D00] hover:to-[#FF5500] text-white pl-2 pr-6 py-2.5 rounded-full font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer group">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <ChevronsRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <span>{ctaText}</span>
                </button>
              </Link>

              {secondaryCtaText && (
                <Link href={secondaryCtaUrl}>
                  <button className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 backdrop-blur-xs transition cursor-pointer flex items-center gap-1.5">
                    <span>{secondaryCtaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN: MOCKUP / IMAGE (5 cols) ── */}
          <div className="lg:col-span-5 relative">
            {/* Image Preview with Glassmorphism Frame */}
            {imageUrl ? (
              <div className="relative group rounded-3xl overflow-hidden border border-white/15 bg-slate-950/40 shadow-2xl p-2 backdrop-blur-xs transition-transform duration-300 hover:scale-[1.01]">
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="w-full h-auto object-cover rounded-2xl"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = document.getElementById('study-card-default-fallback');
                    if (fallback) fallback.style.display = 'block';
                  }}
                />

                {/* Optional Fallback if image path is unavailable */}
                <div id="study-card-default-fallback" style={{ display: 'none' }} className="p-5 bg-white text-slate-900 rounded-2xl space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#FF5500] text-white flex items-center justify-center text-xs font-black">
                        EG
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-900">Study Deck Pro</span>
                        <p className="text-[10px] text-slate-500">Target: BUET Ka Unit</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-50 text-[#FF5500]">
                      Active
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">Syllabus Completion</span>
                      <span className="text-[#FF5500] font-mono">68.5%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#FF5500] to-orange-400 rounded-full w-[68.5%]" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Fallback interactive card */
              <div className="p-6 rounded-3xl bg-white/95 text-slate-900 border border-white/20 shadow-2xl backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5500] to-[#FF8800] text-white flex items-center justify-center text-xs font-black shadow-sm">
                      EG
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900">Study Deck Pro</span>
                      <p className="text-[10px] text-slate-500">Target: BUET Ka Unit • HSC 2026</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-50 text-[#FF5500] border border-orange-200">
                    Active
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">Syllabus Completion</span>
                    <span className="text-[#FF5500] font-mono font-bold">68.5%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF5500] to-orange-400 rounded-full w-[68.5%]" />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[9px] font-bold text-[#FF5500] uppercase font-mono tracking-wider">
                    Up Next
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Physics: Newton's Laws &amp; Impulse
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    25 min visual breakdown + past 10 years BUET solved numericals.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 text-center border border-slate-100">
                    <span className="text-[10px] text-slate-400">Target</span>
                    <div className="font-bold text-sm text-slate-900">24 MCQs</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 text-center border border-slate-100">
                    <span className="text-[10px] text-slate-400">Accuracy</span>
                    <div className="font-bold text-sm text-emerald-600">88.4%</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
