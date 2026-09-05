import React from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';
import { fetchServerGuides } from '@/lib/server-api';
import { GuidesFilterIsland } from '@/components/guides/guides-filter-island';

export const revalidate = 3600; // ISR: 1 hour cache regeneration

export default async function GuidesPage() {
  const guides = await fetchServerGuides();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans antialiased selection:bg-orange-500/20 selection:text-[#FF5500] relative flex flex-col pb-20">
      {/* ── TOP RADIAL BACKGROUND GLOW ── */}
      <div
        className="absolute inset-x-0 top-0 h-[600px] pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(255, 110, 30, 0.14), transparent)',
        }}
      />

      <div className="relative z-10 flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 max-w-6xl">
        {/* ── BREADCRUMBS ── */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-[#FF5500] transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">Admission Guides & Knowledge Base</span>
        </nav>

        {/* ── HEADER BANNER (Server-Rendered for SEO) ── */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#FF5500] border border-orange-200 font-mono flex items-center gap-1.5 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Admission Knowledge Base</span>
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Verified Articles ({guides.length} published)</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            University Preparation{' '}
            <span className="bg-gradient-to-r from-[#FF5500] to-[#FF7700] bg-clip-text text-transparent">
              Articles & Guides
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            In-depth guides, unit-wise weightage analyses, cutoff marks history, and step-by-step circular breakdowns written by university toppers for BUET, DU, Medical, and GST Cluster exams.
          </p>
        </div>

        {/* ── CLIENT ISLAND: SEARCH, CATEGORIES & ARTICLE CARDS ── */}
        <GuidesFilterIsland initialGuides={guides} />
      </div>
    </div>
  );
}
