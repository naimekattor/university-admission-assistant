'use client';

import React from 'react';
import { CommunityCategory } from '@/lib/community-types';
import {
  Compass,
  GraduationCap,
  Sigma,
  Zap,
  FlaskConical,
  Dna,
  Languages,
  Building2,
  Sparkles,
  Flame,
  Clock,
  HelpCircle,
} from 'lucide-react';

interface QuestionFiltersProps {
  categories: CommunityCategory[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  selectedSort: 'latest' | 'popular' | 'unanswered' | 'most-voted';
  onSelectSort: (sort: 'latest' | 'popular' | 'unanswered' | 'most-voted') => void;
}

const ICON_MAP: Record<string, any> = {
  Compass,
  GraduationCap,
  Sigma,
  Zap,
  FlaskConical,
  Dna,
  Languages,
  Building2,
};

export function QuestionFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
}: QuestionFiltersProps) {
  return (
    <div className="space-y-3 mb-6">
      {/* ── 1. CATEGORY CHIPS (HORIZONTAL SCROLL ON MOBILE) ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          const IconComp = ICON_MAP[cat.icon || 'Compass'] || Compass;
          return (
            <button
              key={cat.id || cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-[#FF5500] text-white border-[#FF5500] shadow-2xs shadow-orange-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300 hover:bg-orange-50/40'
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#FF5500]'}`} />
              <span>{cat.name}</span>
              {typeof cat.question_count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.question_count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 2. SORT TABS ROW ── */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onSelectSort('latest')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              selectedSort === 'latest'
                ? 'bg-white text-[#FF5500] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Latest</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSort('popular')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              selectedSort === 'popular'
                ? 'bg-white text-[#FF5500] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Popular</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSort('unanswered')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              selectedSort === 'unanswered'
                ? 'bg-white text-[#FF5500] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
            <span>Unanswered</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSort('most-voted')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              selectedSort === 'most-voted'
                ? 'bg-white text-[#FF5500] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>Most Voted</span>
          </button>
        </div>
      </div>
    </div>
  );
}
