import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/seo/json-ld';
import { Shield, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service, user agreements, and usage policies for the EduGuide Bangladesh university admission intelligence platform.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service | EduGuide',
    description: 'Terms of service and user agreements for EduGuide Bangladesh.',
    url: '/terms',
    images: ['/og-image.png'],
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Terms of Service', url: '/terms' },
        ]}
      />

      <section className="bg-white border-b border-slate-200/80 pt-10 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#FF5500] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF5500] uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Legal & Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-600">
            Last updated: March 2026. Please read these terms carefully before accessing EduGuide services.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pt-10">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 space-y-8 text-sm text-slate-700 leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using EduGuide (eduguide.com.bd), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using our services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. Educational & Informational Purpose</h2>
            <p>
              EduGuide aggregates and presents university admission circulars, GPA eligibility requirements, exam dates, and preparation material for informational and practice purposes. While we strive for maximum accuracy, university authorities may amend admission policies. Candidates are advised to cross-check with official university portals linked on EduGuide.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. User Accounts & Fair Usage</h2>
            <p>
              Users agree to provide accurate information when registering accounts, simulating test results, or asking questions in the community. Automated scraping, abuse of AI tutor endpoints, or distribution of unauthorized content is strictly prohibited.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. Intellectual Property</h2>
            <p>
              All proprietary logos, user interface designs, curriculum roadmaps, and custom practice question explanations developed by EduGuide are the intellectual property of EduGuide Bangladesh.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
