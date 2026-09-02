'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, ArrowLeft, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { HeroSection } from '@/components/homepage/hero-section';
import { AdmissionAtGlance } from '@/components/homepage/admission-at-glance';
import { EligibilityCheckerSection } from '@/components/homepage/eligibility-checker-section';
import { DeadlinesSection } from '@/components/homepage/deadlines-section';
import { FeaturedUniversitiesSection } from '@/components/homepage/featured-universities-section';
import { AiAdvisorPreviewSection } from '@/components/homepage/ai-advisor-preview-section';
import { GuidesSection } from '@/components/homepage/guides-section';
import { PreparationCtaSection } from '@/components/homepage/preparation-cta-section';
import { FaqSection } from '@/components/homepage/faq-section';
import { FooterSection } from '@/components/homepage/footer-section';

export default function AdminHomepageDraftPreviewPage() {
  const router = useRouter();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const fetchDraftData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/homepage?preview=true', { cache: 'no-store' });
      if (!res.ok) throw new Error('Preview fetch error');
      const json = await res.json();
      setData(json);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraftData();
  }, []);

  const handlePublishFromPreview = async () => {
    setPublishing(true);
    try {
      const res = await fetch('/api/v1/admin/homepage/publish', { method: 'POST' });
      if (!res.ok) throw new Error('Publish error');
      setPublishedSuccess(true);
      setTimeout(() => {
        router.push('/admin/homepage');
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Publishing failed');
    } finally {
      setPublishing(false);
    }
  };

  const config = data?.config;

  return (
    <div className="min-h-screen bg-[var(--eg-surface-subtle)] text-[var(--eg-text-primary)]">
      {/* ── TOP PREVIEW HEADER ACTION BAR ── */}
      <div className="sticky top-0 z-[100] bg-amber-500 text-slate-950 px-4 py-3 shadow-md">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-xs">
            <Eye className="w-4 h-4" />
            <span>DRAFT PREVIEW MODE — You are inspecting unpublished changes before deployment.</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/homepage"
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to CMS Editor</span>
            </Link>

            <button
              onClick={handlePublishFromPreview}
              disabled={publishing || publishedSuccess}
              className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition disabled:opacity-60 cursor-pointer"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : publishedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Published!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Publish Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN PREVIEW RENDERER ── */}
      {loading ? (
        <div className="p-16 text-center text-xs text-[var(--eg-text-muted)] animate-pulse">
          Loading draft preview...
        </div>
      ) : (
        <main>
          {(!config || config.hero?.enabled !== false) && <HeroSection config={config?.hero} />}
          {(!config || config.admissionSection?.enabled !== false) && (
            <AdmissionAtGlance config={config?.admissionSection} admissions={data?.admissions} />
          )}
          {(!config || config.eligibilitySection?.enabled !== false) && (
            <EligibilityCheckerSection config={config?.eligibilitySection} />
          )}
          {(!config || config.deadlineSection?.enabled !== false) && (
            <DeadlinesSection config={config?.deadlineSection} deadlines={data?.deadlines} />
          )}
          {(!config || config.featuredUniversities?.enabled !== false) && (
            <FeaturedUniversitiesSection
              config={config?.featuredUniversities}
              universities={data?.featuredUniversities}
            />
          )}
          {(!config || config.aiAdvisor?.enabled !== false) && (
            <AiAdvisorPreviewSection config={config?.aiAdvisor} />
          )}
          {(!config || config.guideSection?.enabled !== false) && (
            <GuidesSection config={config?.guideSection} guides={data?.guides} />
          )}
          {(!config || config.preparation?.enabled !== false) && (
            <PreparationCtaSection config={config?.preparation} />
          )}
          {(!config || config.faq?.enabled !== false) && (
            <FaqSection config={config?.faq} faqs={data?.faqs} />
          )}
          <FooterSection config={config?.footer} />
        </main>
      )}
    </div>
  );
}
