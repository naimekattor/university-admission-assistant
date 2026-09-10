import React from 'react';
import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Eligibility Qualifier & GPA Calculator 2026',
  description:
    'Free admission eligibility calculator for Bangladeshi HSC students. Enter your GPA to instantly check eligibility for BUET, DU, Medical, and GST units.',
  alternates: {
    canonical: '/eligibility',
  },
  openGraph: {
    title: 'Eligibility Qualifier & GPA Calculator 2026 | EduGuide',
    description:
      'Check which engineering, medical, and public university units you qualify for based on official SSC & HSC GPA requirements.',
    url: '/eligibility',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eligibility Qualifier & GPA Calculator 2026 | EduGuide',
    description:
      'Check which engineering, medical, and public university units you qualify for based on official SSC & HSC GPA requirements.',
    images: ['/og-image.png'],
  },
};

export default function EligibilityLayout({
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
          { name: 'Eligibility Qualifier', url: `${siteUrl}/eligibility` },
        ]}
      />
      {children}
    </>
  );
}
