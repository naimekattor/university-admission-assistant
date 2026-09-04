export type CommunityRole = 'student' | 'senior' | 'teacher' | 'admin';

export type QuestionType =
  | 'Admission Information'
  | 'Conceptual'
  | 'Problem Solving'
  | 'MCQ'
  | 'Subjective'
  | 'Study Strategy'
  | 'University Guidance'
  | 'Other';

export type ContentStatus = 'published' | 'pending' | 'flagged' | 'hidden' | 'deleted';

export interface CreateQuestionInput {
  title: string;
  content: string;
  categoryId?: string;
  categorySlug?: string;
  subjectId?: string;
  chapterId?: string;
  topicId?: string;
  universityId?: string;
  unit?: string;
  questionType?: QuestionType;
  authorName?: string;
  authorRole?: CommunityRole;
  authorBadge?: string;
  sessionToken: string;
  tags?: string[];
}

export interface CreateAnswerInput {
  questionId: string;
  content: string;
  parentAnswerId?: string;
  authorName?: string;
  authorRole?: CommunityRole;
  authorBadge?: string;
  sessionToken: string;
}

export interface QuestionFilterParams {
  category?: string;
  subject?: string;
  university?: string;
  questionType?: string;
  search?: string;
  sort?: 'latest' | 'popular' | 'unanswered' | 'most-voted';
  status?: string;
  sessionToken?: string;
  onlyMine?: boolean;
  onlySaved?: boolean;
  page?: number;
  limit?: number;
}
