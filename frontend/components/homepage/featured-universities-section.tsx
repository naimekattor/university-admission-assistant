'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, MapPin, ArrowRight, Award, Users, Calendar, ExternalLink } from 'lucide-react';
import { FeaturedUniversitiesConfig } from '@/../backend/src/modules/homepage/homepage.service';

interface FeaturedUniversitiesSectionProps {
  config?: FeaturedUniversitiesConfig;
  universities?: any[];
}

export function FeaturedUniversitiesSection({ config, universities = [] }: FeaturedUniversitiesSectionProps) {
  const title = config?.title || 'Explore Universities';
  const description =
    config?.description ||
    'Explore top engineering, general, medical, and agricultural universities across Bangladesh.';

  return (
    <section id="explore-universities" className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto border-t border-[var(--eg-border)] bg-[var(--eg-surface-subtle)]">
      <div className="space-y-8">
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--eg-primary)] font-mono">
              CURATED DIRECTORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--eg-text-primary)] mt-1">
              {title}
            </h2>
            <p className="text-sm text-[var(--eg-text-secondary)] mt-1 max-w-2xl">
              {description}
            </p>
          </div>

          <Link href="/universities" className="shrink-0">
            <button className="text-xs font-semibold text-[var(--eg-primary)] hover:text-[var(--eg-primary-hover)] flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--eg-surface)] border border-[var(--eg-border)] shadow-2xs hover:bg-slate-50 transition cursor-pointer">
              <span>Explore All Universities (36+)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {/* ── UNIVERSITIES GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {universities.map((uni) => (
            <div
              key={uni.id}
              className="p-5 rounded-xl border border-[var(--eg-border)] bg-[var(--eg-surface)] hover:border-[var(--eg-primary)]/50 hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
            >
              {/* Top: Logo & Title */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[var(--eg-surface-subtle)] border border-[var(--eg-border)] flex items-center justify-center text-2xl shadow-2xs">
                    {uni.logo || '🏛️'}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {uni.status || 'Active'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-[var(--eg-text-primary)] leading-snug">
                    {uni.shortName}
                  </h3>
                  <p className="text-xs text-[var(--eg-text-secondary)] line-clamp-2 mt-0.5">
                    {uni.name}
                  </p>
                </div>
              </div>

              {/* Middle: Details */}
              <div className="space-y-1.5 pt-2 border-t border-[var(--eg-border)]/60 text-xs text-[var(--eg-text-secondary)]">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--eg-text-muted)] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location:
                  </span>
                  <span className="font-medium text-[var(--eg-text-primary)]">{uni.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--eg-text-muted)] flex items-center gap-1">
                    <Users className="w-3 h-3" /> Total Seats:
                  </span>
                  <span className="font-mono font-medium text-[var(--eg-text-primary)]">
                    {uni.seats ? uni.seats.toLocaleString() : '1,200+'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--eg-text-muted)] flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Next Exam:
                  </span>
                  <span className="font-semibold text-slate-800">{uni.testDate || 'TBA'}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center gap-2 pt-1">
                <Link href="/universities" className="flex-1">
                  <button className="w-full py-2 px-3 bg-[var(--eg-primary-soft)] hover:bg-[var(--eg-primary)]/15 border border-[var(--eg-primary)]/20 text-[var(--eg-primary)] text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition">
                    <span>View University</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
