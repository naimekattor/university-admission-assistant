'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, ArrowRight, BookOpen, Target, Award, Sparkles, HelpCircle } from 'lucide-react';
import type { StructuredAiResponse } from '@/lib/ai-types';

interface Props {
  response: StructuredAiResponse | any;
}

export function StructuredAiMessageRenderer({ response }: Props) {
  if (!response || typeof response !== 'object') {
    return <div className="text-gray-200">{String(response)}</div>;
  }

  const { type } = response;

  if (type === 'university_comparison') {
    return (
      <div className="space-y-4 bg-slate-900/90 border border-slate-700/80 rounded-xl p-5 text-slate-100 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-lg">
          <Sparkles className="w-5 h-5" />
          <h3>{response.title || 'University Comparison'}</h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{response.summary}</p>

        {response.comparisonTable && response.comparisonTable.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-800 text-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3">Metric</th>
                  <th className="p-3">Option A</th>
                  <th className="p-3">Option B</th>
                  <th className="p-3">Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {response.comparisonTable.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-800/50">
                    <td className="p-3 font-medium text-amber-300">{row.metric}</td>
                    <td className="p-3 text-slate-200">{row.uni1Value}</td>
                    <td className="p-3 text-slate-200">{row.uni2Value}</td>
                    <td className="p-3 text-emerald-400 font-medium">{row.advantage || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {response.keyDifferences && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Takeaways</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {response.keyDifferences.map((diff: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{diff}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {response.recommendedNextActions && (
          <div className="flex flex-wrap gap-2 pt-3">
            {response.recommendedNextActions.map((act: any, idx: number) => (
              <Link key={idx} href="/prepare">
                <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition">
                  {act.label} <ArrowRight className="w-3.5 h-3.5" />
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
      <div className="space-y-4 bg-slate-900/90 border border-slate-700/80 rounded-xl p-5 text-slate-100 shadow-xl">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-lg">
          <Award className="w-5 h-5" />
          <h3>Admission Eligibility Analysis</h3>
        </div>
        <p className="text-sm text-slate-300">{response.summary}</p>

        {response.eligibleUniversities && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {response.eligibleUniversities.map((uni: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm text-slate-100">{uni.university}</div>
                  <div className="text-xs text-slate-400">{uni.program}</div>
                </div>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${uni.status === 'eligible' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                  {uni.status === 'eligible' ? 'Eligible' : 'Pending Verification'}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <Link href="/eligibility">
            <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition">
              Full Eligibility Checker <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
          <Link href="/prepare">
            <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition">
              Start Preparation <BookOpen className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (type === 'question_explanation') {
    return (
      <div className="space-y-4 bg-slate-900/90 border border-slate-700/80 rounded-xl p-5 text-slate-100 shadow-xl">
        <div className="flex items-center gap-2 text-blue-400 font-semibold text-lg">
          <HelpCircle className="w-5 h-5" />
          <h3>AI Tutor Step-by-step Explanation</h3>
        </div>
        <div className="p-3 bg-slate-800/90 rounded-lg text-sm font-medium text-amber-200 border border-slate-700">
          Question: {response.questionText}
        </div>
        <div className="text-xs font-semibold text-emerald-400">
          Correct Answer: {response.correctAnswer}
        </div>

        {response.stepByStepSolution && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Solution Steps</h4>
            <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside">
              {response.stepByStepSolution.map((step: string, i: number) => (
                <li key={i} className="leading-relaxed">{step}</li>
              ))}
            </ol>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Link href="/practice">
            <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition">
              Practice Similar MCQs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // General Answer Renderer
  return (
    <div className="space-y-4 bg-slate-900/90 border border-slate-700/80 rounded-xl p-5 text-slate-100 shadow-xl">
      {response.summary && <p className="text-sm text-slate-200 leading-relaxed">{response.summary}</p>}

      {response.sections && response.sections.map((sec: any, idx: number) => (
        <div key={idx} className="space-y-1 border-t border-slate-800 pt-3">
          <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">{sec.heading}</h4>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{sec.content}</p>
        </div>
      ))}

      {response.recommendedNextActions && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800">
          {response.recommendedNextActions.map((act: any, idx: number) => (
            <Link key={idx} href="/prepare">
              <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition">
                {act.label} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
