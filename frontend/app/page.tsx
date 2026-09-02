'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
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
import { Sparkles, Eye, ArrowLeft, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';

export default function DynamicHomepage() {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  const [homepageData, setHomepageData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomepageData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/homepage${isPreview ? '?preview=true' : ''}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`Failed to load homepage data (status ${res.status})`);
      }
      const data = await res.json();
      setHomepageData(data);
    } catch (err: any) {
      console.warn('[Homepage] Fetch failed, using client fallback:', err.message);
      // Fallback data provided by default in components if API fails
      setHomepageData({
        config: undefined,
        admissions: undefined,
        deadlines: undefined,
        featuredUniversities: undefined,
        guides: undefined,
        faqs: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepageData();
  }, [isPreview]);

  const config = homepageData?.config;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500/20 selection:text-amber-300">
      {/* ── JSON-LD STRUCTURED DATA SCHEMA FOR SEO ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalOrganization',
            name: 'EduGuide Bangladesh',
            url: 'https://eduguide.com.bd',
            description:
              config?.seo?.metaDescription ||
              'Bangladesh university admission intelligence and preparation platform for BUET, DU, Medical, and GST.',
            sameAs: [
              'https://facebook.com/eduguidebd',
              'https://youtube.com/@eduguidebd',
            ],
          }),
        }}
      />

      {/* ── DRAFT PREVIEW BANNER (If ?preview=true) ── */}
      {isPreview && (
        <div className="sticky top-0 z-[60] bg-amber-500 text-slate-950 px-4 py-2.5 font-semibold text-xs flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2 font-bold">
              <Eye className="w-4 h-4" />
              <span>DRAFT PREVIEW MODE — You are previewing unpublished homepage changes.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/admin/homepage"
                className="px-3 py-1 bg-slate-950 text-white rounded-md text-xs font-bold flex items-center gap-1 hover:bg-slate-800 transition"
              >
                <ArrowLeft className="w-3 h-3" /> Back to CMS Editor
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── 1. GLOBAL NAVBAR ── */}
      <Navbar />

      {/* ── LOADING SKELETON ── */}
      {loading ? (
        <div className="max-w-[1440px] mx-auto px-4 py-16 space-y-12 animate-pulse">
          {/* Hero skeleton */}
          <div className="max-w-3xl mx-auto space-y-4 text-center">
            <div className="h-6 w-48 bg-slate-900 rounded-full mx-auto" />
            <div className="h-12 w-3/4 bg-slate-900 rounded-xl mx-auto" />
            <div className="h-6 w-1/2 bg-slate-900 rounded-lg mx-auto" />
            <div className="h-10 w-64 bg-slate-900 rounded-lg mx-auto" />
          </div>

          {/* Table skeleton */}
          <div className="space-y-4">
            <div className="h-8 w-64 bg-slate-900 rounded-lg" />
            <div className="h-64 bg-slate-900 rounded-2xl" />
          </div>
        </div>
      ) : (
        <main>
          {/* ── 2. HERO SECTION ── */}
          {(!config || config.hero?.enabled !== false) && (
            <HeroSection config={config?.hero} />
          )}

          {/* ── 3. ADMISSION AT A GLANCE (TABLE + MOBILE CARDS) ── */}
          {(!config || config.admissionSection?.enabled !== false) && (
            <AdmissionAtGlance
              config={config?.admissionSection}
              admissions={homepageData?.admissions}
            />
          )}

          {/* ── 4 & 5. ELIGIBILITY CHECKER & RESULTS ── */}
          {(!config || config.eligibilitySection?.enabled !== false) && (
            <EligibilityCheckerSection config={config?.eligibilitySection} />
          )}

          {/* ── 6. UPCOMING ADMISSION DEADLINES ── */}
          {(!config || config.deadlineSection?.enabled !== false) && (
            <DeadlinesSection
              config={config?.deadlineSection}
              deadlines={homepageData?.deadlines}
            />
          )}

          {/* ── 7. EXPLORE UNIVERSITIES ── */}
          {(!config || config.featuredUniversities?.enabled !== false) && (
            <FeaturedUniversitiesSection
              config={config?.featuredUniversities}
              universities={homepageData?.featuredUniversities}
            />
          )}

          {/* ── 8. AI ADMISSION ADVISOR PREVIEW ── */}
          {(!config || config.aiAdvisor?.enabled !== false) && (
            <AiAdvisorPreviewSection config={config?.aiAdvisor} />
          )}

          {/* ── 9. ADMISSION GUIDES ── */}
          {(!config || config.guideSection?.enabled !== false) && (
            <GuidesSection
              config={config?.guideSection}
              guides={homepageData?.guides}
            />
          )}

          {/* ── 10. PREPARE WITH EDUGUIDE CTA ── */}
          {(!config || config.preparation?.enabled !== false) && (
            <PreparationCtaSection config={config?.preparation} />
          )}

          {/* ── 11. FAQ ACCORDION ── */}
          {(!config || config.faq?.enabled !== false) && (
            <FaqSection config={config?.faq} faqs={homepageData?.faqs} />
          )}

          {/* ── 12. FOOTER ── */}
          <FooterSection config={config?.footer} />
        </main>
      )}
    </div>
  );
}
