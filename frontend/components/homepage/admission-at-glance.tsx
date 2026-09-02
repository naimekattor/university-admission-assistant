'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ExternalLink, Filter, Building2, Calendar, Award, ArrowRight, CheckCircle2, Clock, FileText } from 'lucide-react';
import { AdmissionSectionConfig, AdmissionRowItem, DEFAULT_HOMEPAGE_CONFIG } from '@/lib/homepage-types';

interface AdmissionAtGlanceProps {
  config?: AdmissionSectionConfig;
  admissions?: AdmissionRowItem[];
}

export function AdmissionAtGlance({ config, admissions = [] }: AdmissionAtGlanceProps) {
  const title = config?.title || 'Admission at a Glance';
  const description =
    config?.description ||
    'See important admission schedules, application dates, and GPA criteria across Bangladesh universities.';

  const rawRows: AdmissionRowItem[] = useMemo(() => {
    if (config?.customRows && config.customRows.length > 0) {
      return config.customRows;
    }
    if (admissions && admissions.length > 0) {
      return admissions;
    }
    return (DEFAULT_HOMEPAGE_CONFIG.admissionSection?.customRows as AdmissionRowItem[]) || [];
  }, [config?.customRows, admissions]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredAdmissions = useMemo(() => {
    return rawRows.filter((item) => {
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
  }, [rawRows, searchQuery, selectedGroup, selectedStatus]);

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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#FF5500] border border-orange-200">
            <Clock className="w-3 h-3 text-[#FF5500]" />
            Opening Soon
          </span>
        );
      case 'Deadline Passed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
            Deadline Passed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {status || 'Not Announced'}
          </span>
        );
    }
  };

  const visibleCols = config?.visibleColumns || {
    university: true,
    application: true,
    testDate: true,
    minGpa: true,
    units: true,
    seats: true,
    status: true,
    circular: true,
  };

  return (
    <section id="admission-table" className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5500] font-mono">
              OFFICIAL CIRCULAR BREAKDOWN 2026
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {title}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {description}
            </p>
          </div>

          <div className="text-xs text-slate-500 font-mono shrink-0">
            Showing <strong className="text-slate-900">{filteredAdmissions.length}</strong> of {rawRows.length} universities
          </div>
        </div>

        {/* ── CUSTOM RICH HTML NOTICE (If added in Admin CMS) ── */}
        {config?.customHtmlNotice && (
          <div
            className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs text-slate-800 leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: config.customHtmlNotice }}
          />
        )}

        {/* ── SEARCH & FILTER CONTROLS ── */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by university name, short code, unit, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-[#FF5500] shadow-2xs cursor-pointer"
            >
              <option value="All">All Disciplines</option>
              <option value="Science">Science Group</option>
              <option value="Commerce">Commerce / BBA</option>
              <option value="Arts">Humanities / Arts</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-[#FF5500] shadow-2xs cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Applications Open">Applications Open</option>
              <option value="Opening Soon">Opening Soon</option>
              <option value="Deadline Passed">Deadline Passed</option>
            </select>
          </div>
        </div>

        {/* ── DESKTOP DATA TABLE ── */}
        <div className="hidden md:block rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  {visibleCols.university !== false && <th className="py-3.5 px-4">University & Code</th>}
                  {visibleCols.application !== false && <th className="py-3.5 px-4">Application Window</th>}
                  {visibleCols.testDate !== false && <th className="py-3.5 px-4">Exam Date</th>}
                  {visibleCols.minGpa !== false && <th className="py-3.5 px-4">Min. GPA & Criteria</th>}
                  {visibleCols.units !== false && <th className="py-3.5 px-4">Units & Seats</th>}
                  {visibleCols.status !== false && <th className="py-3.5 px-4">Status</th>}
                  {visibleCols.circular !== false && <th className="py-3.5 px-4 text-right">Circular</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredAdmissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No matching universities found for the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredAdmissions.slice(0, config?.maxDisplayCount || 10).map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/60 transition group">
                      {visibleCols.university !== false && (
                        <td className="py-3.5 px-4 font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-orange-50 text-[#FF5500] font-black text-[10px] flex items-center justify-center font-mono">
                              {row.shortName.slice(0, 3)}
                            </span>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-[#FF5500] transition">
                                {row.shortName}
                              </div>
                              <div className="text-[11px] text-slate-500 font-normal">{row.name}</div>
                            </div>
                          </div>
                        </td>
                      )}

                      {visibleCols.application !== false && (
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                          {row.applicationWindow}
                        </td>
                      )}

                      {visibleCols.testDate !== false && (
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-800 font-medium">
                          {row.testDate}
                        </td>
                      )}

                      {visibleCols.minGpa !== false && (
                        <td className="py-3.5 px-4 max-w-xs text-slate-700">
                          <span className="font-medium">{row.minGpa}</span>
                        </td>
                      )}

                      {visibleCols.units !== false && (
                        <td className="py-3.5 px-4 text-[11px]">
                          <div className="font-semibold text-slate-800">{row.units}</div>
                          {row.seats ? <div className="text-slate-400">{row.seats.toLocaleString()} seats</div> : null}
                        </td>
                      )}

                      {visibleCols.status !== false && (
                        <td className="py-3.5 px-4">
                          {getStatusBadge(row.status)}
                        </td>
                      )}

                      {visibleCols.circular !== false && (
                        <td className="py-3.5 px-4 text-right">
                          <a
                            href={row.circularUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5500] hover:text-[#E64D00] hover:underline"
                          >
                            <span>Circular</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── MOBILE CARDS VIEW (md:hidden) ── */}
        <div className="md:hidden space-y-3">
          {filteredAdmissions.slice(0, config?.maxDisplayCount || 10).map((row) => (
            <div
              key={row.id}
              className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{row.shortName}</h3>
                  <p className="text-[11px] text-slate-500">{row.name}</p>
                </div>
                {getStatusBadge(row.status)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">App Window</span>
                  <div className="font-medium text-slate-800 text-[11px]">{row.applicationWindow}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Exam Date</span>
                  <div className="font-medium text-slate-800 text-[11px]">{row.testDate}</div>
                </div>
              </div>

              <div className="text-xs pt-1 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Min GPA Criteria</span>
                <p className="text-[11px] text-slate-700">{row.minGpa}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-[11px] text-slate-500 font-medium">{row.units}</span>
                <a
                  href={row.circularUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#FF5500] flex items-center gap-1"
                >
                  <span>Circular</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
