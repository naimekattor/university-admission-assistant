'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  Layers,
  PlusCircle,
  ChevronRight,
  BookOpen,
  Edit,
  Trash2,
  Sparkles,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';

export default function AdminCurriculumPage() {
  const [activeSubject, setActiveSubject] = useState('Physics');

  const curriculum = {
    Physics: [
      {
        chapter: "Newton's Mechanics (Paper 1, Chapter 4)",
        topics: [
          { name: "Newton's First & Second Laws", lessonsCount: 3, status: 'Published' },
          { name: 'Linear Impulse & Momentum Integration', lessonsCount: 2, status: 'Published' },
          { name: 'Centripetal Force & Banking of Road', lessonsCount: 3, status: 'Published' },
          { name: 'Moment of Inertia & Angular Momentum', lessonsCount: 4, status: 'Published' },
        ],
      },
      {
        chapter: 'Work, Energy & Power (Paper 1, Chapter 5)',
        topics: [
          { name: 'Work-Energy Theorem', lessonsCount: 2, status: 'Published' },
          { name: 'Conservative Forces & Spring Potential', lessonsCount: 3, status: 'Published' },
        ],
      },
    ],
    Chemistry: [
      {
        chapter: 'Organic Chemistry (Paper 2, Chapter 2)',
        topics: [
          { name: 'IUPAC Nomenclature & Isomerism', lessonsCount: 4, status: 'Published' },
          { name: 'Electrophilic Aromatic Substitution', lessonsCount: 3, status: 'Published' },
        ],
      },
    ],
    'Higher Mathematics': [
      {
        chapter: 'Differential Calculus (Paper 1, Chapter 9)',
        topics: [
          { name: "Limits & L'Hopital Rule", lessonsCount: 3, status: 'Published' },
          { name: 'First Principle Differentiation', lessonsCount: 4, status: 'Published' },
        ],
      },
    ],
  };

  return (
    <AdminShell
      pageTitle="Curriculum Hierarchy (Subject → Chapter → Topic Tree)"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Curriculum' }]}
      actions={
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:shadow-lg transition cursor-pointer">
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Topic Node</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* ── KPI Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Curriculum Scope</p>
              <h3 className="text-2xl font-black text-slate-900 font-mono">3 Core Tracks</h3>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                HSC National Board Aligned
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#FF5500] flex items-center justify-center shadow-2xs shrink-0">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Chapters Structured</p>
              <h3 className="text-2xl font-black text-slate-900 font-mono">48 Chapters</h3>
              <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                Physics, Chemistry, Higher Math
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center shadow-2xs shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Topic Nodes</p>
              <h3 className="text-2xl font-black text-slate-900 font-mono">140 Nodes</h3>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                100% verified curriculum
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center shadow-2xs shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ── Subject Tabs ── */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
          {['Physics', 'Chemistry', 'Higher Mathematics'].map((s) => (
            <button
              key={s}
              onClick={() => setActiveSubject(s)}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeSubject === s
                  ? 'bg-white text-[#FF5500] shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* ── Tree Container ── */}
        <div className="space-y-4">
          {(curriculum as any)[activeSubject]?.map((ch: any, idx: number) => (
            <div
              key={idx}
              className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 text-[#FF5500] flex items-center justify-center shadow-2xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm sm:text-base text-slate-900">
                    {ch.chapter}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                  {ch.topics.length} Topics
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {ch.topics.map((t: any, i: number) => (
                  <div
                    key={i}
                    className="py-3 px-2 rounded-xl hover:bg-slate-50 transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-[#FF5500] font-mono font-bold">{i + 1}.</span>
                      <span className="font-semibold text-slate-900">{t.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {t.lessonsCount} Lessons
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {t.status}
                      </span>
                      <button className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-200 text-slate-500 border border-slate-200/60 transition cursor-pointer">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
