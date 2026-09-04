'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  CornerDownRight,
  MessageSquare,
  Clock,
  Check,
} from 'lucide-react';
import { CommunityAnswer } from '@/lib/community-types';
import { ContributorBadge } from './contributor-badge';
import { VoteControl } from './vote-control';
import { MathRenderer } from './math-renderer';
import { ReportDialog } from './report-dialog';
import { MathEditorToolbar } from './math-editor-toolbar';
import { createAnswer, getStoredAuthorName } from '@/lib/community-service';

interface AnswerCardProps {
  answer: CommunityAnswer;
  questionId: string;
  isQuestionAuthor?: boolean;
  onAcceptAnswer?: (answerId: string) => void;
  onNewReply?: (newReply: CommunityAnswer) => void;
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

export function AnswerCard({
  answer,
  questionId,
  isQuestionAuthor = false,
  onAcceptAnswer,
  onNewReply,
}: AnswerCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthorName, setReplyAuthorName] = useState(getStoredAuthorName() || 'HSC Student');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInsertSnippet = (snippet: string) => {
    setReplyContent((prev) => (prev ? `${prev} ${snippet}` : snippet));
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setIsSubmittingReply(true);
    setErrorMsg('');

    try {
      const created = await createAnswer({
        questionId,
        parentAnswerId: answer.id,
        content: replyContent.trim(),
        authorName: replyAuthorName.trim() || 'HSC Student',
      });
      setReplyContent('');
      setShowReplyForm(false);
      onNewReply?.(created);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to post reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
        answer.is_accepted
          ? 'bg-emerald-50/30 border-emerald-300/80 shadow-2xs'
          : 'bg-white border-slate-200 shadow-2xs'
      }`}
    >
      {/* ── ACCEPTED ANSWER BANNER ── */}
      {answer.is_accepted && (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold w-fit mb-3 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
          <span>Accepted Answer by Author</span>
        </div>
      )}

      <div className="flex gap-3 sm:gap-4">
        {/* Vote Control (Left) */}
        <div className="pt-0.5">
          <VoteControl
            itemId={answer.id}
            itemType="answer"
            initialVotes={answer.vote_count || 0}
            initialUserVote={answer.user_vote || 0}
          />
        </div>

        {/* Content & Meta (Right) */}
        <div className="flex-1 min-w-0">
          {/* Author Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                {(answer.author_name || 'C')[0].toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-900">
                {answer.author_name || 'Community Contributor'}
              </span>
              <ContributorBadge
                role={answer.author_role}
                isVerified={answer.is_verified_author}
                customBadge={answer.author_badge}
              />
              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatRelativeTime(answer.created_at)}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <ReportDialog answerId={answer.id} />
            </div>
          </div>

          {/* Answer Body (KaTeX math rendered) */}
          <div className="text-xs sm:text-sm text-slate-800 mb-3 leading-relaxed">
            <MathRenderer content={answer.content} />
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100 text-xs">
            <button
              type="button"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-[#FF5500] font-semibold transition cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>

            {isQuestionAuthor && !answer.is_accepted && onAcceptAnswer && (
              <button
                type="button"
                onClick={() => onAcceptAnswer(answer.id)}
                className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full font-bold transition cursor-pointer border border-emerald-200"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark as Accepted</span>
              </button>
            )}
          </div>

          {/* Inline Reply Composer Form */}
          {showReplyForm && (
            <form onSubmit={handleSubmitReply} className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="block text-xs font-bold text-slate-700">Write a follow-up reply</span>
              {errorMsg && <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>}
              
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="text"
                  value={replyAuthorName}
                  onChange={(e) => setReplyAuthorName(e.target.value)}
                  placeholder="Your Name (e.g. Rahim, HSC 25)"
                  className="w-full sm:w-1/2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
                />
              </div>

              <MathEditorToolbar onInsert={handleInsertSnippet} currentContent={replyContent} />

              <textarea
                rows={3}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your explanation or follow-up question..."
                className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500] resize-y font-mono"
              />

              {replyContent.trim() && /[\$\\\{\}\^_\=\±\√]/.test(replyContent) && (
                <div className="p-3 bg-white border border-orange-200 rounded-xl shadow-2xs">
                  <span className="block text-[10px] font-bold text-[#FF5500] uppercase tracking-wider mb-1">
                    Live Math Preview
                  </span>
                  <MathRenderer content={replyContent} />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReply}
                  className="px-4 py-1 text-xs font-bold bg-[#FF5500] hover:bg-[#E64D00] text-white rounded-full transition shadow-2xs"
                >
                  {isSubmittingReply ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </form>
          )}

          {/* 1-Level Threaded Replies */}
          {answer.replies && answer.replies.length > 0 && (
            <div className="mt-4 pl-3 sm:pl-5 border-l-2 border-slate-200 space-y-3">
              {answer.replies.map((rep) => (
                <div key={rep.id} className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/70 text-xs">
                  <div className="flex items-center gap-1.5 mb-1.5 text-[11px] text-slate-500">
                    <CornerDownRight className="w-3 h-3 text-slate-400" />
                    <span className="font-bold text-slate-900">{rep.author_name || 'HSC Student'}</span>
                    <ContributorBadge role={rep.author_role} isVerified={rep.is_verified_author} customBadge={rep.author_badge} />
                    <span>· {formatRelativeTime(rep.created_at)}</span>
                  </div>
                  <div className="text-slate-700 leading-relaxed pl-4">
                    <MathRenderer content={rep.content} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
