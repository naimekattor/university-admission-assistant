'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { FaqConfig } from '@/../backend/src/modules/homepage/homepage.service';
import { RichTextRenderer } from '@/components/rich-text/rich-text-renderer';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

interface FaqSectionProps {
  config?: FaqConfig;
  faqs?: FaqItem[];
}

export function FaqSection({ config, faqs = [] }: FaqSectionProps) {
  const title = config?.title || 'Frequently Asked Questions';
  const description =
    config?.description ||
    'Quick answers to common questions regarding Bangladesh university admissions, circulars, and EduGuide.';

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Eligibility', 'Admission', 'Preparation', 'General'];

  const filteredFaqs = faqs.filter((f) => {
    if (selectedCategory === 'All') return true;
    return f.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto border-t border-[var(--eg-border)] bg-[var(--eg-surface-subtle)]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ── SECTION HEADER ── */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--eg-primary-soft)] text-[var(--eg-primary)] text-xs font-bold uppercase tracking-wider font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-[var(--eg-primary)]" />
            <span>ADMISSION CLARIFICATIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--eg-text-primary)]">
            {title}
          </h2>
          <p className="text-sm text-[var(--eg-text-secondary)] max-w-xl mx-auto">
            {description}
          </p>
        </div>

        {/* ── CATEGORY TABS ── */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setOpenIndex(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[var(--eg-primary)] text-white shadow-2xs'
                  : 'bg-[var(--eg-surface)] text-[var(--eg-text-secondary)] hover:text-[var(--eg-text-primary)] border border-[var(--eg-border)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── ACCORDIONS ── */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="py-10 text-center text-xs text-[var(--eg-text-muted)] bg-[var(--eg-surface)] border border-[var(--eg-border)] rounded-xl">
              No questions found under this category.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={faq.id || idx}
                  className="rounded-xl border border-[var(--eg-border)] bg-[var(--eg-surface)] overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[var(--eg-text-primary)] hover:bg-[var(--eg-surface-subtle)]/60 transition cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--eg-text-muted)] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[var(--eg-primary)]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-[var(--eg-text-secondary)] border-t border-[var(--eg-border)]/50 leading-relaxed bg-[var(--eg-surface-subtle)]/40">
                      <RichTextRenderer content={faq.answer} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
