'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, BookOpen, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function StudyPlanPage() {
  const scheduleDays = [
    { day: 1, subject: 'Physics', chapter: "Newton's Mechanics", task: 'Lesson & Practice', minutes: 75, isDone: true },
    { day: 2, subject: 'Chemistry', chapter: 'Chemical Bonding & Hybridization', task: 'Lesson & Practice', minutes: 70, isDone: false },
    { day: 3, subject: 'Higher Mathematics', chapter: 'Calculus Differentiation', task: 'Revision & Drill', minutes: 60, isDone: false },
    { day: 4, subject: 'Physics', chapter: 'Work, Energy & Power', task: 'Lesson & MCQ Practice', minutes: 75, isDone: false },
    { day: 5, subject: 'Chemistry', chapter: 'Organic Chemistry Reactions', task: 'Weak Topic Drill', minutes: 80, isDone: false },
    { day: 6, subject: 'Higher Mathematics', chapter: 'Trigonometry Equations', task: 'Lesson & Practice', minutes: 65, isDone: false },
    { day: 7, subject: 'All Subjects', chapter: 'BUET Preliminary Full Mock Test', task: 'Mock Test & Analysis', minutes: 120, isDone: false },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Personal Admission Coach Engine
          </div>
          <h1 className="text-3xl font-extrabold text-white">Your 30-Day BUET CSE Study Plan</h1>
          <p className="text-sm text-slate-400">
            Prioritizes weak topics identified in diagnostic test with allocated daily hours.
          </p>
        </div>

        <Link href="/prepare">
          <button className="px-4 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-semibold rounded-lg text-slate-200">
            Back to Preparation Dashboard
          </button>
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          <span>Week 1 Schedule (Focus: Physics Kinematics & Chemistry Bonding)</span>
        </h2>

        <div className="space-y-3">
          {scheduleDays.map((item) => (
            <div
              key={item.day}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${item.isDone ? 'bg-slate-950/60 border-slate-800/80 opacity-70' : 'bg-slate-900 border-slate-800 hover:border-amber-500/40'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold flex items-center justify-center text-sm shrink-0">
                  Day {item.day}
                </div>
                <div>
                  <div className="text-xs font-semibold text-amber-400">{item.subject}</div>
                  <div className="text-sm font-bold text-slate-100">{item.chapter}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{item.task}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {item.minutes} mins</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {item.isDone ? (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Completed
                  </span>
                ) : (
                  <Link href="/prepare/lessons/newtons-second-law-buet-guide">
                    <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition">
                      Start Tasks <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
