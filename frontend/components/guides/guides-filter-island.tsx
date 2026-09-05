'use client';

import React, { useState, useMemo } from 'react';
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
  TrendingUp,
} from 'lucide-react';

export interface GuideItem {
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

interface GuidesFilterIslandProps {
  initialGuides: GuideItem[];
}

export function GuidesFilterIsland({ initialGuides }: GuidesFilterIslandProps) {
  const [guides] = useState<GuideItem[]>(initialGuides || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    guides.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return Array.from(set);
  }, [guides]);

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
    <div className="space-y-8">
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
                className={`px-3.5 py-1.5 rounded-full transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#FF5500] text-white font-bold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>{cat}</span>
                <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FEATURED SPOTLIGHT CARD ── */}
      {featuredGuide && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-stone-900 text-white shadow-xl relative overflow-hidden group">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider bg-[#FF5500] text-white">
                Featured Guide
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{featuredGuide.readingTimeMinutes || 8} min read</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
              {featuredGuide.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
              {featuredGuide.summary}
            </p>

            <div className="pt-2">
              <Link
                href={`/guides/${featuredGuide.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white font-bold text-xs shadow-md transition group/btn"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── ARTICLE LIST GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listGuides.map((guide) => (
          <div
            key={guide.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-orange-50 text-[#FF5500] border border-orange-200 text-[11px]">
                  {guide.category || 'Admission Guide'}
                </span>
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3" />
                  <span>{guide.readingTimeMinutes || 5} mins</span>
                </span>
              </div>

              <Link href={`/guides/${guide.slug}`} className="block">
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#FF5500] transition line-clamp-2">
                  {guide.title}
                </h3>
              </Link>

              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{guide.summary}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">EduGuide Editorial</span>
              <Link
                href={`/guides/${guide.slug}`}
                className="text-xs font-bold text-[#FF5500] hover:underline flex items-center gap-1"
              >
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
