'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Sparkles, FileText } from 'lucide-react';
import { GuideSectionConfig } from '@/../backend/src/modules/homepage/homepage.service';

interface GuideItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  readingTimeMinutes: number;
  publishedDate: string;
  featuredImage?: string;
}

interface GuidesSectionProps {
  config?: GuideSectionConfig;
  guides?: GuideItem[];
}

export function GuidesSection({ config, guides = [] }: GuidesSectionProps) {
  const title = config?.title || 'Admission Guides';
  const description =
    config?.description ||
    'In-depth preparation guides, subject-wise weightage analyses, and circular breakdowns by top scorers.';

  const featuredGuide = guides[0];
  const remainingGuides = guides.slice(1);

  return (
    <section id="guides" className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto border-t border-slate-800 bg-slate-950">
      <div className="space-y-8">
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              KNOWLEDGE BASE & GUIDES
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              {title}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {description}
            </p>
          </div>

          <Link href="/guides" className="shrink-0">
            <button className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 shadow-2xs hover:bg-slate-850 transition cursor-pointer">
              <span>View All Admission Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {/* ── GUIDES LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured Guide (Left/Top Large Card - 7 cols) */}
          {featuredGuide && (
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 hover:shadow-sm transition flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono">
                    {featuredGuide.category || 'Featured Guide'}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredGuide.readingTimeMinutes} min read</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  {featuredGuide.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {featuredGuide.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                <span className="text-slate-400">{featuredGuide.publishedDate}</span>
                <Link href={`/guides/${featuredGuide.slug}`}>
                  <button className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Remaining Guides (Right List - 5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {remainingGuides.map((guide) => (
              <div
                key={guide.id}
                className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 hover:shadow-2xs transition space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400 font-mono uppercase text-[11px]">
                    {guide.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" /> {guide.readingTimeMinutes} min
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white leading-snug">
                  {guide.title}
                </h4>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {guide.summary}
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">{guide.publishedDate}</span>
                  <Link href={`/guides/${guide.slug}`} className="font-bold text-amber-400 hover:underline flex items-center gap-1">
                    <span>Read</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
