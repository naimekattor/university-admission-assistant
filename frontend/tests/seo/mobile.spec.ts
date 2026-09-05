import { test, expect } from '@playwright/test';

const MOBILE_CHECK_ROUTES = [
  '/',
  '/universities',
  '/universities/buet',
  '/admission',
  '/eligibility',
  '/guides',
  '/pricing',
];

test.describe('SEO Technical Audit: Mobile Responsiveness & Usability', () => {
  test.use({ viewport: { width: 390, height: 844 } }); // Realistic iPhone 14/15 viewport

  for (const path of MOBILE_CHECK_ROUTES) {
    test(`Mobile viewport on ${path} should have zero horizontal overflow and readable text`, async ({ page, baseURL }) => {
      await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);

      // 1. Check viewport meta
      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewport, `Viewport meta should exist on ${path}`).toBeTruthy();
      expect(viewport, `Viewport should contain width=device-width`).toContain('width=device-width');

      // 2. Check for Horizontal Scroll Overflow (Critical mobile UX flaw)
      const overflow = await page.evaluate(() => {
        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        return {
          scrollWidth,
          innerWidth,
          hasOverflow: scrollWidth > innerWidth + 2,
        };
      });

      expect(
        overflow.hasOverflow,
        `Page ${path} should not overflow horizontally on mobile (scrollWidth: ${overflow.scrollWidth}px, innerWidth: ${overflow.innerWidth}px)`
      ).toBe(false);

      // 3. Verify H1 exists and is visible
      const h1 = page.locator('h1').first();
      const h1Count = await page.locator('h1').count();
      expect(h1Count, `Page ${path} must have an <h1> heading`).toBeGreaterThanOrEqual(1);
      await expect(h1).toBeVisible();
    });
  }
});
