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
    <section id="deadlines" className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto bg-slate-950">
      <div className="space-y-6">
        {/* ── SECTION HEADER & FILTERS ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>TIME-SENSITIVE SCHEDULES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              {title}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {description}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilterType('application')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                filterType === 'application'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setFilterType('exam')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                filterType === 'exam'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admission Tests
            </button>
          </div>
        </div>

        {/* ── DEADLINE EVENT CARDS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full py-12 text-center text-sm text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
              No upcoming admission events in this category yet.
            </div>
          ) : (
            filteredEvents.map((event) => {
              const isUrgent = event.remainingDays <= 18;

              return (
                <div
                  key={event.id}
                  className="p-5 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-amber-500/40 hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                >
                  {/* Top: University + Event Badge */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-white font-mono">
                        {event.university}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          isUrgent
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {event.eventTypeName}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-medium">
                      {event.unit}
                    </div>
                  </div>

                  {/* Center: Date Display & Countdown */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {event.dateDisplay}
                        </div>
                        <span className="text-[10px] text-slate-400">Official Date</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-xs font-extrabold ${
                          isUrgent ? 'text-amber-400' : 'text-slate-200'
                        }`}
                      >
                        {event.remainingDays} days left
                      </div>
                      <span className="text-[10px] text-slate-400">Countdown</span>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800 text-xs">
                    {event.sourceUrl ? (
                      <a
                        href={event.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-amber-400 hover:underline font-medium"
                      >
                        <span>Official Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Official Circular</span>
                    )}

                    <Link href="/universities" className="inline-flex items-center gap-1 text-slate-200 font-semibold hover:text-amber-400 transition">
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
