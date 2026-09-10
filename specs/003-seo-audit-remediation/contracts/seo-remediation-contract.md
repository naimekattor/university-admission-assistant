# API & Interface Contracts: SEO Remediation

**Feature**: `003-seo-audit-remediation`  
**Date**: 2026-09-05  

---

## 1. Homepage SSR / Client Boundary Contract

```typescript
// frontend/app/page.tsx (Server Component Entry Point)
export default async function HomepagePage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const isPreview = searchParams.preview === 'true';

  // Server-rendered initial configuration
  const initialConfig = DEFAULT_HOMEPAGE_CONFIG;

  return (
    <HomepageView initialConfig={initialConfig} isPreview={isPreview} />
  );
}
```

### Invariant Guarantees:
1. When any crawler or browser issues `GET /`, the complete DOM tree with `<h1>`, `<h2>`, `<p>`, and internal links is emitted directly in the initial HTTP stream.
2. No blank fallback div is rendered on the server.
3. Client-side state hydration takes place on the client without hydration mismatch.

---

## 2. SERP Title & Metadata Contract

```typescript
// frontend/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'EduGuide — Bangladesh University Admission & Preparation', // 56 chars (<580px)
    template: '%s | EduGuide',
  },
  description:
    'Official Bangladesh university admission circulars, GPA eligibility qualifier, deadlines, and smart preparation for BUET, DU, Medical, and GST 2026.',
  // ...
};
```
