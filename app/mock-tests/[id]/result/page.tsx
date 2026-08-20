'use client';

import React from 'react';
import Link from 'next/link';
import { Award, CheckCircle2, XCircle, Clock, ArrowRight, RefreshCw, Sparkles, BookOpen } from 'lucide-react';

export default function MockTestResultPage() {
  const result = {
    testTitle: 'BUET Preliminary Model Test 01',
    score: 8.75,
    maxScore: 10.0,
    accuracy: 90,
    correctCount: 9,
    incorrectCount: 1,
    unansweredCount: 0,
    timeSpent: '11 mins 45 secs',
    subjectBreakdown: [
      { subject: 'Physics', score: 4.75, maxScore: 5.0, accuracy: 95 },
      { subject: 'Chemistry', score: 4.0, maxScore: 5.0, accuracy: 80 },
    ],
    aiAnalysis: 'Outstanding performance on Physics kinematics. Slight inaccuracy in Chemistry organic synthesis reagents. Recommended to practice 15 organic reaction MCQs.',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
          <Award className="w-4 h-4" /> Official Examination Evaluation
        </div>
        <h1 className="text-3xl font-extrabold text-white">{result.testTitle} — Result Summary</h1>
      </div>

      {/* Main Score Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center shadow-lg">
          <div className="text-3xl font-black text-amber-400">{result.score}</div>
          <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Total Score</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center shadow-lg">
          <div className="text-3xl font-black text-emerald-400">{result.accuracy}%</div>
          <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Accuracy</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center shadow-lg">
          <div className="text-3xl font-black text-blue-400">{result.correctCount} / {result.correctCount + result.incorrectCount}</div>
          <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Correct Answers</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center shadow-lg">
          <div className="text-3xl font-black text-slate-200">{result.timeSpent}</div>
          <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Time Spent</div>
        </div>
      </div>

      {/* AI Performance Analysis Box */}
      <div className="p-5 bg-gradient-to-r from-amber-900/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-xl space-y-2 shadow-xl">
        <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> AI Performance Analysis & Next Steps
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">{result.aiAnalysis}</p>
      </div>

      {/* Subject Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
          Subject Performance Breakdown
        </h3>

        <div className="space-y-3">
          {result.subjectBreakdown.map((sb, idx) => (
            <div key={idx} className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-100">{sb.subject}</div>
                <div className="text-xs text-slate-400">Score: {sb.score} / {sb.maxScore}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono font-bold text-emerald-400">{sb.accuracy}%</div>
                <div className="text-[10px] text-slate-400 uppercase">Accuracy</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-between items-center pt-2">
        <Link href="/mistakes">
          <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5">
            View Mistakes in Notebook <ArrowRight className="w-4 h-4" />
          </button>
        </Link>

        <Link href="/prepare">
          <button className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2">
            Return to Preparation Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
}
