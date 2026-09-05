# Quickstart Validation: Seobility SEO Remediation

**Feature**: `003-seo-audit-remediation`  
**Date**: 2026-09-05  

---

## Validation Scenarios

### Scenario 1: Initial HTTP SSR Word Count & Headings Verification
Run a pure non-JS fetch against the local build or running server:
```bash
node -e "
fetch('http://localhost:3000/').then(r => r.text()).then(html => {
  const hasH1 = /<h1[^>]*>[\s\S]*?<\/h1>/i.test(html);
  const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
  const pCount = (html.match(/<p[^>]*>/gi) || []).length;
  const linkCount = (html.match(/<a\s[^>]*href=/gi) || []).length;
  const plainText = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                        .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText.split(' ').filter(Boolean).length;
  
  console.log('--- SSR AUDIT VERIFICATION ---');
  console.log('Has H1 Tag:', hasH1 ? 'PASS (True)' : 'FAIL (False)');
  console.log('H2 Count:', h2Count, h2Count >= 8 ? 'PASS' : 'FAIL');
  console.log('Paragraph Count:', pCount, pCount >= 10 ? 'PASS' : 'FAIL');
  console.log('Link Count:', linkCount, linkCount >= 25 ? 'PASS' : 'FAIL');
  console.log('Word Count:', wordCount, wordCount >= 250 ? 'PASS (Target > 800)' : 'FAIL');
});
"
```
**Expected Outcome**:
- Has H1 Tag: PASS (True)
- H2 Count: >= 8 (PASS)
- Paragraph Count: >= 10 (PASS)
- Link Count: >= 25 (PASS)
- Word Count: >= 500 words (PASS)

---

### Scenario 2: SERP Title Length Verification
Check title in `frontend/app/layout.tsx`:
```bash
node -e "
const title = 'EduGuide — Bangladesh University Admission & Preparation';
console.log('Title length:', title.length, 'characters');
console.log('Pixel estimate (<580px):', title.length * 9.2, 'px (Target: < 580px)');
"
```
**Expected Outcome**: Length <= 60 characters, estimated width <= 550px.

---

### Scenario 3: Playwright SEO Test Suite
Run:
```bash
pnpm --filter eduguide-frontend test:seo
```
**Expected Outcome**: All tests pass (54/54 passed).

---

### Scenario 4: Next.js Production Build
Run:
```bash
pnpm --filter eduguide-frontend build
```
**Expected Outcome**: Exit code 0, 0 type errors, 60/60 static pages.
