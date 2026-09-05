import React from 'react';
import { Metadata } from 'next';
import { CollegeOrUniversitySchema, BreadcrumbSchema } from '@/components/seo/json-ld';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

// Friendly university metadata map
const UNIVERSITY_MAP: Record<
  string,
  { name: string; shortName: string; location: string; type: string }
> = {
  buet: { name: 'Bangladesh University of Engineering and Technology', shortName: 'BUET', location: 'Dhaka', type: 'Engineering' },
  du: { name: 'University of Dhaka', shortName: 'DU', location: 'Dhaka', type: 'General' },
  medical: { name: 'Government Medical Colleges (MBBS/BDS)', shortName: 'Medical', location: 'Bangladesh', type: 'Medical' },
  ckruet: { name: 'Chittagong, Khulna & Rajshahi UET Cluster', shortName: 'CKRUET', location: 'Bangladesh', type: 'Engineering' },
  cuet: { name: 'Chittagong University of Engineering & Technology', shortName: 'CUET', location: 'Chittagong', type: 'Engineering' },
  kuet: { name: 'Khulna University of Engineering & Technology', shortName: 'KUET', location: 'Khulna', type: 'Engineering' },
  ruet: { name: 'Rajshahi University of Engineering & Technology', shortName: 'RUET', location: 'Rajshahi', type: 'Engineering' },
  gst: { name: 'General, Science & Technology Cluster (GST)', shortName: 'GST', location: 'Bangladesh', type: 'Cluster' },
  sust: { name: 'Shahjalal University of Science and Technology', shortName: 'SUST', location: 'Sylhet', type: 'Science & Technology' },
  ju: { name: 'Jahangirnagar University', shortName: 'JU', location: 'Savar, Dhaka', type: 'General' },
  ru: { name: 'University of Rajshahi', shortName: 'RU', location: 'Rajshahi', type: 'General' },
  cu: { name: 'University of Chittagong', shortName: 'CU', location: 'Chittagong', type: 'General' },
  jnu: { name: 'Jagannath University', shortName: 'JnU', location: 'Dhaka', type: 'General' },
  butex: { name: 'Bangladesh University of Textiles', shortName: 'BUTEX', location: 'Dhaka', type: 'Textile Engineering' },
  bup: { name: 'Bangladesh University of Professionals', shortName: 'BUP', location: 'Mirpur, Dhaka', type: 'Specialized' },
  sau: { name: 'Sher-e-Bangla Agricultural University', shortName: 'SAU', location: 'Dhaka', type: 'Agricultural' },
  bau: { name: 'Bangladesh Agricultural University', shortName: 'BAU', location: 'Mymensingh', type: 'Agricultural' },
};

function formatSlugName(slug: string): string {
  const clean = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (UNIVERSITY_MAP[clean]) {
    return `${UNIVERSITY_MAP[clean].shortName} (${UNIVERSITY_MAP[clean].name})`;
  }
  return slug.toUpperCase().replace(/-/g, ' ');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const clean = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
  const info = UNIVERSITY_MAP[clean];

  const shortName = info ? info.shortName : slug.toUpperCase().replace(/-/g, ' ');
  const fullName = info ? info.name : formatSlugName(slug);
  const location = info?.location || 'Bangladesh';

  const title = `${shortName} Admission 2026: Circular, GPA & Deadlines`;
  const description = `${shortName} admission guide 2026: unit-wise GPA criteria, seat count, exam dates, syllabus, and official circular notices in Bangladesh.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/universities/${slug}`,
    },
    openGraph: {
      title: `${title} | EduGuide`,
      description,
      url: `/universities/${slug}`,
      type: 'article',
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | EduGuide`,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default async function UniversityDetailLayout({
  params,
  children,
}: Props) {
  const { slug } = await params;
  const clean = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
  const info = UNIVERSITY_MAP[clean];
  const displayName = info ? info.name : formatSlugName(slug);
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://university-admission-assistant.vercel.app';

  return (
    <>
      <CollegeOrUniversitySchema
        name={displayName}
        url={`${siteUrl}/universities/${slug}`}
        addressLocality={info?.location || 'Dhaka, Bangladesh'}
        description={`Admission test rules, circulars, GPA criteria, and seat breakdown for ${displayName}.`}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: `${siteUrl}` },
          { name: 'Universities', url: `${siteUrl}/universities` },
          { name: info?.shortName || slug.toUpperCase(), url: `${siteUrl}/universities/${slug}` },
        ]}
      />
      {children}
    </>
  );
}
