'use client';

import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { toggleBookmark } from '@/lib/community-service';

interface BookmarkButtonProps {
  questionId: string;
  initialBookmarked?: boolean;
  className?: string;
  showText?: boolean;
}

export function BookmarkButton({
  questionId,
  initialBookmarked = false,
  className = '',
  showText = false,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSubmitting) return;

    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    setIsSubmitting(true);

    try {
      const result = await toggleBookmark(questionId);
      setIsBookmarked(result);
    } catch {
      setIsBookmarked(!nextState);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSubmitting}
      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this question'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
        isBookmarked
          ? 'bg-amber-50 text-amber-700 border-amber-300'
          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800'
      } ${className}`}
    >
      <Bookmark
        className={`w-3.5 h-3.5 ${
          isBookmarked ? 'fill-amber-500 text-amber-600' : 'text-slate-400'
        }`}
      />
      {showText && <span>{isBookmarked ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
