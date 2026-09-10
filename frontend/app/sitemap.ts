import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://university-admission-assistant.vercel.app';
  const baseUrl = rawUrl.replace(/\/$/, '');
  const now = new Date();

  // Core public static routes
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/eligibility`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/universities`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/admission`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/prepare`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/practice`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mock-tests`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Top Universities dynamic routes (17 canonical universities)
  const universitySlugs = [
    'buet',
    'du',
    'medical',
    'ckruet',
    'gst',
    'sust',
    'cuet',
    'kuet',
    'ruet',
    'ju',
    'cu',
    'ru',
    'bup',
    'butex',
    'iut',
    'sau',
    'agri-cluster',
  ];

  const universityRoutes: MetadataRoute.Sitemap = universitySlugs.map((slug) => ({
    url: `${baseUrl}/universities/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Canonical guides
  const guideSlugs = [
    'buet-admission-guide-2026',
    'du-ka-unit-guide',
    'medical-admission-prep-strategy',
    'gst-cluster-guideline-2026',
    'ckruet-engineering-roadmap',
    'organic-chemistry-hsc-guide',
    'calculus-tricks-admission',
  ];

  const guideRoutes: MetadataRoute.Sitemap = guideSlugs.map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...coreRoutes, ...universityRoutes, ...guideRoutes];
}
