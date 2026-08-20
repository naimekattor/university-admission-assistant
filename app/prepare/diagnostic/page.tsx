'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, CheckCircle2, ArrowRight, Award, BarChart3, AlertCircle } from 'lucide-react';

export default function DiagnosticAssessmentPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sampleQuestions = [
    {
      id: 'q1',
      subject: 'Physics',
      chapter: "Newton's Mechanics",
      text: 'একটি 5 kg ভরের বস্তুর ওপর F(t) = (3t^2 + 2) N বল কাজ করছে। t = 0 হতে t = 2s সময়ে বস্তুর ভরবেগের পরিবর্তন (Impulse) কত Ns?',
      options: ['8 Ns', '12 Ns', '16 Ns', '20 Ns'],
      correctIdx: 1,
    },
    {
      id: 'q2',
      subject: 'Chemistry',
      chapter: 'Chemical Bonding',
      text: 'sp^3d সংকরণ (hybridization)-এর ক্ষেত্রে অণুর জ্যামিতিক আকৃতি কোনটি?',
      options: ['ত্রিকোণীয় দ্বিপিরামিডীয়', 'অষ্টতলকীয়', 'চতুস্তলকীয়', 'সমতলীয় বর্গাকার'],
      correctIdx: 0,
    },
    {
      id: 'q3',
      subject: 'Higher Mathematics',
      chapter: 'Calculus',
      text: 'lim (x->0) (sin 5x / x) এর মান কত?',
      options: ['1', '5', '1/5', '0'],
      correctIdx: 1,
    },
  ];

  const handleSelect = (optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optionIdx }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const q = sampleQuestions[currentIdx];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" /> Baseline Diagnostic Assessment
        </div>
        <h1 className="text-3xl font-extrabold text-white">Identify Your Weak Concepts</h1>
        <p className="text-sm text-slate-400">
          Complete this short diagnostic test to evaluate your accuracy across Physics, Chemistry, and Higher Mathematics.
        </p>
      </div>

      {!isSubmitted ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-amber-400 uppercase">Question {currentIdx + 1} of {sampleQuestions.length}</span>
            <span className="text-xs text-slate-400">{q.subject} • {q.chapter}</span>
          </div>

          <div className="text-lg font-medium text-slate-100">{q.text}</div>

          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentIdx] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-4 rounded-lg border text-left text-sm font-medium transition flex items-center justify-between ${isSelected ? 'bg-amber-500/20 border-amber-500 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60'}`}
                >
                  <span>{opt}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((p) => p - 1)}
              className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-slate-200"
            >
              Previous
            </button>

            {currentIdx < sampleQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((p) => p + 1)}
                className="px-5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-600 rounded-lg text-slate-950"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-bold"
              >
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Evaluation Result View */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-3 text-emerald-400 font-bold text-xl border-b border-slate-800 pb-3">
            <Award className="w-6 h-6" />
            <h2>Your Admission Preparation Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center">
              <div className="text-2xl font-black text-amber-400">2.75 / 3.0</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Total Score</div>
            </div>
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center">
              <div className="text-2xl font-black text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Accuracy</div>
            </div>
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center">
              <div className="text-2xl font-black text-blue-400">4.5 Hours</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Rec. Daily Study</div>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase">Identified Weak Areas</div>
            <div className="text-sm text-slate-200">Chemistry Organic Reactions & Physics Integration</div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link href="/prepare/study-plan">
              <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-lg flex items-center gap-2">
                Generate Personalized 30-Day Study Plan <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
