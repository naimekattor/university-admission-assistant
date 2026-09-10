export interface GuideItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  readingTimeMinutes?: number;
  publishedDate?: string;
  createdAt?: string;
  featuredImage?: string;
}

export const FALLBACK_GUIDES: GuideItem[] = [
  {
    id: 'g1',
    title: 'BUET Admission Complete Preparation Guide 2026',
    slug: 'buet-admission-guide-2026',
    summary: 'Essential strategies for BUET undergraduate engineering admission: preliminary MCQ screening, final written examination structure, calculator usage rules, and high-yield physics and math topics.',
    category: 'Engineering',
    readingTimeMinutes: 8,
    publishedDate: 'January 2026',
    featuredImage: '/images/study-platform-mockup.svg',
    content: `
## Overview of BUET Undergraduate Admission

The Bangladesh University of Engineering and Technology (BUET) admission exam is widely recognized as the most rigorous and prestigious undergraduate STEM competitive test in Bangladesh.

### Two-Step Selection Process

1. **Preliminary Screening (MCQ)**: Top applicants shortlisted based on SSC & HSC science marks take a 100-mark preliminary MCQ screening test covering Physics, Chemistry, and Higher Mathematics.
2. **Final Written Test (400 Marks)**: The top qualifying candidates from the preliminary exam sit for the 400-mark written test without calculator usage restrictions specified in the circular.

### High-Yield Subject Breakdown

- **Higher Mathematics (150 Marks)**: Focus heavily on Calculus (Definite Integrals, Differential Equations, Tangents & Normals), Vectors, Coordinate Geometry, and Trigonometric Equations.
- **Physics (150 Marks)**: Newton's Laws of Motion, Work Energy Power, Rotational Dynamics, Thermodynamics, Waves, and Modern Physics.
- **Chemistry (100 Marks)**: Chemical Bonding, Hybridization, Organic Chemistry Reaction Mechanisms, Molarity, Titration, Electrochemistry, and Buffer Solutions.

### Key Advice from Top Rankers

- **Concept Clarity Over Memorization**: Questions test multi-step derivation and physical intuition.
- **Speed & Precision**: Practice writing out clear mathematical steps without skipping intermediate equations.
- **Time Management**: Divide the 120-minute written window strictly across subjects.
    `,
  },
  {
    id: 'g2',
    title: 'Dhaka University Ka Unit Admission Strategy 2026',
    slug: 'du-ka-unit-guide',
    summary: 'Comprehensive roadmap for DU Faculty of Science (Ka Unit): 60 MCQ + 40 Written mark distribution, negative marking strategies, and subject selection tactics for Physics, Chemistry, Math, and Biology.',
    category: 'General Science',
    readingTimeMinutes: 7,
    publishedDate: 'January 2026',
    featuredImage: '/images/study-platform-mockup.svg',
    content: `
## Understanding DU Ka Unit (Faculty of Science)

The University of Dhaka Ka Unit exam admits students into top departments including Computer Science & Engineering (CSE), Electrical and Electronic Engineering (EEE), Pharmacy, Applied Chemistry, and Biochemistry.

### Examination Format

- **Total Marks**: 100 Marks (60 MCQ + 40 Written) within 90 minutes.
- **Subjects**: Physics (25), Chemistry (25), and 2 optional choices from Higher Math, Biology, Bangla, or English (25 marks each).
- **Negative Marking**: 0.25 marks deducted per incorrect MCQ answer.

### Scoring Strategy for CSE & Pharmacy

- **For CSE & Engineering**: Higher Mathematics is mandatory. Focus heavily on 1st & 2nd paper calculus, matrices, and vectors.
- **For Pharmacy & Life Sciences**: Biology is mandatory. Emphasize Cell Biology, Genetics, Plant Physiology, and Human Organ Systems.

### Written Section Preparation

Practice answering short questions in 2-3 sentences and solving mathematical problems within designated 4-5 line answer boxes.
    `,
  },
  {
    id: 'g3',
    title: 'Medical Admission Test (MBBS/BDS) High-Yield Checklist',
    slug: 'medical-admission-guide',
    summary: 'Proven preparation tactics for the DGHS 100-mark centralized Medical and Dental admission test: Biology NCERT/NCTB line-by-line review, Chemistry reactions, Physics formulas, and General Knowledge focus.',
    category: 'Medical',
    readingTimeMinutes: 6,
    publishedDate: 'January 2026',
    featuredImage: '/images/study-platform-mockup.svg',
    content: `
## Centralized Medical (MBBS) Admission Overview

Conducted by the Directorate General of Health Services (DGHS), the medical admission test determines placements in 37 government medical colleges (over 5,300 seats) and 12 dental colleges nationwide.

### 100-Mark MCQ Distribution

- **Biology (30 Marks)**: Botany (15) and Zoology (15).
- **Chemistry (25 Marks)**: Inorganic, Organic, and Environmental Chemistry.
- **Physics (20 Marks)**: Formulas, units, direct concept applications.
- **English (15 Marks)**: Prepositions, Vocabulary, Voice, Narration, Corrections.
- **General Knowledge (10 Marks)**: History of Bangladesh, Liberation War 1971, National Achievements.

### Top Medical Preparation Rule

Read NCTB textbooks thoroughly. Over 90% of Biology questions are extracted directly from standard NCTB textbook statements.
    `,
  },
];

export function getGuideBySlug(slug: string): GuideItem | undefined {
  if (!slug) return undefined;
  const clean = slug.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
  return FALLBACK_GUIDES.find((g) => g.slug.toLowerCase() === clean || clean.includes(g.slug) || g.slug.includes(clean));
}
