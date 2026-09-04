'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Send,
  Sparkles,
  AlertCircle,
  Building2,
  BookOpen,
  Tag,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Code,
  Eye,
  Columns2,
} from 'lucide-react';
import { MathEditorToolbar } from './math-editor-toolbar';
import { MathRenderer } from './math-renderer';
import {
  createQuestion,
  checkSimilarQuestions,
  getStoredAuthorName,
  fetchCommunityCategories,
} from '@/lib/community-service';
import { CommunityCategory, QuestionType } from '@/lib/community-types';

const QUESTION_TYPES: QuestionType[] = [
  'Problem Solving',
  'Conceptual',
  'Admission Information',
  'MCQ',
  'Subjective',
  'Study Strategy',
  'University Guidance',
  'Other',
];

const UNIVERSITIES_DROPDOWN = [
  { short: 'BUET', name: 'Bangladesh University of Engineering and Technology' },
  { short: 'DU', name: 'University of Dhaka' },
  { short: 'Medical', name: 'Government Medical Colleges (MBBS)' },
  { short: 'CKRUET', name: 'Engineering University Cluster (KUET, RUET, CUET)' },
  { short: 'JU', name: 'Jahangirnagar University' },
  { short: 'RU', name: 'University of Rajshahi' },
  { short: 'GST Cluster', name: 'General & Science Technology Cluster' },
  { short: 'BUP', name: 'Bangladesh University of Professionals' },
  { short: 'IUT', name: 'Islamic University of Technology' },
];

