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

export interface CommunityTag {
  id: string;
  name: string;
  slug: string;
  usage_count?: number;
}

export interface CommunityCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  sort_order?: number;
  question_count?: number;
}

export interface CommunityAnswer {
  id: string;
  question_id: string;
  parent_answer_id?: string | null;
  author_name: string;
  author_role: CommunityRole;
  is_verified_author: boolean;
  author_badge?: string | null;
  content: string;
  content_format?: string;
  is_accepted: boolean;
  vote_count: number;
  created_at: string;
  user_vote?: number;
  replies?: CommunityAnswer[];
}

export interface CommunityQuestion {
  id: string;
  title: string;
  slug: string;
  content: string;
  content_format?: string;
  author_name: string;
  author_role: CommunityRole;
  is_verified_author: boolean;
  author_badge?: string | null;
  question_type: QuestionType;
  unit?: string | null;
  status: 'published' | 'hidden' | 'flagged' | 'deleted';
  accepted_answer_id?: string | null;
  answer_count: number;
  vote_count: number;
  view_count: number;
  is_pinned: boolean;
  created_at: string;
  last_activity_at: string;
  category_name?: string;
  category_slug?: string;
  subject_name?: string;
  subject_slug?: string;
  university_name?: string;
  university_short_name?: string;
  tags?: CommunityTag[];
  is_bookmarked?: boolean;
  user_vote?: number;
}

export interface QuestionDetailResponse {
  question: CommunityQuestion;
  answers: CommunityAnswer[];
  relatedCurriculum?: {
    subjectName: string;
    lessonTitle: string;
    lessonSlug: string;
    practiceUrl: string;
    lessonUrl: string;
  } | null;
}

export interface CreateQuestionPayload {
  title: string;
  content: string;
  categorySlug?: string;
  categoryId?: string;
  subjectId?: string;
  universityId?: string;
  unit?: string;
  questionType?: QuestionType;
  authorName?: string;
  tags?: string[];
}

export interface CreateAnswerPayload {
  questionId: string;
  content: string;
  parentAnswerId?: string;
  authorName?: string;
}
