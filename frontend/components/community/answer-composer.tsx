'use client';

import React, { useState } from 'react';
import { Send, Sparkles, UserCheck } from 'lucide-react';
import { MathEditorToolbar } from './math-editor-toolbar';
import { createAnswer, getStoredAuthorName } from '@/lib/community-service';
import { CommunityAnswer } from '@/lib/community-types';

interface AnswerComposerProps {
  questionId: string;
  onAnswerCreated: (newAnswer: CommunityAnswer) => void;
}

export function AnswerComposer({ questionId, onAnswerCreated }: AnswerComposerProps) {
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState(getStoredAuthorName() || 'HSC Student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInsertSnippet = (snippet: string) => {
    setContent((prev) => (prev ? `${prev} ${snippet}` : snippet));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMsg('Please write your answer or solution steps.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const created = await createAnswer({
        questionId,
        content: content.trim(),
        authorName: authorName.trim() || 'HSC Student',
      });
      setContent('');
      onAnswerCreated(created);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit answer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Your Answer</span>
          <span className="text-xs font-normal text-slate-400 font-mono">(Public Discussion)</span>
        </h3>
        <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full font-semibold">
          ✓ No login required
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 mb-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Author Name / Handle */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Your Name or Handle
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="e.g. Rahim (HSC 25) or Dr. Karim"
            className="w-full sm:w-72 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500] transition"
          />
        </div>

        {/* Visual Math Toolbar & Equation Helper */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <span>Solution Content</span>
            <span className="text-slate-400 font-normal">(Click math symbols to insert formulas)</span>
          </label>
          <MathEditorToolbar onInsert={handleInsertSnippet} currentContent={content} defaultOpenStudio={false} />
          <textarea
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Explain the solution step-by-step. Use math toolbar for fractions, integrals, powers, and Greek letters..."
            className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500] leading-relaxed resize-y font-normal"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-slate-400">
            Supports natural Bengali & English explanations alongside LaTeX equations.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:shadow-lg transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Posting Answer...' : 'Post Answer'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
