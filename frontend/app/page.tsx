'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
import { DEFAULT_HOMEPAGE_CONFIG, HomepageFullConfig } from '@/lib/homepage-types';

export default function DynamicHomepage() {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  const [homepageData, setHomepageData] = useState<any | null>(null);
  const [config, setConfig] = useState<HomepageFullConfig>(DEFAULT_HOMEPAGE_CONFIG);
  const [loading, setLoading] = useState(false);

  const fetchHomepageData = async () => {
    // 1. Instant local hydration of latest saved/published CMS changes
    if (typeof window !== 'undefined') {
      try {
        const storedKey = isPreview ? 'eduguide_homepage_draft' : 'eduguide_homepage_published';
        const stored = localStorage.getItem(storedKey) || localStorage.getItem('eduguide_homepage_config');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            setConfig(parsed);
          }
        }
      } catch {}
    }

    // 2. Fetch fresh synchronized data from backend
    try {
      const res = await fetch(`/api/v1/homepage${isPreview ? '?preview=true' : ''}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        setHomepageData(data);
        if (data.config) {
          setConfig(data.config);
        }
      }
    } catch {
      // Offline / seeding fallback
    }
  };

  useEffect(() => {
    fetchHomepageData();
  }, [isPreview]);

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

      {/* ── MAIN HOMEPAGE SECTIONS ── */}
      <div className="relative z-10 space-y-4 sm:space-y-6">
        {/* ── 1. HERO SECTION ── */}
        {(!config || config.hero?.enabled !== false) && (
          <HeroSection config={config?.hero} />
        )}

        {/* ── 2. DASHBOARD PREVIEW FRAME ── */}
        <DashboardPreviewFrame />

        {/* ── 3. ADMISSION AT A GLANCE (DATA TABLE & READY TEMPLATES) ── */}
        {(!config || config.admissionSection?.enabled !== false) && (
          <AdmissionAtGlance
            config={config?.admissionSection}
            admissions={config?.admissionSection?.customRows || homepageData?.admissions}
          />
        )}

        {/* ── 4. ELIGIBILITY CHECKER & RESULTS ── */}
        {(!config || config.eligibilitySection?.enabled !== false) && (
          <EligibilityCheckerSection config={config?.eligibilitySection} />
        )}

        {/* ── 5. UPCOMING ADMISSION DEADLINES ── */}
        {(!config || config.deadlineSection?.enabled !== false) && (
          <DeadlinesSection
            config={config?.deadlineSection}
            deadlines={homepageData?.deadlines}
          />
        )}

        {/* ── 6. EXPLORE UNIVERSITIES ── */}
        {(!config || config.featuredUniversities?.enabled !== false) && (
          <FeaturedUniversitiesSection
            config={config?.featuredUniversities}
            universities={homepageData?.featuredUniversities}
          />
        )}

        {/* ── 7. AI ADMISSION ADVISOR PREVIEW ── */}
        {(!config || config.aiAdvisor?.enabled !== false) && (
          <AiAdvisorPreviewSection config={config?.aiAdvisor} />
        )}

        {/* ── 8. ADMISSION GUIDES ── */}
        {(!config || config.guideSection?.enabled !== false) && (
          <GuidesSection
            config={config?.guideSection}
            guides={homepageData?.guides}
          />
        )}

        {/* ── 9. PREPARE WITH EDUGUIDE CTA ── */}
        {(!config || config.preparation?.enabled !== false) && (
          <PreparationCtaSection config={config?.preparation} />
        )}

        {/* ── 10. FAQ ACCORDION ── */}
        {(!config || config.faq?.enabled !== false) && (
          <FaqSection config={config?.faq} faqs={homepageData?.faqs} />
        )}

        {/* ── 11. FOOTER ── */}
        {(!config || config.footer?.enabled !== false) && (
          <FooterSection config={config?.footer} />
        )}
      </div>
    </div>
  );
}
