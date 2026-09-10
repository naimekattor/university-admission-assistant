export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface SeoIssue {
  id: string;
  url: string;
  category: 'technical' | 'indexability' | 'content' | 'structured-data' | 'internal-linking' | 'performance' | 'mobile' | 'accessibility';
  severity: IssueSeverity;
  title: string;
  description: string;
  recommendation: string;
}

export interface HeadingItem {
  level: number;
  text: string;
}

export interface ImageAuditItem {
  src: string;
  alt: string | null;
  hasAlt: boolean;
  isDescriptiveAlt: boolean;
  width?: number;
  height?: number;
  loading?: string;
  isNextImage: boolean;
}

export interface LinkAuditItem {
  href: string;
  text: string;
  isInternal: boolean;
  isHashOnly: boolean;
  isJavascript: boolean;
  isEmpty: boolean;
}

export interface StructuredDataItem {
  type: string;
  context: string;
  raw: any;
  isValid: boolean;
  errors?: string[];
}

export interface PerformanceMetrics {
  domContentLoadedMs: number;
  loadEventMs: number;
  totalRequests: number;
  totalJsRequests: number;
  totalCssRequests: number;
  totalImageRequests: number;
  totalTransferredBytes?: number;
  slowRequests: Array<{ url: string; durationMs: number }>;
  failedRequests: Array<{ url: string; status: number | string }>;
}

export interface MobileUsabilityMetrics {
  hasHorizontalOverflow: boolean;
  scrollWidth: number;
  clientWidth: number;
  isH1Visible: boolean;
  viewportMeta: string | null;
  touchTargetIssues: number;
}

export interface PageAuditResult {
  url: string;
  path: string;
  status: number;
  statusText: string;
  contentType: string;
  redirectUrl?: string;
  timingMs: number;

  // Metadata
  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  canonicalUrl: string | null;
  isCanonicalMatch: boolean;
  metaRobots: string | null;
  isNoindex: boolean;
  isNofollow: boolean;

  // OpenGraph & Twitter
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogUrl: string | null;
  ogType: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;

  // Content & Headings
  h1Count: number;
  h1Texts: string[];
  headings: HeadingItem[];
  wordCount: number;
  contentFingerprint: string;
  studentKeywordsFound: string[];

  // Resources & Signals
  images: ImageAuditItem[];
  links: LinkAuditItem[];
  structuredData: StructuredDataItem[];
  performance: PerformanceMetrics;
  mobile: MobileUsabilityMetrics;

  // Page Specific Issues
  issues: SeoIssue[];
}

export interface LinkGraphNode {
  url: string;
  inboundLinks: string[];
  outboundLinks: string[];
  inDegree: number;
  outDegree: number;
  isOrphan: boolean;
  depth: number;
}

export interface DuplicateCluster {
  type: 'title' | 'description' | 'h1' | 'content';
  value: string;
  urls: string[];
}

export interface CategoryScore {
  name: string;
  weight: number;
  score: number;
  maxScore: number;
  deductions: string[];
}

export interface AuditReportData {
  timestamp: string;
  targetBaseUrl: string;
  totalPagesAudited: number;
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  categoryScores: {
    technical: CategoryScore;
    indexability: CategoryScore;
    onPage: CategoryScore;
    structuredData: CategoryScore;
    internalLinking: CategoryScore;
    performance: CategoryScore;
    accessibility: CategoryScore;
  };
  issueCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    quickWins: number;
  };
  issues: SeoIssue[];
  pages: PageAuditResult[];
  duplicates: DuplicateCluster[];
  linkGraph: Record<string, LinkGraphNode>;
  orphanPages: string[];
  sitemapComparison: {
    sitemapUrl: string;
    totalSitemapUrls: number;
    sitemapUrlsNotInCrawl: string[];
    crawledUrlsNotInSitemap: string[];
  };
  robotsTxtAnalysis: {
    robotsUrl: string;
    accessible: boolean;
    hasSitemap: boolean;
    disallowedPaths: string[];
    allowedPaths: string[];
    criticalRulesOk: boolean;
    issues: string[];
  };
  strategicRecommendations: {
    bangladeshiStudentSearchIntent: string[];
    universityHubs: string[];
    admissionYearStrategy: string[];
    internalLinkingPlan: string[];
    schemaPlan: string[];
    performancePlan: string[];
  };
}
