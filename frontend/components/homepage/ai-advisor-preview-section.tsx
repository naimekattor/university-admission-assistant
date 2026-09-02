'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare, ExternalLink, HelpCircle } from 'lucide-react';
import { AiAdvisorConfig } from '@/../backend/src/modules/homepage/homepage.service';

interface AiAdvisorPreviewSectionProps {
  config?: AiAdvisorConfig;
}

export function AiAdvisorPreviewSection({ config }: AiAdvisorPreviewSectionProps) {
  const title = config?.title || 'Ask Anything About University Admission';
  const description =
    config?.description ||
    'Confused about GPA criteria, second-time rules, unit conversions, or circular requirements? Ask EduGuide.';
  const ctaText = config?.ctaText || 'Ask Admission Advisor';
  const exampleQuestions = config?.exampleQuestions || [
    { id: 'q1', text: 'Which universities are accepting applications right now?', category: 'Deadlines', order: 1, enabled: true },
    { id: 'q2', text: 'What is the BUET admission minimum GPA requirement?', category: 'Eligibility', order: 2, enabled: true },
    { id: 'q3', text: 'Which units can I apply to with SSC GPA 4.8 and HSC GPA 5.0?', category: 'Eligibility', order: 3, enabled: true },
    { id: 'q4', text: 'What are the main differences between BUET and DU Ka Unit exams?', category: 'Comparison', order: 4, enabled: true },
  ];

  const [activeQuestion, setActiveQuestion] = useState(
    'What is the BUET admission minimum GPA requirement?'
  );

  return (
    <section id="ai-advisor" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="space-y-6">
        {/* ── SECTION HEADER ── */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-xs font-bold uppercase tracking-wider font-mono">
            <Bot className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>AI ADMISSION INTELLIGENCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {title}
          </h2>
          <p className="text-sm text-slate-600">
            {description}
          </p>
        </div>

        {/* ── QUESTION CHIPS ── */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          {exampleQuestions
            .filter((q) => q.enabled)
            .map((q) => (
              <button
                key={q.id}
                onClick={() => setActiveQuestion(q.text)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeQuestion === q.text
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-300'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 opacity-80" />
                <span>{q.text}</span>
              </button>
            ))}
        </div>

        {/* ── PREVIEW CHAT CONTAINER ── */}
        <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          {/* User Message */}
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
              ST
            </div>
            <div className="p-3 rounded-2xl rounded-tl-none bg-slate-100 text-xs text-slate-800 font-medium">
              {activeQuestion}
            </div>
          </div>

          {/* AI Response Card */}
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#FF5500] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            <div className="flex-1 p-4 rounded-2xl rounded-tl-none bg-orange-50/50 border border-orange-200/80 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                <div className="flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified from Official Circular</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Updated: Sep 2026
                </span>
              </div>

              <p className="text-slate-700 leading-relaxed font-normal">
                For BUET Undergraduate Admission 2026, candidates from the <strong className="text-slate-900 font-bold">Science Group</strong> must satisfy:
              </p>

              <ul className="space-y-1 text-slate-700 pl-3 list-disc text-[11px]">
                <li><strong className="text-slate-900">SSC GPA</strong>: Minimum 4.00 out of 5.00.</li>
                <li><strong className="text-slate-900">HSC GPA</strong>: Minimum 4.00 in PHY, CHE, MATH, ENG.</li>
                <li><strong className="text-slate-900">Combined Grades</strong>: Total points in PHY + CHE + MATH must equal or exceed 270 points (Grade A+ in all three recommended).</li>
                <li><strong className="text-slate-900">Second-time Policy</strong>: Strictly disallowed.</li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link href="/chat">
              <button className="btn-primary-brand px-6 py-2 text-xs font-bold flex items-center justify-center gap-1.5 mx-auto cursor-pointer">
                <span>{ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
