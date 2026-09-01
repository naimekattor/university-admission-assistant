'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle2, XCircle, ArrowRight, HelpCircle, RefreshCw } from 'lucide-react';

export default function PracticePage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const questions = [
    {
      id: 'q1',
      subject: 'Physics',
      chapter: "Newton's Mechanics",
      text: 'একটি 5 kg ভরের বস্তুর ওপর F(t) = (3t^2 + 2) N বল কাজ করছে। t = 0 হতে t = 2s সময়ে বস্তুর ভরবেগের পরিবর্তন (Impulse) কত Ns?',
      options: ['8 Ns', '12 Ns', '16 Ns', '20 Ns'],
      correctIdx: 1,
      explanation: 'Impulse J = ∫ F(t) dt from 0 to 2 = [t^3 + 2t]_0^2 = (8 + 4) - 0 = 12 Ns।',
      source: 'BUET 2023',
    },
    {
      id: 'q2',
      subject: 'Chemistry',
      chapter: 'Chemical Bonding',
      text: 'sp^3d সংকরণ (hybridization)-এর ক্ষেত্রে অণুর জ্যামিতিক আকৃতি কোনটি?',
      options: ['ত্রিকোণীয় দ্বিপিরামিডীয়', 'অষ্টতলকীয়', 'চতুস্তলকীয়', 'সমতলীয় বর্গাকার'],
      correctIdx: 0,
      explanation: 'sp^3d সংকরায়নে ৫টি সংকর অরবিটাল থাকে, যার জ্যামিতিক আকৃতি ত্রিকোণীয় দ্বিপিরামিডীয়।',
      source: 'KUET 2023',
    },
  ];

  const q = questions[currentIdx];

  const handleSelect = (idx: number) => {
    setSelectedOption(idx);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setCurrentIdx((prev) => (prev + 1) % questions.length);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Admission Practice Engine
          </div>
          <h1 className="text-2xl font-extrabold text-white">Chapter & Weak Topic Drill</h1>
        </div>
        <Link href="/mistakes">
          <button className="px-4 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-semibold rounded-lg text-red-400">
            Open Mistake Notebook
          </button>
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-amber-400 uppercase">{q.subject} • {q.chapter}</span>
          <span className="text-xs bg-slate-800 px-2.5 py-1 rounded text-slate-300 font-medium">{q.source}</span>
        </div>

        <div className="text-lg font-medium text-slate-100">{q.text}</div>

        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === q.correctIdx;

            let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60';
            if (showExplanation) {
              if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
              else if (isSelected) btnStyle = 'bg-red-500/20 border-red-500 text-red-200';
            }

            return (
              <button
                key={idx}
                disabled={showExplanation}
                onClick={() => handleSelect(idx)}
                className={`w-full p-4 rounded-lg border text-left text-sm font-medium transition flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {showExplanation && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {showExplanation && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2 animate-in fade-in">
            <div className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1">
              <HelpCircle className="w-4 h-4" /> Explanation & Concept Solution
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {showExplanation && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 transition"
            >
              Next Question <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
