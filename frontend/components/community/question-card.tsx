'use client';

import React from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  CheckCircle2,
  Eye,
  Building2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CommunityQuestion } from '@/lib/community-types';
import { ContributorBadge } from './contributor-badge';
import { VoteControl } from './vote-control';
import { BookmarkButton } from './bookmark-button';
import { MathRenderer } from './math-renderer';

interface QuestionCardProps {
  question: CommunityQuestion;
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

export function QuestionCard({ question }: QuestionCardProps) {
  const isSolved = Boolean(question.accepted_answer_id);
  const previewSnippet = question.content
    ? question.content.substring(0, 180) + (question.content.length > 180 ? '...' : '')
    : '';

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 hover:border-orange-300/80 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex gap-3 sm:gap-4 relative">
      {/* ── LEFT: DESKTOP VOTE CONTROL ── */}
      <div className="hidden sm:flex flex-col items-center pt-0.5">
        <VoteControl
          itemId={question.id}
          itemType="question"
          initialVotes={question.vote_count || 0}
          initialUserVote={question.user_vote || 0}
        />
      </div>

      {/* ── RIGHT: QUESTION CONTENT & META ── */}
      <div className="flex-1 min-w-0">
        {/* Top Badges & Subject Hierarchy */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs mb-2">
          {question.category_name && (
            <span className="px-2 py-0.5 rounded-md bg-orange-50 text-[#FF5500] font-bold text-[11px] border border-orange-200/60">
              {question.category_name}
            </span>
          )}

          {question.subject_name && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
              {question.subject_name}
            </span>
          )}

          {question.university_short_name && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-semibold text-[11px] border border-sky-100">
              <Building2 className="w-3 h-3 text-sky-600" />
              <span>{question.university_short_name}</span>
              {question.unit && <span className="opacity-75">· {question.unit}</span>}
            </span>
          )}

          {isSolved && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Solved</span>
            </span>
          )}

          <div className="ml-auto flex items-center gap-1">
            <BookmarkButton
              questionId={question.id}
              initialBookmarked={question.is_bookmarked}
            />
          </div>
        </div>

        {/* Title Link */}
        <Link href={`/community/questions/${question.slug}`} className="block group-hover:text-[#FF5500] transition">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight mb-1.5">
            {question.title}
          </h3>
        </Link>

        {/* Content Snippet (with KaTeX rendering) */}
        <div className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">
          <MathRenderer content={previewSnippet} />
        </div>

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {question.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200/70 text-slate-600 text-[10px] font-medium"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Author & Engagement Stats */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          {/* Author Details */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white font-black text-[10px] flex items-center justify-center shadow-2xs">
              {(question.author_name || 'S')[0].toUpperCase()}
            </div>
            <span className="font-semibold text-slate-800 text-xs">
              {question.author_name || 'HSC Student'}
            </span>
            <ContributorBadge
              role={question.author_role}
              isVerified={question.is_verified_author}
              customBadge={question.author_badge}
            />
            <span className="text-slate-400 text-[11px] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(question.created_at)}
            </span>
          </div>

          {/* Engagement Counts */}
          <div className="flex items-center gap-3 font-medium text-xs">
            {/* Mobile Vote Buttons */}
            <div className="sm:hidden">
              <VoteControl
                itemId={question.id}
                itemType="question"
                initialVotes={question.vote_count || 0}
                initialUserVote={question.user_vote || 0}
                horizontal
              />
            </div>

            <div className="flex items-center gap-1 text-slate-600">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>{question.answer_count || 0} answers</span>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-slate-400">
              <Eye className="w-3.5 h-3.5" />
              <span>{question.view_count || 0} views</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
