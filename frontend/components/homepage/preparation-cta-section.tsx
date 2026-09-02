'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Sparkles, BookOpen, Target, Award, Flame, Zap } from 'lucide-react';
import { PreparationConfig } from '@/../backend/src/modules/homepage/homepage.service';

interface PreparationCtaSectionProps {
  config?: PreparationConfig;
}

export function PreparationCtaSection({ config }: PreparationCtaSectionProps) {
  const headline = config?.headline || 'Know where to apply. Now prepare to get in.';
  const description =
    config?.description ||
    'Turn your target university and admission unit into a personalized preparation plan with visual lessons and chapter-wise MCQs.';
  const features = config?.features || [
    'Visual interactive lessons',
    'Chapter-wise MCQ practice drills',
    'Past 15 years solved admission questions',
    'Full-length timed mock tests',
    '24/7 AI Admission Tutor with step-by-step derivations',
    'Personalized mistake notebook & revision queue',
  ];
  const ctaText = config?.ctaText || 'Start Preparing';
  const ctaUrl = config?.ctaUrl || '/prepare';

  return (
    <section id="preparation-cta" className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto bg-slate-950">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Copy & Feature Checkmarks (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider font-mono">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>THE PREPARATION PLATFORM</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {headline}
            </h2>

            <p className="text-base text-slate-300 leading-relaxed max-w-xl">
              {description}
            </p>

            {/* Checkmark List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Link href={ctaUrl}>
                <button className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-lg shadow-md hover:shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer">
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>{ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Student Preview Mockup (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xs space-y-4">
              {/* Preview Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">
                    EG
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white">Student Study Deck</span>
                    <p className="text-[10px] text-slate-400">Target: BUET Ka Unit (Engineering)</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Interactive Preview
                </span>
              </div>

              {/* Progress Indicator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Syllabus Completion</span>
                  <span className="font-bold text-amber-400 font-mono">68%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[68%]" />
                </div>
              </div>

              {/* Next Lesson Card */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-400 font-mono uppercase">
                  Up Next in Curriculum
                </span>
                <h4 className="text-xs font-bold text-white">
                  Physics: Newton's Laws & Impulse Calculations
                </h4>
                <p className="text-[11px] text-slate-300">
                  25 min visual breakdown with past 10 years BUET solved numericals.
                </p>
              </div>

              {/* Practice Stats Row */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Today's Target</span>
                  <div className="font-bold text-sm text-white font-mono">24 MCQs</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Weak Topic Focus</span>
                  <div className="font-bold text-sm text-rose-400 truncate">Organic Chem</div>
                </div>
              </div>

              {/* Bottom Badge */}
              <div className="text-[11px] text-center text-slate-400 pt-1">
                Personalized study schedules adapt daily to your strengths and mock test scores.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
