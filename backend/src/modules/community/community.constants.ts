export const COMMUNITY_LIMITS = {
  MAX_PAGE_LIMIT: 50,
  DEFAULT_PAGE_LIMIT: 15,
  MAX_TITLE_LENGTH: 250,
  MIN_TITLE_LENGTH: 8,
  MAX_CONTENT_LENGTH: 20000,
  MIN_CONTENT_LENGTH: 10,
  MAX_TAGS_PER_QUESTION: 8,
  RATE_LIMIT_QUESTIONS_PER_HOUR: 10,
  RATE_LIMIT_ANSWERS_PER_HOUR: 30,
  RATE_LIMIT_VOTES_PER_HOUR: 300,
  RATE_LIMIT_REPORTS_PER_HOUR: 20,
};

export const DEFAULT_COMMUNITY_CATEGORIES = [
  { name: 'All Questions', slug: 'all', icon: 'Compass', color: '#FF5500' },
  { name: 'Admission Circulars & Guidelines', slug: 'admission', icon: 'GraduationCap', color: '#FF5500' },
  { name: 'Higher Mathematics', slug: 'mathematics', icon: 'Sigma', color: '#3b82f6' },
  { name: 'Physics', slug: 'physics', icon: 'Zap', color: '#f59e0b' },
  { name: 'Chemistry', slug: 'chemistry', icon: 'FlaskConical', color: '#10b981' },
  { name: 'Biology', slug: 'biology', icon: 'Dna', color: '#ec4899' },
  { name: 'English & General Knowledge', slug: 'english', icon: 'Languages', color: '#8b5cf6' },
  { name: 'University Guidance & Prep', slug: 'university', icon: 'Building2', color: '#06b6d4' },
];
