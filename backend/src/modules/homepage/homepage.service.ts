import pg from 'pg';
import { ENV } from '../../config';

export interface HeroConfig {
  eyebrow: string;
  headline: string;
  subheading: string;
  primaryCtaLabel: string;
  primaryCtaAction: string;
  secondaryCtaLabel: string;
  secondaryCtaAction: string;
  trustIndicators: string[];
  enabled: boolean;
}

export interface AdmissionSectionConfig {
  title: string;
  description: string;
  selectionMode: 'automatic' | 'manual' | 'upcoming_deadline' | 'featured';
  visibleColumns: {
    university: boolean;
    application: boolean;
    testDate: boolean;
    minGpa: boolean;
    units: boolean;
    seats: boolean;
    status: boolean;
    circular: boolean;
  };
  maxDisplayCount: number;
  customRows?: any[];
  customHtmlNotice?: string;
  enabled: boolean;
}

export interface EligibilitySectionConfig {
  title: string;
  description: string;
  primaryCtaLabel: string;
  helperText: string;
  visibleFields: {
    group: boolean;
    sscGpa: boolean;
    hscGpa: boolean;
    sscYear: boolean;
    hscYear: boolean;
    preferredField: boolean;
    preferredLocation: boolean;
  };
  enabled: boolean;
}

export interface DeadlineSectionConfig {
  title: string;
  description: string;
  maxDisplayCount: number;
  eventTypesFilter: string[];
  enabled: boolean;
}

export interface FeaturedUniversitiesConfig {
  title: string;
  description: string;
  selectedUniversityIds: string[];
  enabled: boolean;
}

export interface AiAdvisorConfig {
  title: string;
  description: string;
  exampleQuestions: Array<{
    id: string;
    text: string;
    category: string;
    order: number;
    enabled: boolean;
  }>;
  ctaText: string;
  enabled: boolean;
}

export interface GuideSectionConfig {
  title: string;
  description: string;
  featuredArticleSlug?: string;
  maxDisplayCount: number;
  enabled: boolean;
}

export interface PreparationConfig {
  headline: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaUrl: string;
  enabled: boolean;
}

export interface FaqConfig {
  title: string;
  description: string;
  categories: string[];
  enabled: boolean;
}

export interface FooterConfig {
  description: string;
  navGroups: Array<{
    title: string;
    links: Array<{ label: string; url: string }>;
  }>;
  socialLinks: Array<{ platform: string; url: string }>;
  copyrightText: string;
}

export interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  robots: string;
}

export interface HomepageFullConfig {
  hero: HeroConfig;
  admissionSection: AdmissionSectionConfig;
  eligibilitySection: EligibilitySectionConfig;
  deadlineSection: DeadlineSectionConfig;
  featuredUniversities: FeaturedUniversitiesConfig;
  aiAdvisor: AiAdvisorConfig;
  guideSection: GuideSectionConfig;
  preparation: PreparationConfig;
  faq: FaqConfig;
  footer: FooterConfig;
  seo: SeoConfig;
  updatedAt?: string;
  publishedAt?: string;
  status: 'draft' | 'published';
  version: number;
}

export const DEFAULT_HOMEPAGE_CONFIG: HomepageFullConfig = {
  status: 'published',
  version: 1,
  updatedAt: new Date().toISOString(),
  publishedAt: new Date().toISOString(),
  hero: {
    eyebrow: 'UNIVERSITY ADMISSION 2026',
    headline: 'Find where you can apply.',
    subheading: 'Check university admission dates, GPA requirements, units, seats and circulars — all in one place.',
    primaryCtaLabel: 'Find My Universities',
    primaryCtaAction: '#eligibility-checker',
    secondaryCtaLabel: 'Explore Universities',
    secondaryCtaAction: '#admission-table',
    trustIndicators: [
      'Eligibility information',
      'Admission deadlines',
      'Unit requirements',
      'Official circulars',
    ],
    enabled: true,
  },
  admissionSection: {
    title: 'Admission at a Glance',
    description: 'See important admission information from leading universities without visiting multiple websites.',
    selectionMode: 'automatic',
    visibleColumns: {
      university: true,
      application: true,
      testDate: true,
      minGpa: true,
      units: true,
      seats: true,
      status: true,
      circular: true,
    },
    maxDisplayCount: 8,
    enabled: true,
  },
  eligibilitySection: {
    title: 'Find where you qualify.',
    description: 'Enter your academic information and discover universities and units you may be eligible for.',
    primaryCtaLabel: 'Find My Universities',
    helperText: 'Real-time rule evaluation based on official 2026 university admission circular criteria.',
    visibleFields: {
      group: true,
      sscGpa: true,
      hscGpa: true,
      sscYear: true,
      hscYear: true,
      preferredField: true,
      preferredLocation: true,
    },
    enabled: true,
  },
  deadlineSection: {
    title: 'Upcoming Admission Deadlines',
    description: 'Never miss an important application window, admit card release, or admission test date.',
    maxDisplayCount: 6,
    eventTypesFilter: ['application_deadline', 'exam_date', 'result_date'],
    enabled: true,
  },
  featuredUniversities: {
    title: 'Explore Universities',
    description: 'Explore top engineering, general, medical, and agricultural universities across Bangladesh.',
    selectedUniversityIds: ['buet', 'du', 'kuet', 'ruet', 'cuet', 'ju', 'dmc', 'sust'],
    enabled: true,
  },
  aiAdvisor: {
    title: 'Ask anything about university admission.',
    description: 'Confused about eligibility, units, deadlines or admission requirements? Ask EduGuide.',
    exampleQuestions: [
      { id: 'q1', text: 'Which universities are accepting applications right now?', category: 'Deadlines', order: 1, enabled: true },
      { id: 'q2', text: 'What is the BUET admission minimum GPA requirement?', category: 'Eligibility', order: 2, enabled: true },
      { id: 'q3', text: 'Which units can I apply to with SSC GPA 4.8 and HSC GPA 5.0?', category: 'Eligibility', order: 3, enabled: true },
      { id: 'q4', text: 'What are the main differences between BUET and DU Ka Unit exams?', category: 'Comparison', order: 4, enabled: true },
      { id: 'q5', text: 'When will the Medical admission test admit card be published?', category: 'Deadlines', order: 5, enabled: true },
    ],
    ctaText: 'Ask Admission Advisor',
    enabled: true,
  },
  guideSection: {
    title: 'Admission Guides',
    description: 'In-depth preparation guides, subject-wise weightage analyses, and circular breakdowns by top scorers.',
    featuredArticleSlug: 'buet-admission-guide-2026',
    maxDisplayCount: 4,
    enabled: true,
  },
  preparation: {
    headline: 'Know where to apply. Now prepare to get in.',
    description: 'Turn your target university and admission unit into a personalized preparation plan with visual lessons and chapter-wise MCQs.',
    features: [
      'Visual interactive lessons',
      'Chapter-wise MCQ practice drills',
      'Past 15 years solved admission questions',
      'Full-length timed mock tests',
      '24/7 AI Admission Tutor with step-by-step derivations',
      'Personalized mistake notebook & revision queue',
    ],
    ctaText: 'Start Preparing',
    ctaUrl: '/prepare',
    enabled: true,
  },
  faq: {
    title: 'Frequently Asked Questions',
    description: 'Quick answers to common questions regarding Bangladesh university admissions, circulars, and EduGuide.',
    categories: ['General', 'Eligibility', 'Admission', 'Preparation'],
    enabled: true,
  },
  footer: {
    description: 'EduGuide is Bangladesh’s premier data-driven university admission intelligence and preparation platform, consolidating circulars, eligibility criteria, deadlines, and smart prep in one unified place.',
    navGroups: [
      {
        title: 'Admission',
        links: [
          { label: 'Admission At A Glance', url: '/#admission-table' },
          { label: 'Eligibility Checker', url: '/eligibility' },
          { label: 'Upcoming Deadlines', url: '/#deadlines' },
          { label: 'All Universities', url: '/universities' },
          { label: 'Official Circulars', url: '/admission' },
        ],
      },
      {
        title: 'Preparation',
        links: [
          { label: 'Curriculum & Lessons', url: '/prepare' },
          { label: 'Practice MCQs', url: '/practice' },
          { label: 'Mock Test Simulator', url: '/mock-tests' },
          { label: 'AI Admission Tutor', url: '/chat' },
          { label: 'Student Dashboard', url: '/dashboard' },
        ],
      },
      {
        title: 'Knowledge',
        links: [
          { label: 'Admission Guides', url: '/guides' },
          { label: 'BUET Preparation Guide', url: '/guides/buet-admission-guide-2026' },
          { label: 'DU Ka Unit Guide', url: '/guides/du-ka-unit-guide' },
          { label: 'Medical Admission Tips', url: '/guides' },
        ],
      },
      {
        title: 'Platform',
        links: [
          { label: 'Pricing & Passes', url: '/pricing' },
          { label: 'Admin Portal', url: '/admin' },
          { label: 'Terms of Service', url: '#' },
          { label: 'Privacy Policy', url: '#' },
        ],
      },
    ],
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com/eduguidebd' },
      { platform: 'YouTube', url: 'https://youtube.com/@eduguidebd' },
      { platform: 'Telegram', url: 'https://t.me/eduguidebd' },
    ],
    copyrightText: '© 2026 EduGuide Bangladesh. All rights reserved. Official admission data sourced from university circulars.',
  },
  seo: {
    metaTitle: 'EduGuide — Bangladesh University Admission Intelligence & Preparation Platform',
    metaDescription: 'Find where you qualify for university admission 2026. Real-time circulars, application deadlines, GPA requirements, and preparation for BUET, DU, Medical, and GST.',
    ogTitle: 'EduGuide — Find where you can apply for University Admission 2026',
    ogDescription: 'Check university admission dates, GPA requirements, units, seats and official circulars — all in one place.',
    ogImage: '/images/eduguide-og.jpg',
    canonicalUrl: 'https://eduguide.com.bd',
    robots: 'index, follow',
  },
};

