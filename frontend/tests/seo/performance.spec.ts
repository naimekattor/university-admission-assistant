import { test, expect } from '@playwright/test';

const CORE_SPEED_ROUTES = ['/', '/universities', '/admission', '/eligibility', '/guides'];

test.describe('SEO Technical Audit: Core Page Performance & Resource Weight', () => {
  for (const path of CORE_SPEED_ROUTES) {
    test(`Performance baseline for ${path}`, async ({ page, baseURL }) => {
      let scriptCount = 0;
      let styleCount = 0;
      let imageCount = 0;

      page.on('request', (req) => {
        const type = req.resourceType();
        if (type === 'script') scriptCount++;
        if (type === 'stylesheet') styleCount++;
        if (type === 'image') imageCount++;
      });

      const startTime = Date.now();
      const response = await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' });
      const duration = Date.now() - startTime;

      expect(response?.status()).toBe(200);

      // Verify DOMContentLoaded completes within reasonable time (under 5 seconds)
      expect(duration, `Route ${path} should load DOM within 5000ms. Took ${duration}ms`).toBeLessThan(5000);

      console.log(`[Speed Baseline] ${path} -> ${duration}ms (Scripts: ${scriptCount}, Styles: ${styleCount}, Images: ${imageCount})`);
    });
  }
});
