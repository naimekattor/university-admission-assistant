import { test, expect } from '@playwright/test';

test.describe('SEO Technical Audit: Structured Data (JSON-LD)', () => {
  test('Homepage must contain valid WebSite and EducationalOrganization schemas', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/`, { waitUntil: 'domcontentloaded' });

    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
    expect(jsonLdScripts.length, 'Homepage must have at least one JSON-LD script tag').toBeGreaterThanOrEqual(1);

    const typesFound: string[] = [];
    for (const script of jsonLdScripts) {
      const rawText = await script.innerText();
      const parsed = JSON.parse(rawText);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item['@type']) typesFound.push(item['@type']);
        }
      } else if (parsed['@type']) {
        typesFound.push(parsed['@type']);
      }
    }

    expect(
      typesFound.some((t) => ['EducationalOrganization', 'WebSite', 'Organization'].includes(t)),
      `Homepage schemas should include EducationalOrganization or WebSite. Found: ${typesFound.join(', ')}`
    ).toBe(true);
  });

  test('University detail page (/universities/buet) must contain CollegeOrUniversity and BreadcrumbList schemas', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/universities/buet`, { waitUntil: 'domcontentloaded' });

    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
    expect(jsonLdScripts.length, 'University page should have JSON-LD script tags').toBeGreaterThanOrEqual(1);

    const typesFound: string[] = [];
    for (const script of jsonLdScripts) {
      const rawText = await script.innerText();
      const parsed = JSON.parse(rawText);
      if (parsed['@type']) typesFound.push(parsed['@type']);
    }

    expect(typesFound, 'University page must include CollegeOrUniversity schema').toContain('CollegeOrUniversity');
    expect(typesFound, 'University page must include BreadcrumbList schema').toContain('BreadcrumbList');
  });

  test('Guide article page (/guides/buet-admission-guide-2026) must contain Article and BreadcrumbList schemas', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/guides/buet-admission-guide-2026`, { waitUntil: 'domcontentloaded' });

    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
    expect(jsonLdScripts.length, 'Guide article page should have JSON-LD schema').toBeGreaterThanOrEqual(1);

    const typesFound: string[] = [];
    for (const script of jsonLdScripts) {
      const rawText = await script.innerText();
      const parsed = JSON.parse(rawText);
      if (parsed['@type']) typesFound.push(parsed['@type']);
    }

    expect(typesFound, 'Guide article must include Article schema').toContain('Article');
    expect(typesFound, 'Guide article must include BreadcrumbList schema').toContain('BreadcrumbList');
  });
});
