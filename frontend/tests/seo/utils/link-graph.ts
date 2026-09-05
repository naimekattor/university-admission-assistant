import { PageAuditResult, LinkGraphNode } from './types';
import { normalizeUrl } from './crawler';

export function buildLinkGraph(pages: PageAuditResult[], baseUrl: string): {
  graph: Record<string, LinkGraphNode>;
  orphanPages: string[];
} {
  const graph: Record<string, LinkGraphNode> = {};
  const pageUrls = new Set(pages.map((p) => p.url));

  // Initialize nodes
  for (const page of pages) {
    graph[page.url] = {
      url: page.url,
      inboundLinks: [],
      outboundLinks: [],
      inDegree: 0,
      outDegree: 0,
      isOrphan: false,
      depth: page.url === baseUrl || page.path === '/' ? 0 : 1,
    };
  }

  // Populate edges
  for (const page of pages) {
    const currentNode = graph[page.url];
    if (!currentNode) continue;

    const seenOutbound = new Set<string>();

    for (const link of page.links) {
      if (!link.isInternal || link.isHashOnly || link.isJavascript || link.isEmpty) continue;

      const normalized = normalizeUrl(link.href, baseUrl);
      if (!normalized || !pageUrls.has(normalized)) continue;
      if (normalized === page.url) continue; // Ignore self-links

      if (!seenOutbound.has(normalized)) {
        seenOutbound.add(normalized);
        currentNode.outboundLinks.push(normalized);

        const targetNode = graph[normalized];
        if (targetNode && !targetNode.inboundLinks.includes(page.url)) {
          targetNode.inboundLinks.push(page.url);
        }
      }
    }
  }

  // Calculate degrees and orphan status
  const orphanPages: string[] = [];

  for (const [url, node] of Object.entries(graph)) {
    node.inDegree = node.inboundLinks.length;
    node.outDegree = node.outboundLinks.length;

    // Homepage is not an orphan even with 0 in-links
    const isHome = node.url === baseUrl || new URL(url).pathname === '/';
    if (node.inDegree === 0 && !isHome) {
      node.isOrphan = true;
      orphanPages.push(url);
    }
  }

  return { graph, orphanPages };
}
