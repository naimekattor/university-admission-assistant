import { test, expect } from '@playwright/test';

const PUBLIC_ROUTES = [
  { path: '/', expectedKeyword: 'EduGuide' },
  { path: '/universities', expectedKeyword: 'Universities' },
  { path: '/universities/buet', expectedKeyword: 'BUET' },
  { path: '/universities/du', expectedKeyword: 'DU' },
  { path: '/admission', expectedKeyword: 'Admission' },
  { path: '/eligibility', expectedKeyword: 'Eligibility' },
  { path: '/guides', expectedKeyword: 'Guides' },
  { path: '/guides/buet-admission-guide-2026', expectedKeyword: 'BUET' },
  { path: '/community', expectedKeyword: 'Community' },
  { path: '/pricing', expectedKeyword: 'Pricing' },
];

test.describe('SEO Technical Audit: Metadata & Canonical Tags', () => {
  for (const { path, expectedKeyword } of PUBLIC_ROUTES) {
    test(`Route ${path} must have unique title, description, canonical and social tags`, async ({ page, baseURL }) => {
      const targetUrl = `${baseURL}${path}`;
      const response = await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

      // 1. HTTP 200 Check
      expect(response?.status(), `Route ${path} should respond with HTTP 200`).toBe(200);

      // 2. Title Tag Verification
      const title = await page.title();
      expect(title, `Title on ${path} should exist`).toBeTruthy();
      expect(title.length, `Title "${title}" should be at least 25 characters`).toBeGreaterThanOrEqual(25);
      expect(title.toLowerCase(), `Title should contain "${expectedKeyword.toLowerCase()}"`).toContain(expectedKeyword.toLowerCase());

      // 3. Meta Description Verification
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description, `Meta description on ${path} should exist`).toBeTruthy();
      expect(description!.length, `Description length on ${path} should be >= 50 chars`).toBeGreaterThanOrEqual(50);

      // 4. Canonical URL Verification
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical, `Canonical link on ${path} should exist`).toBeTruthy();
      expect(canonical, `Canonical should be absolute or root-relative`).toMatch(/^(\/|https?:\/\/)/);

      // 5. OpenGraph Tags Verification
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      expect(ogTitle, `og:title on ${path} should exist`).toBeTruthy();

      // 6. Robots Meta Verification (Never accidentally noindex public routes!)
      const robots = await page.locator('meta[name="robots"]').getAttribute('content');
      if (robots) {
        expect(robots.toLowerCase(), `Public route ${path} must NOT be noindexed`).not.toContain('noindex');
      }
    });
  }
});
