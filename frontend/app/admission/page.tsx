import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { fetchServerAdmissions } from '@/lib/server-api';
import { DEFAULT_HOMEPAGE_CONFIG } from '@/lib/homepage-types';
import { AdmissionTableIsland } from '@/components/admission/admission-table-island';

export const revalidate = 600; // ISR: 10 minutes cache regeneration

export default async function AdmissionDirectoryPage() {
  const serverAdmissions = await fetchServerAdmissions();
  const initialRows =
    serverAdmissions && serverAdmissions.length > 0
      ? serverAdmissions
      : DEFAULT_HOMEPAGE_CONFIG.admissionSection?.rows || [];

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-slate-900 py-8 antialiased selection:bg-orange-500/20 selection:text-[#FF5500]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ── BACK NAVIGATION BREADCRUMB ── */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#FF5500] transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">Admission Circulars & Table Center</span>
        </div>

        {/* ── HERO BANNER (Server-Rendered for SEO) ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-xs font-bold uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>OFFICIAL 2026 ADMISSION INTELLIGENCE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Admission at a Glance Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Complete, real-time database of application windows, admission test dates, minimum GPA requirements, seat capacities, and official circular links for Bangladesh universities & centralized clusters.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/eligibility">
              <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF6B00] hover:from-[#E64D00] hover:to-[#FF5500] text-white text-xs font-bold shadow-sm hover:shadow transition flex items-center gap-2 cursor-pointer">
                <span>Check My Eligibility</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>

        {/* ── CLIENT ISLAND: INTERACTIVE TABLE, SEARCH & FILTERING ── */}
        <AdmissionTableIsland
          initialRows={initialRows}
          customHtmlNotice={DEFAULT_HOMEPAGE_CONFIG.admissionSection?.customHtmlNotice}
        />
      </div>
    </main>
  );
}
