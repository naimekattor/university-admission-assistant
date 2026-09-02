'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare, ExternalLink, HelpCircle } from 'lucide-react';
import { AiAdvisorConfig } from '@/../backend/src/modules/homepage/homepage.service';

interface AiAdvisorPreviewSectionProps {
  config?: AiAdvisorConfig;
}

export function AiAdvisorPreviewSection({ config }: AiAdvisorPreviewSectionProps) {
  const title = config?.title || 'Ask anything about university admission.';
  const description =
    config?.description ||
    'Confused about eligibility, units, deadlines or admission requirements? Ask EduGuide.';
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
    <section id="ai-advisor" className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto bg-slate-950">
      <div className="space-y-8">
        {/* ── SECTION HEADER ── */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider font-mono">
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span>AI ADMISSION INTELLIGENCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {title}
          </h2>
          <p className="text-sm text-slate-300">
            {description}
          </p>
        </div>

        {/* ── QUESTION CHIPS ── */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {exampleQuestions
            .filter((q) => q.enabled)
            .map((q) => (
              <button
                key={q.id}
                onClick={() => setActiveQuestion(q.text)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeQuestion === q.text
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 opacity-80" />
                <span>{q.text}</span>
              </button>
            ))}
        </div>

        {/* ── INTERACTIVE PREVIEW CHAT CONTAINER ── */}
        <div className="max-w-3xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm space-y-5">
          {/* User Message */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center text-xs font-bold shrink-0 border border-slate-700">
              STU
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-950 border border-slate-800 text-sm text-slate-100 font-medium">
              {activeQuestion}
            </div>
          </div>

          {/* AI Response Card */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4 fill-slate-950" />
            </div>

            <div className="flex-1 p-5 rounded-2xl rounded-tl-none bg-slate-950 border border-slate-800 shadow-2xs space-y-4 text-xs">
              {/* Top verification header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Official Circular Verification</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  Verified: Sep 2026
                </span>
              </div>

              {/* Summary Text */}
              <p className="text-slate-200 leading-relaxed font-normal">
                For BUET Undergraduate Admission 2026, candidates from the <strong className="text-amber-400">Science Group</strong> must satisfy the following deterministic criteria:
              </p>

              {/* Structured Points */}
              <ul className="space-y-1.5 text-slate-300 pl-3 list-disc">
                <li><strong className="text-white">SSC GPA</strong>: Minimum 4.00 out of 5.00 (with 4th subject).</li>
                <li><strong className="text-white">HSC GPA</strong>: Minimum 4.00 out of 5.00 in Physics, Chemistry, Higher Mathematics, English.</li>
                <li><strong className="text-white">Total Combined Score</strong>: Subject grades in PHY + CHE + MATH must total minimum 270 points (Grade A+ in all three subjects strongly recommended for preliminary shortlisting).</li>
                <li><strong className="text-white">Second-time Policy</strong>: Strictly disallowed. Only 1st-time candidates may sit for the test.</li>
              </ul>

              {/* Sources & Citations */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-medium text-slate-300">Source: BUET Admission Circular 2026</span>
                <a
                  href="https://buet.ac.bd/admission"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>View PDF Circular</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom CTA to Full Advisor */}
          <div className="text-center pt-2">
            <Link href="/chat">
              <button className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm hover:shadow transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer">
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