export class HomepageService {
  private pool: pg.Pool;
  private inMemoryDraftConfig: HomepageFullConfig = { ...DEFAULT_HOMEPAGE_CONFIG, status: 'draft' };
  private inMemoryPublishedConfig: HomepageFullConfig = { ...DEFAULT_HOMEPAGE_CONFIG, status: 'published' };

  constructor() {
    this.pool = new pg.Pool({ connectionString: ENV.DATABASE_URL || process.env.DATABASE_URL });
  }

  /**
   * Fetch aggregated public homepage payload
   */
  public async getPublicHomepageData(isPreview = false): Promise<any> {
    const config = isPreview ? await this.getDraftConfig() : await this.getPublishedConfig();

    const [admissions, deadlines, featuredUnis, guides, faqsList] = await Promise.all([
      this.getDynamicAdmissionOverview(),
      this.getUpcomingDeadlines(),
      this.getFeaturedUniversities(config.featuredUniversities?.selectedUniversityIds || []),
      this.getPublishedGuides(config.guideSection?.maxDisplayCount || 4),
      this.getPublishedFaqs(),
    ]);

    return {
      success: true,
      isPreview,
      config,
      admissions,
      deadlines,
      featuredUniversities: featuredUnis,
      guides,
      faqs: faqsList,
    };
  }

  /**
   * Fetch Admin CMS configuration + content quality warnings
   */
  public async getAdminHomepageData(): Promise<any> {
    const draft = await this.getDraftConfig();
    const published = await this.getPublishedConfig();
    const warnings = await this.scanContentQualityWarnings();
    const allUniversities = await this.getDynamicAdmissionOverview();
    const allGuides = await this.getAllGuides();
    const allFaqs = await this.getAllFaqs();
    const allDeadlines = await this.getUpcomingDeadlines(20);

    return {
      success: true,
      draftConfig: draft,
      publishedConfig: published,
      warnings,
      universities: allUniversities,
      guides: allGuides,
      faqs: allFaqs,
      deadlines: allDeadlines,
    };
  }

  public async getDraftConfig(): Promise<HomepageFullConfig> {
    try {
      const res = await this.pool.query(
        `SELECT * FROM homepage_configs WHERE status = 'draft' ORDER BY updated_at DESC LIMIT 1`
      );
      if (res.rows.length > 0) {
        return this.mapDbRowToConfig(res.rows[0], 'draft');
      }
    } catch {
      // Fallback to in-memory draft
    }
    return this.inMemoryDraftConfig;
  }

  public async getPublishedConfig(): Promise<HomepageFullConfig> {
    try {
      const res = await this.pool.query(
        `SELECT * FROM homepage_configs WHERE status = 'published' ORDER BY published_at DESC LIMIT 1`
      );
      if (res.rows.length > 0) {
        return this.mapDbRowToConfig(res.rows[0], 'published');
      }
    } catch {
      // Fallback to in-memory published
    }
    return this.inMemoryPublishedConfig;
  }

  public async saveDraftSection(sectionKey: string, sectionData: any): Promise<HomepageFullConfig> {
    const currentDraft = await this.getDraftConfig();
    const updatedDraft: any = {
      ...currentDraft,
      [sectionKey]: sectionData,
      status: 'draft',
      updatedAt: new Date().toISOString(),
    };

    this.inMemoryDraftConfig = updatedDraft;

    try {
      await this.pool.query(
        `INSERT INTO homepage_configs (
          status, version, hero_config, admission_section_config, eligibility_section_config,
          deadline_section_config, featured_university_ids, ai_advisor_config, guide_section_config,
          preparation_config, faq_config, footer_config, seo_config, updated_at
        ) VALUES (
          'draft', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()
        )`,
        [
          updatedDraft.version || 1,
          JSON.stringify(updatedDraft.hero),
          JSON.stringify(updatedDraft.admissionSection),
          JSON.stringify(updatedDraft.eligibilitySection),
          JSON.stringify(updatedDraft.deadlineSection),
          JSON.stringify(updatedDraft.featuredUniversities?.selectedUniversityIds || []),
          JSON.stringify(updatedDraft.aiAdvisor),
          JSON.stringify(updatedDraft.guideSection),
          JSON.stringify(updatedDraft.preparation),
          JSON.stringify(updatedDraft.faq),
          JSON.stringify(updatedDraft.footer),
          JSON.stringify(updatedDraft.seo),
        ]
      );
    } catch {
      // Memory persistence retained
    }

    return updatedDraft;
  }

