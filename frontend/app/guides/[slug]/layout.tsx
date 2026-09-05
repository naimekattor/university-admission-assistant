import React from 'react';
import { Metadata } from 'next';
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/json-ld';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

function formatGuideTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prettyTitle = formatGuideTitle(slug);
  const title = `${prettyTitle}: Preparation Guide 2026`;
  const description = `Complete admission preparation guide for ${prettyTitle}: syllabus weightage, strategy, and past question analysis in Bangladesh.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/guides/${slug}`,
    },
    openGraph: {
      title: `${title} | EduGuide`,
      description,
      url: `/guides/${slug}`,
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

export default async function GuideArticleLayout({
  params,
  children,
}: Props) {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://university-admission-assistant.vercel.app';
  const prettyTitle = formatGuideTitle(slug);

  return (
    <>
      <ArticleSchema
        title={prettyTitle}
        headline={`${prettyTitle} — Admission Strategy & Preparation Guide`}
        url={`${siteUrl}/guides/${slug}`}
        description={`In-depth preparation guide for ${prettyTitle} covering syllabus, book lists, and exam day hacks.`}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteUrl },
          { name: 'Guides', url: `${siteUrl}/guides` },
          { name: prettyTitle, url: `${siteUrl}/guides/${slug}` },
        ]}
      />
      {children}
    </>
  );
}
