import { test, expect } from '@playwright/test';

test.describe('SEO Technical Audit: Robots.txt Rules', () => {
  test('Robots.txt should be accessible, reference sitemap, and NOT block public resources', async ({ request, baseURL }) => {
    const res = await request.get(`${baseURL}/robots.txt`);
    expect(res.status(), 'robots.txt must return HTTP 200').toBe(200);

    const body = await res.text();

    // 1. Must declare User-agent
    expect(body, 'robots.txt must contain User-agent').toContain('User-agent:');

    // 2. Must link to sitemap
    expect(body.toLowerCase(), 'robots.txt must contain Sitemap reference').toContain('sitemap:');

    // 3. Must NEVER block Next.js client chunks
    expect(body, 'robots.txt must NOT disallow /_next/ (which breaks JS/CSS crawling)').not.toContain('Disallow: /_next/');

    // 4. Must disallow private admin area
    expect(body, 'robots.txt should protect /admin/').toContain('Disallow: /admin/');
  });
});
