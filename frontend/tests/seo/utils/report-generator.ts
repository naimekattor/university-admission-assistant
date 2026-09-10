import fs from 'fs';
import path from 'path';
import {
  AuditReportData,
  PageAuditResult,
  DuplicateCluster,
  LinkGraphNode,
  CategoryScore,
  SeoIssue,
} from './types';

export function calculateAuditScores(
  pages: PageAuditResult[],
  duplicates: DuplicateCluster[],
  orphanPages: string[],
  robotsOk: boolean,
  sitemapOk: boolean
): {
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  categoryScores: AuditReportData['categoryScores'];
} {
  const totalPages = Math.max(pages.length, 1);

  // 1. Technical SEO (Weight: 25%)
  let techScore = 100;
  const techDeductions: string[] = [];
  const statusFailures = pages.filter((p) => p.status >= 400).length;
  if (statusFailures > 0) {
    const penalty = Math.min(statusFailures * 20, 50);
    techScore -= penalty;
    techDeductions.push(`${statusFailures} page(s) returned HTTP error status (-${penalty})`);
  }
  const missingCanonical = pages.filter((p) => !p.canonicalUrl).length;
  if (missingCanonical > 0) {
    const penalty = Math.min(Math.round((missingCanonical / totalPages) * 30), 30);
    techScore -= penalty;
    techDeductions.push(`${missingCanonical} page(s) missing canonical link (-${penalty})`);
  }
  techScore = Math.max(techScore, 0);

  // 2. Indexability (Weight: 20%)
  let indexScore = 100;
  const indexDeductions: string[] = [];
  if (!robotsOk) {
    indexScore -= 25;
    indexDeductions.push('robots.txt has configuration issues (-25)');
  }
  if (!sitemapOk) {
    indexScore -= 25;
    indexDeductions.push('sitemap.xml has validation issues (-25)');
  }
  const accidentalNoindex = pages.filter((p) => p.isNoindex).length;
  if (accidentalNoindex > 0) {
    const penalty = Math.min(accidentalNoindex * 20, 50);
    indexScore -= penalty;
    indexDeductions.push(`${accidentalNoindex} public page(s) have noindex directives (-${penalty})`);
  }
  indexScore = Math.max(indexScore, 0);

  // 3. On-Page & Content (Weight: 20%)
  let onPageScore = 100;
  const onPageDeductions: string[] = [];
  const missingTitles = pages.filter((p) => !p.title).length;
  if (missingTitles > 0) {
    const penalty = Math.min(missingTitles * 15, 30);
    onPageScore -= penalty;
    onPageDeductions.push(`${missingTitles} page(s) missing <title> tag (-${penalty})`);
  }
  const missingDescriptions = pages.filter((p) => !p.metaDescription).length;
  if (missingDescriptions > 0) {
    const penalty = Math.min(missingDescriptions * 10, 25);
    onPageScore -= penalty;
    onPageDeductions.push(`${missingDescriptions} page(s) missing meta description (-${penalty})`);
  }
  const missingH1 = pages.filter((p) => p.h1Count === 0).length;
  if (missingH1 > 0) {
    const penalty = Math.min(missingH1 * 10, 25);
    onPageScore -= penalty;
    onPageDeductions.push(`${missingH1} page(s) missing <h1> heading (-${penalty})`);
  }
  const duplicateTitles = duplicates.filter((d) => d.type === 'title').length;
  if (duplicateTitles > 0) {
    const penalty = Math.min(duplicateTitles * 5, 20);
    onPageScore -= penalty;
    onPageDeductions.push(`${duplicateTitles} cluster(s) with duplicate titles (-${penalty})`);
  }
  onPageScore = Math.max(onPageScore, 0);

  // 4. Structured Data (Weight: 10%)
  let schemaScore = 100;
  const schemaDeductions: string[] = [];
  const pagesWithoutSchema = pages.filter((p) => p.structuredData.length === 0).length;
  if (pagesWithoutSchema > 0) {
    const penalty = Math.min(Math.round((pagesWithoutSchema / totalPages) * 60), 60);
    schemaScore -= penalty;
    schemaDeductions.push(`${pagesWithoutSchema} page(s) lack schema.org structured data (-${penalty})`);
  }
  const invalidSchemas = pages.flatMap((p) => p.structuredData).filter((s) => !s.isValid).length;
  if (invalidSchemas > 0) {
    const penalty = Math.min(invalidSchemas * 20, 40);
    schemaScore -= penalty;
    schemaDeductions.push(`${invalidSchemas} invalid schema script(s) found (-${penalty})`);
  }
  schemaScore = Math.max(schemaScore, 0);

  // 5. Internal Linking (Weight: 10%)
  let linkScore = 100;
  const linkDeductions: string[] = [];
  if (orphanPages.length > 0) {
    const penalty = Math.min(orphanPages.length * 10, 40);
    linkScore -= penalty;
    linkDeductions.push(`${orphanPages.length} orphan page(s) with no inbound internal links (-${penalty})`);
  }
  const emptyLinksCount = pages.reduce((sum, p) => sum + p.links.filter((l) => l.isEmpty).length, 0);
  if (emptyLinksCount > 0) {
    const penalty = Math.min(emptyLinksCount * 2, 20);
    linkScore -= penalty;
    linkDeductions.push(`${emptyLinksCount} placeholder/empty href link(s) found (-${penalty})`);
  }
  linkScore = Math.max(linkScore, 0);

  // 6. Performance (Weight: 10%)
  let perfScore = 100;
  const perfDeductions: string[] = [];
  const slowPages = pages.filter((p) => p.timingMs > 3000).length;
  if (slowPages > 0) {
    const penalty = Math.min(slowPages * 10, 40);
    perfScore -= penalty;
    perfDeductions.push(`${slowPages} page(s) took over 3.0s to render (-${penalty})`);
  }
  perfScore = Math.max(perfScore, 0);

  // 7. Accessibility & Mobile (Weight: 5%)
  let mobileScore = 100;
  const mobileDeductions: string[] = [];
  const overflowPages = pages.filter((p) => p.mobile.hasHorizontalOverflow).length;
  if (overflowPages > 0) {
    const penalty = Math.min(overflowPages * 25, 60);
    mobileScore -= penalty;
    mobileDeductions.push(`${overflowPages} page(s) cause horizontal overflow on mobile (-${penalty})`);
  }
  const missingAltTotal = pages.reduce((sum, p) => sum + p.images.filter((i) => !i.hasAlt).length, 0);
  if (missingAltTotal > 0) {
    const penalty = Math.min(missingAltTotal * 5, 30);
    mobileScore -= penalty;
    mobileDeductions.push(`${missingAltTotal} image(s) missing alt attribute (-${penalty})`);
  }
  mobileScore = Math.max(mobileScore, 0);

  // Overall Weighted Score
  const overallScore = Math.round(
    techScore * 0.25 +
    indexScore * 0.20 +
    onPageScore * 0.20 +
    schemaScore * 0.10 +
    linkScore * 0.10 +
    perfScore * 0.10 +
    mobileScore * 0.05
  );

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (overallScore >= 95) grade = 'A+';
  else if (overallScore >= 85) grade = 'A';
  else if (overallScore >= 75) grade = 'B';
  else if (overallScore >= 65) grade = 'C';
  else if (overallScore >= 50) grade = 'D';

  return {
    overallScore,
    grade,
    categoryScores: {
      technical: { name: 'Technical SEO', weight: 25, score: techScore, maxScore: 100, deductions: techDeductions },
      indexability: { name: 'Indexability', weight: 20, score: indexScore, maxScore: 100, deductions: indexDeductions },
      onPage: { name: 'On-Page & Content', weight: 20, score: onPageScore, maxScore: 100, deductions: onPageDeductions },
      structuredData: { name: 'Structured Data', weight: 10, score: schemaScore, maxScore: 100, deductions: schemaDeductions },
      internalLinking: { name: 'Internal Linking', weight: 10, score: linkScore, maxScore: 100, deductions: linkDeductions },
      performance: { name: 'Performance Signals', weight: 10, score: perfScore, maxScore: 100, deductions: perfDeductions },
      accessibility: { name: 'Accessibility & Mobile', weight: 5, score: mobileScore, maxScore: 100, deductions: mobileDeductions },
    },
  };
}

