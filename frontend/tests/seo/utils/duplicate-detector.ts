import { PageAuditResult, DuplicateCluster } from './types';

export function detectDuplicates(pages: PageAuditResult[]): DuplicateCluster[] {
  const clusters: DuplicateCluster[] = [];

  // 1. Group by Title
  const titleMap = new Map<string, string[]>();
  for (const page of pages) {
    if (!page.title) continue;
    const cleanTitle = page.title.trim().toLowerCase();
    const list = titleMap.get(cleanTitle) || [];
    list.push(page.url);
    titleMap.set(cleanTitle, list);
  }

  for (const [title, urls] of titleMap.entries()) {
    if (urls.length > 1) {
      clusters.push({
        type: 'title',
        value: title,
        urls,
      });
    }
  }

  // 2. Group by Meta Description
  const descMap = new Map<string, string[]>();
  for (const page of pages) {
    if (!page.metaDescription) continue;
    const cleanDesc = page.metaDescription.trim().toLowerCase();
    const list = descMap.get(cleanDesc) || [];
    list.push(page.url);
    descMap.set(cleanDesc, list);
  }

  for (const [desc, urls] of descMap.entries()) {
    if (urls.length > 1) {
      clusters.push({
        type: 'description',
        value: desc,
        urls,
      });
    }
  }

  // 3. Group by H1 Heading
  const h1Map = new Map<string, string[]>();
  for (const page of pages) {
    if (page.h1Texts.length === 0) continue;
    const primaryH1 = page.h1Texts[0].trim().toLowerCase();
    const list = h1Map.get(primaryH1) || [];
    list.push(page.url);
    h1Map.set(primaryH1, list);
  }

  for (const [h1, urls] of h1Map.entries()) {
    if (urls.length > 1) {
      clusters.push({
        type: 'h1',
        value: h1,
        urls,
      });
    }
  }

  return clusters;
}