  public async publishHomepage(): Promise<{ success: boolean; message: string; version: number }> {
    const draft = await this.getDraftConfig();

    // Content Validation
    if (!draft.hero?.headline?.trim()) {
      throw new Error('Validation failed: Hero headline cannot be empty.');
    }
    if (!draft.hero?.primaryCtaLabel?.trim()) {
      throw new Error('Validation failed: Primary CTA label is required.');
    }
    if (!draft.seo?.metaTitle?.trim()) {
      throw new Error('Validation failed: SEO meta title is required.');
    }

    const newVersion = (draft.version || 1) + 1;
    const now = new Date().toISOString();

    const published: HomepageFullConfig = {
      ...draft,
      status: 'published',
      version: newVersion,
      publishedAt: now,
      updatedAt: now,
    };

    this.inMemoryPublishedConfig = published;
    this.inMemoryDraftConfig = { ...published, status: 'draft' };

    try {
      await this.pool.query(
        `INSERT INTO homepage_configs (
          status, version, hero_config, admission_section_config, eligibility_section_config,
          deadline_section_config, featured_university_ids, ai_advisor_config, guide_section_config,
          preparation_config, faq_config, footer_config, seo_config, updated_at, published_at
        ) VALUES (
          'published', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()
        )`,
        [
          newVersion,
          JSON.stringify(published.hero),
          JSON.stringify(published.admissionSection),
          JSON.stringify(published.eligibilitySection),
          JSON.stringify(published.deadlineSection),
          JSON.stringify(published.featuredUniversities?.selectedUniversityIds || []),
          JSON.stringify(published.aiAdvisor),
          JSON.stringify(published.guideSection),
          JSON.stringify(published.preparation),
          JSON.stringify(published.faq),
          JSON.stringify(published.footer),
          JSON.stringify(published.seo),
        ]
      );
    } catch {
      // Memory persistence retained
    }

    return {
      success: true,
      message: `Homepage successfully published to version ${newVersion}!`,
      version: newVersion,
    };
  }

  /**
   * Automated Content Quality Warnings Scanner
   */
  public async scanContentQualityWarnings(): Promise<Array<{ id: string; severity: 'high' | 'medium' | 'low'; title: string; detail: string; actionUrl: string }>> {
    const warnings: Array<{ id: string; severity: 'high' | 'medium' | 'low'; title: string; detail: string; actionUrl: string }> = [];

    const draft = await this.getDraftConfig();

    if (!draft.seo?.metaDescription || draft.seo.metaDescription.length < 30) {
      warnings.push({
        id: 'w-seo-desc',
        severity: 'high',
        title: 'Homepage meta description is short or missing',
        detail: 'Search engines require a descriptive meta summary (50-160 characters) to optimize admission ranking.',
        actionUrl: '/admin/homepage?tab=seo',
      });
    }

    if (!draft.hero?.trustIndicators || draft.hero.trustIndicators.length < 3) {
      warnings.push({
        id: 'w-hero-trust',
        severity: 'medium',
        title: 'Hero trust indicators are fewer than 3',
        detail: 'Showing at least 3 trust points improves student conversion rates.',
        actionUrl: '/admin/homepage?tab=hero',
      });
    }

    try {
      const unis = await this.getAllUniversities();
      const missingCirculars = unis.filter((u) => !u.website && !u.circularUrl);
      if (missingCirculars.length > 0) {
        warnings.push({
          id: 'w-uni-circ',
          severity: 'medium',
          title: `${missingCirculars.length} universities are missing circular links`,
          detail: `Universities (${missingCirculars.map((u) => u.shortName).join(', ')}) do not have direct circular URLs.`,
          actionUrl: '/admin/universities',
        });
      }
    } catch {
      // Non-blocking
    }

    return warnings;
  }

