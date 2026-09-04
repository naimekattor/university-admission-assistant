'use client';

import React, { useState } from 'react';
import { Send, Sparkles, Eye, Code, Columns2, Wand2, Check } from 'lucide-react';
import { MathEditorToolbar } from './math-editor-toolbar';
import { MathRenderer } from './math-renderer';
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
  const [viewMode, setViewMode] = useState<'write' | 'preview' | 'split'>('write');
  const [justFormatted, setJustFormatted] = useState(false);

  const handleInsertSnippet = (snippet: string) => {
    setContent((prev) => (prev ? `${prev} ${snippet}` : snippet));
  };

  // Helper to neatly separate display math equations with clean line breaks
  const handleAutoFormatSpacing = () => {
    if (!content.trim()) return;
    let formatted = content
      // Separate colons or Bengali danda if glued to display math
      .replace(/([:।])\\\[/g, '$1\n\n\\[')
      .replace(/\\\]([^\n])/g, '\\]\n\n$1')
      // Ensure double newlines around display blocks
      .replace(/([^\n])\s*(\\\[[\s\S]*?\\\])\s*([^\n])/g, '$1\n\n$2\n\n$3')
      // Ensure 'সমাধান:' stands out
      .replace(/^সমাধান:/m, '**সমাধান:**\n');

    setContent(formatted);
    setJustFormatted(true);
    setTimeout(() => setJustFormatted(false), 2000);
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
      setViewMode('write');
      onAnswerCreated(created);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit answer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasMathContent = /[\$\\\{\}\^_\=\±\√]/.test(content);

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

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Visual Math Toolbar & Mode Tabs */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <span>Solution Content</span>
              <span className="text-slate-400 font-normal">(Click math symbols to insert formulas)</span>
            </label>

            {/* View Mode Switcher: Write vs Preview vs Split */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setViewMode('write')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'write'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Code className="w-3.5 h-3.5 text-slate-600" />
                <span>Write (LaTeX)</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'preview'
                    ? 'bg-[#FF5500] text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Rendered Preview</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-white text-[#FF5500] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>Split View</span>
              </button>
            </div>
          </div>

          {/* Math Toolbar (Active when writing or split) */}
          {viewMode !== 'preview' && (
            <div className="mb-2">
              <MathEditorToolbar onInsert={handleInsertSnippet} currentContent={content} defaultOpenStudio={false} />
            </div>
          )}

          {/* Auto Format Spacing Utility Button */}
          {content.trim().length > 10 && viewMode !== 'preview' && (
            <div className="flex items-center justify-between pb-1.5 px-1">
              <span className="text-[11px] text-slate-400">
                Pasted equations from KaTeX/LaTeX? Click to auto-format clean line breaks:
              </span>
              <button
                type="button"
                onClick={handleAutoFormatSpacing}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5500] hover:text-[#d44700] bg-orange-50 hover:bg-orange-100 border border-orange-200/80 px-2.5 py-0.5 rounded-full transition cursor-pointer active:scale-95"
              >
                {justFormatted ? <Check className="w-3 h-3 text-emerald-600" /> : <Wand2 className="w-3 h-3" />}
                <span>{justFormatted ? 'Formatted!' : 'Auto-Format Spacing'}</span>
              </button>
            </div>
          )}

          {/* Editor Body: Tab Content based on View Mode */}
          {viewMode === 'write' && (
            <div className="space-y-3">
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Explain the solution step-by-step. Use math toolbar for fractions, integrals, powers, and Greek letters... e.g. \[y^2 = 4ax \implies y = \pm 2\sqrt{a}\sqrt{x}\]"
                className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500] leading-relaxed resize-y font-normal font-mono"
              />

              {/* Automatic live preview panel directly underneath when math content is detected */}
              {content.trim() && hasMathContent && (
                <div className="p-4 bg-gradient-to-b from-orange-50/40 to-slate-50 border border-orange-200/70 rounded-2xl">
                  <div className="flex items-center justify-between pb-2 border-b border-orange-200/50 mb-3">
                    <span className="text-[11px] font-bold text-[#FF5500] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Live Rendered Math Output (KaTeX)
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Exact view as displayed to readers
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <MathRenderer content={content} />
                  </div>
                </div>
              )}
            </div>
          )}

          {viewMode === 'preview' && (
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs min-h-[160px]">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" /> KaTeX Formatted Math Solution
                </span>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  Preview Mode
                </span>
              </div>
              {content.trim() ? (
                <div className="pt-1">
                  <MathRenderer content={content} />
                </div>
              ) : (
                <div className="py-10 text-center text-slate-400 text-xs">
                  Nothing to preview yet. Switch to <span className="font-semibold text-slate-600">Write (LaTeX)</span> tab to type equations.
                </div>
              )}
            </div>
          )}

          {viewMode === 'split' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="block text-[11px] font-bold text-slate-500 mb-1">LaTeX Source</span>
                <textarea
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Explain solution step-by-step..."
                  className="w-full p-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500] leading-relaxed resize-y font-mono"
                />
              </div>

              <div>
                <span className="block text-[11px] font-bold text-[#FF5500] mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Live Formatted View
                </span>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs min-h-[200px] max-h-[350px] overflow-y-auto">
                  {content.trim() ? (
                    <MathRenderer content={content} />
                  ) : (
                    <p className="text-xs text-slate-400 italic">Formulas will appear here in real-time...</p>
                  )}
                </div>
              </div>
            </div>
          )}
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
