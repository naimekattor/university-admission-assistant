'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Search,
  Sparkles,
  Calendar,
  Filter,
  CheckCircle2,
  ChevronRight,
  Loader2,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { FooterSection } from '@/components/homepage/footer-section';

interface GuideItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  readingTimeMinutes?: number;
  publishedDate?: string;
  createdAt?: string;
  featuredImage?: string;
}

import { FALLBACK_GUIDES } from '@/lib/guides-fallback';

export default function GuidesPage() {
  const [guides, setGuides] = useState<GuideItem[]>(FALLBACK_GUIDES);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchGuides = async () => {
    try {
      const res = await fetch('/api/v1/guides?limit=50', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          setGuides(json.data);
        }
      }
    } catch (err) {
      console.error('Error fetching guides from PostgreSQL:', err);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  // Compute unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    guides.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return Array.from(set);
  }, [guides]);

  // Filtered guides based on search and category
  const filteredGuides = useMemo(() => {
    return guides.filter((g) => {
      const matchCat =
        selectedCategory === 'all' ||
        (g.category && g.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        g.title.toLowerCase().includes(q) ||
        (g.summary && g.summary.toLowerCase().includes(q)) ||
        (g.category && g.category.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [guides, selectedCategory, searchQuery]);

  const featuredGuide = filteredGuides.length > 0 ? filteredGuides[0] : null;
  const listGuides = filteredGuides.length > 1 ? filteredGuides.slice(1) : [];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans antialiased selection:bg-orange-500/20 selection:text-[#FF5500] relative flex flex-col">
      {/* ── TOP RADIAL BACKGROUND GLOW ── */}
      <div
        className="absolute inset-x-0 top-0 h-[600px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(255, 110, 30, 0.14), transparent)',
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

        {/* ── HEADER BANNER ── */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#FF5500] border border-orange-200 font-mono flex items-center gap-1.5 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Admission Knowledge Base</span>
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live PostgreSQL Articles ({guides.length} published)</span>
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

        {/* ── SEARCH & FILTER CONTROLS ── */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guides by university, unit, subject (e.g. BUET, Physics, DU Ka Unit)..."
                className="w-full h-11 pl-10 pr-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5500] focus:bg-white transition"
              />
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
            <span className="text-slate-400 mr-1.5 flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>

            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full transition cursor-pointer shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[#FF5500] text-white font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              All Articles ({guides.length})
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.toLowerCase();
              const count = guides.filter((g) => g.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat.toLowerCase())}
                  className={`px-3.5 py-1.5 rounded-full transition cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#FF5500] text-white font-bold shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* ── LOADING STATE ── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs animate-pulse space-y-4"
              >
                <div className="flex justify-between">
                  <div className="h-5 w-24 bg-slate-200 rounded-md"></div>
                  <div className="h-4 w-16 bg-slate-100 rounded-md"></div>
                </div>
                <div className="h-6 w-3/4 bg-slate-200 rounded-md"></div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-slate-100 rounded-md"></div>
                  <div className="h-3 w-5/6 bg-slate-100 rounded-md"></div>
                </div>
                <div className="h-8 w-28 bg-slate-100 rounded-full mt-4"></div>
              </div>
            ))}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && filteredGuides.length === 0 && (
          <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF5500] flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-slate-900">No matching guides found</h3>
              <p className="text-xs text-slate-500">
                {searchQuery
                  ? `No guide articles matched your search query "${searchQuery}".`
                  : 'No articles in this category currently.'}
              </p>
            </div>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-full bg-[#FF5500] text-white text-xs font-bold hover:bg-[#E64D00] transition cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* ── ARTICLES FEED ── */}
        {!loading && filteredGuides.length > 0 && (
          <div className="space-y-6">
            {/* 1. Featured Guide Card (7/12 or wide hero) */}
            {featuredGuide && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:border-orange-300 hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group">
                <div
                  className="absolute top-0 right-0 w-80 h-80 pointer-events-none rounded-full blur-3xl opacity-20 -mr-20 -mt-20 group-hover:opacity-30 transition"
                  style={{
                    background: 'radial-gradient(circle, #FF5500, transparent)',
                  }}
                />

                <div className="space-y-3 relative z-10 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#FF5500] border border-orange-200 font-mono">
                      {featuredGuide.category || 'Featured Guide'}
                    </span>

                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{featuredGuide.readingTimeMinutes || 6} min read</span>
                    </span>

                    {featuredGuide.publishedDate && (
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{featuredGuide.publishedDate}</span>
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-[#FF5500] transition leading-snug">
                    {featuredGuide.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {featuredGuide.summary}
                  </p>

                  <div className="pt-2">
                    <Link href={`/guides/${featuredGuide.slug}`}>
                      <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF6B00] hover:from-[#E64D00] hover:to-[#FF5500] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer">
                        <span>Read Complete Guide</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Right decorative stats chip */}
                <div className="hidden md:flex flex-col items-center justify-center p-6 rounded-2xl bg-orange-50/60 border border-orange-100 text-center space-y-1.5 shrink-0 w-48 relative z-10">
                  <TrendingUp className="w-7 h-7 text-[#FF5500]" />
                  <div className="text-xs font-bold text-slate-900">High-Yield Roadmap</div>
                  <div className="text-[11px] text-slate-500">Curated by top admission rankers</div>
                </div>
              </div>
            )}

            {/* 2. Remaining Guides Grid */}
            {listGuides.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pt-4">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    More Preparation Articles ({listGuides.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {listGuides.map((article) => (
                    <div
                      key={article.id}
                      className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:border-orange-300 hover:shadow-md transition flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                            {article.category || 'General Guide'}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{article.readingTimeMinutes || 5} min read</span>
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 group-hover:text-[#FF5500] transition leading-snug">
                          {article.title}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {article.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                        <span className="text-slate-400 font-mono text-[11px]">
                          {article.publishedDate || 'Admission 2026'}
                        </span>

                        <Link href={`/guides/${article.slug}`}>
                          <button className="text-xs font-bold text-[#FF5500] hover:text-[#E64D00] flex items-center gap-1 group-hover:translate-x-0.5 transition cursor-pointer">
                            <span>Read Guide</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CONVERSION ACTION BANNER ── */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white shadow-xl relative overflow-hidden space-y-6">
          <div
            className="absolute top-0 right-0 w-96 h-96 pointer-events-none rounded-full blur-3xl opacity-30 -mr-20 -mt-20"
            style={{
              background: 'radial-gradient(circle, #FF5500, transparent)',
            }}
          />

          <div className="space-y-2 relative z-10 max-w-2xl">
            <span className="text-xs font-bold text-[#FF5500] font-mono uppercase tracking-wider">
              READY FOR ADMISSION SUCCESS?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Know Where You Can Apply & Start Targeted Practice
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Verify your SSC & HSC GPA eligibility for BUET, DU, Medical, and 24 GST public universities with instant qualification analysis.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 relative z-10">
            <Link href="/eligibility">
              <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF6B00] hover:from-[#E64D00] hover:to-[#FF5500] text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-2">
                <span>Check My Eligibility Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <Link href="/prepare/diagnostic">
              <button className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition cursor-pointer flex items-center gap-2">
                <span>Take Diagnostic Test</span>
                <Sparkles className="w-4 h-4 text-orange-400" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <FooterSection />
    </div>
  );
}
