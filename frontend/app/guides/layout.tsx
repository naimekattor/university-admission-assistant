import React from 'react';
import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Admission Preparation Guides & Tips 2026',
  description:
    'Step-by-step admission preparation guides and subject strategies for Higher Math, Physics, Chemistry, and Biology for BUET, DU, and Medical 2026.',
  alternates: {
    canonical: '/guides',
  },
  openGraph: {
    title: 'Admission Preparation Guides & Tips 2026 | EduGuide',
    description:
      'Curated admission preparation guides from university toppers covering BUET, DU Ka Unit, Medical, and GST entrance tests.',
    url: '/guides',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admission Preparation Guides & Tips 2026 | EduGuide',
    description:
      'Curated admission preparation guides from university toppers covering BUET, DU Ka Unit, Medical, and GST entrance tests.',
    images: ['/og-image.png'],
  },
};

export default function GuidesLayout({
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
          { name: 'Guides', url: `${siteUrl}/guides` },
        ]}
      />
      {children}
    </>
  );
}
