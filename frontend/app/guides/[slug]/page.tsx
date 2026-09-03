'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Share2,
  Bookmark,
  Sparkles,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { FooterSection } from '@/components/homepage/footer-section';

interface GuideArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  readingTimeMinutes?: number;
  publishedDate?: string;
  createdAt?: string;
  featuredImage?: string;
}

export default function GuideArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<GuideArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/guides/${slug}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setArticle(json.data);
          }
        }
      } catch (err) {
        console.error('Error fetching guide article from PostgreSQL:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans antialiased selection:bg-orange-500/20 selection:text-[#FF5500] relative flex flex-col">
      {/* ── TOP RADIAL BACKGROUND GLOW ── */}
      <div
        className="absolute inset-x-0 top-0 h-[600px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(255, 110, 30, 0.14), transparent)',
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
          <span className="text-slate-900 font-semibold truncate max-w-xs">
            {article?.title || 'Article'}
          </span>
        </nav>

        {/* ── LOADING SKELETON ── */}
        {loading && (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm animate-pulse space-y-6">
            <div className="h-6 w-32 bg-slate-200 rounded-md"></div>
            <div className="h-10 w-3/4 bg-slate-200 rounded-lg"></div>
            <div className="h-20 w-full bg-slate-100 rounded-xl"></div>
            <div className="space-y-3 pt-4">
              <div className="h-4 w-full bg-slate-100 rounded"></div>
              <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
              <div className="h-4 w-4/6 bg-slate-100 rounded"></div>
            </div>
          </div>
        )}

        {/* ── ARTICLE NOT FOUND ── */}
        {!loading && !article && (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-[#FF5500] mx-auto" />
            <h2 className="text-2xl font-bold text-slate-900">Guide article not found</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              The article you are looking for might have been moved or unpublished. Browse all available guides.
            </p>
            <Link href="/guides">
              <button className="px-5 py-2.5 rounded-full bg-[#FF5500] text-white text-xs font-bold hover:bg-[#E64D00] transition cursor-pointer">
                Back to All Guides
              </button>
            </Link>
          </div>
        )}

        {/* ── ARTICLE DETAIL ── */}
        {!loading && article && (
          <article className="space-y-8">
            {/* Header Card */}
            <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <Link
                  href="/guides"
                  className="text-xs font-bold text-[#FF5500] hover:text-[#E64D00] flex items-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Guides</span>
                </Link>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-[#FF5500] border border-orange-200 font-mono">
                    {article.category || 'Admission Guide'}
                  </span>

                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{article.readingTimeMinutes || 6} min read</span>
                  </span>

                  <button
                    onClick={handleShare}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs flex items-center gap-1 transition cursor-pointer"
                    title="Copy Link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold">{copied ? 'Copied!' : 'Share'}</span>
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                {article.title}
              </h1>

              {article.summary && (
                <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-100 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {article.summary}
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono pt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Published: {article.publishedDate || 'Admission 2026 Season'}</span>
                <span>•</span>
                <span>Curated for HSC 2025/2026 Batch</span>
              </div>
            </div>

            {/* Content Card */}
            <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
              {/<[a-z][\s\S]*>/i.test(article.content || '') ? (
                <div
                  className="guide-article-prose"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : (
                <div className="guide-article-prose whitespace-pre-line space-y-4">
                  {article.content || article.summary}
                </div>
              )}
            </div>

            {/* Bottom Conversion CTA */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white shadow-xl space-y-5 relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-80 h-80 pointer-events-none rounded-full blur-3xl opacity-25 -mr-16 -mt-16"
                style={{
                  background: 'radial-gradient(circle, #FF5500, transparent)',
                }}
              />

              <div className="space-y-2 relative z-10">
                <span className="text-xs font-bold text-[#FF5500] font-mono uppercase tracking-wider">
                  TAKE ACTION
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Verify Your Admission Chances Today
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Input your SSC & HSC GPAs to instantly find eligible units across BUET, DU, Medical, and GST Cluster universities.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 relative z-10">
                <Link href="/eligibility">
                  <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF6B00] hover:from-[#E64D00] hover:to-[#FF5500] text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-2">
                    <span>Check Eligibility Free</span>
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
          </article>
        )}
      </div>

      {/* ── FOOTER ── */}
      <FooterSection />
    </div>
  );
}
