import { Browser, Page } from '@playwright/test';
import { PageAuditResult, SeoIssue } from './types';
import { auditPage } from './seo-checker';

export interface CrawlerOptions {
  baseUrl: string;
  maxPages?: number;
  timeout?: number;
  concurrency?: number;
  customSeeds?: string[];
  excludedPrefixes?: string[];
}

const DEFAULT_EXCLUDED_PREFIXES = [
  '/admin',
  '/dashboard',
  '/profile',
  '/settings',
  '/progress',
  '/recommendations',
  '/community/ask',
  '/community/my-questions',
  '/community/saved',
  '/api',
  '/_next',
  '/login',
  '/logout',
  '/sign-in',
  '/sign-up',
];

const KNOWN_PUBLIC_SEEDS = [
  '/',
  '/universities',
  '/universities/buet',
  '/universities/du',
  '/universities/ckruet',
  '/universities/medical',
  '/universities/gst',
  '/universities/sust',
  '/universities/kuet',
  '/admission',
  '/eligibility',
  '/guides',
  '/guides/buet-admission-guide-2026',
  '/guides/du-ka-unit-guide',
  '/community',
  '/pricing',
  '/ai-tutor',
];

export function normalizeUrl(rawUrl: string, baseUrl: string): string | null {
  try {
    const parsedBase = new URL(baseUrl);
    const parsed = new URL(rawUrl, baseUrl);

    // Reject non-http(s) protocols (javascript:, mailto:, tel:)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    // Reject different domains (only crawl internal links)
    if (parsed.hostname !== parsedBase.hostname) {
      return null;
    }

    // Ignore asset files
    if (/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|pdf|zip)$/i.test(parsed.pathname)) {
      return null;
    }

    // Strip hash and common tracking query params
    parsed.hash = '';
    const cleanParams = new URLSearchParams();
    for (const [key, value] of parsed.searchParams.entries()) {
      if (!key.startsWith('utm_') && !['fbclid', 'ref', 'preview', 'token', 'sessionToken'].includes(key)) {
        cleanParams.append(key, value);
      }
    }
    parsed.search = cleanParams.toString() ? `?${cleanParams.toString()}` : '';

    // Normalize trailing slash (keep only for root '/')
    let pathname = parsed.pathname.toLowerCase();
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    parsed.pathname = pathname;

    return parsed.href;
  } catch {
    return null;
  }
}

export function isExcluded(url: string, excludedPrefixes: string[] = DEFAULT_EXCLUDED_PREFIXES): boolean {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return excludedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  } catch {
    return true;
  }
}

export async function crawlPublicRoutes(
  browser: Browser,
  options: CrawlerOptions
): Promise<PageAuditResult[]> {
  const {
    baseUrl,
    maxPages = 40,
    timeout = 30000,
    customSeeds = [],
    excludedPrefixes = DEFAULT_EXCLUDED_PREFIXES,
  } = options;

  const visited = new Set<string>();
  const queue: string[] = [];
  const results: PageAuditResult[] = [];

  // Initialize seed URLs
  const allSeeds = [...new Set([...KNOWN_PUBLIC_SEEDS, ...customSeeds])];
  for (const seed of allSeeds) {
    const normalized = normalizeUrl(seed, baseUrl);
    if (normalized && !isExcluded(normalized, excludedPrefixes) && !visited.has(normalized)) {
      queue.push(normalized);
      visited.add(normalized);
    }
  }

  const context = await browser.newContext({
    userAgent: 'EduGuide-SEO-Auditor/1.0 (Playwright; +https://university-admission-assistant.vercel.app/robots.txt)',
    viewport: { width: 1440, height: 900 },
  });

  await context.addInitScript('window.__name = (fn) => fn;');

  const page = await context.newPage();

  while (queue.length > 0 && results.length < maxPages) {
    const currentUrl = queue.shift()!;
    console.log(`[SEO Crawler] Crawling (${results.length + 1}/${maxPages}): ${currentUrl}`);

    try {
      const pageResult = await auditPage(page, currentUrl, baseUrl, timeout);
      results.push(pageResult);

      // Extract discovered internal links from this page
      for (const link of pageResult.links) {
        if (!link.isInternal || link.isHashOnly || link.isJavascript || link.isEmpty) continue;

        const normalized = normalizeUrl(link.href, baseUrl);
        if (
          normalized &&
          !isExcluded(normalized, excludedPrefixes) &&
          !visited.has(normalized) &&
          results.length + queue.length < maxPages * 2
        ) {
          visited.add(normalized);
          queue.push(normalized);
        }
      }
    } catch (err: any) {
      console.warn(`[SEO Crawler] Error auditing ${currentUrl}:`, err?.message || err);
      results.push({
        url: currentUrl,
        path: new URL(currentUrl).pathname,
        status: 500,
        statusText: 'Internal Crawl Error',
        contentType: 'unknown',
        timingMs: 0,
        title: null,
        titleLength: 0,
        metaDescription: null,
        metaDescriptionLength: 0,
        canonicalUrl: null,
        isCanonicalMatch: false,
        metaRobots: null,
        isNoindex: false,
        isNofollow: false,
        ogTitle: null,
        ogDescription: null,
        ogImage: null,
        ogUrl: null,
        ogType: null,
        twitterCard: null,
        twitterTitle: null,
        twitterDescription: null,
        twitterImage: null,
        h1Count: 0,
        h1Texts: [],
        headings: [],
        wordCount: 0,
        contentFingerprint: '',
        studentKeywordsFound: [],
        images: [],
        links: [],
        structuredData: [],
        performance: {
          domContentLoadedMs: 0,
          loadEventMs: 0,
          totalRequests: 0,
          totalJsRequests: 0,
          totalCssRequests: 0,
          totalImageRequests: 0,
          slowRequests: [],
          failedRequests: [],
        },
        mobile: {
          hasHorizontalOverflow: false,
          scrollWidth: 0,
          clientWidth: 0,
          isH1Visible: false,
          viewportMeta: null,
          touchTargetIssues: 0,
        },
        issues: [
          {
            id: 'page-load-failed',
            url: currentUrl,
            category: 'technical',
            severity: 'critical',
            title: 'Page failed to load during audit',
            description: `Error loading page: ${err?.message || 'Unknown network error'}`,
            recommendation: 'Check server error logs and ensure the route responds with HTTP 200.',
          },
        ],
      });
    }
  }

  await context.close();
  return results;
}
