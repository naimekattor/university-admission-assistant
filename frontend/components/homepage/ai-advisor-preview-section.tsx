'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Zap,
  Flame,
} from 'lucide-react';
import { AiAdvisorConfig } from '@/lib/homepage-types';

interface AiAdvisorPreviewSectionProps {
  config?: AiAdvisorConfig;
}

export function AiAdvisorPreviewSection({ config }: AiAdvisorPreviewSectionProps) {
  const eyebrow = config?.eyebrowBadge || 'AI ADMISSION INTELLIGENCE';
  const title = config?.title || 'Ask anything about university admission.';
  const description =
    config?.description ||
    'Confused about eligibility, units, deadlines or admission requirements? Ask EduGuide.';
  const ctaText = config?.ctaText || 'Ask Admission Advisor';
  const ctaUrl = config?.ctaUrl || '/chat';
  const imageUrl = config?.imageUrl || '/images/ai-advisor-avatar.svg';
  const imageAlt = config?.imageAlt || 'EduGuide AI Admission Intelligence';
  const gradientTheme = config?.gradientTheme || 'warm-glow';

  const exampleQuestions =
    config?.exampleQuestions && config.exampleQuestions.length > 0
      ? config.exampleQuestions
      : [
          {
            id: 'q1',
            text: 'Which universities are accepting applications right now?',
            category: 'Deadlines',
            order: 1,
            answer:
              'Currently, BUET, KUET, RUET, CUET, and DU Ka Unit have active circular deadlines for the 2026 session. Medical (MBBS) applications are also open with test scheduled for late November.',
            enabled: true,
          },
          {
            id: 'q2',
            text: 'What is the BUET admission minimum GPA requirement?',
            category: 'Eligibility',
            order: 2,
            answer:
              'For BUET Undergraduate Admission 2026, candidates from the Science Group must satisfy: Minimum 4.00 out of 5.00 in SSC, 4.00 in HSC across PHY, CHE, MATH, ENG, and combined points >= 270. Second-time is strictly disallowed.',
            enabled: true,
          },
          {
            id: 'q3',
            text: 'Which units can I apply to with SSC GPA 4.8 and HSC GPA 5.0?',
            category: 'Eligibility',
            order: 3,
            answer:
              'With a combined GPA of 9.80, you qualify for 95%+ of public university units including DU Ka & Kha, GST Cluster Science & General, and Engineering Universities (subject to Physics & Math grade prerequisites).',
            enabled: true,
          },
          {
            id: 'q4',
            text: 'What are the main differences between BUET and DU Ka Unit exams?',
            category: 'Comparison',
            order: 4,
            answer:
              'BUET has a preliminary MCQ screening followed by a written-only final test with zero calculators allowed. DU Ka Unit combines both 60 MCQ and 40 Written marks in a unified 90-minute sitting without calculators.',
            enabled: true,
          },
          {
            id: 'q5',
            text: 'When will the Medical admission test admit card be published?',
            category: 'Admit Card',
            order: 5,
            answer:
              'Medical (MBBS) admit cards will be downloadable from DGHS official portal approximately 10 days before the admission exam date.',
            enabled: true,
          },
        ];

  const activeEnabledQuestions = exampleQuestions.filter((q) => q.enabled);
  const initialQuestion = activeEnabledQuestions[1] || activeEnabledQuestions[0];

  const [activeQuestionText, setActiveQuestionText] = useState<string>(
    initialQuestion?.text || 'What is the BUET admission minimum GPA requirement?'
  );

  const currentQuestionItem =
    activeEnabledQuestions.find((q) => q.text === activeQuestionText) || initialQuestion;

  const displayAnswer =
    currentQuestionItem?.answer ||
    config?.simulatedAnswer ||
    'For BUET Undergraduate Admission 2026, candidates from the Science Group must satisfy: Minimum 4.00 out of 5.00 in SSC, 4.00 in HSC across PHY, CHE, MATH, ENG, and combined points >= 270. Second-time is strictly disallowed.';

  // Theme styles
  let containerBg =
    'bg-gradient-to-br from-orange-50/50 via-white to-amber-50/40 border-orange-200/80 shadow-sm';
  let isDark = false;

  if (gradientTheme === 'smooth-sunset') {
    containerBg =
      'bg-gradient-to-br from-[#FFF5EE] via-[#FFEBD9] to-[#FFF0E6] border-orange-300 shadow-md';
  } else if (gradientTheme === 'executive-dark') {
    containerBg =
      'bg-gradient-to-br from-[#18110D] via-[#24150B] to-[#120C08] text-white border-orange-500/30 shadow-2xl';
    isDark = true;
  } else if (gradientTheme === 'solar-amber') {
    containerBg =
      'bg-gradient-to-br from-[#FFFDF9] via-[#FFF6ED] to-[#FEF3C7] border-amber-200 shadow-sm';
  }

  return (
    <section id="ai-advisor" className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className={`rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden border transition-all duration-300 ${containerBg}`}
      >
        {/* ── SMOOTH AMBIENT GLOW ORBS ── */}
        <div
          className="absolute top-0 right-1/4 w-96 h-96 pointer-events-none rounded-full blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle, #FF5500 0%, rgba(255,140,0,0.4) 50%, transparent 80%)',
          }}
        />
        <div
          className="absolute bottom-0 left-10 w-80 h-80 pointer-events-none rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 space-y-8">
          {/* ── SECTION HEADER ── */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-[#FF5500] text-xs font-bold uppercase tracking-wider font-mono shadow-2xs backdrop-blur-xs">
              <Bot className="w-4 h-4 text-[#FF5500]" />
              <span>{eyebrow}</span>
            </div>

            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {title}
            </h2>

            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {description}
            </p>
          </div>

          {/* ── QUESTION CHIPS ── */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {activeEnabledQuestions.map((q) => {
              const isSelected = activeQuestionText === q.text;
              return (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestionText(q.text)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs scale-[1.02]'
                      : isDark
                      ? 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/15'
                      : 'bg-white/90 text-slate-700 hover:text-slate-900 border-slate-200/90 hover:border-orange-300 shadow-2xs'
                  }`}
                >
                  <HelpCircle className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-400' : 'text-slate-400'}`} />
                  <span>{q.text}</span>
                </button>
              );
            })}
          </div>

          {/* ── 2-COLUMN MAIN CONTENT: CHAT PREVIEW + AI AVATAR ARTWORK ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center max-w-5xl mx-auto pt-2">
            {/* Left: Chat Simulation Card (7 cols) */}
            <div className={`lg:col-span-7 rounded-3xl p-5 sm:p-7 space-y-4 border shadow-md backdrop-blur-md ${
              isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/95 border-slate-200/90 text-slate-900'
            }`}>
              {/* User Message */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                  ST
                </div>
                <div className={`p-3.5 rounded-2xl rounded-tl-none text-xs font-semibold leading-relaxed ${
                  isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-900'
                }`}>
                  {activeQuestionText}
                </div>
              </div>

              {/* AI Response Card */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF5500] to-[#FF7700] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>

                <div className={`flex-1 p-4 sm:p-5 rounded-2xl rounded-tl-none border space-y-3 text-xs ${
                  isDark
                    ? 'bg-orange-950/30 border-orange-500/30 text-slate-200'
                    : 'bg-orange-50/60 border-orange-200/90 text-slate-800'
                }`}>
                  <div className="flex items-center justify-between border-b border-orange-200/60 pb-2.5">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Verified from Official Circular</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Updated: Admission 2026
                    </span>
                  </div>

                  <div className="leading-relaxed whitespace-pre-line text-xs font-medium space-y-1.5">
                    {displayAnswer}
                  </div>
                </div>
              </div>

              {/* CTA button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Ask tailored questions about your GPA &amp; eligible universities.
                </span>

                <Link href={ctaUrl}>
                  <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF6B00] hover:from-[#E64D00] hover:to-[#FF5500] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer shrink-0">
                    <span>{ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: Modern AI Avatar / Illustration Card (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative group w-full max-w-sm rounded-3xl overflow-hidden border border-white/20 shadow-xl p-2 bg-gradient-to-b from-white/60 to-white/20 backdrop-blur-md transition-transform duration-300 hover:scale-[1.01]">
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="w-full h-auto object-contain rounded-2xl max-h-[300px]"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />

                {/* Floating pill badge */}
                <div className="p-3 bg-white/95 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#FF5500] flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">EduGuide AI Assistant</div>
                      <div className="text-[10px] text-slate-500">Trained on 100+ Circulars</div>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Online 24/7
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
