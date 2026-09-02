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

export interface AdmissionRowItem {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  location: string;
  applicationWindow: string;
  testDate: string;
  minGpa: string;
  group: string;
  units: string;
  seats: number;
  status: string;
  statusColor?: string;
  circularUrl: string;
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
  customRows?: AdmissionRowItem[];
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
  maxEvents?: number;
  maxDisplayCount?: number;
  filterMode: 'all' | 'application_deadline' | 'exam_date' | 'result_date';
  enabled: boolean;
}

export interface FeaturedUniversitiesConfig {
  title: string;
  description: string;
  selectionType: 'manual' | 'top_rated' | 'most_popular';
  selectedUniversityIds: string[];
  maxDisplayCount: number;
  enabled: boolean;
}

export interface ExampleQuestion {
  id: string;
  text: string;
  category: string;
  order: number;
  enabled: boolean;
}

export interface AiAdvisorConfig {
  title: string;
  description: string;
  ctaText: string;
  exampleQuestions: ExampleQuestion[];
  enabled: boolean;
}

export interface GuideSectionConfig {
  title: string;
  description: string;
  featuredArticleSlug: string;
  selectionMode: 'manual' | 'recent';
  selectedSlugs: string[];
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

export interface FaqItemConfig {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  enabled: boolean;
}

export interface FaqConfig {
  title: string;
  description: string;
  selectedFaqIds: string[];
  customFaqs?: FaqItemConfig[];
  enabled: boolean;
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterNavGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterConfig {
  description: string;
  navGroups: FooterNavGroup[];
  copyrightText: string;
  enabled: boolean;
}

export interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  ogTitle?: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl: string;
}

export interface HomepageFullConfig {
  version: number;
  status: 'draft' | 'published' | 'archived';
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
  updatedBy?: string;
  publishedAt?: string;
}

export const DEFAULT_HOMEPAGE_CONFIG: HomepageFullConfig = {
  version: 1,
  status: 'published',
  hero: {
    eyebrow: 'Trusted by over 50,000+ admission aspirants',
    headline: 'Find Where You Can Apply.',
    subheading:
      'Check university admission dates, GPA requirements, units, and past question trends — all unified with AI guidance in one place.',
    primaryCtaLabel: 'Get Started for Free',
    primaryCtaAction: 'scroll_to_checker',
    secondaryCtaLabel: 'Explore Universities',
    secondaryCtaAction: 'navigate_to_universities',
    trustIndicators: [
      'Official Circulars',
      'Real-time Eligibility Engine',
      'Accurate GPA Rules',
      '15-Year Question Bank',
    ],
    enabled: true,
  },
  admissionSection: {
    title: 'Admission at a Glance',
    description:
      'See important admission schedules, application dates, and GPA criteria across Bangladesh universities.',
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
    title: 'Find Where You Qualify.',
    description:
      'Enter your academic information and discover universities and units you are eligible to apply for.',
    primaryCtaLabel: 'Find My Universities',
    helperText:
      'Real-time rule evaluation based on official 2026 university admission circular criteria.',
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
    description:
      'Never miss an application window, admit card download, or admission test date across Bangladesh universities.',
    maxEvents: 6,
    filterMode: 'all',
    enabled: true,
  },
  featuredUniversities: {
    title: 'Explore Universities',
    description:
      'Explore engineering, general, medical, and agricultural universities across Bangladesh with verified admission data.',
    selectionType: 'top_rated',
    selectedUniversityIds: ['buet', 'du', 'kuet', 'ruet', 'cuet', 'medical'],
    maxDisplayCount: 6,
    enabled: true,
  },
  aiAdvisor: {
    title: 'Ask Anything About University Admission',
    description:
      'Confused about GPA criteria, second-time rules, unit conversions, or circular requirements? Ask EduGuide.',
    ctaText: 'Ask Admission Advisor',
    exampleQuestions: [
      { id: 'q1', text: 'Which universities are accepting applications right now?', category: 'Deadlines', order: 1, enabled: true },
      { id: 'q2', text: 'What is the BUET admission minimum GPA requirement?', category: 'Eligibility', order: 2, enabled: true },
      { id: 'q3', text: 'Which units can I apply to with SSC GPA 4.8 and HSC GPA 5.0?', category: 'Eligibility', order: 3, enabled: true },
      { id: 'q4', text: 'What are the main differences between BUET and DU Ka Unit exams?', category: 'Comparison', order: 4, enabled: true },
    ],
    enabled: true,
  },
  guideSection: {
    title: 'Admission Guides',
    description:
      'In-depth preparation guides, subject-wise weightage analysis, and circular breakdowns written by top scorers.',
    featuredArticleSlug: 'buet-admission-guide-2026',
    selectionMode: 'recent',
    selectedSlugs: ['buet-admission-guide-2026', 'du-ka-unit-guide', 'medical-admission-tips'],
    maxDisplayCount: 4,
    enabled: true,
  },
  preparation: {
    headline: 'Know where to apply. Now prepare to get in.',
    description:
      'Turn your target university and admission unit into a personalized preparation plan with visual lessons, chapter-wise MCQs, and past 15 years question bank.',
    features: [
      'Visual interactive lessons',
      'Chapter-wise MCQ practice drills',
      'Past 15 years solved admission questions',
      'Full-length timed mock test simulator',
      '24/7 AI Admission Tutor with step derivations',
      'Personalized mistake notebook & revision queue',
    ],
    ctaText: 'Start Preparing Free',
    ctaUrl: '/prepare',
    enabled: true,
  },
  faq: {
    title: 'Frequently Asked Questions',
    description:
      'Quick answers to common questions regarding Bangladesh university admission circulars, GPA rules, and preparation.',
    selectedFaqIds: ['faq-1', 'faq-2', 'faq-3', 'faq-4', 'faq-5'],
    enabled: true,
  },
  footer: {
    description:
      'EduGuide is Bangladesh’s premier data-driven university admission intelligence and preparation platform, consolidating official circulars, GPA rules, deadlines, and smart preparation in one unified place.',
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
          { label: 'Medical Tips', url: '/guides' },
        ],
      },
      {
        title: 'Platform',
        links: [
          { label: 'Pricing & Passes', url: '/pricing' },
          { label: 'Terms of Service', url: '#' },
          { label: 'Privacy Policy', url: '#' },
        ],
      },
    ],
    copyrightText:
      '© 2026 EduGuide Bangladesh. All rights reserved. Official admission data sourced from university circulars.',
    enabled: true,
  },
  seo: {
    metaTitle: 'EduGuide — Bangladesh University Admission Intelligence & Preparation Platform 2026',
    metaDescription:
      'Check university admission circulars, GPA requirements, and deadlines. Prepare with AI tutor, chapter MCQs, and past questions.',
    keywords: [
      'Bangladesh university admission 2026',
      'BUET admission circular',
      'DU Ka Unit admission',
      'Medical admission 2026',
      'GST admission circular',
      'Admission eligibility checker',
    ],
    ogImage: '/og-image.png',
    canonicalUrl: 'https://eduguide.com.bd',
  },
};
