'use client';

import React, { useState, useRef } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FaqConfig } from '@/lib/homepage-types';
import { RichTextRenderer } from '@/components/rich-text/rich-text-renderer';
import { useScrollTriggerReveal } from '@/hooks/use-gsap-motion';

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
  const sectionRef = useRef<HTMLElement>(null);
  useScrollTriggerReveal(sectionRef, { y: 22 });

  const title = config?.title || 'Frequently Asked Questions';
  const description =
    config?.description ||
    'Quick answers to common questions regarding Bangladesh university admission circulars, GPA rules, and preparation.';

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
    <section ref={sectionRef} id="faq" className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* ── SECTION HEADER ── */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-xs font-bold uppercase tracking-wider font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>ADMISSION CLARIFICATIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {title}
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
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
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── ACCORDIONS ── */}
        <div className="space-y-2.5">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={faq.id || idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-50 transition cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#FF5500]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/40">
                    <RichTextRenderer content={faq.answer} className="text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
