'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/homepage/hero-section';
import { DashboardPreviewFrame } from '@/components/homepage/dashboard-preview-frame';
import { AdmissionAtGlance } from '@/components/homepage/admission-at-glance';
import { EligibilityCheckerSection } from '@/components/homepage/eligibility-checker-section';
import { DeadlinesSection } from '@/components/homepage/deadlines-section';
import { FeaturedUniversitiesSection } from '@/components/homepage/featured-universities-section';
import { AiAdvisorPreviewSection } from '@/components/homepage/ai-advisor-preview-section';
import { GuidesSection } from '@/components/homepage/guides-section';
import { PreparationCtaSection } from '@/components/homepage/preparation-cta-section';
import { FaqSection } from '@/components/homepage/faq-section';
import { FooterSection } from '@/components/homepage/footer-section';
import { Eye, ArrowLeft } from 'lucide-react';

export default function DynamicHomepage() {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  const [homepageData, setHomepageData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHomepageData = async () => {
    setLoading(true);
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
      // Fallback
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
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans antialiased selection:bg-orange-500/20 selection:text-[#FF5500] relative">
      {/* ── TOP RADIAL BACKGROUND GLOW ── */}
      <div
        className="absolute inset-x-0 top-0 h-[640px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(255, 110, 30, 0.14), transparent)',
        }}
      />

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
          }),
        }}
      />

      {/* ── DRAFT PREVIEW BANNER (If ?preview=true) ── */}
      {isPreview && (
        <div className="sticky top-0 z-[60] bg-[#FF5500] text-white px-4 py-2.5 font-semibold text-xs flex items-center justify-between shadow-md">
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

      {/* ── 1. FLOATING NAVBAR WITH TOP BANNER ── */}
      <Navbar />

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10">
        {/* ── 2. HERO SECTION WITH TILTED CARDS ── */}
        <HeroSection config={config?.hero} />

        {/* ── 3. EXACT DASHBOARD PREVIEW FRAME AS IN IMAGE ── */}
        <DashboardPreviewFrame />

        {/* ── 4. ADMISSION AT A GLANCE (DATA TABLE & MOBILE CARDS) ── */}
        {(!config || config.admissionSection?.enabled !== false) && (
          <AdmissionAtGlance
            config={config?.admissionSection}
            admissions={homepageData?.admissions}
          />
        )}

        {/* ── 5. ELIGIBILITY CHECKER & RESULTS ── */}
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
    </div>
  );
}