export function generateHtmlReport(data: AuditReportData): string {
  const getBadgeClass = (sev: string) => {
    switch (sev) {
      case 'critical': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 border-emerald-500';
    if (score >= 75) return 'text-blue-600 border-blue-500';
    if (score >= 60) return 'text-amber-600 border-amber-500';
    return 'text-rose-600 border-rose-500';
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EduGuide Technical SEO Audit Report — ${data.targetBaseUrl}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
    code, pre { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen">
  <!-- Top Navigation Bar -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-[#FF5500] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
          EG
        </div>
        <div>
          <h1 class="font-extrabold text-base text-slate-900 tracking-tight">EduGuide SEO Audit Engine</h1>
          <p class="text-[11px] text-slate-500">Bangladeshi University Admission Platform</p>
        </div>
      </div>
      <div class="flex items-center gap-3 text-xs">
        <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">Target: ${data.targetBaseUrl}</span>
        <span class="px-2.5 py-1 rounded-full bg-orange-50 text-[#FF5500] font-semibold">${new Date(data.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Hero Scorecard -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8">
      <div class="space-y-3 text-center lg:text-left max-w-xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <span>● Playwright Production Audit</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          EduGuide Technical SEO Audit Score
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Comprehensive search performance assessment across ${data.totalPagesAudited} discovered public routes, analyzing indexability, meta tags, schema markup, and organic search intent for Bangladeshi admission candidates.
        </p>
      </div>

      <!-- Score Rings & Stats -->
      <div class="flex items-center gap-8 shrink-0">
        <div class="text-center">
          <div class="w-28 h-28 rounded-full border-8 ${getScoreColor(data.overallScore)} flex flex-col items-center justify-center shadow-xs">
            <span class="text-3xl font-black">${data.overallScore}</span>
            <span class="text-[10px] uppercase font-bold text-slate-400">/ 100</span>
          </div>
          <span class="inline-block mt-2 font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">Grade ${data.grade}</span>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs">
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
            <div class="text-xl font-bold text-slate-900">${data.totalPagesAudited}</div>
            <div class="text-[11px] text-slate-500">Pages Audited</div>
          </div>
          <div class="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-center">
            <div class="text-xl font-bold text-rose-600">${data.issueCounts.critical}</div>
            <div class="text-[11px] text-rose-700 font-medium">Critical Issues</div>
          </div>
          <div class="bg-orange-50 border border-orange-200 rounded-2xl p-3 text-center">
            <div class="text-xl font-bold text-orange-600">${data.issueCounts.high}</div>
            <div class="text-[11px] text-orange-700 font-medium">High Priority</div>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-center">
            <div class="text-xl font-bold text-blue-600">${data.issueCounts.quickWins}</div>
            <div class="text-[11px] text-blue-700 font-medium">Quick Wins</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Breakdown Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      ${Object.values(data.categoryScores).map((cat) => `
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">${cat.name}</span>
            <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100">${cat.weight}% wt</span>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-black ${cat.score >= 80 ? 'text-emerald-600' : cat.score >= 60 ? 'text-amber-600' : 'text-rose-600'}">${cat.score}</span>
            <span class="text-xs text-slate-400">/ 100</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div class="h-full rounded-full ${cat.score >= 80 ? 'bg-emerald-500' : cat.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}" style="width: ${cat.score}%"></div>
          </div>
          ${cat.deductions.length > 0 ? `
            <div class="text-[11px] text-slate-500 space-y-1 pt-1">
              ${cat.deductions.slice(0, 2).map((d) => `<p class="truncate text-rose-600">⚠ ${d}</p>`).join('')}
            </div>
          ` : `<p class="text-[11px] text-emerald-600 font-medium">✓ No major issues detected</p>`}
        </div>
      `).join('')}
    </div>

    <!-- Actionable Issues Section -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 class="text-xl font-bold text-slate-900 tracking-tight">Audit Findings & Prioritized Actions</h3>
          <p class="text-xs text-slate-500">Every issue flagged with specific file, URL, and remediation steps</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-mono text-slate-500">${data.issues.length} total issue(s)</span>
        </div>
      </div>

      <div class="space-y-3">
        ${data.issues.map((issue) => `
          <div class="border border-slate-200/80 rounded-2xl p-4 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-bold px-2 py-0.5 rounded-md uppercase border ${getBadgeClass(issue.severity)} font-mono">
                  ${issue.severity}
                </span>
                <span class="text-xs font-bold text-slate-800">${issue.title}</span>
              </div>
              <span class="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 truncate max-w-xs">
                ${new URL(issue.url).pathname}
              </span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">${issue.description}</p>
            <div class="text-xs text-emerald-800 bg-emerald-50/70 border border-emerald-200 rounded-lg p-2.5 font-medium">
              💡 <strong>Action:</strong> ${issue.recommendation}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Audited Pages Inventory Table -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      <div class="border-b border-slate-100 pb-4">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Audited Public Routes Inventory</h3>
        <p class="text-xs text-slate-500">Technical crawl details across every indexable URL</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50 text-slate-600">
              <th class="py-3 px-3 font-bold">Route</th>
              <th class="py-3 px-3 font-bold">HTTP</th>
              <th class="py-3 px-3 font-bold">Title</th>
              <th class="py-3 px-3 font-bold">H1 Tag</th>
              <th class="py-3 px-3 font-bold">Canonical</th>
              <th class="py-3 px-3 font-bold">Schema</th>
              <th class="py-3 px-3 font-bold">Speed</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${data.pages.map((page) => `
              <tr class="hover:bg-slate-50/70 transition">
                <td class="py-3 px-3 font-mono font-medium text-slate-900">
                  <a href="${page.url}" target="_blank" class="hover:text-[#FF5500] hover:underline">${page.path}</a>
                </td>
                <td class="py-3 px-3">
                  <span class="font-mono font-bold px-1.5 py-0.5 rounded ${page.status === 200 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                    ${page.status}
                  </span>
                </td>
                <td class="py-3 px-3 max-w-xs truncate text-slate-700" title="${page.title || 'None'}">
                  ${page.title || '<span class="text-rose-500">Missing</span>'}
                </td>
                <td class="py-3 px-3 max-w-xs truncate text-slate-700" title="${page.h1Texts[0] || 'None'}">
                  ${page.h1Texts[0] || '<span class="text-rose-500">None</span>'}
                </td>
                <td class="py-3 px-3 font-mono text-[11px] ${page.isCanonicalMatch ? 'text-emerald-700' : 'text-amber-600'}">
                  ${page.canonicalUrl ? '✓ Set' : '✗ Missing'}
                </td>
                <td class="py-3 px-3 text-[11px]">
                  ${page.structuredData.length > 0 ? `<span class="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold border border-purple-200">${page.structuredData[0].type}</span>` : '<span class="text-slate-400">None</span>'}
                </td>
                <td class="py-3 px-3 font-mono text-slate-600">
                  ${page.timingMs}ms
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Strategic SEO Playbook for Bangladeshi Admission Aspirants -->
    <div class="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
      <div class="border-b border-slate-800 pb-4">
        <span class="text-xs font-mono font-bold text-[#FF5500] uppercase tracking-wider">Topical Authority & Market Strategy</span>
        <h3 class="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
          EduGuide Organic Growth Blueprint (Bangladeshi Student Market)
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
        <div class="space-y-2 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
          <h4 class="font-bold text-white text-sm">🎯 High-Intent Keywords</h4>
          <ul class="space-y-1 text-slate-400 list-disc list-inside leading-relaxed">
            ${data.strategicRecommendations.bangladeshiStudentSearchIntent.map((k) => `<li>${k}</li>`).join('')}
          </ul>
        </div>

        <div class="space-y-2 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
          <h4 class="font-bold text-white text-sm">🏛️ University Hub Hierarchy</h4>
          <ul class="space-y-1 text-slate-400 list-disc list-inside leading-relaxed">
            ${data.strategicRecommendations.universityHubs.map((h) => `<li>${h}</li>`).join('')}
          </ul>
        </div>

        <div class="space-y-2 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
          <h4 class="font-bold text-white text-sm">⚡ Admission-Year URL Architecture</h4>
          <ul class="space-y-1 text-slate-400 list-disc list-inside leading-relaxed">
            ${data.strategicRecommendations.admissionYearStrategy.map((s) => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  </main>
</body>
</html>`;
}

export function saveAuditReports(data: AuditReportData, outDir: string): {
  jsonPath: string;
  mdPath: string;
  htmlPath: string;
} {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. JSON Report
  const jsonPath = path.join(outDir, 'report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');

  // 2. Markdown Report
  const mdPath = path.join(outDir, 'report.md');
  const mdContent = `# EduGuide Technical SEO Audit Report

- **Target Base URL**: \`${data.targetBaseUrl}\`
- **Audit Date**: \`${data.timestamp}\`
- **Total Public Pages Audited**: \`${data.totalPagesAudited}\`
- **Overall Technical SEO Audit Score**: **${data.overallScore}/100** (Grade: **${data.grade}**)

---

## Category Scores

| Category | Score | Weight | Status |
| :--- | :--- | :--- | :--- |
| **Technical SEO** | **${data.categoryScores.technical.score}/100** | 25% | ${data.categoryScores.technical.score >= 80 ? '✅ Pass' : '⚠️ Attention'} |
| **Indexability** | **${data.categoryScores.indexability.score}/100** | 20% | ${data.categoryScores.indexability.score >= 80 ? '✅ Pass' : '⚠️ Attention'} |
| **On-Page & Content** | **${data.categoryScores.onPage.score}/100** | 20% | ${data.categoryScores.onPage.score >= 80 ? '✅ Pass' : '⚠️ Attention'} |
| **Structured Data** | **${data.categoryScores.structuredData.score}/100** | 10% | ${data.categoryScores.structuredData.score >= 80 ? '✅ Pass' : '⚠️ Attention'} |
| **Internal Linking** | **${data.categoryScores.internalLinking.score}/100** | 10% | ${data.categoryScores.internalLinking.score >= 80 ? '✅ Pass' : '⚠️ Attention'} |
| **Performance Signals** | **${data.categoryScores.performance.score}/100** | 10% | ${data.categoryScores.performance.score >= 80 ? '✅ Pass' : '⚠️ Attention'} |
| **Accessibility & Mobile** | **${data.categoryScores.accessibility.score}/100** | 5% | ${data.categoryScores.accessibility.score >= 80 ? '✅ Pass' : '⚠️ Attention'} |

---

## Prioritized Issues (${data.issues.length})

${data.issues.map((i) => `
### [${i.severity.toUpperCase()}] ${i.title}
- **URL**: \`${i.url}\`
- **Category**: \`${i.category}\`
- **Description**: ${i.description}
- **Action Required**: ${i.recommendation}
`).join('\n')}

---

## Audited Pages (${data.pages.length})

| Path | Status | Title | Canonical | Schema | Speed |
| :--- | :--- | :--- | :--- | :--- | :--- |
${data.pages.map((p) => `| \`${p.path}\` | \`${p.status}\` | ${p.title || '*Missing*'} | ${p.canonicalUrl ? '✓' : '✗'} | ${p.structuredData[0]?.type || 'None'} | ${p.timingMs}ms |`).join('\n')}
`;
  fs.writeFileSync(mdPath, mdContent, 'utf-8');

  // 3. HTML Report
  const htmlPath = path.join(outDir, 'index.html');
  const htmlContent = generateHtmlReport(data);
  fs.writeFileSync(htmlPath, htmlContent, 'utf-8');

  return { jsonPath, mdPath, htmlPath };
}