export function QuestionComposer() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState(getStoredAuthorName() || 'HSC Student');
  const [categorySlug, setCategorySlug] = useState('mathematics');
  const [questionType, setQuestionType] = useState<QuestionType>('Problem Solving');
  const [universityShort, setUniversityShort] = useState('');
  const [unit, setUnit] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Calculus', 'BUET']);
  const [viewMode, setViewMode] = useState<'write' | 'preview' | 'split'>('write');

  // Dynamic Categories
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  // Duplicate check
  const [similarQuestions, setSimilarQuestions] = useState<Array<{ id: string; title: string; slug: string; answer_count: number }>>([]);
  // Form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchCommunityCategories().then((res) => {
      const filtered = res.filter((c) => c.slug !== 'all');
      setCategories(filtered);
      if (filtered.length > 0 && !filtered.some((c) => c.slug === categorySlug)) {
        setCategorySlug(filtered[0].slug);
      }
    });
  }, []);

  // Debounced Similar Questions Check
  useEffect(() => {
    if (title.trim().length < 5) {
      setSimilarQuestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await checkSimilarQuestions(title);
      setSimilarQuestions(results);
    }, 400);

    return () => clearTimeout(timer);
  }, [title]);

  const handleInsertSnippet = (snippet: string) => {
    setContent((prev) => (prev ? `${prev} ${snippet}` : snippet));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !tags.includes(val) && tags.length < 6) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 8) {
      setErrorMsg('Question title must be at least 8 characters.');
      return;
    }
    if (content.trim().length < 10) {
      setErrorMsg('Please describe your problem or question in detail (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const created = await createQuestion({
        title: title.trim(),
        content: content.trim(),
        authorName: authorName.trim() || 'HSC Student',
        categorySlug,
        questionType,
        unit: unit.trim() || undefined,
        tags,
      });

      router.push(`/community/questions/${created.slug}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to post question. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── CARD 1: QUESTION TITLE & DUPLICATE PREVIEW ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <label className="block text-sm font-extrabold text-slate-900 mb-1">
          Question Title <span className="text-[#FF5500]">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
          Be specific and summarize your academic problem or admission question clearly.
        </p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. How do I solve this definite integration problem from BUET 2023?"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500] transition"
        />

        {/* Similar Questions Warning Card */}
        {similarQuestions.length > 0 && (
          <div className="mt-3 p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs text-amber-900">
            <div className="flex items-center gap-1.5 font-bold mb-1.5 text-[#FF5500]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>We found similar questions that might already answer your query:</span>
            </div>
            <ul className="space-y-1">
              {similarQuestions.map((q) => (
                <li key={q.id}>
                  <Link
                    href={`/community/questions/${q.slug}`}
                    target="_blank"
                    className="font-medium hover:underline text-slate-800 hover:text-[#FF5500] flex items-center gap-1"
                  >
                    <span>• {q.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({q.answer_count} answers)</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── CARD 2: RICH CONTENT & VISUAL MATHEMATICAL INPUT ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <label className="block text-sm font-extrabold text-slate-900">
            Detailed Description & Equations <span className="text-[#FF5500]">*</span>
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

        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
          Write out your working, formula, or what you tried. Use the visual math toolbar below to click and insert fractions, roots, integrals, and limits without typing raw LaTeX!
        </p>

        {/* Visual Math Toolbar with Live KaTeX Preview */}
        {viewMode !== 'preview' && (
          <MathEditorToolbar onInsert={handleInsertSnippet} currentContent={content} />
        )}

        {viewMode === 'write' && (
          <div className="space-y-3">
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Describe your problem step by step...
Example:
I am trying to solve this integration:
$$\\int_{0}^{1} \\frac{x^2+1}{x^4+1} dx$$
I got stuck after substituting $u = x - 1/x$.`}
              className="w-full p-4 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500] leading-relaxed resize-y font-normal font-mono"
            />

            {/* Live Rendered Math Output if equations exist */}
            {content.trim() && /[\$\\\{\}\^_\=\±\√]/.test(content) && (
              <div className="p-4 bg-gradient-to-b from-orange-50/40 to-slate-50 border border-orange-200/70 rounded-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-orange-200/50 mb-3">
                  <span className="text-[11px] font-bold text-[#FF5500] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Live Rendered Math Output (KaTeX)
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Readers will see this formatted math
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
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs min-h-[200px]">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" /> KaTeX Formatted Preview
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
                No content entered yet. Switch back to Write mode to type.
              </div>
            )}
          </div>
        )}

        {viewMode === 'split' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span className="block text-[11px] font-bold text-slate-500 mb-1">LaTeX Source</span>
              <textarea
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type question content..."
                className="w-full p-3.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500] leading-relaxed resize-y font-mono"
              />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-[#FF5500] mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Rendered View
              </span>
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs min-h-[240px] max-h-[400px] overflow-y-auto">
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

      {/* ── CARD 3: CATEGORY, QUESTION TYPE & TARGET CONTEXT ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
          Topic & University Context
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
            >
              {categories.map((c) => (
                <option key={c.id || c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Question Type
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as QuestionType)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
            >
              {QUESTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Target University (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target University (Optional)
            </label>
            <select
              value={universityShort}
              onChange={(e) => setUniversityShort(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
            >
              <option value="">None / General Discussion</option>
              {UNIVERSITIES_DROPDOWN.map((uni) => (
                <option key={uni.short} value={uni.short}>
                  {uni.short} - {uni.name}
                </option>
              ))}
            </select>
          </div>

          {/* Target Unit (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Unit (Optional)
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g. Ka / A Unit / Engineering"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tags (Up to 6)
          </label>
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-300 text-slate-800 text-xs font-semibold"
              >
                <span>#{t}</span>
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  className="text-slate-400 hover:text-rose-600 font-bold ml-1 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
            {tags.length < 6 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag and press Enter..."
                className="flex-1 min-w-[140px] px-2 py-1 bg-transparent text-xs text-slate-800 focus:outline-none"
              />
            )}
          </div>
        </div>
      </div>

      {/* ── CARD 4: AUTHOR IDENTITY (ZERO LOGIN BARRIER) ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Your Display Name / Handle
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="e.g. Rahim (HSC 2025)"
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500] w-64"
          />
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            ✓ Public posting enabled — no login required!
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white font-extrabold text-sm shadow-md shadow-orange-500/25 hover:shadow-lg transition cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Publishing Question...' : 'Publish Question'}</span>
        </button>
      </div>
    </form>
  );
}
