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
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto border-t border-slate-800 bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ── SECTION HEADER ── */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>ADMISSION CLARIFICATIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {title}
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
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
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── ACCORDIONS ── */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
              No questions found under this category.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={faq.id || idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white hover:bg-slate-800/40 transition cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-amber-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-slate-300 border-t border-slate-800 leading-relaxed bg-slate-950/40">
                      <RichTextRenderer content={faq.answer} className="text-slate-300" />
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
