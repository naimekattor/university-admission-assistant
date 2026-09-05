# Data Model & Schema: SEO Remediation & SSR Structure

**Feature**: `003-seo-audit-remediation`  
**Date**: 2026-09-05  

---

## 1. Metadata Schema Configuration

```typescript
export interface SiteSeoMetadata {
  title: string;           // Max 60 chars (<= 580px width)
  description: string;     // 140-160 chars (approx 900-950px width)
  canonical: string;       // Strict canonical URL
  keywords: string[];      // Core admission keywords
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
      type: string;
    }>;
  };
}
```

## 2. Server-Side Pre-Rendered Content Contract

To guarantee that non-JS crawlers receive >800 words and full heading structures, the SSR layout contract specifies:

| Component | Semantic Tag | Minimum Words | Target Keywords |
| :--- | :--- | :--- | :--- |
| `HeroSection` | `<header>`, `<h1>`, `<p>` | ~120 words | Bangladesh University Admission, Circulars, Eligibility |
| `AdmissionAtGlance` | `<section>`, `<h2>`, `<table>` | ~150 words | Engineering, Medical, GST, General Public Units |
| `FeaturedUniversities` | `<section>`, `<h2>`, `<article>` | ~200 words | BUET, DU, RUET, CUET, SUST, IBA, DMC |
| `EligibilityChecker` | `<section>`, `<h2>`, `<form>` | ~80 words | SSC GPA, HSC GPA, Criteria Calculator |
| `GuidesSection` | `<section>`, `<h2>`, `<article>` | ~120 words | Preparation Guidelines, Syllabus, Question Bank |
| `FaqSection` | `<section>`, `<h2>`, `<dl>` | ~200 words | Negative marking, quota, second-timer policy |
| `FooterSection` | `<footer>`, `<h4>`, `<ul>`, `<nav>` | ~100 words | Official university resources, UGC accreditation |
