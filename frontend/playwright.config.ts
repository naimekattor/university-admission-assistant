import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://university-admission-assistant.vercel.app';

export default defineConfig({
  testDir: './tests/seo',
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: false, // run sequentially to avoid hammering the local or production server
  workers: 1,
  retries: 0,
  reporter: [
    ['list'],
    ['json', { outputFile: 'seo-report/playwright-results.json' }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    userAgent: 'EduGuide-SEO-Auditor/1.0 (Playwright; +https://university-admission-assistant.vercel.app/robots.txt)',
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
});
