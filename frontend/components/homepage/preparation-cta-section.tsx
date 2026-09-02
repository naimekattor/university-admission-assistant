'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Sparkles, BookOpen, Target, Award, Flame, Zap, ChevronsRight } from 'lucide-react';
import { PreparationConfig } from '@/lib/homepage-types';

interface PreparationCtaSectionProps {
  config?: PreparationConfig;
}

export function PreparationCtaSection({ config }: PreparationCtaSectionProps) {
  const headline = config?.headline || 'Know where to apply. Now prepare to get in.';
  const description =
    config?.description ||
    'Turn your target university and admission unit into a personalized preparation plan with visual lessons, chapter-wise MCQs, and past 15 years question bank.';
  const features = config?.features || [
    'Visual interactive lessons',
    'Chapter-wise MCQ practice drills',
    'Past 15 years solved admission questions',
    'Full-length timed mock test simulator',
    '24/7 AI Admission Tutor with step derivations',
    'Personalized mistake notebook & revision queue',
  ];
  const ctaText = config?.ctaText || 'Start Preparing Free';
  const ctaUrl = config?.ctaUrl || '/prepare';

  return (
    <section id="preparation-cta" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5500]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider font-mono">
              <Zap className="w-3.5 h-3.5" />
              <span>THE PREPARATION PLATFORM</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {headline}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
              {description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <Link href={ctaUrl}>
                <button className="bg-gradient-to-r from-[#FF5500] to-[#FF6B00] hover:from-[#E64D00] hover:to-[#FF5500] text-white pl-2 pr-6 py-2.5 rounded-full font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer group">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <ChevronsRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <span>{ctaText}</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column Preview Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-5 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FF5500] text-white flex items-center justify-center text-xs font-black">
                    EG
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900">Study Deck</span>
                    <p className="text-[10px] text-slate-500">Target: BUET Ka Unit</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-50 text-[#FF5500]">
                  Active
                </span>
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600">Syllabus Completion</span>
                  <span className="text-[#FF5500] font-mono">68%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF5500] to-orange-400 rounded-full w-[68%]" />
                </div>
              </div>

              {/* Next Lesson */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[9px] font-bold text-[#FF5500] uppercase font-mono">
                  Up Next
                </span>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  Physics: Newton's Laws & Impulse
                </h4>
                <p className="text-[10px] text-slate-500">
                  25 min visual breakdown + past 10 years BUET solved numericals.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 text-center">
                  <span className="text-[10px] text-slate-400">Target</span>
                  <div className="font-bold text-xs text-slate-900">24 MCQs</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 text-center">
                  <span className="text-[10px] text-slate-400">Accuracy</span>
                  <div className="font-bold text-xs text-emerald-600">88%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
