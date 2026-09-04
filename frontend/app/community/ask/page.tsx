import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronLeft, Sparkles, HelpCircle } from 'lucide-react';
import { QuestionComposer } from '@/components/community/question-composer';

export const metadata: Metadata = {
  title: 'Ask a Question | EduGuide Community',
  description: 'Post an admission or academic problem with interactive visual math equations.',
};

export default function AskQuestionPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── BREADCRUMB ── */}
      <div className="flex items-center justify-between">
        <Link
          href="/community"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#FF5500] transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Community</span>
        </Link>

        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
          ✓ Open for all students · No login needed
        </span>
      </div>

      {/* ── HEADER TITLE ── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">
          Ask the Community
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-medium">
          Get answers from fellow students, seniors at BUET/DU/Medical, and verified teachers. Use the visual math toolbar to easily build formulas and fractions!
        </p>
      </div>

      {/* ── COMPOSER FORM ── */}
      <QuestionComposer />
    </div>
  );
}
