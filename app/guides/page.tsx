'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';

export default function GuidesPage() {
  const articles = [
    {
      id: 'a1',
      title: 'BUET Admission Test 2026: Complete Preparation & Eligibility Guide',
      slug: 'buet-admission-guide-2026',
      summary: 'Everything HSC candidates need to know about BUET admission requirements, preliminary cutoff marks, seat breakdown, and preparation strategy.',
      readingTime: '8 mins read',
      category: 'University Guides',
    },
    {
      id: 'a2',
      title: 'DU Ka Unit Admission Strategy: How to Score High in Physics & Chemistry',
      slug: 'du-ka-unit-guide',
      summary: 'Proven preparation techniques for University of Dhaka Ka Unit science admission test with past year question analysis.',
      readingTime: '6 mins read',
      category: 'Preparation Guides',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" /> SEO Admission Guides & Knowledge Base
        </div>
        <h1 className="text-3xl font-extrabold text-white">University Preparation Articles</h1>
        <p className="text-sm text-slate-400">
          In-depth guides answering student questions on admission eligibility, seat capacities, cutoffs, and study strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((a) => (
          <div key={a.id} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase">{a.category}</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> {a.readingTime}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 leading-snug">{a.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{a.summary}</p>
            </div>

            <Link href={`/guides/${a.slug}`}>
              <button className="mt-4 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                Read Full Guide <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
