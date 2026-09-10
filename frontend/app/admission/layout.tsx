import React from 'react';
import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Admission Circulars & Deadlines 2026',
  description:
    'Live verified directory of Bangladesh university admission circulars 2026: application dates, exam schedules, seat distribution, and minimum GPA criteria.',
  alternates: {
    canonical: '/admission',
  },
  openGraph: {
    title: 'Admission Circulars & Deadlines 2026 | EduGuide',
    description:
      'Live tracker of public, engineering, medical, and GST admission circulars, minimum GPA qualifications, application dates, and circular PDFs in Bangladesh.',
    url: '/admission',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admission Circulars & Deadlines 2026 | EduGuide',
    description:
      'Live tracker of public, engineering, medical, and GST admission circulars, minimum GPA qualifications, and application dates in Bangladesh.',
    images: ['/og-image.png'],
  },
};

export default function AdmissionLayout({
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
          { name: 'Admission Circulars', url: `${siteUrl}/admission` },
        ]}
      />
      {children}
    </>
  );
}
