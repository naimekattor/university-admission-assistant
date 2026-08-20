'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function GuideArticlePage() {
  const article = {
    title: 'BUET Admission Test 2026: Complete Preparation & Eligibility Guide',
    category: 'University Guides',
    readingTime: '8 mins read',
    content: `
# BUET Admission Test 2026 Strategy Guide

BUET (Bangladesh University of Engineering and Technology) is the premier engineering institution in Bangladesh.

## Key Eligibility Highlights
- **Academic Group**: Science Group (HSC)
- **Minimum HSC GPA**: 4.50+ in Physics, Chemistry, Higher Mathematics, and English.
- **Seat Breakdown**: ~1,305 total engineering seats across Architecture, CSE, EEE, Civil, and Mechanical.

## High-Yield Preparation Roadmap
1. **Focus on Core HSC Physics & Math Concepts**: Preliminary questions test quick concept recall and formula application under 60-second time limits.
2. **Solve 15-Year Question Banks**: Practice BUET written and preliminary questions repeatedly.
3. **Analyze Mistakes**: Track weak topics in impulse momentum and calculus integrals.
`,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <Link href="/guides" className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Guides
        </Link>
        <span className="text-xs text-amber-400 font-semibold uppercase">{article.category} • {article.readingTime}</span>
      </div>

      <h1 className="text-3xl font-black text-white leading-tight">{article.title}</h1>

      <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-line bg-slate-900/60 p-6 rounded-xl border border-slate-800/80 shadow-xl">
        {article.content}
      </div>

      {/* Product CTAs embedded inside guide */}
      <div className="p-6 bg-gradient-to-r from-amber-900/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-xl space-y-4">
        <div className="text-sm font-bold text-white">Ready to prepare for BUET Admission?</div>
        <div className="flex flex-wrap gap-3">
          <Link href="/eligibility">
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5">
              Check My Eligibility <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
          <Link href="/prepare/diagnostic">
            <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5">
              Take Diagnostic Test <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
