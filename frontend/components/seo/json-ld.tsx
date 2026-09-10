import React from 'react';

/**
 * Helper to safely serialize structured data as a JSON script tag
 */
export function JsonLdScript({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

/**
 * WebSite + SearchAction Schema
 */
export function WebSiteSchema({
  url = 'https://university-admission-assistant.vercel.app',
  name = 'EduGuide Bangladesh',
  searchUrl = 'https://university-admission-assistant.vercel.app/universities?search={search_term_string}',
}: {
  url?: string;
  name?: string;
  searchUrl?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: searchUrl,
      'query-input': 'required name=search_term_string',
    },
  };

  return <JsonLdScript data={schema} />;
}

/**
 * Organization / EducationalOrganization Schema
 */
export function EducationalOrganizationSchema({
  name = 'EduGuide Bangladesh',
  url = 'https://university-admission-assistant.vercel.app',
  logo = 'https://university-admission-assistant.vercel.app/images/eduguide_logo.png',
  description = 'Bangladesh premier data-driven university admission intelligence platform: official circulars, BUET, DU, Medical, and GST eligibility qualifier.',
}: {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name,
    url,
    logo,
    description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BD',
      addressLocality: 'Dhaka',
    },
    sameAs: ['https://facebook.com/eduguidebd'],
  };

  return <JsonLdScript data={schema} />;
}

/**
 * CollegeOrUniversity Schema for university profile pages
 */
export function CollegeOrUniversitySchema({
  name,
  url,
  logo,
  addressLocality,
  description,
}: {
  name: string;
  url: string;
  logo?: string;
  addressLocality?: string;
  description?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name,
    url,
    ...(logo ? { logo } : {}),
    ...(addressLocality
      ? {
          address: {
            '@type': 'PostalAddress',
            addressLocality,
            addressCountry: 'BD',
          },
        }
      : {}),
    ...(description ? { description } : {}),
  };

  return <JsonLdScript data={schema} />;
}

/**
 * Article / BlogPosting Schema for guide articles
 */
export function ArticleSchema({
  title,
  headline,
  url,
  datePublished,
  dateModified,
  authorName = 'EduGuide Academic Team',
  description,
  imageUrl,
}: {
  title: string;
  headline?: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  description?: string;
  imageUrl?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: headline || title,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'EduGuide Bangladesh',
      logo: {
        '@type': 'ImageObject',
        url: 'https://university-admission-assistant.vercel.app/icon.svg',
      },
    },
    ...(description ? { description } : {}),
  };

  return <JsonLdScript data={schema} />;
}

/**
 * BreadcrumbList Schema
 */
export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLdScript data={schema} />;
}

/**
 * FAQPage Schema
 */
export function FAQPageSchema({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <JsonLdScript data={schema} />;
}
