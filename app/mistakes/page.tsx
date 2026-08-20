'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

export default function MistakeNotebookPage() {
  const mistakes = [
    {
      id: 'm1',
      subject: 'Physics',
      chapter: "Newton's Mechanics",
      topic: 'Linear Impulse Integration',
      questionText: 'একটি 5 kg ভরের বস্তুর ওপর F(t) = (3t^2 + 2) N বল কাজ করছে। t = 0 হতে t = 2s সময়ে বস্তুর ভরবেগের পরিবর্তন কত?',
      yourAnswer: '8 Ns',
      correctAnswer: '12 Ns',
      frequency: 2,
    },
    {
      id: 'm2',
      subject: 'Chemistry',
      chapter: 'Organic Chemistry',
      topic: 'Electrophilic Substitution',
      questionText: 'বেনজিনের নাইট্রেশন বিক্রিয়ায় ইলেকট্রোফাইল কোনটি?',
      yourAnswer: 'NO2-',
      correctAnswer: 'NO2+ (নাইট্রোনিয়াম আয়ন)',
      frequency: 3,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Personal Mistake Notebook
          </div>
          <h1 className="text-2xl font-extrabold text-white">Review & Master Incorrect Concepts</h1>
        </div>
        <Link href="/practice">
          <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg">
            Practice All Mistakes
          </button>
        </Link>
      </div>

      <div className="space-y-4">
        {mistakes.map((m) => (
          <div key={m.id} className="p-5 bg-slate-900 border border-red-500/20 rounded-xl space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase">{m.subject} • {m.chapter}</span>
              <span className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-medium">
                Incorrect {m.frequency} times
              </span>
            </div>

            <div className="text-sm font-semibold text-slate-100">{m.questionText}</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-400">Your Answer: </span>
                <span className="text-red-400 font-medium">{m.yourAnswer}</span>
              </div>
              <div>
                <span className="text-slate-400">Correct Answer: </span>
                <span className="text-emerald-400 font-bold">{m.correctAnswer}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Link href="/practice">
                <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" /> Practice Again
                </button>
              </Link>
              <Link href="/chat">
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Ask AI Tutor
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
