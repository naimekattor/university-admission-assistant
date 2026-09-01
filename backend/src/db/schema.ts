import { pgTable, text, timestamp, integer, boolean, jsonb, uuid, customType, doublePrecision } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Custom pgvector type for vector embeddings
export const vector = customType<{ data: number[] }>({
  dataType() {
    return 'vector(768)';
  },
  toDriver(value: number[]): string {
    return JSON.stringify(value);
  },
  fromDriver(value: unknown): number[] {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return (value as number[]) || [];
  },
});

// ==========================================
// 1. SESSIONS & ANONYMOUS TRACKING
// ==========================================
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionToken: text('session_token').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastActiveAt: timestamp('last_active_at').defaultNow().notNull(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
});

export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  action: text('action').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  role: text('role').notNull(), // 'user' or 'assistant'
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  hscMarks: integer('hsc_marks'),
  subjects: jsonb('subjects'),
  preferences: jsonb('preferences'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// 2. STUDENTS & PROFILES
// ==========================================
export const students = pgTable('students', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id),
  email: text('email').unique(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const studentProfiles = pgTable('student_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').references(() => students.id).notNull().unique(),
  academicGroup: text('academic_group').notNull(), // 'Science' | 'Commerce' | 'Humanities'
  sscGpa: doublePrecision('ssc_gpa').notNull(),
  hscGpa: doublePrecision('hsc_gpa').notNull(),
  passingYear: integer('passing_year').notNull(),
  primaryGoal: text('primary_goal'), // e.g., 'BUET CSE'
  secondaryGoals: jsonb('secondary_goals'), // e.g. ['RUET CSE', 'DU CSE']
  availableStudyHours: doublePrecision('available_study_hours').default(4.0),
  preferredLocation: text('preferred_location'),
  examDate: timestamp('exam_date'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// 3. UNIVERSITIES & ADMISSIONS
// ==========================================
export const universities = pgTable('universities', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  shortName: text('short_name').notNull().unique(),
  description: text('description'),
  location: text('location'),
  website: text('website'),
  logo: text('logo'),
  foundedYear: integer('founded_year'),
  admissionType: text('admission_type'), // 'merit', 'quota', 'both'
  cutoffMarks: integer('cutoff_marks'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const programs = pgTable('programs', {
  id: uuid('id').primaryKey().defaultRandom(),
  universityId: uuid('university_id').references(() => universities.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  duration: text('duration'),
  seats: integer('seats'),
  cutoffMarks: integer('cutoff_marks'),
  subjects: jsonb('subjects'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const eligibilityCriteria = pgTable('eligibility_criteria', {
  id: uuid('id').primaryKey().defaultRandom(),
  programId: uuid('program_id').references(() => programs.id).notNull(),
  minHscMarks: integer('min_hsc_marks'),
  minGpa: text('min_gpa'),
  requiredSubjects: jsonb('required_subjects'),
  physicalEligibility: text('physical_eligibility'),
  ageLimit: text('age_limit'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const admissionCirculars = pgTable('admission_circulars', {
  id: uuid('id').primaryKey().defaultRandom(),
  universityId: uuid('university_id').references(() => universities.id).notNull(),
  title: text('title').notNull(),
  unit: text('unit'),
  year: integer('year').notNull(),
  applicationStartDate: timestamp('application_start_date'),
  applicationEndDate: timestamp('application_end_date'),
  examDate: timestamp('exam_date'),
  resultDate: timestamp('result_date'),
  officialUrl: text('official_url'),
  summary: text('summary'),
  requirements: jsonb('requirements'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 4. CURRICULUM HIERARCHY
// ==========================================
export const subjects = pgTable('subjects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(), // e.g., 'Physics', 'Chemistry', 'Higher Math'
  slug: text('slug').notNull().unique(),
  code: text('code'),
  description: text('description'),
  icon: text('icon'),
  color: text('color'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const chapters = pgTable('chapters', {
  id: uuid('id').primaryKey().defaultRandom(),
  subjectId: uuid('subject_id').references(() => subjects.id).notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  paper: integer('paper').default(1), // 1st Paper or 2nd Paper
  order: integer('order').default(0),
  weightage: doublePrecision('weightage').default(1.0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const topics = pgTable('topics', {
  id: uuid('id').primaryKey().defaultRandom(),
  chapterId: uuid('chapter_id').references(() => chapters.id).notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const concepts = pgTable('concepts', {
  id: uuid('id').primaryKey().defaultRandom(),
  topicId: uuid('topic_id').references(() => topics.id).notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  summary: text('summary'),
  difficulty: text('difficulty').default('medium'), // 'easy' | 'medium' | 'hard'
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const lessons = pgTable('lessons', {
  id: uuid('id').primaryKey().defaultRandom(),
  conceptId: uuid('concept_id').references(() => concepts.id).notNull(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  summary: text('summary'),
  content: text('content').notNull(), // Detailed markdown notes
  learningObjectives: jsonb('learning_objectives'),
  estimatedMinutes: integer('estimated_minutes').default(30),
  visualType: text('visual_type').default('none'), // 'none' | 'diagram' | 'animation' | 'interactive' | 'simulation' | '3d'
  visualConfig: jsonb('visual_config'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const lessonAssets = pgTable('lesson_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  lessonId: uuid('lesson_id').references(() => lessons.id).notNull(),
  type: text('type').notNull(), // 'image' | 'svg' | 'json_animation' | 'interactive_canvas'
  url: text('url'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 5. QUESTION BANK & PRACTICE
// ==========================================
export const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  conceptId: uuid('concept_id').references(() => concepts.id),
  chapterId: uuid('chapter_id').references(() => chapters.id),
  subjectId: uuid('subject_id').references(() => subjects.id),
  questionText: text('question_text').notNull(),
  questionImage: text('question_image'),
  correctOptionIndex: integer('correct_option_index').notNull(),
  explanation: text('explanation').notNull(),
  difficulty: text('difficulty').default('medium'), // 'easy' | 'medium' | 'hard'
  source: text('source'), // e.g. 'BUET 2023', 'DU 2024'
  universityTag: text('university_tag'),
  yearTag: integer('year_tag'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const questionOptions = pgTable('question_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  questionId: uuid('question_id').references(() => questions.id).notNull(),
  optionIndex: integer('option_index').notNull(),
  optionText: text('option_text').notNull(),
  optionImage: text('option_image'),
});

// ==========================================
// 6. EXAMS & MOCK TESTS
// ==========================================
export const mockTests = pgTable('mock_tests', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  targetUniversity: text('target_university'),
  targetUnit: text('target_unit'),
  durationMinutes: integer('duration_minutes').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  totalMarks: doublePrecision('total_marks').notNull(),
  negativeMarkPerWrong: doublePrecision('negative_mark_per_wrong').default(0.25),
  isPublished: boolean('is_published').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const mockTestQuestions = pgTable('mock_test_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  mockTestId: uuid('mock_test_id').references(() => mockTests.id).notNull(),
  questionId: uuid('question_id').references(() => questions.id).notNull(),
  order: integer('order').notNull(),
  marks: doublePrecision('marks').default(1.0),
});

export const testAttempts = pgTable('test_attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  studentId: uuid('student_id').references(() => students.id),
  mockTestId: uuid('mock_test_id').references(() => mockTests.id).notNull(),
  score: doublePrecision('score').default(0),
  correctAnswersCount: integer('correct_answers_count').default(0),
  incorrectAnswersCount: integer('incorrect_answers_count').default(0),
  unansweredCount: integer('unanswered_count').default(0),
  timeSpentSeconds: integer('time_spent_seconds').default(0),
  accuracy: doublePrecision('accuracy').default(0),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const testAnswers = pgTable('test_answers', {
  id: uuid('id').primaryKey().defaultRandom(),
  attemptId: uuid('attempt_id').references(() => testAttempts.id).notNull(),
  questionId: uuid('question_id').references(() => questions.id).notNull(),
  selectedOptionIndex: integer('selected_option_index'),
  isCorrect: boolean('is_correct').default(false),
  timeSpentSeconds: integer('time_spent_seconds').default(0),
  markedForReview: boolean('marked_for_review').default(false),
});

// ==========================================
// 7. STUDENT PROGRESS, MISTAKES & REVISION
// ==========================================
export const studentProgress = pgTable('student_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  studentId: uuid('student_id').references(() => students.id),
  overallProgressPercentage: doublePrecision('overall_progress_percentage').default(0),
  streakDays: integer('streak_days').default(0),
  totalQuestionsSolved: integer('total_questions_solved').default(0),
  totalMockTestsCompleted: integer('total_mock_tests_completed').default(0),
  lastStudyDate: timestamp('last_study_date'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const studentTopicProgress = pgTable('student_topic_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  topicId: uuid('topic_id').references(() => topics.id).notNull(),
  masteryPercentage: doublePrecision('mastery_percentage').default(0),
  totalAttempts: integer('total_attempts').default(0),
  correctCount: integer('correct_count').default(0),
  status: text('status').default('unstudied'), // 'unstudied' | 'weak' | 'moderate' | 'strong'
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const studentMistakes = pgTable('student_mistakes', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  questionId: uuid('question_id').references(() => questions.id).notNull(),
  userSelectedOption: integer('user_selected_option'),
  mistakeCount: integer('mistake_count').default(1),
  isReviewed: boolean('is_reviewed').default(false),
  lastAttemptedAt: timestamp('last_attempted_at').defaultNow().notNull(),
});

export const revisionItems = pgTable('revision_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  topicId: uuid('topic_id').references(() => topics.id),
  questionId: uuid('question_id').references(() => questions.id),
  title: text('title').notNull(),
  subjectName: text('subject_name').notNull(),
  chapterName: text('chapter_name').notNull(),
  dueDate: timestamp('due_date').notNull(),
  isCompleted: boolean('is_completed').default(false),
  priority: text('priority').default('medium'), // 'high' | 'medium' | 'low'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 8. PERSONALIZED STUDY PLANS
// ==========================================
export const studyPlans = pgTable('study_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  studentId: uuid('student_id').references(() => students.id),
  targetGoal: text('target_goal').notNull(),
  durationDays: integer('duration_days').default(30),
  dailyHours: doublePrecision('daily_hours').default(3.0),
  summary: text('summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const studyPlanItems = pgTable('study_plan_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  planId: uuid('plan_id').references(() => studyPlans.id).notNull(),
  dayNumber: integer('day_number').notNull(),
  subjectName: text('subject_name').notNull(),
  chapterName: text('chapter_name').notNull(),
  topicName: text('topic_name'),
  taskType: text('task_type').notNull(), // 'lesson' | 'practice' | 'revision' | 'mock_test'
  allocatedMinutes: integer('allocated_minutes').notNull(),
  isCompleted: boolean('is_completed').default(false),
});

// ==========================================
// 9. RAG & DOCUMENTS (PostgreSQL + pgvector)
// ==========================================
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  originalFileName: text('original_file_name').notNull(),
  filePath: text('file_path'),
  university: text('university').notNull(),
  unit: text('unit'),
  year: integer('year'),
  documentType: text('document_type'),
  chunkCount: integer('chunk_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const documentChunks = pgTable('document_chunks', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id').references(() => documents.id),
  chunkIndex: integer('chunk_index').notNull(),
  content: text('content').notNull(),
  embedding: vector('embedding'),
  source: text('source').notNull(),
  sourceUrl: text('source_url'),
  university: text('university'),
  unit: text('unit'),
  subject: text('subject'),
  chapter: text('chapter'),
  topic: text('topic'),
  year: integer('year'),
  page: integer('page').default(1),
  contentType: text('content_type').default('circular'), // 'circular' | 'prospectus' | 'faq' | 'question_bank' | 'lesson'
  embeddingModel: text('embedding_model').default('embedding-001'),
  embeddingDimension: integer('embedding_dimension').default(768),
  embeddingVersion: text('embedding_version').default('v1'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// 10. AI USAGE & TELEMETRY
// ==========================================
export const aiConversations = pgTable('ai_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  roleType: text('role_type').default('advisor'), // 'advisor' | 'tutor'
  title: text('title').default('New Conversation'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const aiMessages = pgTable('ai_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => aiConversations.id).notNull(),
  role: text('role').notNull(), // 'user' | 'assistant'
  content: text('content').notNull(),
  structuredContent: jsonb('structured_content'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const aiUsage = pgTable('ai_usage', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id),
  studentId: uuid('student_id').references(() => students.id),
  requestType: text('request_type').notNull(), // 'chat' | 'tutor' | 'rag' | 'study_plan' | 'lesson' | 'question_explanation'
  model: text('model').notNull(),
  inputTokens: integer('input_tokens').default(0),
  outputTokens: integer('output_tokens').default(0),
  estimatedCost: doublePrecision('estimated_cost').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 11. ARTICLES, GUIDES & SEO
// ==========================================
export const articleCategories = pgTable('article_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
});

export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').references(() => articleCategories.id),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  summary: text('summary').notNull(),
  content: text('content').notNull(), // Markdown
  readingTimeMinutes: integer('reading_time_minutes').default(5),
  featuredImage: text('featured_image'),
  isPublished: boolean('is_published').default(true),
  seoKeywords: jsonb('seo_keywords'),
  relatedUniversity: text('related_university'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// 12. SUBSCRIPTIONS & SAAS ENTITLEMENTS
// ==========================================
export const subscriptionPlans = pgTable('subscription_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // 'Free' | 'Premium Admission Pass'
  code: text('code').notNull().unique(), // 'free' | 'premium'
  priceBdt: doublePrecision('price_bdt').notNull().default(0),
  durationDays: integer('duration_days').default(30),
  features: jsonb('features'),
});

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').references(() => students.id).notNull(),
  planId: uuid('plan_id').references(() => subscriptionPlans.id).notNull(),
  status: text('status').notNull().default('active'), // 'active' | 'expired' | 'cancelled'
  startDate: timestamp('start_date').defaultNow().notNull(),
  expiryDate: timestamp('expiry_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// RELATIONS DEFINITIONS
// ==========================================
export const sessionsRelations = relations(sessions, ({ many }) => ({
  activityLogs: many(activityLogs),
  chatMessages: many(chatMessages),
  userPreferences: many(userPreferences),
}));

export const universitiesRelations = relations(universities, ({ many }) => ({
  programs: many(programs),
  circulars: many(admissionCirculars),
}));

export const programsRelations = relations(programs, ({ one, many }) => ({
  university: one(universities, {
    fields: [programs.universityId],
    references: [universities.id],
  }),
  eligibilityCriteria: many(eligibilityCriteria),
}));

export const eligibilityCriteriaRelations = relations(eligibilityCriteria, ({ one }) => ({
  program: one(programs, {
    fields: [eligibilityCriteria.programId],
    references: [programs.id],
  }),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  chapters: many(chapters),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [chapters.subjectId],
    references: [subjects.id],
  }),
  topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [topics.chapterId],
    references: [chapters.id],
  }),
  concepts: many(concepts),
}));

export const conceptsRelations = relations(concepts, ({ one, many }) => ({
  topic: one(topics, {
    fields: [concepts.topicId],
    references: [topics.id],
  }),
  lessons: many(lessons),
  questions: many(questions),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  concept: one(concepts, {
    fields: [lessons.conceptId],
    references: [concepts.id],
  }),
  assets: many(lessonAssets),
}));