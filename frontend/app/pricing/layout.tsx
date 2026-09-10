import React from 'react';
import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Passes & Pricing — AI Tutor & Mock Tests',
  description:
    'Affordable student passes for university admission preparation in Bangladesh. Free circulars and GPA eligibility, or upgrade to Premium for AI tutoring and mock tests.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Passes & Pricing — AI Tutor & Mock Tests | EduGuide',
    description:
      'Compare Free and Premium student preparation passes: AI admission assistant, unlimited mock exams, and personalized mistake notebook.',
    url: '/pricing',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Passes & Pricing — AI Tutor & Mock Tests | EduGuide',
    description:
      'Compare Free and Premium student preparation passes: AI admission assistant, unlimited mock exams, and personalized mistake notebook.',
    images: ['/og-image.png'],
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://university-admission-assistant.vercel.app';

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteUrl },
          { name: 'Pricing', url: `${siteUrl}/pricing` },
        ]}
      />
      {children}
    </>
  );
}
