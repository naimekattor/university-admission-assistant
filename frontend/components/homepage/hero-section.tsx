'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Building2, Calendar, FileText } from 'lucide-react';
import { HeroConfig } from '@/../backend/src/modules/homepage/homepage.service';

interface HeroSectionProps {
  config?: HeroConfig;
  onFindUniversitiesClick?: () => void;
}

export function HeroSection({ config, onFindUniversitiesClick }: HeroSectionProps) {
  const eyebrow = config?.eyebrow || 'UNIVERSITY ADMISSION 2026';
  const headline = config?.headline || 'Find where you can apply.';
  const subheading =
    config?.subheading ||
    'Check university admission dates, GPA requirements, units, seats and circulars — all in one place.';
  const primaryCtaLabel = config?.primaryCtaLabel || 'Find My Universities';
  const secondaryCtaLabel = config?.secondaryCtaLabel || 'Explore Universities';
  const trustIndicators = config?.trustIndicators || [
    'Eligibility information',
    'Admission deadlines',
    'Unit requirements',
    'Official circulars',
  ];

  const handlePrimaryClick = (e: React.MouseEvent) => {
    if (onFindUniversitiesClick) {
      e.preventDefault();
      onFindUniversitiesClick();
    } else {
      const el = document.getElementById('eligibility-checker');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto border-b border-[var(--eg-border)] bg-[var(--eg-surface-subtle)]">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* ── EYEBROW BADGE ── */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--eg-primary-soft)] border border-[var(--eg-primary)]/20 text-[var(--eg-primary)] text-xs font-semibold uppercase tracking-wider shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[var(--eg-primary)]" />
          <span>{eyebrow}</span>
        </div>

        {/* ── HERO HEADLINE ── */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[var(--eg-text-primary)] tracking-tight text-balance leading-[1.15]">
          {headline}
        </h1>

        {/* ── SUBHEADING ── */}
        <p className="text-base sm:text-lg md:text-xl text-[var(--eg-text-secondary)] max-w-2xl mx-auto leading-relaxed text-balance">
          {subheading}
        </p>

        {/* ── PRIMARY & SECONDARY ACTION CTAS ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handlePrimaryClick}
            className="w-full sm:w-auto px-6 py-3.5 bg-[var(--eg-primary)] hover:bg-[var(--eg-primary-hover)] text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{primaryCtaLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link href="#admission-table" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-3.5 bg-[var(--eg-surface)] hover:bg-slate-100 text-[var(--eg-text-primary)] border border-[var(--eg-border-strong)] text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
              <span>{secondaryCtaLabel}</span>
            </button>
          </Link>
        </div>

        {/* ── TRUST INDICATORS ── */}
        <div className="pt-6 border-t border-[var(--eg-border)]/60 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-[var(--eg-text-muted)] font-medium">
          {trustIndicators.map((indicator, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-[var(--eg-text-secondary)]">
              <CheckCircle2 className="w-4 h-4 text-[var(--eg-success)] shrink-0" />
              <span>{indicator}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
