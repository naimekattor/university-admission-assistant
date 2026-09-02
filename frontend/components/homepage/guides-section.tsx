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
    <section id="guides" className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto border-t border-[var(--eg-border)] bg-[var(--eg-surface-subtle)]">
      <div className="space-y-8">
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--eg-primary)] font-mono">
              KNOWLEDGE BASE & GUIDES
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--eg-text-primary)] mt-1">
              {title}
            </h2>
            <p className="text-sm text-[var(--eg-text-secondary)] mt-1 max-w-2xl">
              {description}
            </p>
          </div>

          <Link href="/guides" className="shrink-0">
            <button className="text-xs font-semibold text-[var(--eg-primary)] hover:text-[var(--eg-primary-hover)] flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--eg-surface)] border border-[var(--eg-border)] shadow-2xs hover:bg-slate-50 transition cursor-pointer">
              <span>View All Admission Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {/* ── GUIDES LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured Guide (Left/Top Large Card - 7 cols) */}
          {featuredGuide && (
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[var(--eg-surface)] border border-[var(--eg-border)] hover:border-[var(--eg-primary)]/40 hover:shadow-sm transition flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--eg-primary-soft)] text-[var(--eg-primary)] font-mono">
                    {featuredGuide.category || 'Featured Guide'}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[var(--eg-text-muted)]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredGuide.readingTimeMinutes} min read</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[var(--eg-text-primary)] leading-snug">
                  {featuredGuide.title}
                </h3>

                <p className="text-sm text-[var(--eg-text-secondary)] leading-relaxed line-clamp-3">
                  {featuredGuide.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--eg-border)]/60 text-xs">
                <span className="text-[var(--eg-text-muted)]">{featuredGuide.publishedDate}</span>
                <Link href={`/guides/${featuredGuide.slug}`}>
                  <button className="text-xs font-semibold text-[var(--eg-primary)] hover:text-[var(--eg-primary-hover)] flex items-center gap-1">
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
                className="p-5 rounded-xl bg-[var(--eg-surface)] border border-[var(--eg-border)] hover:border-[var(--eg-primary)]/40 hover:shadow-2xs transition space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--eg-primary)] font-mono uppercase text-[11px]">
                    {guide.category}
                  </span>
                  <span className="text-[var(--eg-text-muted)] flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" /> {guide.readingTimeMinutes} min
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[var(--eg-text-primary)] leading-snug">
                  {guide.title}
                </h4>

                <p className="text-xs text-[var(--eg-text-secondary)] line-clamp-2 leading-relaxed">
                  {guide.summary}
                </p>

                <div className="pt-2 border-t border-[var(--eg-border)]/40 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[var(--eg-text-muted)]">{guide.publishedDate}</span>
                  <Link href={`/guides/${guide.slug}`} className="font-semibold text-[var(--eg-primary)] hover:underline flex items-center gap-1">
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
