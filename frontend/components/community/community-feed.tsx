'use client';

import React, { useState, useEffect } from 'react';
import {
  fetchQuestions,
  fetchCommunityCategories,
  fetchPopularTags,
} from '@/lib/community-service';
import {
  CommunityCategory,
  CommunityQuestion,
  CommunityTag,
} from '@/lib/community-types';
import { QuestionCard } from './question-card';
import { QuestionFilters } from './question-filters';
import { QuestionSearch } from './question-search';
import { CommunitySidebar } from './community-sidebar';
import {
  Sparkles,
  HelpCircle,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import Link from 'next/link';

interface CommunityFeedProps {
  initialCategory?: string;
  onlyMine?: boolean;
  onlySaved?: boolean;
  feedTitle?: string;
  feedSubtitle?: string;
}

export function CommunityFeed({
  initialCategory = 'all',
  onlyMine = false,
  onlySaved = false,
  feedTitle = 'Student Q&A Community',
  feedSubtitle = 'Ask questions, solve academic problems with visual equations, and learn directly from seniors & verified teachers.',
}: CommunityFeedProps) {
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [popularTags, setPopularTags] = useState<CommunityTag[]>([]);
  const [questions, setQuestions] = useState<CommunityQuestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState<'latest' | 'popular' | 'unanswered' | 'most-voted'>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load Categories & Popular Tags once
  useEffect(() => {
    fetchCommunityCategories().then(setCategories);
    fetchPopularTags().then(setPopularTags);
  }, []);

  // Load Questions whenever filters change
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    fetchQuestions({
      category: selectedCategory,
      sort: selectedSort,
      search: searchQuery,
      page,
      limit: 15,
      onlyMine,
      onlySaved,
    })
      .then((res) => {
        if (!isCancelled) {
          setQuestions(res.questions || []);
          setPagination(res.pagination);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedCategory, selectedSort, searchQuery, page, onlyMine, onlySaved]);

  const handleSelectTag = (tagName: string) => {
    setSearchQuery(tagName);
  };

  return (
    <div className="w-full">
      {/* ── HERO BANNER ── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-200/60 p-6 sm:p-8 mb-8 overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500] font-extrabold text-[11px] mb-3 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>EduGuide Q&A · Open & Free for All</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-2">
            {feedTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-5">
            {feedSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/community/ask"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white font-bold text-xs shadow-md shadow-orange-500/25 hover:shadow-lg transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ask a Question</span>
            </Link>

            <Link
              href="/community/my-questions"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-[#FF5500] font-semibold text-xs transition shadow-2xs"
            >
              <span>My Questions</span>
            </Link>

            <Link
              href="/community/saved"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-[#FF5500] font-semibold text-xs transition shadow-2xs"
            >
              <span>Saved</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="mb-5">
        <QuestionSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* ── MAIN CONTENT GRID: FEED + SIDEBAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-4">
          {/* Category & Sort Filters */}
          <QuestionFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setPage(1);
            }}
            selectedSort={selectedSort}
            onSelectSort={(sort) => {
              setSelectedSort(sort);
              setPage(1);
            }}
          />

          {/* Feed List */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse space-y-3"
                >
                  <div className="flex gap-2">
                    <div className="h-5 bg-slate-200 rounded w-20" />
                    <div className="h-5 bg-slate-200 rounded w-28" />
                  </div>
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-[#FF5500] flex items-center justify-center mx-auto">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No questions found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                {searchQuery
                  ? `No questions matched "${searchQuery}". Try different keywords or ask this question yourself!`
                  : 'Be the first to start a discussion or ask a problem in this category.'}
              </p>
              <div className="pt-2">
                <Link
                  href="/community/ask"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF5500] text-white font-bold text-xs shadow-sm hover:bg-[#E64D00] transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Ask This Question</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {questions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 pb-2 text-xs">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <span className="text-slate-500 font-mono">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNextPage}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold disabled:opacity-40 hover:bg-slate-50"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4">
          <div className="sticky top-20">
            <CommunitySidebar
              popularTags={popularTags}
              onSelectTag={handleSelectTag}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
