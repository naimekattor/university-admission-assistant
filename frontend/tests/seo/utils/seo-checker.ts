import { Page } from '@playwright/test';
import {
  PageAuditResult,
  SeoIssue,
  HeadingItem,
  ImageAuditItem,
  LinkAuditItem,
  StructuredDataItem,
} from './types';

const BANGLADESH_STUDENT_KEYWORDS = [
  'buet',
  'dhaka university',
  'du',
  'admission',
  'circular',
  'deadline',
  'gpa',
  'eligibility',
  'medical',
  'engineering',
  'gst',
  'unit',
  'seats',
  'syllabus',
  'mock test',
  'higher math',
  'physics',
  'chemistry',
  'biology',
  'preparation',
  'ভর্তি',
  'বিশ্ববিদ্যালয়',
];

export async function auditPage(
  page: Page,
  url: string,
  baseUrl: string,
  timeout = 30000
): Promise<PageAuditResult> {
  const issues: SeoIssue[] = [];
  const slowRequests: Array<{ url: string; durationMs: number }> = [];
  const failedRequests: Array<{ url: string; status: number | string }> = [];

  let totalRequests = 0;
  let totalJsRequests = 0;
  let totalCssRequests = 0;
  let totalImageRequests = 0;

  // Track network activity
  const requestStartTimes = new Map<string, number>();

  const onRequest = (request: any) => {
    totalRequests++;
    const reqUrl = request.url();
    requestStartTimes.set(reqUrl, Date.now());

    const resourceType = request.resourceType();
    if (resourceType === 'script') totalJsRequests++;
    if (resourceType === 'stylesheet') totalCssRequests++;
    if (resourceType === 'image') totalImageRequests++;
  };

  const onResponse = (response: any) => {
    const resUrl = response.url();
    const startTime = requestStartTimes.get(resUrl);
    if (startTime) {
      const duration = Date.now() - startTime;
      if (duration > 2000 && !resUrl.includes('google') && !resUrl.includes('vercel')) {
        slowRequests.push({ url: resUrl, durationMs: duration });
      }
    }
    if (response.status() >= 400) {
      failedRequests.push({ url: resUrl, status: response.status() });
    }
  };

  const onRequestFailed = (request: any) => {
    failedRequests.push({ url: request.url(), status: request.failure()?.errorText || 'FAILED' });
  };

  page.on('request', onRequest);
  page.on('response', onResponse);
  page.on('requestfailed', onRequestFailed);

  const startTime = Date.now();
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
  const loadTimingMs = Date.now() - startTime;

  // Wait an extra second for hydration
  await page.waitForTimeout(1000);

  // Unhook listeners
  page.off('request', onRequest);
  page.off('response', onResponse);
  page.off('requestfailed', onRequestFailed);

  const status = response ? response.status() : 200;
  const statusText = response ? response.statusText() : 'OK';
  const contentType = response ? response.headers()['content-type'] || '' : '';

  // 1. Technical HTTP status check
  if (status >= 400) {
    issues.push({
      id: `http-${status}`,
      url,
      category: 'technical',
      severity: 'critical',
      title: `Page returned HTTP status ${status}`,
      description: `The page returned an error status code (${status} ${statusText}).`,
      recommendation: 'Fix the page route or server handler so it returns HTTP 200.',
    });
  }

  // 2. Extract DOM data via page.evaluate
  await page.evaluate("window.__name = window.__name || ((fn) => fn);");
  const domData = await page.evaluate((parsedBase) => {
    // Title
    const titleEl = document.querySelector('title');
    const title = titleEl ? titleEl.innerText.trim() : null;

    // Meta Description
    const descEl = document.querySelector('meta[name="description"]');
    const metaDescription = descEl ? descEl.getAttribute('content')?.trim() || null : null;

    // Canonical
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    const canonicalUrl = canonicalEl ? canonicalEl.getAttribute('href')?.trim() || null : null;

    // Meta Robots
    const robotsEl = document.querySelector('meta[name="robots"]');
    const metaRobots = robotsEl ? robotsEl.getAttribute('content')?.trim().toLowerCase() || null : null;

    // OpenGraph
    const getOg = (prop: string) => document.querySelector(`meta[property="${prop}"]`)?.getAttribute('content') || null;
    const ogTitle = getOg('og:title');
    const ogDescription = getOg('og:description');
    const ogImage = getOg('og:image');
    const ogUrl = getOg('og:url');
    const ogType = getOg('og:type');

    // Twitter
    const getTwitter = (name: string) => document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') || null;
    const twitterCard = getTwitter('twitter:card');
    const twitterTitle = getTwitter('twitter:title');
    const twitterDescription = getTwitter('twitter:description');
    const twitterImage = getTwitter('twitter:image');

    // Viewport
    const viewportEl = document.querySelector('meta[name="viewport"]');
    const viewportMeta = viewportEl ? viewportEl.getAttribute('content') : null;

    // Headings
    const headingEls = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const headings: Array<{ level: number; text: string }> = headingEls.map((h) => ({
      level: parseInt(h.tagName.substring(1), 10),
      text: (h as HTMLElement).innerText.trim(),
    }));

    const h1Els = Array.from(document.querySelectorAll('h1'));
    const h1Texts = h1Els.map((h) => (h as HTMLElement).innerText.trim()).filter(Boolean);

    // Images
    const imgEls = Array.from(document.querySelectorAll('img'));
    const images = imgEls.map((img) => {
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt');
      const hasAlt = alt !== null;
      const isDescriptiveAlt = hasAlt && alt.trim().length > 3 && !alt.includes('.png') && !alt.includes('.jpg');
      return {
        src,
        alt,
        hasAlt,
        isDescriptiveAlt,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        loading: img.getAttribute('loading') || undefined,
        isNextImage: img.getAttribute('data-nimg') !== null || src.includes('/_next/image'),
      };
    });

    // Links
    const linkEls = Array.from(document.querySelectorAll('a[href]'));
    const links = linkEls.map((a) => {
      const href = a.getAttribute('href') || '';
      const text = (a as HTMLElement).innerText.trim() || a.getAttribute('aria-label') || '';
      const isInternal = href.startsWith('/') || href.includes(parsedBase);
      const isHashOnly = href.startsWith('#');
      const isJavascript = href.startsWith('javascript:');
      const isEmpty = href === '' || href === '#';
      return {
        href,
        text,
        isInternal,
        isHashOnly,
        isJavascript,
        isEmpty,
      };
    });

    // Structured Data (JSON-LD)
    const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    const structuredData = jsonLdScripts.map((s) => {
      try {
        const raw = JSON.parse(s.innerHTML);
        const isArr = Array.isArray(raw);
        const isValid = isArr
          ? raw.length > 0 && raw.every((item: any) => Boolean(item && (item['@context'] || item['@type'])))
          : Boolean(raw && (raw['@context'] || raw['@type']));
        return {
          type: isArr ? raw.map((r: any) => r?.['@type'] || 'Object').join(', ') : (raw?.['@type'] || 'Unknown'),
          context: isArr ? (raw[0]?.['@context'] || '') : (raw?.['@context'] || ''),
          raw,
          isValid,
        };
      } catch (err: any) {
        return {
          type: 'Invalid JSON',
          context: '',
          raw: null,
          isValid: false,
          errors: [err.message],
        };
      }
    });

    // Text Content
    const bodyText = document.body.innerText || '';
    const cleanWords = bodyText.replace(/\s+/g, ' ').trim().split(' ').filter((w) => w.length > 1);
    const wordCount = cleanWords.length;

    // Mobile Horizontal Overflow
    const scrollWidth = document.documentElement.scrollWidth;
    const clientWidth = document.documentElement.clientWidth;
    const hasHorizontalOverflow = scrollWidth > clientWidth + 2;

    // H1 Visibility
    const isH1Visible = h1Els.length > 0 && h1Els.some((h) => {
      const rect = h.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && window.getComputedStyle(h).display !== 'none';
    });

    return {
      title,
      metaDescription,
      canonicalUrl,
      metaRobots,
      ogTitle,
      ogDescription,
      ogImage,
      ogUrl,
      ogType,
      twitterCard,
      twitterTitle,
      twitterDescription,
      twitterImage,
      viewportMeta,
      headings,
      h1Count: h1Els.length,
      h1Texts,
      images,
      links,
      structuredData,
      wordCount,
      bodySample: bodyText.toLowerCase().substring(0, 5000),
      hasHorizontalOverflow,
      scrollWidth,
      clientWidth,
      isH1Visible,
    };
  }, baseUrl);

  // 3. Evaluate Title
  const title = domData.title;
  const titleLength = title ? title.length : 0;
  if (!title) {
    issues.push({
      id: 'missing-title',
      url,
      category: 'onPage',
      severity: 'critical',
      title: 'Missing <title> tag',
      description: 'The page has no title tag in the head.',
      recommendation: 'Add a descriptive, keyword-targeted <title> tag with 30-65 characters.',
    });
  } else if (titleLength < 25) {
    issues.push({
      id: 'short-title',
      url,
      category: 'onPage',
      severity: 'medium',
      title: `Title is too short (${titleLength} chars)`,
      description: `"${title}" is shorter than the recommended minimum of 30 characters.`,
      recommendation: 'Expand the title to include target university or admission search terms.',
    });
  } else if (titleLength > 70) {
    issues.push({
      id: 'long-title',
      url,
      category: 'onPage',
      severity: 'low',
      title: `Title may be truncated (${titleLength} chars)`,
      description: `"${title}" exceeds 70 characters and may get cut off in Google SERPs.`,
      recommendation: 'Shorten title to between 50 and 65 characters.',
    });
  }

  // 4. Evaluate Meta Description
  const metaDescription = domData.metaDescription;
  const metaDescriptionLength = metaDescription ? metaDescription.length : 0;
  if (!metaDescription) {
    issues.push({
      id: 'missing-description',
      url,
      category: 'onPage',
      severity: 'high',
      title: 'Missing meta description',
      description: 'The page lacks a <meta name="description"> tag.',
      recommendation: 'Add a compelling meta description between 120 and 160 characters summarizing the page.',
    });
  } else if (metaDescriptionLength < 60) {
    issues.push({
      id: 'short-description',
      url,
      category: 'onPage',
      severity: 'medium',
      title: `Meta description is short (${metaDescriptionLength} chars)`,
      description: 'Meta description is under 70 characters.',
      recommendation: 'Provide more admission context (dates, GPA, syllabus) to reach 120-160 characters.',
    });
  } else if (metaDescriptionLength > 175) {
    issues.push({
      id: 'long-description',
      url,
      category: 'onPage',
      severity: 'low',
      title: `Meta description may be truncated (${metaDescriptionLength} chars)`,
      description: 'Meta description exceeds 160 characters.',
      recommendation: 'Keep primary search intent information within the first 155 characters.',
    });
  }

  // 5. Canonical URL
  const canonicalUrl = domData.canonicalUrl;
  let isCanonicalMatch = false;
  if (!canonicalUrl) {
    issues.push({
      id: 'missing-canonical',
      url,
      category: 'technical',
      severity: 'medium',
      title: 'Missing canonical link',
      description: 'The page does not declare a <link rel="canonical"> tag.',
      recommendation: 'Add an absolute HTTPS canonical link in metadata.',
    });
  } else {
    try {
      const parsedCanonical = new URL(canonicalUrl, baseUrl);
      const parsedCurrent = new URL(url);
      isCanonicalMatch = parsedCanonical.pathname.replace(/\/$/, '') === parsedCurrent.pathname.replace(/\/$/, '');
      if (!isCanonicalMatch) {
        issues.push({
          id: 'canonical-mismatch',
          url,
          category: 'technical',
          severity: 'medium',
          title: 'Canonical URL points to a different path',
          description: `Current path: ${parsedCurrent.pathname}, canonical path: ${parsedCanonical.pathname}`,
          recommendation: 'Ensure canonical points to the exact canonical URL for this page.',
        });
      }
    } catch {
      issues.push({
        id: 'invalid-canonical',
        url,
        category: 'technical',
        severity: 'high',
        title: 'Malformed canonical URL',
        description: `The canonical URL "${canonicalUrl}" could not be parsed as a valid URL.`,
        recommendation: 'Use an absolute URL format (e.g. https://.../path).',
      });
    }
  }

  // 6. Robots Directives
  const metaRobots = domData.metaRobots;
  const isNoindex = metaRobots ? metaRobots.includes('noindex') : false;
  const isNofollow = metaRobots ? metaRobots.includes('nofollow') : false;
  if (isNoindex) {
    issues.push({
      id: 'accidental-noindex',
      url,
      category: 'indexability',
      severity: 'critical',
      title: 'Page contains "noindex" directive',
      description: 'The page is flagged with noindex in robots meta tag, preventing Google from indexing it.',
      recommendation: 'Remove noindex from public pages that should rank on Google.',
    });
  }

  // 7. Headings Structure (H1 check)
  if (domData.h1Count === 0) {
    issues.push({
      id: 'missing-h1',
      url,
      category: 'onPage',
      severity: 'high',
      title: 'Missing <h1> heading',
      description: 'The page does not contain any <h1> heading element.',
      recommendation: 'Add a single, semantic <h1> heading clearly stating the page topic.',
    });
  } else if (domData.h1Count > 1) {
    issues.push({
      id: 'multiple-h1',
      url,
      category: 'onPage',
      severity: 'medium',
      title: `Multiple <h1> headings found (${domData.h1Count})`,
      description: `Headings: ${domData.h1Texts.slice(0, 3).join(' | ')}`,
      recommendation: 'Use exactly one primary <h1> per page; convert secondary headings to <h2>.',
    });
  }

  // Check heading hierarchy skips (H1 -> H3 without H2)
  const levels = domData.headings.map((h) => h.level);
  for (let i = 0; i < levels.length - 1; i++) {
    if (levels[i] === 1 && levels[i + 1] >= 3) {
      issues.push({
        id: 'heading-level-skip',
        url,
        category: 'onPage',
        severity: 'low',
        title: 'Heading structure skips a level (H1 -> H3)',
        description: `An <h1> is followed directly by an <h${levels[i + 1]}> without an intervening <h2>.`,
        recommendation: 'Organize page content hierarchically (H1 -> H2 -> H3).',
      });
      break;
    }
  }

  // 8. OpenGraph & Twitter Cards
  if (!domData.ogTitle || !domData.ogDescription || !domData.ogImage) {
    issues.push({
      id: 'incomplete-opengraph',
      url,
      category: 'onPage',
      severity: 'low',
      title: 'Incomplete Open Graph tags',
      description: 'Missing one or more essential OpenGraph tags (og:title, og:description, og:image).',
      recommendation: 'Add complete OpenGraph tags to ensure rich social previews on Facebook and LinkedIn.',
    });
  }

  // 9. Image Audits
  const missingAltImages = domData.images.filter((img) => !img.hasAlt || img.alt?.trim() === '');
  if (missingAltImages.length > 0) {
    issues.push({
      id: 'missing-image-alt',
      url,
      category: 'accessibility',
      severity: 'medium',
      title: `${missingAltImages.length} image(s) missing alt attribute`,
      description: `Images without alt text found: ${missingAltImages.slice(0, 2).map((i) => i.src).join(', ')}`,
      recommendation: 'Provide descriptive alt text for every content image to improve image search ranking and accessibility.',
    });
  }

  // 10. Links Audits
  const emptyLinks = domData.links.filter((l) => l.isEmpty);
  if (emptyLinks.length > 0) {
    issues.push({
      id: 'empty-href-links',
      url,
      category: 'internal-linking',
      severity: 'medium',
      title: `${emptyLinks.length} link(s) with empty or "#" href`,
      description: 'Links with href="#" or empty destinations reduce crawl efficiency.',
      recommendation: 'Replace placeholder href="#" with valid destination URLs.',
    });
  }

  // 11. Structured Data check
  if (domData.structuredData.length === 0) {
    issues.push({
      id: 'missing-structured-data',
      url,
      category: 'structured-data',
      severity: 'low',
      title: 'No JSON-LD structured data detected',
      description: 'Page lacks schema.org structured data markup.',
      recommendation: 'Add appropriate JSON-LD (WebSite, CollegeOrUniversity, Article, BreadcrumbList).',
    });
  } else {
    const invalidSchemas = domData.structuredData.filter((s) => !s.isValid);
    if (invalidSchemas.length > 0) {
      issues.push({
        id: 'invalid-json-ld',
        url,
        category: 'structured-data',
        severity: 'high',
        title: 'Invalid JSON-LD schema syntax',
        description: `Schema errors: ${invalidSchemas.map((s) => s.errors?.join(', ')).join('; ')}`,
        recommendation: 'Fix JSON formatting syntax in the <script type="application/ld+json"> tag.',
      });
    }
  }

  // 12. Mobile Responsiveness check
  if (domData.hasHorizontalOverflow) {
    issues.push({
      id: 'mobile-horizontal-overflow',
      url,
      category: 'mobile',
      severity: 'high',
      title: 'Horizontal scrolling detected on mobile',
      description: `Page scrollWidth (${domData.scrollWidth}px) exceeds clientWidth (${domData.clientWidth}px).`,
      recommendation: 'Add overflow-x-hidden to outer containers and ensure tables use scroll containers.',
    });
  }

  // 13. Content Thinness
  if (domData.wordCount < 100) {
    issues.push({
      id: 'thin-content',
      url,
      category: 'content',
      severity: 'high',
      title: `Thin content (${domData.wordCount} words)`,
      description: 'The page contains fewer than 100 words of visible text.',
      recommendation: 'Expand with comprehensive admission criteria, deadlines, and guidelines.',
    });
  }

  // 14. Student Search Intent keywords found
  const studentKeywordsFound = BANGLADESH_STUDENT_KEYWORDS.filter((kw) =>
    domData.bodySample.includes(kw.toLowerCase())
  );

  // Content fingerprint for duplicate detection
  const contentFingerprint = domData.bodySample
    .replace(/[^a-z0-9]/gi, '')
    .substring(0, 300);

  return {
    url,
    path: new URL(url).pathname,
    status,
    statusText,
    contentType,
    timingMs: loadTimingMs,
    title: domData.title,
    titleLength,
    metaDescription: domData.metaDescription,
    metaDescriptionLength,
    canonicalUrl: domData.canonicalUrl,
    isCanonicalMatch,
    metaRobots: domData.metaRobots,
    isNoindex,
    isNofollow,
    ogTitle: domData.ogTitle,
    ogDescription: domData.ogDescription,
    ogImage: domData.ogImage,
    ogUrl: domData.ogUrl,
    ogType: domData.ogType,
    twitterCard: domData.twitterCard,
    twitterTitle: domData.twitterTitle,
    twitterDescription: domData.twitterDescription,
    twitterImage: domData.twitterImage,
    h1Count: domData.h1Count,
    h1Texts: domData.h1Texts,
    headings: domData.headings,
    wordCount: domData.wordCount,
    contentFingerprint,
    studentKeywordsFound,
    images: domData.images,
    links: domData.links,
    structuredData: domData.structuredData,
    performance: {
      domContentLoadedMs: loadTimingMs,
      loadEventMs: loadTimingMs,
      totalRequests,
      totalJsRequests,
      totalCssRequests,
      totalImageRequests,
      slowRequests,
      failedRequests,
    },
    mobile: {
      hasHorizontalOverflow: domData.hasHorizontalOverflow,
      scrollWidth: domData.scrollWidth,
      clientWidth: domData.clientWidth,
      isH1Visible: domData.isH1Visible,
      viewportMeta: domData.viewportMeta,
      touchTargetIssues: 0,
    },
    issues,
  };
}
