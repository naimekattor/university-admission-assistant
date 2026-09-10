# Research: Seobility SEO Remediation & SSR Architecture

**Feature**: `003-seo-audit-remediation`  
**Date**: 2026-09-05  

---

## 1. Technical Investigations & Findings

### Finding 1: Why Seobility Reported 0 Headings and 20 Words
- **Observation**:
  In Seobility's crawl of `https://university-admission-assistant.vercel.app/`, the HTML document size was 23.2 kB with a word count of only 20, 0 `<h1>`, 0 headings, 0 paragraphs, and only 9 links.
- **Root Cause**:
  `frontend/app/page.tsx` was marked `'use client'` and its root export was:
  ```tsx
  export default function DynamicHomepage() {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5]" />}>
        <HomepageInner />
      </Suspense>
    );
  }
  ```
  Inside `HomepageInner`, `useSearchParams()` was called to check `?preview=true`. In Next.js App Router, wrapping a client component that calls `useSearchParams()` inside `<Suspense>` causes Next.js to render only the `fallback` (`<div className="min-h-screen bg-[#FAF8F5]" />`) during static HTML export and SSR for bots that don't execute client JS.
- **Remediation**:
  The default homepage content should be rendered during SSR. We can provide `DEFAULT_HOMEPAGE_CONFIG` directly to the server-rendered components so the initial HTML contains the full hero, `<h1>`, all `<h2>` section headings, `<p>` paragraphs, and 40+ internal links. Preview query handling can be isolated without blanking out the SSR payload.

---

### Finding 2: SERP Snippet Title Pixel Width
- **Observation**:
  Seobility flagged:
  *The page title should be shorter than 580 pixels. It is 655 pixels long.*
  Current title: `EduGuide — Bangladesh University Admission Intelligence & Preparation` (70 characters).
- **Target**:
  Google and Seobility desktop SERP snippet maximum width is ~580px (~55-60 Latin characters).
- **Proposed Title**:
  `EduGuide — Bangladesh University Admission & Preparation`
  - Character count: 56 characters
  - Approximate pixel width: ~515px (well below the 580px threshold)
  - Keyword density: Retains "EduGuide", "Bangladesh", "University Admission", and "Preparation".

---

### Finding 3: Link Graph (Internal & External)
- **Observation**:
  Seobility reported:
  *There are too few (9) internal links on this page.* (Only navbar links were in SSR HTML).
  *There are no external links on this page.*
- **Remediation**:
  1. Once full SSR is enabled, all homepage cards, university links, circular links, and footer links (40+ links) will be present in the raw HTML.
  2. Add external links with `rel="noopener noreferrer"` to official university portals (e.g. BUET official site `buet.ac.bd`, DU official site `du.ac.bd`, Medical DGHS `dghs.gov.bd`, UGC Bangladesh `ugc.gov.bd`) in the university directory preview and footer resources.

---

### Finding 4: Social Sharing Integration
- **Observation**:
  Seobility warned: *There are few social sharing options on the page.*
  Sharing tools improve viral discovery and social authority signals.
- **Remediation**:
  Introduce a lightweight social share trigger bar (WhatsApp, Facebook, LinkedIn, X/Twitter, Copy Link) on key admission circular and guide cards.
