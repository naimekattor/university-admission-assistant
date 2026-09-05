import React from 'react';
import { Sparkles, Building2, Users, Calendar, Award } from 'lucide-react';
import { fetchServerUniversities } from '@/lib/server-api';
import { UniversityFilterIsland } from '@/components/universities/university-filter-island';

export const revalidate = 1800; // ISR: 30 minutes cache regeneration

export default async function UniversitiesPage() {
  const universities = await fetchServerUniversities();

  const totalSeats = universities.reduce(
    (acc: number, u: any) => acc + (Number(u.seats) || 0),
    0
  );

  const openCount = universities.filter(
    (u: any) => u.status === 'Applications Open'
  ).length;

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">
      {/* ── HERO BANNER (Server-Rendered for SEO) ── */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-12 pb-14 sm:pt-16 sm:pb-18">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-xs font-bold font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Database Verified Directory</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Universities & Admission Portals <span className="text-[#FF5500]">2026</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Explore all public, engineering, medical, and centralized cluster universities across Bangladesh.
              Review verified seat capacities, eligibility GPA criteria, test dates, and official circular portals.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5500] shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">{universities.length}</div>
                <div className="text-xs text-slate-500 font-medium">Universities Tracked</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">{openCount}</div>
                <div className="text-xs text-slate-500 font-medium">Circulars Active</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  {totalSeats.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 font-medium">Undergraduate Seats</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">100% Verified</div>
                <div className="text-xs text-slate-500 font-medium">Official Sources</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLIENT ISLAND: FILTERING, SEARCH & DIRECTORY GRID ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <UniversityFilterIsland initialUniversities={universities} />
      </div>
    </main>
  );
}
