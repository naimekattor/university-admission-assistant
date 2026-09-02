'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Clock, AlertTriangle, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DeadlineSectionConfig } from '@/../backend/src/modules/homepage/homepage.service';

interface DeadlineEvent {
  id: string;
  university: string;
  unit: string;
  eventType: string;
  eventTypeName: string;
  eventDate: string;
  dateDisplay: string;
  remainingDays: number;
  status: string;
  sourceUrl?: string;
}

interface DeadlinesSectionProps {
  config?: DeadlineSectionConfig;
  deadlines?: DeadlineEvent[];
}

export function DeadlinesSection({ config, deadlines = [] }: DeadlinesSectionProps) {
  const title = config?.title || 'Upcoming Admission Deadlines';
  const description =
    config?.description ||
    'Never miss an important application window, admit card release, or admission test date.';

  const [filterType, setFilterType] = useState<string>('all');

  const filteredEvents = useMemo(() => {
    if (filterType === 'all') return deadlines;
    if (filterType === 'application') {
      return deadlines.filter((d) => d.eventType.includes('application'));
    }
    if (filterType === 'exam') {
      return deadlines.filter((d) => d.eventType.includes('exam'));
    }
    if (filterType === 'result') {
      return deadlines.filter((d) => d.eventType.includes('result'));
    }
    return deadlines;
  }, [deadlines, filterType]);

  return (
    <section id="deadlines" className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      <div className="space-y-6">
        {/* ── SECTION HEADER & FILTERS ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>TIME-SENSITIVE SCHEDULES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--eg-text-primary)] mt-1">
              {title}
            </h2>
            <p className="text-sm text-[var(--eg-text-secondary)] mt-1 max-w-2xl">
              {description}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--eg-surface-subtle)] border border-[var(--eg-border)] shrink-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[var(--eg-primary)] text-white shadow-2xs'
                  : 'text-[var(--eg-text-secondary)] hover:text-[var(--eg-text-primary)]'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilterType('application')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                filterType === 'application'
                  ? 'bg-[var(--eg-primary)] text-white shadow-2xs'
                  : 'text-[var(--eg-text-secondary)] hover:text-[var(--eg-text-primary)]'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setFilterType('exam')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                filterType === 'exam'
                  ? 'bg-[var(--eg-primary)] text-white shadow-2xs'
                  : 'text-[var(--eg-text-secondary)] hover:text-[var(--eg-text-primary)]'
              }`}
            >
              Admission Tests
            </button>
          </div>
        </div>

        {/* ── DEADLINE EVENT CARDS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full py-12 text-center text-sm text-[var(--eg-text-muted)] bg-[var(--eg-surface)] border border-[var(--eg-border)] rounded-xl">
              No upcoming admission events in this category yet.
            </div>
          ) : (
            filteredEvents.map((event) => {
              const isUrgent = event.remainingDays <= 18;

              return (
                <div
                  key={event.id}
                  className="p-5 rounded-xl border border-[var(--eg-border)] bg-[var(--eg-surface)] hover:border-[var(--eg-primary)]/40 hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                >
                  {/* Top: University + Event Badge */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-[var(--eg-text-primary)] font-mono">
                        {event.university}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          isUrgent
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {event.eventTypeName}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--eg-text-secondary)] font-medium">
                      {event.unit}
                    </div>
                  </div>

                  {/* Center: Date Display & Countdown */}
                  <div className="p-3 rounded-lg bg-[var(--eg-surface-subtle)] border border-[var(--eg-border)]/70 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[var(--eg-primary)]" />
                      <div>
                        <div className="text-xs font-bold text-[var(--eg-text-primary)]">
                          {event.dateDisplay}
                        </div>
                        <span className="text-[10px] text-[var(--eg-text-muted)]">Official Date</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-xs font-extrabold ${
                          isUrgent ? 'text-amber-600' : 'text-slate-800'
                        }`}
                      >
                        {event.remainingDays} days left
                      </div>
                      <span className="text-[10px] text-[var(--eg-text-muted)]">Countdown</span>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--eg-border)]/60 text-xs">
                    {event.sourceUrl ? (
                      <a
                        href={event.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[var(--eg-primary)] hover:underline font-medium"
                      >
                        <span>Official Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[var(--eg-text-muted)] text-[11px]">Official Circular</span>
                    )}

                    <Link href="/universities" className="inline-flex items-center gap-1 text-[var(--eg-text-primary)] font-semibold hover:text-[var(--eg-primary)] transition">
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
