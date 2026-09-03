'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ExternalLink, ArrowRight } from 'lucide-react';
import { DeadlineSectionConfig } from '@/lib/homepage-types';

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
    'Never miss an application window, admit card download, or admission test date across Bangladesh universities.';

  const [filterType, setFilterType] = useState<string>('all');

  const filteredEvents = useMemo(() => {
    if (filterType === 'all') return deadlines;
    if (filterType === 'application') {
      return deadlines.filter((d) => d.eventType.includes('application'));
    }
    if (filterType === 'exam') {
      return deadlines.filter((d) => d.eventType.includes('exam'));
    }
    return deadlines;
  }, [deadlines, filterType]);

  return (
    <section id="deadlines" className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* ── SECTION HEADER & FILTERS ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-xs font-bold uppercase tracking-wider font-mono">
              <Clock className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>TIME-SENSITIVE SCHEDULES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {title}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {description}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 border border-slate-200 shrink-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('application')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition cursor-pointer ${
                filterType === 'application'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setFilterType('exam')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition cursor-pointer ${
                filterType === 'exam'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Exams
            </button>
          </div>
        </div>

        {/* ── DEADLINE EVENT CARDS GRID ── */}
        {filteredEvents.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-slate-200 bg-white text-center space-y-2">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No deadline events scheduled</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Admission test dates and application deadlines will appear here once published in the Admin CMS.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-orange-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3.5"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {event.university}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-[#FF5500] border border-orange-200">
                      {event.eventTypeName}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {event.unit}
                  </div>
                </div>

                {/* Date & Countdown */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#FF5500]" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{event.dateDisplay}</div>
                      <span className="text-[10px] text-slate-400">Official Date</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-[#FF5500]">
                      {typeof event.remainingDays === 'number' && event.remainingDays > 0
                        ? `${event.remainingDays} days left`
                        : 'Upcoming (2026-2027)'}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
                  {event.sourceUrl ? (
                    <a
                      href={event.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#FF5500] hover:underline font-medium text-[11px]"
                    >
                      <span>Circular</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Official Source</span>
                  )}

                  <Link href="/universities" className="inline-flex items-center gap-1 text-slate-700 font-bold hover:text-[#FF5500] transition text-[11px]">
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
