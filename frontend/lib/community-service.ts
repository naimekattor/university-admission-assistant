import {
  CommunityCategory,
  CommunityQuestion,
  QuestionDetailResponse,
  CommunityTag,
  CreateQuestionPayload,
  CreateAnswerPayload,
} from './community-types';

const RAW_API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api` : 'http://localhost:4000/api');

const API_BASE = `${RAW_API_BASE.replace(/\/+$/, '')}/community`;

const SESSION_STORAGE_KEY = 'eduguide_community_session_token';
const AUTHOR_NAME_STORAGE_KEY = 'eduguide_community_author_name';

/**
 * Get or generate persistent client session token
 */
export function getCommunitySessionToken(): string {
  if (typeof window === 'undefined') return 'server-session';
  let token = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!token) {
    token = 'comm_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem(SESSION_STORAGE_KEY, token);
  }
  return token;
}

/**
 * Remember student's preferred display name
 */
export function getStoredAuthorName(): string {
  if (typeof window === 'undefined') return 'HSC Student';
  return localStorage.getItem(AUTHOR_NAME_STORAGE_KEY) || '';
}

export function setStoredAuthorName(name: string): void {
  if (typeof window === 'undefined') return;
  if (name && name.trim()) {
    localStorage.setItem(AUTHOR_NAME_STORAGE_KEY, name.trim());
  }
}

/**
 * Fetch Categories
 */
export async function fetchCommunityCategories(): Promise<CommunityCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn('[communityService] Error fetching categories:', err);
    return [
      { id: '1', name: 'All Questions', slug: 'all', icon: 'Compass', color: '#FF5500', question_count: 14 },
      { id: '2', name: 'Admission Circulars & Guidelines', slug: 'admission', icon: 'GraduationCap', color: '#FF5500', question_count: 8 },
      { id: '3', name: 'Higher Mathematics', slug: 'mathematics', icon: 'Sigma', color: '#3b82f6', question_count: 12 },
      { id: '4', name: 'Physics', slug: 'physics', icon: 'Zap', color: '#f59e0b', question_count: 9 },
      { id: '5', name: 'Chemistry', slug: 'chemistry', icon: 'FlaskConical', color: '#10b981', question_count: 7 },
      { id: '6', name: 'Biology', slug: 'biology', icon: 'Dna', color: '#ec4899', question_count: 4 },
      { id: '7', name: 'English & General Knowledge', slug: 'english', icon: 'Languages', color: '#8b5cf6', question_count: 5 },
      { id: '8', name: 'University Guidance & Prep', slug: 'university', icon: 'Building2', color: '#06b6d4', question_count: 6 },
    ];
  }
}

/**
 * Fetch Popular Tags
 */
export async function fetchPopularTags(): Promise<CommunityTag[]> {
  try {
    const res = await fetch(`${API_BASE}/tags/popular`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch tags');
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    return [
      { id: 't1', name: 'Calculus', slug: 'calculus', usage_count: 42 },
      { id: 't2', name: 'BUET 2026', slug: 'buet-2026', usage_count: 38 },
      { id: 't3', name: 'DU A Unit', slug: 'du-a-unit', usage_count: 31 },
      { id: 't4', name: 'Mechanics', slug: 'mechanics', usage_count: 26 },
      { id: 't5', name: 'Integration', slug: 'integration', usage_count: 22 },
      { id: 't6', name: 'Cutoff Marks', slug: 'cutoff-marks', usage_count: 19 },
    ];
  }
}

/**
 * Fetch Questions Feed
 */
export async function fetchQuestions(params: {
  category?: string;
  subject?: string;
  university?: string;
  questionType?: string;
  search?: string;
  sort?: string;
  status?: string;
  page?: number;
  limit?: number;
  onlyMine?: boolean;
  onlySaved?: boolean;
}): Promise<{
  questions: CommunityQuestion[];
  pagination: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean };
}> {
  const sessionToken = getCommunitySessionToken();
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.subject) query.set('subject', params.subject);
  if (params.university) query.set('university', params.university);
  if (params.questionType) query.set('questionType', params.questionType);
  if (params.search) query.set('search', params.search);
  if (params.sort) query.set('sort', params.sort);
  if (params.status) query.set('status', params.status);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.onlyMine) query.set('onlyMine', 'true');
  if (params.onlySaved) query.set('onlySaved', 'true');
  query.set('sessionToken', sessionToken);

  try {
    const res = await fetch(`${API_BASE}/questions?${query.toString()}`, {
      headers: { 'x-session-id': sessionToken },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch questions feed');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('[communityService] Error fetching questions:', err);
    return {
      questions: [],
      pagination: { page: 1, limit: 15, total: 0, totalPages: 1, hasNextPage: false },
    };
  }
}

/**
 * Fetch Question Detail by Slug
 */
export async function fetchQuestionBySlug(slug: string): Promise<QuestionDetailResponse | null> {
  const sessionToken = getCommunitySessionToken();
  try {
    const res = await fetch(`${API_BASE}/questions/${encodeURIComponent(slug)}?sessionToken=${encodeURIComponent(sessionToken)}`, {
      headers: { 'x-session-id': sessionToken },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch (err) {
    console.warn('[communityService] Error fetching question detail:', err);
    return null;
  }
}

/**
 * Post a new Question (Zero-Barrier Public)
 */
export async function createQuestion(payload: CreateQuestionPayload): Promise<CommunityQuestion> {
  const sessionToken = getCommunitySessionToken();
  if (payload.authorName) {
    setStoredAuthorName(payload.authorName);
  }

  const res = await fetch(`${API_BASE}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': sessionToken,
    },
    body: JSON.stringify({
      ...payload,
      sessionToken,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to post question');
  }
  return data.data;
}

