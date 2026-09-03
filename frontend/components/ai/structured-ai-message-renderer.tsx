'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, BookOpen, Award, Sparkles, HelpCircle } from 'lucide-react';
import type { StructuredAiResponse } from '@/lib/ai-types';
import { MarkdownContent } from './markdown-content';

interface Props {
  response: StructuredAiResponse | any;
}

export function StructuredAiMessageRenderer({ response }: Props) {
  if (!response || typeof response !== 'object') {
    return <MarkdownContent content={String(response)} />;
  }

  const { type } = response;

  if (type === 'university_comparison') {
    return (
      <div className="space-y-4 bg-white border border-orange-100/90 rounded-2xl p-5 text-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-[#FF5500] font-extrabold text-base">
          <Sparkles className="w-4 h-4" />
          <h3>{response.title || 'University Comparison'}</h3>
        </div>
        <MarkdownContent content={response.summary} />

        {response.comparisonTable && response.comparisonTable.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-mono font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Metric</th>
                  <th className="p-3">Option A</th>
                  <th className="p-3">Option B</th>
                  <th className="p-3">Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {response.comparisonTable.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-orange-50/40 transition">
                    <td className="p-3 font-semibold text-slate-900">{row.metric}</td>
                    <td className="p-3 text-slate-700">{row.uni1Value}</td>
                    <td className="p-3 text-slate-700">{row.uni2Value}</td>
                    <td className="p-3 text-emerald-700 font-bold">{row.advantage || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {response.keyDifferences && (
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Key Takeaways</h4>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              {response.keyDifferences.map((diff: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <MarkdownContent content={diff} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {response.recommendedNextActions && (
          <div className="flex flex-wrap gap-2 pt-2">
            {response.recommendedNextActions.map((act: any, idx: number) => (
              <Link key={idx} href="/prepare">
                <button className="px-3.5 py-2 bg-gradient-to-r from-[#FF5500] to-[#E64D00] hover:from-[#E64D00] hover:to-[#D44000] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer">
                  <span>{act.label}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (type === 'eligibility_result') {
    return (
      <div className="space-y-4 bg-white border border-orange-100/90 rounded-2xl p-5 text-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-base">
          <Award className="w-4 h-4 text-emerald-600" />
          <h3>Admission Eligibility Analysis</h3>
        </div>
        <MarkdownContent content={response.summary} />

        {response.eligibleUniversities && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {response.eligibleUniversities.map((uni: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">{uni.university}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{uni.program}</div>
                </div>
                <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full font-mono ${uni.status === 'eligible' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                  {uni.status === 'eligible' ? 'Eligible' : 'Pending Verification'}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <Link href="/eligibility">
            <button className="px-3.5 py-2 bg-gradient-to-r from-[#FF5500] to-[#E64D00] hover:from-[#E64D00] hover:to-[#D44000] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer">
              <span>Full Eligibility Checker</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
          <Link href="/prepare">
            <button className="px-3.5 py-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#FF5500] text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer">
              <span>Start Preparation</span>
              <BookOpen className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (type === 'question_explanation') {
    return (
      <div className="space-y-4 bg-white border border-orange-100/90 rounded-2xl p-5 text-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-[#FF5500] font-extrabold text-base">
          <HelpCircle className="w-4 h-4 text-[#FF5500]" />
          <h3>AI Tutor Step-by-step Explanation</h3>
        </div>
        <div className="p-3.5 bg-orange-50/70 rounded-xl border border-orange-200/80">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono block mb-1">Question:</span>
          <MarkdownContent content={response.questionText} />
        </div>
        <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg inline-block">
          Correct Answer: {response.correctAnswer}
        </div>

        {response.stepByStepSolution && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Solution Steps</h4>
            <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside font-medium">
              {response.stepByStepSolution.map((step: string, i: number) => (
                <li key={i} className="leading-relaxed">
                  <MarkdownContent content={step} />
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Link href="/practice">
            <button className="px-3.5 py-2 bg-gradient-to-r from-[#FF5500] to-[#E64D00] hover:from-[#E64D00] hover:to-[#D44000] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer">
              <span>Practice Similar MCQs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // General Answer Renderer
  return (
    <div className="space-y-4 bg-white border border-orange-100/90 rounded-2xl p-5 text-slate-800 shadow-sm">
      {response.summary && (
        <div className="border-b border-slate-100 pb-3">
          <MarkdownContent content={response.summary} />
        </div>
      )}

      {response.sections && response.sections.map((sec: any, idx: number) => (
        <div key={idx} className="space-y-1.5 pt-2 border-t border-slate-100/80 first:border-t-0">
          <h4 className="text-xs font-bold text-[#FF5500] uppercase tracking-wider font-mono">{sec.heading}</h4>
          <MarkdownContent content={sec.content} />
        </div>
      ))}

      {response.recommendedNextActions && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
          {response.recommendedNextActions.map((act: any, idx: number) => (
            <Link key={idx} href="/prepare">
              <button className="px-3.5 py-2 bg-gradient-to-r from-[#FF5500] to-[#E64D00] hover:from-[#E64D00] hover:to-[#D44000] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer">
                <span>{act.label}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
