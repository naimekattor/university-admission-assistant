import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/seo/json-ld';
import { Lock, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'EduGuide Bangladesh privacy policy: how we safeguard student data, practice test metrics, and university preference information.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | EduGuide',
    description: 'Privacy policy and student data security commitment at EduGuide Bangladesh.',
    url: '/privacy',
    images: ['/og-image.png'],
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy' },
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
            <Lock className="w-4 h-4" />
            <span>Privacy & Security</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-600">
            Last updated: March 2026. EduGuide is committed to safeguarding student data and privacy.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pt-10">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 space-y-8 text-sm text-slate-700 leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              We collect information necessary to personalize admission recommendations and practice tests, including your target study groups (Science, Commerce, Humanities), target universities (e.g. BUET, Medical, DU), SSC/HSC GPA inputs, and mock test scores.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. How We Use Your Data</h2>
            <p>
              Your data is utilized solely to calculate accurate admission eligibility criteria, generate smart study roadmaps, and surface relevant admission notices and deadlines. We never sell your personal information to third-party marketing companies.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Data Security & Storage</h2>
            <p>
              All user data and test histories are transmitted securely over HTTPS with TLS encryption and stored in secure PostgreSQL database infrastructure with strict access controls.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. Contact & Inquiries</h2>
            <p>
              If you have any questions regarding our privacy practices or wish to request data deletion, contact our support team at privacy@eduguide.com.bd.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