/**
 * Post an Answer (Zero-Barrier Public)
 */
export async function createAnswer(payload: CreateAnswerPayload): Promise<any> {
  const sessionToken = getCommunitySessionToken();
  if (payload.authorName) {
    setStoredAuthorName(payload.authorName);
  }

  const res = await fetch(`${API_BASE}/questions/${encodeURIComponent(payload.questionId)}/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': sessionToken,
    },
    body: JSON.stringify({
      ...payload,
      sessionToken,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to post answer');
  }
  return data.data;
}

/**
 * Vote on a Question (+1, -1, 0)
 */
export async function voteQuestion(questionId: string, vote: number): Promise<{ voteCount: number; userVote: number }> {
  const sessionToken = getCommunitySessionToken();
  const res = await fetch(`${API_BASE}/questions/${encodeURIComponent(questionId)}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': sessionToken,
    },
    body: JSON.stringify({ vote, sessionToken }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to vote');
  return data.data;
}

/**
 * Vote on an Answer (+1, -1, 0)
 */
export async function voteAnswer(answerId: string, vote: number): Promise<{ voteCount: number; userVote: number }> {
  const sessionToken = getCommunitySessionToken();
  const res = await fetch(`${API_BASE}/answers/${encodeURIComponent(answerId)}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': sessionToken,
    },
    body: JSON.stringify({ vote, sessionToken }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to vote');
  return data.data;
}

/**
 * Mark an Answer as Accepted
 */
export async function acceptAnswer(questionId: string, answerId: string): Promise<void> {
  const sessionToken = getCommunitySessionToken();
  const res = await fetch(`${API_BASE}/questions/${encodeURIComponent(questionId)}/accept-answer/${encodeURIComponent(answerId)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': sessionToken,
    },
    body: JSON.stringify({ sessionToken }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to accept answer');
}

/**
 * Toggle Bookmark
 */
export async function toggleBookmark(questionId: string): Promise<boolean> {
  const sessionToken = getCommunitySessionToken();
  const res = await fetch(`${API_BASE}/questions/${encodeURIComponent(questionId)}/bookmark`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': sessionToken,
    },
    body: JSON.stringify({ sessionToken }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to toggle bookmark');
  return data.data.isBookmarked;
}

/**
 * Report Content
 */
export async function submitReport(payload: {
  questionId?: string;
  answerId?: string;
  reason: string;
  description?: string;
}): Promise<string> {
  const sessionToken = getCommunitySessionToken();
  const res = await fetch(`${API_BASE}/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': sessionToken,
    },
    body: JSON.stringify({ ...payload, sessionToken }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to submit report');
  return data.message;
}

/**
 * Check Similar Questions for Duplicate Prevention
 */
export async function checkSimilarQuestions(query: string): Promise<Array<{ id: string; title: string; slug: string; answer_count: number; vote_count: number }>> {
  if (!query || query.trim().length < 4) return [];
  try {
    const res = await fetch(`${API_BASE}/similar?q=${encodeURIComponent(query.trim())}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}
