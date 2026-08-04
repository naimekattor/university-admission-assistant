import { pgTable, text, timestamp, integer, boolean, jsonb, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { year } from 'drizzle-orm/mysql-core';

// Sessions - for anonymous user tracking
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionToken: text('session_token').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastActiveAt: timestamp('last_active_at').defaultNow().notNull(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
});

// Activity logs - track user interactions
export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  action: text('action').notNull(), // 'chat', 'eligibility_check', 'view_university', etc.
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Chat history - store conversations per session
export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  role: text('role').notNull(), // 'user' or 'assistant'
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Universities - placeholder data
export const universities = pgTable('universities', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  shortName: text('short_name').notNull().unique(),
  description: text('description'),
  location: text('location'),
  website: text('website'),
  logo: text('logo'), // URL or emoji
  foundedYear: integer('founded_year'),
  admissionType: text('admission_type'), // 'merit', 'quota', 'both'
  cutoffMarks: integer('cutoff_marks'), // HSC marks cutoff
  metadata: jsonb('metadata'), // Additional data like rankings, stats
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Programs - degree programs offered
export const programs = pgTable('programs', {
  id: uuid('id').primaryKey().defaultRandom(),
  universityId: uuid('university_id').references(() => universities.id).notNull(),
  name: text('name').notNull(), // e.g., "Computer Science", "Medicine"
  description: text('description'),
  duration: text('duration'), // e.g., "4 years"
  seats: integer('seats'),
  cutoffMarks: integer('cutoff_marks'),
  subjects: jsonb('subjects'), // Required HSC subjects
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Eligibility criteria
export const eligibilityCriteria = pgTable('eligibility_criteria', {
  id: uuid('id').primaryKey().defaultRandom(),
  programId: uuid('program_id').references(() => programs.id).notNull(),
  minHscMarks: integer('min_hsc_marks'),
  minGpa: text('min_gpa'), // e.g., "3.5"
  requiredSubjects: jsonb('required_subjects'), // JSON array
  physicalEligibility: text('physical_eligibility'),
  ageLimit: text('age_limit'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User preferences - for recommendations
export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  hscMarks: integer('hsc_marks'),
  subjects: jsonb('subjects'), // JSON array of selected subjects
  preferences: jsonb('preferences'), // Location, field of study, etc.
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const sessionsRelations = relations(sessions, ({ many }) => ({
  activityLogs: many(activityLogs),
  chatMessages: many(chatMessages),
  userPreferences: many(userPreferences),
}));

export const universitiesRelations = relations(universities, ({ many }) => ({
  programs: many(programs),
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

//documents table 
export const documents = pgTable('documents',{
  id: uuid('id').primaryKey().defaultRandom(),
  originalFileName: text('original_file_name').notNull(),
  university: text('university').notNull(),
  unit: text('unit'),
  year: integer('year'),
  documentType: text('document_type'),
  chunkCount: integer('chunk_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})