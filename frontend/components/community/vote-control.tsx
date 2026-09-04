'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { voteQuestion, voteAnswer } from '@/lib/community-service';

interface VoteControlProps {
  itemId: string;
  itemType: 'question' | 'answer';
  initialVotes: number;
  initialUserVote?: number;
  horizontal?: boolean;
  className?: string;
}

export function VoteControl({
  itemId,
  itemType,
  initialVotes = 0,
  initialUserVote = 0,
  horizontal = false,
  className = '',
}: VoteControlProps) {
  const [voteCount, setVoteCount] = useState(initialVotes);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (delta: number) => {
    if (isSubmitting) return;

    // Toggle logic: If user clicks the already active vote, cancel it (vote 0)
    const newVote = userVote === delta ? 0 : delta;
    const voteDiff = newVote - userVote;

    // Optimistic update
    setUserVote(newVote);
    setVoteCount((prev) => prev + voteDiff);
    setIsSubmitting(true);

    try {
      if (itemType === 'question') {
        const res = await voteQuestion(itemId, newVote);
        setVoteCount(res.voteCount);
        setUserVote(res.userVote);
      } else {
        const res = await voteAnswer(itemId, newVote);
        setVoteCount(res.voteCount);
        setUserVote(res.userVote);
      }
    } catch (err) {
      // Revert on error
      setUserVote(userVote);
      setVoteCount((prev) => prev - voteDiff);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (horizontal) {
    return (
      <div className={`inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-2 py-1 ${className}`}>
        <button
          type="button"
          onClick={() => handleVote(1)}
          disabled={isSubmitting}
          aria-label="Upvote"
          className={`p-1 rounded-full transition cursor-pointer ${
            userVote === 1
              ? 'bg-[#FF5500] text-white shadow-2xs'
              : 'text-slate-500 hover:text-[#FF5500] hover:bg-white'
          }`}
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <span className={`text-xs font-bold px-1.5 ${userVote === 1 ? 'text-[#FF5500]' : userVote === -1 ? 'text-rose-600' : 'text-slate-700'}`}>
          {voteCount}
        </span>
        <button
          type="button"
          onClick={() => handleVote(-1)}
          disabled={isSubmitting}
          aria-label="Downvote"
          className={`p-1 rounded-full transition cursor-pointer ${
            userVote === -1
              ? 'bg-rose-600 text-white shadow-2xs'
              : 'text-slate-500 hover:text-rose-600 hover:bg-white'
          }`}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Vertical stacked layout
  return (
    <div className={`flex flex-col items-center bg-slate-50 border border-slate-200 rounded-xl p-1 w-10 ${className}`}>
      <button
        type="button"
        onClick={() => handleVote(1)}
        disabled={isSubmitting}
        aria-label="Upvote"
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
          userVote === 1
            ? 'bg-[#FF5500] text-white shadow-2xs'
            : 'text-slate-500 hover:text-[#FF5500] hover:bg-white'
        }`}
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <span className={`text-xs font-extrabold my-1 ${userVote === 1 ? 'text-[#FF5500]' : userVote === -1 ? 'text-rose-600' : 'text-slate-800'}`}>
        {voteCount}
      </span>
      <button
        type="button"
        onClick={() => handleVote(-1)}
        disabled={isSubmitting}
        aria-label="Downvote"
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
          userVote === -1
            ? 'bg-rose-600 text-white shadow-2xs'
            : 'text-slate-500 hover:text-rose-600 hover:bg-white'
        }`}
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}
