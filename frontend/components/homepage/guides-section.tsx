'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { GuideSectionConfig } from '@/lib/homepage-types';
import { useScrollTriggerReveal } from '@/hooks/use-gsap-motion';

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
  const sectionRef = useRef<HTMLElement>(null);
  useScrollTriggerReveal(sectionRef, { y: 22 });

  const title = config?.title || 'Admission Guides';
  const description =
    config?.description ||
    'In-depth preparation guides, subject-wise weightage analysis, and circular breakdowns written by top scorers.';

  const featuredGuide = guides[0];
  const remainingGuides = guides.slice(1);

  return (
    <section ref={sectionRef} id="guides" className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5500] font-mono">
              KNOWLEDGE BASE & GUIDES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {title}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {description}
            </p>
          </div>

          <Link href="/guides" className="shrink-0">
            <button className="text-xs font-semibold text-[#FF5500] hover:text-[#E64D00] flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 transition cursor-pointer">
              <span>View All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {/* ── GUIDES LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Featured Guide (7 cols) */}
          {featuredGuide && (
            <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-orange-300 transition flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#FF5500] border border-orange-200 font-mono">
                    {featuredGuide.category || 'Featured Guide'}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredGuide.readingTimeMinutes} min read</span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {featuredGuide.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {featuredGuide.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-400">{featuredGuide.publishedDate}</span>
                <Link href={`/guides/${featuredGuide.slug}`}>
                  <button className="text-xs font-bold text-[#FF5500] hover:underline flex items-center gap-1">
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Remaining Guides (5 cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            {remainingGuides.map((guide) => (
              <div
                key={guide.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 hover:shadow-2xs transition space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#FF5500] font-mono uppercase text-[10px]">
                    {guide.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                    <Clock className="w-3 h-3" /> {guide.readingTimeMinutes} min
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-900 leading-snug">
                  {guide.title}
                </h4>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">{guide.publishedDate}</span>
                  <Link href={`/guides/${guide.slug}`} className="font-bold text-[#FF5500] hover:underline flex items-center gap-1 text-xs">
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
