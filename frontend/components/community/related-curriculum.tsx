'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Target, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface RelatedCurriculumProps {
  subjectName?: string;
  lessonTitle?: string;
  practiceUrl?: string;
  lessonUrl?: string;
}

export function RelatedCurriculum({
  subjectName = 'Physics',
  lessonTitle = 'High-yield problem solving and core concept revision',
  practiceUrl = '/practice',
  lessonUrl = '/prepare',
}: RelatedCurriculumProps) {
  return (
    <div className="bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50 rounded-2xl border border-orange-200/80 p-5 shadow-2xs">
      <div className="flex items-center gap-2 text-xs font-extrabold text-[#FF5500] uppercase tracking-wider mb-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Target Preparation Loop</span>
      </div>

      <h4 className="font-bold text-sm text-slate-900 mb-1.5 leading-snug">
        Master {subjectName} for Admission Tests
      </h4>
      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
        {lessonTitle}. Review the step-by-step concepts, then test your speed with timed MCQs.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <Link
          href={lessonUrl}
          className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 transition group"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF5500] flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-900 group-hover:text-[#FF5500]">
                Study Lesson
              </span>
              <span className="text-[10px] text-slate-400">Concepts & notes</span>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF5500] transition-transform group-hover:translate-x-0.5" />
        </Link>

        <Link
          href={practiceUrl}
          className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition group"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Target className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                Practice MCQs
              </span>
              <span className="text-[10px] text-slate-400">Timed question bank</span>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
