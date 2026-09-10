import React from 'react';
import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Universities in Bangladesh — Circulars & Units 2026',
  description:
    'Explore all public, engineering, medical, and GST universities in Bangladesh with verified GPA criteria, test dates, and seat breakdowns.',
  alternates: {
    canonical: '/universities',
  },
  openGraph: {
    title: 'Universities in Bangladesh — Circulars & Units 2026 | EduGuide',
    description:
      'Explore all public, engineering, medical, and GST universities in Bangladesh with verified GPA criteria, test dates, and seat breakdowns.',
    url: '/universities',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Universities in Bangladesh — Circulars & Units 2026 | EduGuide',
    description:
      'Explore all public, engineering, medical, and GST universities in Bangladesh with verified GPA criteria, test dates, and seat breakdowns.',
    images: ['/og-image.png'],
  },
};

export default function UniversitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Universities', url: '/universities' },
        ]}
      />
      {children}
    </>
  );
}
