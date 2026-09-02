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
    <section id="preparation-cta" className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      <div className="rounded-3xl bg-[var(--eg-surface)] border border-[var(--eg-border)] p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Copy & Feature Checkmarks (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--eg-primary-soft)] text-[var(--eg-primary)] text-xs font-bold uppercase tracking-wider font-mono">
              <Zap className="w-3.5 h-3.5 text-[var(--eg-primary)]" />
              <span>THE PREPARATION PLATFORM</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--eg-text-primary)] tracking-tight leading-tight">
              {headline}
            </h2>

            <p className="text-base text-[var(--eg-text-secondary)] leading-relaxed max-w-xl">
              {description}
            </p>

            {/* Checkmark List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-medium text-[var(--eg-text-primary)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--eg-success)] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Link href={ctaUrl}>
                <button className="px-8 py-3.5 bg-[var(--eg-primary)] hover:bg-[var(--eg-primary-hover)] text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer">
                  <span>{ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Student Preview Mockup (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-[var(--eg-surface-subtle)] border border-[var(--eg-border)] shadow-2xs space-y-4">
              {/* Preview Header */}
              <div className="flex items-center justify-between border-b border-[var(--eg-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[var(--eg-primary)] text-white flex items-center justify-center text-xs font-bold">
                    EG
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[var(--eg-text-primary)]">Student Study Deck</span>
                    <p className="text-[10px] text-[var(--eg-text-muted)]">Target: BUET Ka Unit (Engineering)</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
                  Interactive Preview
                </span>
              </div>

              {/* Progress Indicator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--eg-text-secondary)] font-medium">Syllabus Completion</span>
                  <span className="font-bold text-[var(--eg-primary)] font-mono">68%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-[var(--eg-primary)] rounded-full w-[68%]" />
                </div>
              </div>

              {/* Next Lesson Card */}
              <div className="p-3.5 rounded-xl bg-white border border-[var(--eg-border)] space-y-1.5">
                <span className="text-[10px] font-bold text-[var(--eg-primary)] font-mono uppercase">
                  Up Next in Curriculum
                </span>
                <h4 className="text-xs font-bold text-[var(--eg-text-primary)]">
                  Physics: Newton's Laws & Impulse Calculations
                </h4>
                <p className="text-[11px] text-[var(--eg-text-secondary)]">
                  25 min visual breakdown with past 10 years BUET solved numericals.
                </p>
              </div>

              {/* Practice Stats Row */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-white border border-[var(--eg-border)]">
                  <span className="text-[10px] text-[var(--eg-text-muted)]">Today's Target</span>
                  <div className="font-bold text-sm text-[var(--eg-text-primary)] font-mono">24 MCQs</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[var(--eg-border)]">
                  <span className="text-[10px] text-[var(--eg-text-muted)]">Weak Topic Focus</span>
                  <div className="font-bold text-sm text-rose-600 truncate">Organic Chem</div>
                </div>
              </div>

              {/* Bottom Badge */}
              <div className="text-[11px] text-center text-[var(--eg-text-muted)] pt-1">
                Personalized study schedules adapt daily to your strengths and mock test scores.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
