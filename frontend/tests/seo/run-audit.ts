import { chromium } from '@playwright/test';
import path from 'path';
import { crawlPublicRoutes } from './utils/crawler';
import { buildLinkGraph } from './utils/link-graph';
import { detectDuplicates } from './utils/duplicate-detector';
import { calculateAuditScores, saveAuditReports } from './utils/report-generator';
import { AuditReportData, SeoIssue } from './utils/types';

async function runAudit() {
  const rawBase = process.env.BASE_URL || 'https://university-admission-assistant.vercel.app';
  const baseUrl = rawBase.replace(/\/+$/, '');
  const maxPages = parseInt(process.env.SEO_MAX_PAGES || '35', 10);

  console.log(`=======================================================`);
  console.log(`🚀 Starting EduGuide Automated Technical SEO Audit`);
  console.log(`🎯 Target Base URL: ${baseUrl}`);
  console.log(`📊 Max Pages to Crawl: ${maxPages}`);
  console.log(`=======================================================\n`);

  const browser = await chromium.launch({ headless: true });

  // 1. Audit Robots.txt
  let robotsOk = true;
  const robotsIssues: string[] = [];
  let robotsText = '';
  try {
    const res = await fetch(`${baseUrl}/robots.txt`);
    if (!res.ok) {
      robotsOk = false;
      robotsIssues.push(`robots.txt returned HTTP ${res.status}`);
    } else {
      robotsText = await res.text();
      if (!robotsText.toLowerCase().includes('sitemap:')) {
        robotsIssues.push('robots.txt does not contain a Sitemap directive');
      }
      if (robotsText.includes('Disallow: /_next/')) {
        robotsOk = false;
        robotsIssues.push('CRITICAL: robots.txt disallows /_next/, blocking CSS and JavaScript chunks');
      }
    }
  } catch (err: any) {
    robotsOk = false;
    robotsIssues.push(`Failed to reach /robots.txt: ${err.message}`);
  }

  // 2. Audit Sitemap.xml
  let sitemapOk = true;
  const sitemapUrls: string[] = [];
  try {
    const sitemapUrl = `${baseUrl}/sitemap.xml`;
    const res = await fetch(sitemapUrl);
    if (!res.ok) {
      sitemapOk = false;
    } else {
      const xml = await res.text();
      const locMatches = xml.match(/<loc>(.*?)<\/loc>/g) || [];
      for (const m of locMatches) {
        sitemapUrls.push(m.replace(/<\/?loc>/g, '').trim());
      }
      if (sitemapUrls.length === 0) {
        sitemapOk = false;
      }
    }
  } catch {
    sitemapOk = false;
  }

  // 3. Crawl and audit all public pages
  console.log('[SEO Audit] Starting Playwright headless crawl...');
  const pages = await crawlPublicRoutes(browser, {
    baseUrl,
    maxPages,
    timeout: 35000,
  });

  await browser.close();

  // 4. Link Graph & Duplicates
  const { graph: linkGraph, orphanPages } = buildLinkGraph(pages, baseUrl);
  const duplicates = detectDuplicates(pages);

  // 5. Aggregate All Issues
  const allIssues: SeoIssue[] = [];
  for (const page of pages) {
    allIssues.push(...page.issues);
  }

  for (const orphan of orphanPages) {
    allIssues.push({
      id: `orphan-${orphan}`,
      url: orphan,
      category: 'internal-linking',
      severity: 'medium',
      title: 'Orphan page detected',
      description: 'This page received zero incoming links from other crawled internal pages.',
      recommendation: 'Add contextual internal links from relevant university hubs, guides, or navigation.',
    });
  }

  for (const dup of duplicates) {
    if (dup.type === 'title') {
      allIssues.push({
        id: `dup-title-${dup.value.substring(0, 20)}`,
        url: dup.urls[0],
        category: 'onPage',
        severity: 'medium',
        title: `Duplicate <title> tag shared across ${dup.urls.length} pages`,
        description: `Title: "${dup.value}" shared by: ${dup.urls.slice(0, 3).join(', ')}`,
        recommendation: 'Ensure each university and guide page generates a unique title tailored to search intent.',
      });
    }
  }

  // 6. Calculate Weighted Scores
  const { overallScore, grade, categoryScores } = calculateAuditScores(
    pages,
    duplicates,
    orphanPages,
    robotsOk,
    sitemapOk
  );

  const crawledUrls = new Set(pages.map((p) => p.url));
  const sitemapUrlsNotInCrawl = sitemapUrls.filter((u) => !crawledUrls.has(u));
  const crawledUrlsNotInSitemap = pages.map((p) => p.url).filter((u) => !sitemapUrls.includes(u));

  const reportData: AuditReportData = {
    timestamp: new Date().toISOString(),
    targetBaseUrl: baseUrl,
    totalPagesAudited: pages.length,
    overallScore,
    grade,
    categoryScores,
    issueCounts: {
      critical: allIssues.filter((i) => i.severity === 'critical').length,
      high: allIssues.filter((i) => i.severity === 'high').length,
      medium: allIssues.filter((i) => i.severity === 'medium').length,
      low: allIssues.filter((i) => i.severity === 'low').length,
      quickWins: allIssues.filter((i) => ['missing-title', 'missing-description', 'missing-h1', 'empty-href-links'].includes(i.id)).length,
    },
    issues: allIssues,
    pages,
    duplicates,
    linkGraph,
    orphanPages,
    sitemapComparison: {
      sitemapUrl: `${baseUrl}/sitemap.xml`,
      totalSitemapUrls: sitemapUrls.length,
      sitemapUrlsNotInCrawl,
      crawledUrlsNotInSitemap,
    },
    robotsTxtAnalysis: {
      robotsUrl: `${baseUrl}/robots.txt`,
      accessible: robotsOk,
      hasSitemap: Boolean(robotsText.toLowerCase().includes('sitemap:')),
      disallowedPaths: ['/admin/', '/private/'],
      allowedPaths: ['/'],
      criticalRulesOk: robotsOk,
      issues: robotsIssues,
    },
    strategicRecommendations: {
      bangladeshiStudentSearchIntent: [
        'BUET admission 2026: GPA eligibility, unit requirements, question patterns, exam date',
        'DU Ka Unit admission circular: faculty breakdown, seat distribution, negative marking rules',
        'Government Medical (MBBS) circular: combined SSC+HSC biology requirements, cut-off history',
        'GST Cluster admission: general & engineering technology universities, centralized qualification',
        'Admission Higher Math & Physics formula cheatsheets and topic-wise MCQ weightage',
      ],
      universityHubs: [
        'Hub-and-Spoke Model: /universities/[slug] should act as the authoritative hub for every public institution',
        'Direct Cross-Linking: Each university hub must link directly to official circulars (/admission) and matching preparation guides (/guides/[slug])',
        'Clear Breadcrumbs: Home → Universities → [University Name] → [Unit Details] with schema.org BreadcrumbList',
      ],
      admissionYearStrategy: [
        'Maintain dynamic evergreen URLs (/universities/buet) with dynamic admission year token (2026)',
        'For previous years, provide archived tabs (/universities/buet?year=2025) rather than fragmented duplicate URLs',
        'Ensure canonical tags resolve to the canonical institution hub without query parameters',
      ],
      internalLinkingPlan: [
        'Add contextual university mentions in all guide articles pointing to the university page',
        'Add top 5 most viewed guides in the university detail sidebar',
        'Link community questions with university tags directly to the corresponding university directory',
      ],
      schemaPlan: [
        'Inject CollegeOrUniversity on all /universities/[slug] profile pages',
        'Inject Article / BlogPosting with author and datePublished on /guides/[slug]',
        'Inject QAPage / DiscussionForumPosting on /community/questions/[slug]',
        'Include BreadcrumbList on all subpages for rich search snippets',
      ],
      performancePlan: [
        'Ensure Next.js Image component (<Image>) is used for all university logos and guide thumbnails',
        'Keep total JavaScript chunks loaded on initial mobile visit below 350KB',
        'Preload primary Bengali and Latin typography fonts (Inter, Kalpurush, Hind Siliguri) in root head',
      ],
    },
  };

  const reportDir = path.join(process.cwd(), 'seo-report');
  const { jsonPath, mdPath, htmlPath } = saveAuditReports(reportData, reportDir);

  console.log(`\n=======================================================`);
  console.log(`🏁 EduGuide SEO Audit Complete!`);
  console.log(`=======================================================`);
  console.log(`🎯 Overall Score: ${overallScore}/100 (Grade: ${grade})`);
  console.log(`📄 Total Pages Crawled: ${pages.length}`);
  console.log(`🚨 Critical Issues: ${reportData.issueCounts.critical}`);
  console.log(`⚠️  High Priority Issues: ${reportData.issueCounts.high}`);
  console.log(`⚡ Quick Wins Identified: ${reportData.issueCounts.quickWins}`);
  console.log(`-------------------------------------------------------`);
  console.log(`📁 Reports Generated:`);
  console.log(`   - JSON: ${jsonPath}`);
  console.log(`   - Markdown: ${mdPath}`);
  console.log(`   - Interactive HTML: ${htmlPath}`);
  console.log(`=======================================================\n`);
}

runAudit().catch((err) => {
  console.error('[SEO Audit] Fatal Error:', err);
  process.exit(1);
});
