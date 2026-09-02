'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ExternalLink, Filter, Building2, Calendar, Award, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { AdmissionSectionConfig } from '@/../backend/src/modules/homepage/homepage.service';

interface AdmissionItem {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  location: string;
  applicationWindow: string;
  testDate: string;
  minGpa: string;
  group: string;
  units: string;
  seats: number;
  status: string;
  statusColor: string;
  circularUrl: string;
  requiresSubjectVerification?: boolean;
}

interface AdmissionAtGlanceProps {
  config?: AdmissionSectionConfig;
  admissions?: AdmissionItem[];
}

export function AdmissionAtGlance({ config, admissions = [] }: AdmissionAtGlanceProps) {
  const title = config?.title || 'Admission at a Glance';
  const description =
    config?.description ||
    'See important admission information from leading universities without visiting multiple websites.';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredAdmissions = useMemo(() => {
    return admissions.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.units.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGroup =
        selectedGroup === 'All' ||
        item.group.toLowerCase().includes(selectedGroup.toLowerCase()) ||
        item.group.includes('All') ||
        item.group.includes('/');

      const matchesStatus =
        selectedStatus === 'All' || item.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesGroup && matchesStatus;
    });
  }, [admissions, searchQuery, selectedGroup, selectedStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Applications Open':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Applications Open
          </span>
        );
      case 'Opening Soon':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-500" />
            Opening Soon
          </span>
        );
      case 'Deadline Passed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Deadline Passed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Not Announced
          </span>
        );
    }
  };

  return (
    <section id="admission-table" className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      <div className="space-y-6">
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--eg-primary)] font-mono">
              OFFICIAL 2026 SCHEDULES
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--eg-text-primary)] mt-1">
              {title}
            </h2>
            <p className="text-sm text-[var(--eg-text-secondary)] mt-1 max-w-2xl">
              {description}
            </p>
          </div>

          <Link href="/universities" className="shrink-0">
            <button className="text-xs font-semibold text-[var(--eg-primary)] hover:text-[var(--eg-primary-hover)] flex items-center gap-1 px-3 py-2 rounded-lg bg-[var(--eg-primary-soft)] border border-[var(--eg-primary)]/20 transition cursor-pointer">
              <span>View All Universities Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {/* ── SEARCH & FILTERS BAR ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-[var(--eg-surface)] border border-[var(--eg-border)] rounded-xl shadow-sm">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--eg-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by university, acronym (BUET, DU), or unit..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 text-[var(--eg-text-primary)] placeholder:text-[var(--eg-text-muted)]"
            />
          </div>

          {/* Group Filter */}
          <div className="flex items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-[var(--eg-border)] pt-2 sm:pt-0 sm:pl-3">
            <span className="text-xs text-[var(--eg-text-muted)] font-medium shrink-0">Group:</span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="text-xs bg-[var(--eg-surface-subtle)] border border-[var(--eg-border)] text-[var(--eg-text-primary)] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--eg-primary)] font-medium"
            >
              <option value="All">All Groups</option>
              <option value="Science">Science</option>
              <option value="Commerce">Commerce / Business</option>
              <option value="Humanities">Humanities / Arts</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-[var(--eg-border)] pt-2 sm:pt-0 sm:pl-3">
            <span className="text-xs text-[var(--eg-text-muted)] font-medium shrink-0">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-[var(--eg-surface-subtle)] border border-[var(--eg-border)] text-[var(--eg-text-primary)] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--eg-primary)] font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Applications Open">Applications Open</option>
              <option value="Opening Soon">Opening Soon</option>
              <option value="Deadline Passed">Deadline Passed</option>
              <option value="Not Announced">Not Announced</option>
            </select>
          </div>
        </div>

        {/* ── DESKTOP DATA TABLE (Visible >= 768px) ── */}
        <div className="hidden md:block rounded-xl border border-[var(--eg-border)] bg-[var(--eg-surface)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--eg-surface-subtle)] border-b border-[var(--eg-border)] text-xs font-semibold text-[var(--eg-text-muted)] uppercase tracking-wider">
                  <th className="py-3.5 px-4">University</th>
                  <th className="py-3.5 px-4">Application Window</th>
                  <th className="py-3.5 px-4">Admission Test</th>
                  <th className="py-3.5 px-4">Minimum GPA</th>
                  <th className="py-3.5 px-4">Units</th>
                  <th className="py-3.5 px-4 text-right">Seats</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Circular</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--eg-border)] text-sm">
                {filteredAdmissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-sm text-[var(--eg-text-muted)]">
                      No university admissions matched your search filters.
                    </td>
                  </tr>
                ) : (
                  filteredAdmissions.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[var(--eg-surface-subtle)]/70 transition-colors min-h-[64px]"
                    >
                      {/* University Column */}
                      <td className="py-4 px-4">
                        <Link href={`/universities`} className="flex items-center gap-3 group">
                          <div className="w-10 h-10 rounded-lg bg-[var(--eg-surface-subtle)] border border-[var(--eg-border)] flex items-center justify-center text-lg shrink-0 shadow-2xs group-hover:border-[var(--eg-primary)] transition">
                            {item.logo || '🏛️'}
                          </div>
                          <div>
                            <div className="font-bold text-[var(--eg-text-primary)] group-hover:text-[var(--eg-primary)] transition flex items-center gap-1.5">
                              <span>{item.shortName}</span>
                              <span className="text-xs text-[var(--eg-text-muted)] font-normal hidden lg:inline">
                                ({item.location})
                              </span>
                            </div>
                            <div className="text-xs text-[var(--eg-text-secondary)] line-clamp-1 max-w-[200px] lg:max-w-[280px]">
                              {item.name}
                            </div>
                          </div>
                        </Link>
                      </td>

                      {/* Application Window */}
                      <td className="py-4 px-4">
                        <div className="font-medium text-[var(--eg-text-primary)] text-xs">
                          {item.applicationWindow}
                        </div>
                      </td>

                      {/* Admission Test Date */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800 text-xs">
                          {item.testDate}
                        </div>
                      </td>

                      {/* Minimum GPA */}
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-semibold font-mono">
                          {item.minGpa}
                        </span>
                      </td>

                      {/* Units */}
                      <td className="py-4 px-4 text-xs font-medium text-[var(--eg-text-secondary)]">
                        {item.units}
                      </td>

                      {/* Seats */}
                      <td className="py-4 px-4 text-xs font-semibold text-[var(--eg-text-primary)] text-right font-mono">
                        {item.seats ? item.seats.toLocaleString() : 'N/A'}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Circular Link */}
                      <td className="py-4 px-4 text-center">
                        <a
                          href={item.circularUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--eg-primary)] hover:text-[var(--eg-primary-hover)] px-2.5 py-1 rounded bg-[var(--eg-primary-soft)] hover:bg-[var(--eg-primary)]/15 border border-[var(--eg-primary)]/20 transition"
                        >
                          <span>Circular</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── MOBILE STACKED ADMISSION CARDS (Visible < 768px) ── */}
        <div className="md:hidden space-y-3">
          {filteredAdmissions.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--eg-text-muted)] bg-[var(--eg-surface)] border border-[var(--eg-border)] rounded-xl">
              No admission records matched your search.
            </div>
          ) : (
            filteredAdmissions.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-[var(--eg-border)] bg-[var(--eg-surface)] shadow-2xs space-y-3"
              >
                {/* Header: Logo, Name, Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-[var(--eg-surface-subtle)] border border-[var(--eg-border)] flex items-center justify-center text-xl shrink-0">
                      {item.logo || '🏛️'}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[var(--eg-text-primary)] leading-tight">
                        {item.shortName}
                      </h3>
                      <span className="text-xs text-[var(--eg-text-muted)]">{item.location}</span>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <div className="text-xs text-[var(--eg-text-secondary)]">
                  {item.name}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[var(--eg-border)]">
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-[var(--eg-text-muted)]">Application</span>
                    <div className="font-medium text-[var(--eg-text-primary)]">{item.applicationWindow}</div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-[var(--eg-text-muted)]">Admission Test</span>
                    <div className="font-medium text-[var(--eg-text-primary)]">{item.testDate}</div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-[var(--eg-text-muted)]">Minimum GPA</span>
                    <div className="font-semibold text-slate-800">{item.minGpa}</div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-[var(--eg-text-muted)]">Units & Seats</span>
                    <div className="font-medium text-[var(--eg-text-primary)]">{item.units} ({item.seats} seats)</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={item.circularUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-[var(--eg-primary-soft)] hover:bg-[var(--eg-primary)]/15 border border-[var(--eg-primary)]/20 text-[var(--eg-primary)] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition text-center"
                  >
                    <span>View Circular</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <Link href="/universities" className="flex-1">
                    <button className="w-full py-2 px-3 bg-[var(--eg-surface)] border border-[var(--eg-border-strong)] text-[var(--eg-text-primary)] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition">
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
