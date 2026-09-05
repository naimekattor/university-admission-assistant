import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft, BookOpen, Clock, Calendar } from 'lucide-react';
import { fetchServerGuideBySlug } from '@/lib/server-api';
import { GuideShareButton } from '@/components/guides/guide-share-button';
import { FALLBACK_GUIDES } from '@/lib/guides-fallback';

export const revalidate = 3600; // ISR: 1 hour cache regeneration

export async function generateStaticParams() {
  return FALLBACK_GUIDES.map((g) => ({ slug: g.slug }));
}

export default async function GuideArticlePage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const article = await fetchServerGuideBySlug(slug);

  if (!article) {
    notFound();
  }

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

      <div className="relative z-10 flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 max-w-4xl">
        {/* ── BREADCRUMBS ── */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-[#FF5500] transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/guides" className="hover:text-[#FF5500] transition">
            Guides
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate max-w-xs">{article.title}</span>
        </nav>

        {/* ── ARTICLE DETAIL (Server-Rendered for SEO) ── */}
        <article className="space-y-8">
          {/* Header Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <Link
                href="/guides"
                className="text-xs font-bold text-[#FF5500] hover:text-[#E64D00] flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Guides</span>
              </Link>

              <div className="flex items-center gap-2">
                <GuideShareButton />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full font-bold bg-orange-50 text-[#FF5500] border border-orange-200 text-xs font-mono uppercase">
                  {article.category || 'Admission Guide'}
                </span>

                <span className="text-slate-400 flex items-center gap-1 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readingTimeMinutes || 6} min read</span>
                </span>

                {article.publishedDate && (
                  <span className="text-slate-400 flex items-center gap-1 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{article.publishedDate}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {article.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-slate-200/60">
                {article.summary}
              </p>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
            <div className="prose prose-slate prose-headings:font-black prose-headings:tracking-tight prose-a:text-[#FF5500] max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
              {article.content || article.summary}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
