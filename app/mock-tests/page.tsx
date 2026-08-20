'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Clock, Award, ArrowRight, Play } from 'lucide-react';

export default function MockTestsPage() {
  const tests = [
    {
      id: 'buet-prelim-01',
      title: 'BUET Preliminary Model Test 01 (Physics & Chemistry)',
      university: 'BUET',
      unit: 'Ka Unit',
      questions: 10,
      duration: '15 mins',
      totalMarks: 10,
    },
    {
      id: 'du-ka-01',
      title: 'DU Ka Unit Full Standard Model Test',
      university: 'DU',
      unit: 'Ka Unit',
      questions: 20,
      duration: '30 mins',
      totalMarks: 20,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
          <Target className="w-4 h-4" /> Admission Mock Test Series
        </div>
        <h1 className="text-3xl font-extrabold text-white">Realistic Timed Admission Exams</h1>
        <p className="text-sm text-slate-400">
          Simulate official university admission test environments with automatic timing and score analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map((t) => (
          <div key={t.id} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase">{t.university} • {t.unit}</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                  Active Exam
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 leading-snug">{t.title}</h2>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {t.duration}</span>
                <span>•</span>
                <span>{t.questions} MCQs</span>
                <span>•</span>
                <span>{t.totalMarks} Marks</span>
              </div>
            </div>

            <Link href={`/mock-tests/${t.id}`}>
              <button className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition">
                <Play className="w-4 h-4 fill-slate-950" /> Start Mock Test Now
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