  /**
   * Dedicated Admissions Directory API with Backend Filtering, Search & Pagination
   */
  public async getAdmissionsDirectory(query: {
    search?: string;
    group?: string;
    status?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    success: boolean;
    data: any[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const rows = await this.getDynamicAdmissionOverview();
    const { search = '', group = 'All', status = 'All', sortBy = 'default', page = 1, limit = 10 } = query;

    let filtered = rows.filter((item: any) => {
      const matchesSearch =
        search === '' ||
        (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
        (item.shortName && item.shortName.toLowerCase().includes(search.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(search.toLowerCase())) ||
        (item.units && item.units.toLowerCase().includes(search.toLowerCase())) ||
        (item.minGpa && item.minGpa.toLowerCase().includes(search.toLowerCase()));

      let matchesGroup = true;
      if (group !== 'All') {
        if (group === 'Engineering') {
          matchesGroup =
            (item.shortName &&
              (item.shortName.includes('BUET') ||
                item.shortName.includes('KUET') ||
                item.shortName.includes('RUET') ||
                item.shortName.includes('CUET') ||
                item.shortName.includes('BUTEX') ||
                item.shortName.includes('MIST'))) ||
            (item.name && item.name.toLowerCase().includes('engineering'));
        } else if (group === 'Medical') {
          matchesGroup =
            (item.shortName && item.shortName.includes('Medical')) ||
            (item.group && item.group.includes('Bio'));
        } else if (group === 'GST') {
          matchesGroup =
            (item.shortName && item.shortName.includes('GST')) ||
            (item.applicationWindow && item.applicationWindow.includes('GST'));
        } else if (group === 'Agri') {
          matchesGroup =
            (item.shortName && item.shortName.includes('Agri')) ||
            (item.name && item.name.toLowerCase().includes('agri'));
        } else {
          matchesGroup = item.group && item.group.toLowerCase().includes(group.toLowerCase());
        }
      }

      const matchesStatus =
        status === 'All' || (item.status && item.status.toLowerCase() === status.toLowerCase());

      return matchesSearch && matchesGroup && matchesStatus;
    });

    if (sortBy === 'seats') {
      filtered = [...filtered].sort((a: any, b: any) => (b.seats || 0) - (a.seats || 0));
    } else if (sortBy === 'shortName') {
      filtered = [...filtered].sort((a: any, b: any) =>
        (a.shortName || '').localeCompare(b.shortName || '')
      );
    } else if (sortBy === 'name') {
      filtered = [...filtered].sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));
    }

    const total = filtered.length;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = limit === 0 ? total : Math.max(1, Number(limit) || 10);
    const totalPages = Math.max(1, Math.ceil(total / limitNum));
    const startIndex = (pageNum - 1) * limitNum;
    const pagedData = limit === 0 ? filtered : filtered.slice(startIndex, startIndex + limitNum);

    return {
      success: true,
      data: pagedData,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    };
  }

  /**
   * Dynamic Admission at a Glance dataset
   * Dynamically queries PostgreSQL (universities, admission_circulars, programs, eligibility)
   */
  public async getDynamicAdmissionOverview(): Promise<any[]> {
    try {
      const query = `
        SELECT 
          u.id::text AS id,
          u.name,
          u.short_name AS "shortName",
          COALESCE(u.logo, '🏛️') AS logo,
          COALESCE(u.location, 'Bangladesh') AS location,
          COALESCE(c.official_url, u.website, '#') AS "circularUrl",
          COALESCE(u.metadata->>'group', u.admission_type, 'All Groups') AS "group",
          COALESCE(u.metadata->>'application_window', 'Jan 15, 2026 – Feb 15, 2026') AS "applicationWindow",
          COALESCE(u.metadata->>'test_date', 'To be announced') AS "testDate",
          COALESCE(u.metadata->>'min_gpa', 'SSC 4.00, HSC 4.00') AS "minGpa",
          COALESCE(u.metadata->>'units', c.unit, 'All Units') AS "units",
          COALESCE((u.metadata->>'seats')::int, 1200) AS seats,
          COALESCE(u.metadata->>'status', 'Applications Open') AS status
        FROM universities u
        LEFT JOIN admission_circulars c ON u.id = c.university_id
        GROUP BY u.id, u.name, u.short_name, u.logo, u.location, u.website, u.admission_type, u.metadata, c.official_url, c.unit
        ORDER BY 
          CASE 
            WHEN COALESCE(u.metadata->>'status', 'Applications Open') = 'Applications Open' THEN 1
            WHEN COALESCE(u.metadata->>'status', 'Applications Open') = 'Opening Soon' THEN 2
            ELSE 3
          END,
          u.name ASC;
      `;
      const res = await this.pool.query(query);
      if (res && res.rows && res.rows.length > 0) {
        return res.rows;
      }
    } catch (err: any) {
      console.error('Failed to fetch from PostgreSQL:', err.message);
    }

    return this.getFallbackAdmissionsList();
  }

  /**
   * Structured Fallback for Initial Cold Start / Offline Database
   */
  private getFallbackAdmissionsList(): any[] {
    return [
      {
        id: 'buet-adm',
        name: 'Bangladesh University of Engineering and Technology',
        shortName: 'BUET',
        location: 'Dhaka',
        applicationWindow: 'Jan 15, 2026 – Feb 05, 2026',
        testDate: 'Feb 28, 2026 (Preliminary)',
        minGpa: 'SSC 4.00, HSC 4.00 (PHY+CHE+MATH: 270 pts)',
        group: 'Science',
        units: 'Ka (Engg), Kha (Arch)',
        seats: 1305,
        status: 'Applications Open',
        circularUrl: 'https://buet.ac.bd',
      },
      {
        id: 'du-adm',
        name: 'University of Dhaka',
        shortName: 'DU',
        location: 'Dhaka',
        applicationWindow: 'Jan 20, 2026 – Feb 15, 2026',
        testDate: 'Mar 08, 2026 (Ka Unit)',
        minGpa: 'Combined GPA 8.00 (Min 3.50 each)',
        group: 'All Groups',
        units: 'Ka (Sci), Kha (Arts), Ga (BBA), Cha (Fine Arts)',
        seats: 7120,
        status: 'Applications Open',
        circularUrl: 'https://du.ac.bd',
      },
      {
        id: 'medical-adm',
        name: 'Medical & Dental Colleges (MBBS / BDS Centralized Combined Exam)',
        shortName: 'Medical & Dental (DGHS)',
        location: 'Nationwide (37 Gov Medical + 12 Dental)',
        applicationWindow: 'Jan 10, 2026 – Jan 30, 2026',
        testDate: 'Feb 14, 2026',
        minGpa: 'Total GPA 9.00 (Biology Min 4.00)',
        group: 'Science (Biology)',
        units: 'Central MBBS & BDS Merit List',
        seats: 5380,
        status: 'Applications Open',
        circularUrl: 'https://dghs.gov.bd',
      },
      {
        id: 'gst-adm',
        name: 'GST General, Science & Tech Cluster (24 Public Universities)',
        shortName: 'GST 24 Cluster',
        location: 'Nationwide 24 Universities',
        applicationWindow: 'Feb 15, 2026 – Mar 10, 2026',
        testDate: 'Apr 12, 2026 (Unit A)',
        minGpa: 'Science: 8.00, Arts: 7.00, Comm: 7.50',
        group: 'All Groups',
        units: 'Unit A (Sci), Unit B (Hum), Unit C (Bus)',
        seats: 21500,
        status: 'Opening Soon',
        circularUrl: 'https://gstadmission.ac.bd',
      },
      {
        id: 'agri-cluster-adm',
        name: 'Agriculture 9 Public University Combined Cluster (BAU, BSMRAU, SAU)',
        shortName: 'Agriculture 9 Cluster',
        location: 'Nationwide 9 Agriculture Universities',
        applicationWindow: 'Mar 01, 2026 – Mar 25, 2026',
        testDate: 'May 03, 2026',
        minGpa: 'Combined GPA 8.50 (Science & Biology)',
        group: 'Science (Biology)',
        units: 'Combined Agricultural Science Merit List',
        seats: 4230,
        status: 'Opening Soon',
        circularUrl: 'https://acas.edu.bd',
      },
      {
        id: 'ju-adm',
        name: 'Jahangirnagar University',
        shortName: 'JU',
        location: 'Savar, Dhaka',
        applicationWindow: 'Jan 18, 2026 – Feb 10, 2026',
        testDate: 'Mar 02, 2026 – Mar 12, 2026',
        minGpa: 'A Unit: 8.50, D Unit: 9.00',
        group: 'All Groups',
        units: 'Unit A, B, C, D (Bio), E',
        seats: 1844,
        status: 'Applications Open',
        circularUrl: 'https://juniv-admission.org',
      },
      {
        id: 'ru-adm',
        name: 'University of Rajshahi',
        shortName: 'RU',
        location: 'Rajshahi',
        applicationWindow: 'Jan 08, 2026 – Jan 28, 2026',
        testDate: 'Mar 05, 2026 – Mar 07, 2026',
        minGpa: 'Unit A: 7.00, Unit B: 7.50, Unit C: 8.00',
        group: 'All Groups',
        units: 'Unit A (Humanities), Unit B (BBA), Unit C (Science)',
        seats: 4173,
        status: 'Applications Open',
        circularUrl: 'https://admission.ru.ac.bd',
      },
      {
        id: 'cu-adm',
        name: 'University of Chittagong',
        shortName: 'CU',
        location: 'Chittagong',
        applicationWindow: 'Jan 12, 2026 – Feb 02, 2026',
        testDate: 'Mar 10, 2026 – Mar 18, 2026',
        minGpa: 'A Unit: 8.00, B Unit: 7.50, Unit C: 8.00',
        group: 'All Groups',
        units: 'A (Science), B (Arts), C (Business), D (Combined)',
        seats: 4926,
        status: 'Applications Open',
        circularUrl: 'https://admission.cu.ac.bd',
      },
      {
        id: 'kuet-adm',
        name: 'Khulna University of Engineering & Technology',
        shortName: 'KUET',
        location: 'Khulna',
        applicationWindow: 'Feb 01, 2026 – Feb 22, 2026',
        testDate: 'Mar 15, 2026',
        minGpa: 'HSC GPA 4.00 (PHY, CHE, MATH min A)',
        group: 'Science',
        units: 'Unit A (Engineering), Unit B (Architecture)',
        seats: 1065,
        status: 'Applications Open',
        circularUrl: 'https://kuet.ac.bd',
      },
      {
        id: 'ruet-adm',
        name: 'Rajshahi University of Engineering & Technology',
        shortName: 'RUET',
        location: 'Rajshahi',
        applicationWindow: 'Feb 05, 2026 – Feb 25, 2026',
        testDate: 'Mar 22, 2026',
        minGpa: 'HSC GPA 4.00 (PHY, CHE, MATH min A)',
        group: 'Science',
        units: 'Ka (Engineering), Kha (Planning & Arch)',
        seats: 1230,
        status: 'Applications Open',
        circularUrl: 'https://ruet.ac.bd',
      },
      {
        id: 'cuet-adm',
        name: 'Chittagong University of Engineering & Technology',
        shortName: 'CUET',
        location: 'Chittagong',
        applicationWindow: 'Feb 10, 2026 – Mar 01, 2026',
        testDate: 'Mar 29, 2026',
        minGpa: 'HSC GPA 4.00 (Math, Physics, Chemistry A)',
        group: 'Science',
        units: 'Ka, Kha',
        seats: 920,
        status: 'Opening Soon',
        circularUrl: 'https://cuet.ac.bd',
      },
      {
        id: 'butex-adm',
        name: 'Bangladesh University of Textiles',
        shortName: 'BUTEX',
        location: 'Tejgaon, Dhaka',
        applicationWindow: 'Feb 01, 2026 – Feb 20, 2026',
        testDate: 'Apr 04, 2026',
        minGpa: 'Total GPA 9.00 (Math, Physics, Chem, Eng: Min A)',
        group: 'Science',
        units: 'Textile Engineering Faculties',
        seats: 600,
        status: 'Opening Soon',
        circularUrl: 'https://butex.edu.bd',
      },
      {
        id: 'mist-adm',
        name: 'Military Institute of Science and Technology',
        shortName: 'MIST',
        location: 'Mirpur Cantt, Dhaka',
        applicationWindow: 'Jan 05, 2026 – Jan 25, 2026',
        testDate: 'Feb 20, 2026',
        minGpa: 'Total GPA 9.00 (Science: PCM min A+)',
        group: 'Science',
        units: 'Engineering & Architecture Units',
        seats: 820,
        status: 'Deadline Passed',
        circularUrl: 'https://mist.ac.bd',
      },
      {
        id: 'bup-adm',
        name: 'Bangladesh University of Professionals',
        shortName: 'BUP',
        location: 'Mirpur Cantt, Dhaka',
        applicationWindow: 'Jan 02, 2026 – Jan 20, 2026',
        testDate: 'Feb 06, 2026 – Feb 07, 2026',
        minGpa: 'Combined GPA 8.50 - 9.00 (Faculty based)',
        group: 'All Groups',
        units: 'FST, FBA, FASS, FBS',
        seats: 1450,
        status: 'Deadline Passed',
        circularUrl: 'https://bup.edu.bd',
      },
      {
        id: 'ku-adm',
        name: 'Khulna University',
        shortName: 'KU',
        location: 'Khulna',
        applicationWindow: 'Feb 15, 2026 – Mar 10, 2026',
        testDate: 'Apr 12, 2026 (Under GST)',
        minGpa: 'GST Cluster Merit Score Requirement',
        group: 'All Groups',
        units: 'SET, Life Science, Arts, Management',
        seats: 1215,
        status: 'Opening Soon',
        circularUrl: 'https://ku.ac.bd',
      },
      {
        id: 'sust-adm',
        name: 'Shahjalal University of Science and Technology',
        shortName: 'SUST',
        location: 'Sylhet',
        applicationWindow: 'Feb 15, 2026 – Mar 10, 2026',
        testDate: 'Apr 12, 2026 (Under GST)',
        minGpa: 'GST Cluster Criteria (Science min 8.00)',
        group: 'All Groups',
        units: 'A Unit (Science), B Unit (Non-Science)',
        seats: 1700,
        status: 'Opening Soon',
        circularUrl: 'https://sust.edu',
      },
      {
        id: 'jnu-adm',
        name: 'Jagannath University',
        shortName: 'JnU',
        location: 'Dhaka',
        applicationWindow: 'Feb 15, 2026 – Mar 10, 2026',
        testDate: 'Apr 12, 2026 (Under GST)',
        minGpa: 'GST Cluster Evaluation',
        group: 'All Groups',
        units: 'Science, Humanities, Business Units',
        seats: 2765,
        status: 'Opening Soon',
        circularUrl: 'https://jnu.ac.bd',
      },
      {
        id: 'just-adm',
        name: 'Jashore University of Science and Technology',
        shortName: 'JUST',
        location: 'Jashore',
        applicationWindow: 'Feb 15, 2026 – Mar 10, 2026',
        testDate: 'Apr 12, 2026 (Under GST)',
        minGpa: 'GST Cluster Criteria',
        group: 'Science',
        units: 'Engineering, Bio-science, Health Science',
        seats: 980,
        status: 'Opening Soon',
        circularUrl: 'https://just.edu.bd',
      },
      {
        id: 'bau-adm',
        name: 'Bangladesh Agricultural University',
        shortName: 'BAU',
        location: 'Mymensingh',
        applicationWindow: 'Mar 01, 2026 – Mar 25, 2026',
        testDate: 'May 03, 2026 (Agriculture Cluster)',
        minGpa: 'Science GPA 8.50 (Bio, Phy, Chem, Math)',
        group: 'Science (Biology)',
        units: 'Agriculture, Vet Science, Fisheries, Ag-Econ',
        seats: 1110,
        status: 'Opening Soon',
        circularUrl: 'https://bau.edu.bd',
      },
      {
        id: 'cou-adm',
        name: 'Comilla University',
        shortName: 'CoU',
        location: 'Cumilla',
        applicationWindow: 'Feb 15, 2026 – Mar 10, 2026',
        testDate: 'Apr 12, 2026 (Under GST)',
        minGpa: 'GST Cluster Criteria',
        group: 'All Groups',
        units: 'Science, Arts, Commerce Units',
        seats: 1040,
        status: 'Opening Soon',
        circularUrl: 'https://cou.ac.bd',
      },
      {
        id: 'brur-adm',
        name: 'Begum Rokeya University, Rangpur',
        shortName: 'BRUR',
        location: 'Rangpur',
        applicationWindow: 'Feb 15, 2026 – Mar 10, 2026',
        testDate: 'Apr 12, 2026 (Under GST)',
        minGpa: 'GST Cluster Criteria',
        group: 'All Groups',
        units: 'Unit A, B, C, D, E, F',
        seats: 1395,
        status: 'Opening Soon',
        circularUrl: 'https://brur.ac.bd',
      },
      {
        id: 'mbstu-adm',
        name: 'Mawlana Bhashani Science and Technology University',
        shortName: 'MBSTU',
        location: 'Santosh, Tangail',
        applicationWindow: 'Feb 15, 2026 – Mar 10, 2026',
        testDate: 'Apr 12, 2026 (Under GST)',
        minGpa: 'GST Cluster Criteria',
        group: 'Science',
        units: 'Engineering, Life Science, Business',
        seats: 865,
        status: 'Opening Soon',
        circularUrl: 'https://mbstu.ac.bd',
      },
      {
        id: 'nstu-adm',
        name: 'Noakhali Science and Technology University',
        shortName: 'NSTU',
        location: 'Noakhali',
        applicationWindow: 'Feb 15, 2026 – Mar 10, 2026',
        testDate: 'Apr 12, 2026 (Under GST)',
        minGpa: 'GST Cluster Criteria',
        group: 'Science',
        units: 'A, B, C, D Units',
        seats: 1450,
        status: 'Opening Soon',
        circularUrl: 'https://nstu.edu.bd',
      },
      {
        id: 'jkkniu-adm',
        name: 'Jatiya Kabi Kazi Nazrul Islam University',
        shortName: 'JKKNIU',
        location: 'Trishal, Mymensingh',
        applicationWindow: 'Feb 15, 2026 – Mar 10, 2026',
        testDate: 'Apr 12, 2026 (Under GST)',
        minGpa: 'GST Cluster Criteria (Combined GPA 7.00)',
        group: 'All Groups',
        units: 'AL, AP, BBA, Science Faculties',
        seats: 1120,
        status: 'Opening Soon',
        circularUrl: 'https://jkkniu.edu.bd',
      },
    ];
  }

  /**
   * Dynamic Upcoming Deadlines from PostgreSQL
   */
  public async getUpcomingDeadlines(limit = 20): Promise<any[]> {
    try {
      // Ensure table exists
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS admission_events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
          university_name TEXT NOT NULL,
          unit TEXT,
          event_type TEXT NOT NULL,
          title TEXT NOT NULL,
          event_date TIMESTAMP NOT NULL,
          description TEXT,
          source_url TEXT,
          status TEXT DEFAULT 'upcoming',
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `);

      const res = await this.pool.query(
        `SELECT 
           id::text,
           university_name as "universityName",
           unit,
           event_type as "eventType",
           title,
           event_date as "eventDate",
           description,
           source_url as "sourceUrl",
           status
         FROM admission_events 
         ORDER BY event_date ASC 
         LIMIT $1`,
        [limit]
      );

      return res.rows.map((r) => {
        const evtDate = new Date(r.eventDate);
        const diffMs = evtDate.getTime() - Date.now();
        const remainingDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        const dynamicStatus = remainingDays === 0 ? 'passed' : remainingDays <= 7 ? 'urgent' : remainingDays <= 30 ? 'upcoming' : 'scheduled';
        return {
          id: r.id,
          university: r.universityName,
          unit: r.unit || 'All Units',
          eventType: r.eventType,
          eventTypeName: r.title,
          eventDate: evtDate.toISOString(),
          dateDisplay: evtDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          remainingDays,
          status: r.status || dynamicStatus,
          sourceUrl: r.sourceUrl || '#',
          description: r.description || '',
        };
      });
    } catch (err: any) {
      console.error('Error loading upcoming deadlines from PostgreSQL:', err.message);
      return [];
    }
  }

  public async saveDeadline(data: any): Promise<any> {
    try {
      const { id, universityName, unit, eventType, title, eventDate, description, sourceUrl, status } = data;
      if (id && !id.startsWith('deadline-new-')) {
        const res = await this.pool.query(
          `UPDATE admission_events 
           SET university_name = $1, unit = $2, event_type = $3, title = $4, event_date = $5, description = $6, source_url = $7, status = $8
           WHERE id = $9
           RETURNING *`,
          [universityName, unit || 'All Units', eventType || 'application_deadline', title || 'Deadline', eventDate || new Date(), description || null, sourceUrl || null, status || 'upcoming', id]
        );
        return { success: true, data: res.rows[0] };
      } else {
        const res = await this.pool.query(
          `INSERT INTO admission_events (university_name, unit, event_type, title, event_date, description, source_url, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING *`,
          [universityName, unit || 'All Units', eventType || 'application_deadline', title || 'Deadline', eventDate || new Date(), description || null, sourceUrl || null, status || 'upcoming']
        );
        return { success: true, data: res.rows[0] };
      }
    } catch (err: any) {
      console.error('Error saving deadline to PostgreSQL:', err.message);
      return { success: false, error: err.message };
    }
  }

  public async deleteDeadline(id: string): Promise<any> {
    try {
      await this.pool.query(`DELETE FROM admission_events WHERE id = $1`, [id]);
      return { success: true, id };
    } catch (err: any) {
      console.error('Error deleting deadline from PostgreSQL:', err.message);
      return { success: false, error: err.message };
    }
  }

  public async getFeaturedUniversities(selectedIds: string[]): Promise<any[]> {
    const all = await this.getDynamicAdmissionOverview();
    if (!selectedIds || selectedIds.length === 0) {
      return all.slice(0, 6);
    }
    const filtered = all.filter((u) => selectedIds.includes(u.id));
    return filtered.length > 0 ? filtered : all.slice(0, 6);
  }

  public async getPublishedGuides(limit = 4): Promise<any[]> {
    const defaultGuides = [
      {
        id: 'g1',
        title: 'BUET Admission Test 2026: Complete Preparation & Eligibility Guide',
        slug: 'buet-admission-guide-2026',
        summary: 'Everything HSC candidates need to know about BUET admission requirements, preliminary cutoff marks, seat breakdown, and preparation strategy.',
        category: 'Engineering Guide',
        readingTimeMinutes: 8,
        publishedDate: 'September 1, 2026',
        featuredImage: '/images/buet-guide.jpg',
      },
      {
        id: 'g2',
        title: 'DU Ka Unit Admission Strategy: How to Score High in Physics & Chemistry',
        slug: 'du-ka-unit-guide',
        summary: 'Proven preparation techniques for University of Dhaka Ka Unit science admission test with past year question analysis.',
        category: 'Varsity Science',
        readingTimeMinutes: 6,
        publishedDate: 'August 28, 2026',
        featuredImage: '/images/du-guide.jpg',
      },
      {
        id: 'g3',
        title: 'Medical College Admission 2026: Biology & Chemistry High-Yield Topics',
        slug: 'medical-admission-guide-2026',
        summary: 'Strategic analysis of DGHS MBBS question patterns, negative marking prevention, and NCERT-equivalent revision topics.',
        category: 'Medical Guide',
        readingTimeMinutes: 7,
        publishedDate: 'August 25, 2026',
        featuredImage: '/images/medical-guide.jpg',
      },
      {
        id: 'g4',
        title: 'GST Cluster Admission 2026: 24 Public Universities One Exam Breakdown',
        slug: 'gst-cluster-guide-2026',
        summary: 'Complete guide to general, science and technology cluster admission test, subject choices, and merit score formulas.',
        category: 'Cluster Guide',
        readingTimeMinutes: 5,
        publishedDate: 'August 20, 2026',
        featuredImage: '/images/gst-guide.jpg',
      },
    ];

    try {
      const res = await this.pool.query(
        `SELECT a.id, a.title, a.slug, a.summary, a.reading_time_minutes as "readingTimeMinutes",
                a.featured_image as "featuredImage", a.created_at as "createdAt",
                c.name as category
         FROM articles a
         LEFT JOIN article_categories c ON a.category_id = c.id
         WHERE a.is_published = true
         ORDER BY a.created_at DESC LIMIT $1`,
        [limit]
      );
      if (res.rows.length > 0) {
        return res.rows.map((r) => ({
          ...r,
          publishedDate: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        }));
      }
    } catch {
      // Fallback
    }

    return defaultGuides.slice(0, limit);
  }

  public async getPublishedFaqs(): Promise<any[]> {
    const defaultFaqs = [
      {
        id: 'faq-1',
        question: 'How does EduGuide evaluate university admission eligibility?',
        answer: '<p>EduGuide evaluates eligibility deterministically using published official admission circulars from Bangladeshi public and engineering universities. It validates your <strong>SSC GPA</strong>, <strong>HSC GPA</strong>, <strong>Academic Group</strong> (Science, Commerce, Humanities), and <strong>Passing Year</strong> against each university’s cutoff thresholds.</p>',
        category: 'Eligibility',
        order: 1,
      },
      {
        id: 'faq-2',
        question: 'Are second-time candidates allowed to apply to BUET and DU?',
        answer: '<p>Per current regulations, <strong>BUET</strong> strictly disallows second-time admission candidates. <strong>University of Dhaka (DU)</strong> allows second-time applicants only in specific faculties under prescribed circular guidelines. EduGuide clearly flags second-time eligibility for each university in your result view.</p>',
        category: 'Admission',
        order: 2,
      },
      {
        id: 'faq-3',
        question: 'How frequently are admission circulars and deadlines updated on EduGuide?',
        answer: '<p>Our admission intelligence team verifies and updates circulars within <strong>2 hours</strong> of official university notifications. Every deadline record displays an official source citation and a <em>Last Verified</em> verification timestamp.</p>',
        category: 'General',
        order: 3,
      },
      {
        id: 'faq-4',
        question: 'What is included in the "Prepare with EduGuide" learning platform?',
        answer: '<p>EduGuide provides interactive visual lessons, chapter-wise MCQs with detailed explanations, past 15 years solved questions for BUET/DU/Medical, realistic mock tests with negative marking, and a 24/7 AI Admission Tutor for instant problem step-by-step solutions.</p>',
        category: 'Preparation',
        order: 4,
      },
      {
        id: 'faq-5',
        question: 'Is EduGuide free to use for checking eligibility and circulars?',
        answer: '<p><strong>Yes.</strong> Exploring universities, viewing admission dates, checking personal eligibility, reading admission guides, and asking admission guidance questions to the AI Advisor are 100% free.</p>',
        category: 'General',
        order: 5,
      },
    ];

    try {
      const res = await this.pool.query(
        `SELECT id, question, answer, category, "order" FROM faqs WHERE is_published = true ORDER BY "order" ASC`
      );
      if (res.rows.length > 0) {
        return res.rows;
      }
    } catch {
      // Fallback
    }

    return defaultFaqs;
  }

  public async getAllFaqs(): Promise<any[]> {
    try {
      const res = await this.pool.query(`SELECT * FROM faqs ORDER BY "order" ASC, created_at DESC`);
      if (res.rows.length > 0) {
        return res.rows;
      }
    } catch {
      // Fallback
    }
    return this.getPublishedFaqs();
  }

  public async saveFaq(faq: { id?: string; question: string; answer: string; category: string; order: number; isPublished: boolean }): Promise<any> {
    if (faq.id && !faq.id.startsWith('faq-')) {
      await this.pool.query(
        `UPDATE faqs SET question = $1, answer = $2, category = $3, "order" = $4, is_published = $5, updated_at = NOW() WHERE id = $6`,
        [faq.question, faq.answer, faq.category || 'General', faq.order || 0, faq.isPublished ?? true, faq.id]
      );
      return { success: true, id: faq.id };
    } else {
      const res = await this.pool.query(
        `INSERT INTO faqs (question, answer, category, "order", is_published) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [faq.question, faq.answer, faq.category || 'General', faq.order || 0, faq.isPublished ?? true]
      );
      return { success: true, id: res.rows[0]?.id };
    }
  }

  public async deleteFaq(id: string): Promise<any> {
    try {
      await this.pool.query(`DELETE FROM faqs WHERE id = $1`, [id]);
    } catch {
      // Ignore
    }
    return { success: true, id };
  }

  public async getAllUniversities(): Promise<any[]> {
    return this.getDynamicAdmissionOverview();
  }

  public async createUniversity(data: {
    name: string;
    shortName: string;
    description?: string;
    location?: string;
    website?: string;
    logo?: string;
    foundedYear?: number;
    admissionType?: string;
    cutoffMarks?: number;
    metadata?: any;
    applicationWindow?: string;
    testDate?: string;
    minGpa?: string;
    group?: string;
    units?: string;
    seats?: number;
    status?: string;
    overview?: string;
    programList?: string[];
    admissionProcess?: string[];
    fees?: any;
    facilities?: string[];
  }): Promise<any> {
    try {
      const meta = data.metadata || {
        application_window: data.applicationWindow || 'Jan 15, 2026 – Feb 15, 2026',
        test_date: data.testDate || 'To be announced',
        min_gpa: data.minGpa || 'Combined GPA 8.00 (Min 3.50 each)',
        group: data.group || 'All Groups',
        units: data.units || 'Ka, Kha, Ga',
        seats: data.seats || 1200,
        status: data.status || 'Applications Open',
        overview: data.overview || data.description || '',
        program_list: data.programList || [],
        admission_process: data.admissionProcess || [],
        fees: data.fees || {},
        facilities: data.facilities || [],
      };

      const res = await this.pool.query(
        `INSERT INTO universities (name, short_name, description, location, website, logo, founded_year, admission_type, cutoff_marks, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (short_name) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           location = EXCLUDED.location,
           website = EXCLUDED.website,
           logo = EXCLUDED.logo,
           founded_year = EXCLUDED.founded_year,
           admission_type = EXCLUDED.admission_type,
           cutoff_marks = EXCLUDED.cutoff_marks,
           metadata = EXCLUDED.metadata
         RETURNING *`,
        [
          data.name,
          data.shortName,
          data.description || null,
          data.location || null,
          data.website || null,
          data.logo || '🏛️',
          data.foundedYear || 2026,
          data.admissionType || 'merit',
          data.cutoffMarks || 0,
          JSON.stringify(meta),
        ]
      );

      const uni = res.rows[0];
      if (uni?.id) {
        // Upsert circular
        await this.pool.query(
          `INSERT INTO admission_circulars (university_id, title, unit, year, official_url, summary, requirements)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT DO NOTHING`,
          [
            uni.id,
            `${data.shortName} Admission Circular 2026`,
            data.units || 'All Units',
            2026,
            data.website || '#',
            data.description || '',
            JSON.stringify(meta),
          ]
        );
      }

      return { success: true, data: uni };
    } catch (err: any) {
      console.error('Error inserting university into PostgreSQL:', err.message);
      throw err;
    }
  }

  public async updateUniversity(id: string, data: any): Promise<any> {
    try {
      const meta = data.metadata || {
        application_window: data.applicationWindow,
        test_date: data.testDate,
        min_gpa: data.minGpa,
        group: data.group,
        units: data.units,
        seats: data.seats,
        status: data.status,
        overview: data.overview || data.description,
        program_list: data.programList,
        admission_process: data.admissionProcess,
        fees: data.fees,
        facilities: data.facilities,
      };

      const res = await this.pool.query(
        `UPDATE universities
         SET name = COALESCE($1, name),
             short_name = COALESCE($2, short_name),
             description = COALESCE($3, description),
             location = COALESCE($4, location),
             website = COALESCE($5, website),
             logo = COALESCE($6, logo),
             founded_year = COALESCE($7, founded_year),
             admission_type = COALESCE($8, admission_type),
             cutoff_marks = COALESCE($9, cutoff_marks),
             metadata = $10,
             updated_at = NOW()
         WHERE id = $11::uuid OR short_name = $11
         RETURNING *`,
        [
          data.name,
          data.shortName,
          data.description,
          data.location,
          data.website,
          data.logo,
          data.foundedYear,
          data.admissionType,
          data.cutoffMarks,
          JSON.stringify(meta),
          id,
        ]
      );
      return { success: true, data: res.rows[0] };
    } catch (err: any) {
      console.error('Error updating university in PostgreSQL:', err.message);
      throw err;
    }
  }

  public async getUniversityBySlug(slug: string): Promise<any | null> {
    try {
      const cleanSlug = slug.toLowerCase().trim();
      const res = await this.pool.query(
        `SELECT 
           u.id::text,
           u.name,
           u.short_name AS "shortName",
           LOWER(u.short_name) AS slug,
           u.description,
           COALESCE(u.location, 'Bangladesh') AS location,
           COALESCE(u.website, '#') AS website,
           COALESCE(u.logo, '🏛️') AS logo,
           COALESCE(u.founded_year, 1950) AS "foundedYear",
           COALESCE(u.admission_type, 'merit') AS "admissionType",
           COALESCE(u.cutoff_marks, 0) AS "cutoffMarks",
           COALESCE(u.metadata->>'group', 'All Groups') AS "group",
           COALESCE(u.metadata->>'application_window', 'Jan 15, 2026 – Feb 15, 2026') AS "applicationWindow",
           COALESCE(u.metadata->>'test_date', 'To be announced') AS "testDate",
           COALESCE(u.metadata->>'min_gpa', 'SSC 4.00, HSC 4.00') AS "minGpa",
           COALESCE(u.metadata->>'units', 'All Units') AS "units",
           COALESCE((u.metadata->>'seats')::int, 1500) AS seats,
           COALESCE(u.metadata->>'status', 'Applications Open') AS status,
           u.metadata
         FROM universities u
         WHERE LOWER(u.short_name) = $1 
            OR u.id::text = $1 
            OR LOWER(REPLACE(u.name, ' ', '-')) = $1
            OR LOWER(REGEXP_REPLACE(u.name, '[^a-zA-Z0-9]', '', 'g')) = LOWER(REGEXP_REPLACE($1, '[^a-zA-Z0-9]', '', 'g'))
         LIMIT 1`,
        [cleanSlug]
      );

      if (res.rows.length === 0) {
        return null;
      }

      const uni = res.rows[0];

      // Fetch related circulars
      const circRes = await this.pool.query(
        `SELECT id::text, title, unit, year, official_url as "officialUrl", summary, requirements, created_at as "createdAt"
         FROM admission_circulars
         WHERE university_id = $1::uuid
         ORDER BY created_at DESC`,
        [uni.id]
      );

      // Fetch related upcoming events/deadlines
      const eventRes = await this.pool.query(
        `SELECT id::text, unit, event_type as "eventType", title, event_date as "eventDate", description, source_url as "sourceUrl", status
         FROM admission_events
         WHERE university_id = $1::uuid OR LOWER(university_name) = LOWER($2)
         ORDER BY event_date ASC`,
        [uni.id, uni.name]
      );

      // Fetch related programs
      const progRes = await this.pool.query(
        `SELECT id::text, name, degree_level as "degreeLevel", faculty, duration_years as "durationYears", total_credits as "totalCredits", seats, min_gpa as "minGpa", description
         FROM programs
         WHERE university_id = $1::uuid
         ORDER BY faculty ASC, name ASC`,
        [uni.id]
      );

      return {
        ...uni,
        circulars: circRes.rows,
        events: eventRes.rows.map((evt: any) => {
          const evtDate = new Date(evt.eventDate);
          const diffDays = Math.max(0, Math.ceil((evtDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          return {
            ...evt,
            eventDate: evtDate.toISOString(),
            dateDisplay: evtDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            remainingDays: diffDays,
          };
        }),
        programs: progRes.rows,
      };
    } catch (err: any) {
      console.error('Error fetching university by slug:', err.message);
      return null;
    }
  }

  public async deleteUniversity(id: string): Promise<any> {
    try {
      await this.pool.query(
        `DELETE FROM admission_circulars WHERE university_id IN (SELECT id FROM universities WHERE id::text = $1 OR short_name = $1)`,
        [id]
      );
      await this.pool.query(
        `DELETE FROM programs WHERE university_id IN (SELECT id FROM universities WHERE id::text = $1 OR short_name = $1)`,
        [id]
      );
      await this.pool.query(
        `DELETE FROM admission_events WHERE university_id IN (SELECT id FROM universities WHERE id::text = $1 OR short_name = $1)`,
        [id]
      );
      await this.pool.query(`DELETE FROM universities WHERE id::text = $1 OR short_name = $1`, [id]);
      return { success: true, id };
    } catch (err: any) {
      console.error('Error deleting university:', err.message);
      throw err;
    }
  }

  public async getAllGuides(): Promise<any[]> {
    return this.getPublishedGuides(20);
  }

  private mapDbRowToConfig(row: any, status: 'draft' | 'published'): HomepageFullConfig {
    return {
      status,
      version: row.version || 1,
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
      publishedAt: row.published_at ? new Date(row.published_at).toISOString() : undefined,
      hero: typeof row.hero_config === 'string' ? JSON.parse(row.hero_config) : row.hero_config || DEFAULT_HOMEPAGE_CONFIG.hero,
      admissionSection: typeof row.admission_section_config === 'string' ? JSON.parse(row.admission_section_config) : row.admission_section_config || DEFAULT_HOMEPAGE_CONFIG.admissionSection,
      eligibilitySection: typeof row.eligibility_section_config === 'string' ? JSON.parse(row.eligibility_section_config) : row.eligibility_section_config || DEFAULT_HOMEPAGE_CONFIG.eligibilitySection,
      deadlineSection: typeof row.deadline_section_config === 'string' ? JSON.parse(row.deadline_section_config) : row.deadline_section_config || DEFAULT_HOMEPAGE_CONFIG.deadlineSection,
      featuredUniversities: {
        ...DEFAULT_HOMEPAGE_CONFIG.featuredUniversities,
        selectedUniversityIds: typeof row.featured_university_ids === 'string' ? JSON.parse(row.featured_university_ids) : row.featured_university_ids || DEFAULT_HOMEPAGE_CONFIG.featuredUniversities.selectedUniversityIds,
      },
      aiAdvisor: typeof row.ai_advisor_config === 'string' ? JSON.parse(row.ai_advisor_config) : row.ai_advisor_config || DEFAULT_HOMEPAGE_CONFIG.aiAdvisor,
      guideSection: typeof row.guide_section_config === 'string' ? JSON.parse(row.guide_section_config) : row.guide_section_config || DEFAULT_HOMEPAGE_CONFIG.guideSection,
      preparation: typeof row.preparation_config === 'string' ? JSON.parse(row.preparation_config) : row.preparation_config || DEFAULT_HOMEPAGE_CONFIG.preparation,
      faq: typeof row.faq_config === 'string' ? JSON.parse(row.faq_config) : row.faq_config || DEFAULT_HOMEPAGE_CONFIG.faq,
      footer: typeof row.footer_config === 'string' ? JSON.parse(row.footer_config) : row.footer_config || DEFAULT_HOMEPAGE_CONFIG.footer,
      seo: typeof row.seo_config === 'string' ? JSON.parse(row.seo_config) : row.seo_config || DEFAULT_HOMEPAGE_CONFIG.seo,
    };
  }
}

export const homepageService = new HomepageService();
