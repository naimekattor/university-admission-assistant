# Feature Specification: Seobility Technical SEO Audit Remediation

**Feature Branch**: `003-seo-audit-remediation`  
**Created**: 2026-09-05  
**Status**: Ready for Planning  
**Input**: Seobility SEO audit of `https://university-admission-assistant.vercel.app/` reporting:
- 2 Critical Errors: Missing `<h1>` heading, missing headings across page
- Low Word Count (20 words detected by HTTP crawler vs 250+ recommended)
- 0 Paragraphs detected in raw HTML response
- Meta title length warning (655px vs 580px recommended limit)
- Too few internal links (9 detected) and 0 external links

---

## 1. Root Cause Identification

1. **Client-Side Suspense Boundary Bailing SSR Content**:
   In `frontend/app/page.tsx`, the entire page is wrapped inside `<Suspense fallback={<div className="min-h-screen bg-[#FAF8F5]" />}>` because `HomepageInner` invokes `useSearchParams()` for CMS preview logic.
   During production static generation and non-JS HTTP crawler fetching (e.g. Seobility, social bots, search engine initial indexing passes), the server serves the blank fallback div with only the `<Navbar>` and `<FloatingAiChat>` from `layout.tsx`.
   **Outcome**: Crawlers see 23.2 kB of HTML with only 20 words, zero `<h1>`, zero `<h2>`, zero `<p>` tags, and only the 9 navbar links.

2. **Meta Title Pixel Width**:
   Current title: `EduGuide — Bangladesh University Admission Intelligence & Preparation` (70 chars, 655px).
   Search engine SERP snippet limit is 580px (typically ~55-60 characters).

3. **Link Graph Visibility**:
   Because only the navbar links were in the static HTML response, search bots only saw 9 internal links. Once the full homepage content is pre-rendered in SSR, 40+ internal links will be immediately crawlable.

---

## 2. User Scenarios & Testing *(mandatory)*

### User Story 1 - Full Server-Side Rendered HTML with Rich Content & Headings (Priority: P1)

As a search engine crawler (Googlebot, Bingbot, Seobility) or a prospective student on a slow connection, I want the homepage HTML response to immediately contain the full hero, headings, paragraphs, and admission content (>800 words) without requiring client-side JavaScript hydration.

**Why this priority**: Eliminates both critical Seobility errors ("Add a H1 heading", "Use good headings on the page") and resolves the "only 20 words on this page" / "no paragraphs detected" failures.

**Independent Test**: Perform a plain HTTP GET request (`curl -s https://university-admission-assistant.vercel.app/` or node `fetch`) without JavaScript execution. Verify:
- Contains a single semantic `<h1>` tag with targeted admission keywords.
- Contains at least 10 semantic `<h2>` section headings.
- Contains at least 250 (target: >800) words of crawlable text in `<p>` and descriptive text elements.
- Initial HTML file size contains full layout structure.

**Acceptance Scenarios**:
1. **Given** an HTTP crawler requests `/`, **When** the server responds, **Then** the response body contains full semantic HTML (`<h1>`, `<h2>`, `<p>`, `<ul>`, `<a>`) containing EduGuide's admission circulars, guides, deadlines, and features.
2. **Given** CMS preview mode (`?preview=true`), **When** an admin views the page, **Then** client-side search parameter evaluation updates the page dynamically without sacrificing SSR for standard non-preview visitors.

---

### User Story 2 - SERP Title Optimization & Keyword Alignment (Priority: P1)

As an SEO specialist, I want the page title to be within the 580-pixel SERP display limit (<60 characters) while maintaining high click-through appeal and exact target keywords.

**Why this priority**: Eliminates Seobility's "Title should be shorter than 580 pixels" and "Make page title match content more closely" warnings.

**Independent Test**: Inspect `<title>` in `frontend/app/layout.tsx`. Verify length is <= 60 characters / <= 580 pixels (e.g. `EduGuide — Bangladesh University Admission & Preparation`).

**Acceptance Scenarios**:
1. **Given** any SERP snippet preview, **When** evaluated against a 580px boundary, **Then** the title renders without truncation ellipsis (`...`).
2. **Given** target admission keywords ("University Admission", "Circulars", "Preparation"), **Then** the title directly matches the prominent `<h1>` headline on the page.

---

### User Story 3 - Rich Internal & External Link Graph (Priority: P2)

As a search bot crawling the site, I want to discover a diverse graph of internal links (university profiles, guides, circulars, eligibility, mock tests) and verified external links (official university portals) directly in the initial HTML.

**Why this priority**: Resolves Seobility warnings "There are too few (9) internal links" and "There are no external links on this page".

**Independent Test**: Count internal and external `<a>` tags in the initial SSR HTML of the homepage. Confirm >= 25 internal links and at least 1 verified external link (e.g. official university admission portal links or academic accreditation links with `rel="noopener noreferrer"`).

**Acceptance Scenarios**:
1. **Given** the SSR rendered homepage, **When** parsed for `<a href="...">`, **Then** at least 30 valid internal links are found across university directory pages, preparation tools, and guides.
2. **Given** university cards or circular badges, **When** external official portal links are rendered, **Then** they use `target="_blank"` and `rel="noopener noreferrer"`.

---

### User Story 4 - Social Sharing Actions (Priority: P3)

As a student finding an important admission deadline or circular, I want quick social sharing options (Facebook, WhatsApp, Twitter/X, Copy Link) so I can share information with study groups.

**Why this priority**: Resolves Seobility's "There are few social sharing options on the page" warning and boosts viral student acquisition.

**Independent Test**: Verify social sharing buttons exist on the homepage (or circular/guide sections) with valid web share or direct intent links.
