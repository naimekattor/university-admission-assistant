import { test, expect } from '@playwright/test';

test.describe('SEO Technical Audit: Sitemap.xml Verification', () => {
  test('Sitemap should return valid XML and contain all core public routes', async ({ request, baseURL }) => {
    const sitemapUrl = `${baseURL}/sitemap.xml`;
    const res = await request.get(sitemapUrl);

    expect(res.status(), 'Sitemap endpoint must return HTTP 200').toBe(200);

    const text = await res.text();
    expect(text, 'Sitemap must contain <urlset> root tag').toContain('<urlset');

    // Extract all <loc> URLs
    const locMatches = text.match(/<loc>(.*?)<\/loc>/g) || [];
    const urls = locMatches.map((m) => m.replace(/<\/?loc>/g, '').trim());

    expect(urls.length, 'Sitemap should contain at least 10 indexable routes').toBeGreaterThanOrEqual(10);

    // Verify key public routes are present
    const expectedSubpaths = [
      '',
      '/universities',
      '/universities/buet',
      '/admission',
      '/eligibility',
      '/community',
      '/guides',
      '/pricing',
    ];

    for (const subpath of expectedSubpaths) {
      const match = urls.some((u) => u.endsWith(subpath) || u === `${baseURL}${subpath}`);
      expect(match, `Sitemap must include ${subpath || 'homepage'}`).toBe(true);
    }

    // Verify NO private routes exist in sitemap
    const prohibitedPrefixes = ['/admin', '/dashboard', '/profile', '/settings', '/api'];
    for (const url of urls) {
      for (const prefix of prohibitedPrefixes) {
        expect(url, `Sitemap must not expose private path ${prefix}`).not.toContain(prefix);
      }
    }
  });
});
