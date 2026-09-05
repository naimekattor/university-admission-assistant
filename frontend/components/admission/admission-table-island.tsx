'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  ExternalLink,
  Building2,
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { AdmissionRowItem } from '@/lib/homepage-types';

interface AdmissionTableIslandProps {
  initialRows: AdmissionRowItem[];
  customHtmlNotice?: string;
}

export function AdmissionTableIsland({ initialRows, customHtmlNotice }: AdmissionTableIslandProps) {
  const [allRows] = useState<AdmissionRowItem[]>(initialRows || []);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'seats' | 'name' | 'shortName'>('default');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number | 'all'>(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGroup, selectedStatus, sortBy, pageSize]);

  const filteredRows = useMemo(() => {
    let result = allRows.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.units && item.units.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.minGpa && item.minGpa.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesGroup = true;
      if (selectedGroup !== 'All') {
        if (selectedGroup === 'Engineering') {
          matchesGroup =
            item.shortName.includes('BUET') ||
            item.shortName.includes('KUET') ||
            item.shortName.includes('RUET') ||
            item.shortName.includes('CUET') ||
            item.shortName.includes('BUTEX') ||
            item.shortName.includes('MIST') ||
            item.units.toLowerCase().includes('engg') ||
            item.name.toLowerCase().includes('engineering');
        } else if (selectedGroup === 'Medical') {
          matchesGroup =
            item.shortName.includes('Medical') ||
            item.group.includes('Bio') ||
            item.name.toLowerCase().includes('medical');
        } else if (selectedGroup === 'GST') {
          matchesGroup =
            item.shortName.includes('GST') ||
            item.applicationWindow.includes('GST') ||
            item.testDate.includes('GST');
        } else if (selectedGroup === 'Agri') {
          matchesGroup =
            item.shortName.includes('Agri') ||
            item.name.toLowerCase().includes('agri') ||
            item.testDate.includes('Agri');
        } else {
          matchesGroup =
            item.group.toLowerCase().includes(selectedGroup.toLowerCase()) ||
            item.group.includes('All') ||
            item.group.includes('/');
        }
      }

      const matchesStatus =
        selectedStatus === 'All' || item.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesGroup && matchesStatus;
    });

    if (sortBy === 'seats') {
      result = [...result].sort((a, b) => (b.seats || 0) - (a.seats || 0));
    } else if (sortBy === 'shortName') {
      result = [...result].sort((a, b) => a.shortName.localeCompare(b.shortName));
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [allRows, searchQuery, selectedGroup, selectedStatus, sortBy]);

  const openCount = useMemo(() => {
    return allRows.filter((r) => r.status === 'Applications Open').length;
  }, [allRows]);

  const totalSeats = useMemo(() => {
    return allRows.reduce((acc, curr) => acc + (curr.seats || 0), 0);
  }, [allRows]);

  // Pagination Calculations
  const numericPageSize = pageSize === 'all' ? filteredRows.length : pageSize;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / (numericPageSize || 1)));
  const startIndex = (currentPage - 1) * (pageSize === 'all' ? 0 : (pageSize as number));
  const endIndex =
    pageSize === 'all'
      ? filteredRows.length
      : Math.min(startIndex + (pageSize as number), filteredRows.length);
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

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

  const disciplineChips = [
    { id: 'All', label: 'All Disciplines' },
    { id: 'Engineering', label: 'Engineering (BUET / CKRUET)' },
    { id: 'Medical', label: 'Medical & Dental (Combined)' },
    { id: 'GST', label: 'GST 24 Cluster' },
    { id: 'Agri', label: 'Agriculture 9 Cluster' },
    { id: 'Science', label: 'Science Group' },
    { id: 'Commerce', label: 'Commerce / BBA' },
    { id: 'Arts', label: 'Humanities / Arts' },
  ];

  return (
    <div className="space-y-6">
      {/* ── QUICK TELEMETRY STATS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Listed Universities</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{allRows.length}</div>
          <p className="text-[10px] text-slate-500">Public, Clusters & Medical</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-600 uppercase font-mono">Applications Open</span>
          <div className="text-2xl font-black text-emerald-600 font-mono">{openCount}</div>
          <p className="text-[10px] text-slate-500">Currently accepting forms</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#FF5500] uppercase font-mono">Total Admission Seats</span>
          <div className="text-2xl font-black text-[#FF5500] font-mono">{totalSeats.toLocaleString()}</div>
          <p className="text-[10px] text-slate-500">Across all faculties</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Circular Verification</span>
          <div className="text-2xl font-black text-slate-900 font-mono">100%</div>
          <p className="text-[10px] text-slate-500">Official Gazettes Sourced</p>
        </div>
      </div>

      {/* ── CUSTOM RICH HTML NOTICE (If provided) ── */}
      {customHtmlNotice && (
        <div
          className="p-5 rounded-2xl bg-orange-50/80 border border-orange-200 text-xs text-slate-800 leading-relaxed shadow-2xs"
          dangerouslySetInnerHTML={{ __html: customHtmlNotice }}
        />
      )}

      {/* ── SEARCH & MULTI-FILTER BAR ── */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by university name, short code (e.g. BUET, DU, Medical), unit, location, or GPA criteria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-slate-200 bg-[#FAF8F5] text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-full border border-slate-200 bg-[#FAF8F5] text-xs font-medium text-slate-700 focus:outline-none focus:border-[#FF5500] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Applications Open">Applications Open</option>
              <option value="Opening Soon">Opening Soon</option>
              <option value="Deadline Passed">Deadline Passed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-full border border-slate-200 bg-[#FAF8F5] text-xs font-medium text-slate-700 focus:outline-none focus:border-[#FF5500] cursor-pointer"
            >
              <option value="default">Default Order</option>
              <option value="seats">Most Seats First</option>
              <option value="shortName">Short Code (A–Z)</option>
              <option value="name">University Name (A–Z)</option>
            </select>

            <select
              value={pageSize}
              onChange={(e) =>
                setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="px-3.5 py-2.5 rounded-full border border-slate-200 bg-[#FAF8F5] text-xs font-medium text-slate-700 focus:outline-none focus:border-[#FF5500] cursor-pointer"
            >
              <option value={10}>10 / page</option>
              <option value={15}>15 / page</option>
              <option value={25}>25 / page</option>
              <option value="all">Show All</option>
            </select>
          </div>
        </div>

        {/* Discipline Chips Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {disciplineChips.map((chip) => {
            const isSelected = selectedGroup === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedGroup(chip.id)}
                className={`px-3 py-1.5 rounded-full font-medium transition whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── DATA TABLE CONTAINER ── */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-[#FAF8F5] text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                <th className="py-4 px-5">University</th>
                <th className="py-4 px-4">Application Window</th>
                <th className="py-4 px-4">Admission Test Date</th>
                <th className="py-4 px-4">Units & Group</th>
                <th className="py-4 px-4">Min GPA</th>
                <th className="py-4 px-4">Seats</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row) => {
                  const uniSlug =
                    row.slug ||
                    row.shortName.toLowerCase().replace(/[^a-z0-9]/g, '');

                  return (
                    <tr key={row.id} className="hover:bg-orange-50/20 transition-colors group">
                      <td className="py-4 px-5">
                        <div className="space-y-0.5">
                          <Link
                            href={`/universities/${uniSlug}`}
                            className="font-bold text-slate-900 group-hover:text-[#FF5500] transition flex items-center gap-1.5"
                          >
                            <span>{row.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {row.shortName}
                            </span>
                          </Link>
                          <div className="text-[11px] text-slate-500">{row.location}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-medium">
                        {row.applicationWindow || 'TBA'}
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-medium">
                        {row.testDate || 'TBA'}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-800">{row.units}</span>
                        <div className="text-[10px] text-slate-400">{row.group}</div>
                      </td>
                      <td className="py-4 px-4 font-bold text-[#FF5500]">{row.minGpa}</td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {row.seats ? row.seats.toLocaleString() : 'TBA'}
                      </td>
                      <td className="py-4 px-4 text-center">{getStatusBadge(row.status)}</td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/universities/${uniSlug}`}
                            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#FF5500] hover:text-white text-slate-700 text-xs font-bold transition flex items-center gap-1"
                          >
                            <span>Guide</span>
                          </Link>
                          {row.circularUrl && (
                            <a
                              href={row.circularUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition"
                              title="Official Circular PDF"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                    No university circular matches your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION BAR ── */}
        {pageSize !== 'all' && totalPages > 1 && (
          <div className="py-3.5 px-5 bg-[#FAF8F5] border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing <span className="font-bold text-slate-800">{startIndex + 1}</span> to{' '}
              <span className="font-bold text-slate-800">{endIndex}</span> of{' '}
              <span className="font-bold text-slate-800">{filteredRows.length}</span> records
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                title="First Page"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="px-3 font-mono font-bold text-slate-800">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                title="Last Page"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
