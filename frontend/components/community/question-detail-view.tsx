'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Building2,
  Clock,
  Eye,
  CheckCircle2,
  Share2,
  Bookmark,
  Sparkles,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { QuestionDetailResponse, CommunityAnswer } from '@/lib/community-types';
import { MathRenderer } from './math-renderer';
import { ContributorBadge } from './contributor-badge';
import { VoteControl } from './vote-control';
import { BookmarkButton } from './bookmark-button';
import { ReportDialog } from './report-dialog';
import { AnswerCard } from './answer-card';
import { AnswerComposer } from './answer-composer';
import { RelatedCurriculum } from './related-curriculum';
import { acceptAnswer, fetchQuestionBySlug } from '@/lib/community-service';

interface QuestionDetailViewProps {
  initialData?: QuestionDetailResponse | null;
  slug?: string;
}

function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  } catch {
    return 'recently';
  }
}

export function QuestionDetailView({ initialData, slug }: QuestionDetailViewProps) {
  const [data, setData] = useState<QuestionDetailResponse | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData && Boolean(slug));
  const [notFoundState, setNotFoundState] = useState(!initialData && !slug);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!data && slug) {
      setLoading(true);
      fetchQuestionBySlug(slug)
        .then((res) => {
          if (res && res.question) {
            setData(res);
            setNotFoundState(false);
          } else {
            setNotFoundState(true);
          }
        })
        .catch(() => setNotFoundState(true))
        .finally(() => setLoading(false));
    }
  }, [slug, data]);

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-9 h-9 animate-spin text-[#FF5500]" />
        <p className="text-sm font-semibold text-slate-600">Loading question discussion...</p>
      </div>
    );
  }

  if (notFoundState || !data) {
    return (
      <div className="py-16 px-4 text-center max-w-lg mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm mt-8">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF5500] mb-4">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Question Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
          This question may have been removed, or the link might be incorrect.
        </p>
        <Link
          href="/community"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5500] text-white font-bold text-xs hover:bg-[#e04b00] transition shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Community Discussions
        </Link>
      </div>
    );
  }

  const { question, answers, relatedCurriculum } = data;
  const isSolved = Boolean(question.accepted_answer_id);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNewAnswer = (newAnswer: CommunityAnswer) => {
    setData((prev) => ({
      ...prev,
      question: {
        ...prev.question,
        answer_count: (prev.question.answer_count || 0) + 1,
      },
      answers: [...prev.answers, newAnswer],
    }));
  };

  const handleNewReply = (newReply: CommunityAnswer) => {
    setData((prev) => ({
      ...prev,
      answers: prev.answers.map((ans) => {
        if (ans.id === newReply.parent_answer_id) {
          return {
            ...ans,
            replies: [...(ans.replies || []), newReply],
          };
        }
        return ans;
      }),
    }));
  };

  const handleAcceptAnswer = async (answerId: string) => {
    try {
      await acceptAnswer(question.id, answerId);
      setData((prev) => ({
        ...prev,
        question: {
          ...prev.question,
          accepted_answer_id: answerId,
        },
        answers: prev.answers.map((a) => ({
          ...a,
          is_accepted: a.id === answerId,
        })),
      }));
    } catch (err: any) {
      alert(err.message || 'Failed to accept answer');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── BREADCRUMB & BACK BUTTON ── */}
      <div className="flex items-center justify-between">
        <Link
          href="/community"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#FF5500] transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Community Feed</span>
        </Link>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-2xs transition cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* ── QUESTION MAIN CONTAINER ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm">
        {/* Context Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {question.category_name && (
            <span className="px-2.5 py-1 rounded-full bg-orange-50 text-[#FF5500] font-bold text-xs border border-orange-200/80">
              {question.category_name}
            </span>
          )}

          {question.subject_name && (
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs">
              {question.subject_name}
            </span>
          )}

          {question.university_short_name && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 font-semibold text-xs border border-sky-100">
              <Building2 className="w-3.5 h-3.5 text-sky-600" />
              <span>{question.university_short_name}</span>
              {question.unit && <span>· {question.unit}</span>}
            </span>
          )}

          {isSolved && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>✓ Solved</span>
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <BookmarkButton
              questionId={question.id}
              initialBookmarked={question.is_bookmarked}
              showText
            />
            <ReportDialog questionId={question.id} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug mb-3">
          {question.title}
        </h1>

        {/* Author & Metrics Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-2xs">
              {(question.author_name || 'S')[0].toUpperCase()}
            </div>
            <span className="font-bold text-slate-900 text-xs">
              {question.author_name || 'HSC Student'}
            </span>
            <ContributorBadge
              role={question.author_role}
              isVerified={question.is_verified_author}
              customBadge={question.author_badge}
            />
          </div>

          <span>·</span>

          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Asked {formatRelativeTime(question.created_at)}
          </span>

          <span>·</span>

          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {question.view_count || 0} views
          </span>
        </div>

        {/* Layout: Vote Column + Question Content */}
        <div className="flex gap-4 sm:gap-6">
          <div className="hidden sm:block pt-1">
            <VoteControl
              itemId={question.id}
              itemType="question"
              initialVotes={question.vote_count || 0}
              initialUserVote={question.user_vote || 0}
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Rich KaTeX Rendered Content */}
            <div className="text-sm sm:text-base text-slate-800 leading-relaxed mb-6 font-normal">
              <MathRenderer content={question.content} />
            </div>

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {question.tags.map((t) => (
                  <span
                    key={t.id}
                    className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium"
                  >
                    #{t.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── RELATED CURRICULUM CARD ── */}
      {relatedCurriculum && (
        <RelatedCurriculum
          subjectName={relatedCurriculum.subjectName}
          lessonTitle={relatedCurriculum.lessonTitle}
          lessonUrl={relatedCurriculum.lessonUrl}
          practiceUrl={relatedCurriculum.practiceUrl}
        />
      )}

      {/* ── ANSWERS SECTION ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          <span className="text-xs text-slate-400">
            Sorted by Accepted & Votes
          </span>
        </div>

        {answers.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-sm font-semibold text-slate-600 mb-1">
              No answers yet.
            </p>
            <p className="text-xs text-slate-400">
              Be the first to share your problem-solving approach or explanation below!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {answers.map((ans) => (
              <AnswerCard
                key={ans.id}
                answer={ans}
                questionId={question.id}
                isQuestionAuthor={true}
                onAcceptAnswer={handleAcceptAnswer}
                onNewReply={handleNewReply}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── BOTTOM ANSWER COMPOSER ── */}
      <AnswerComposer questionId={question.id} onAnswerCreated={handleNewAnswer} />
    </div>
  );
}
