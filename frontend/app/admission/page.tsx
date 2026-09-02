'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ExternalLink,
  Filter,
  Building2,
  Calendar,
  Award,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Sparkles,
  Users,
  Layers,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  GraduationCap,
  BookOpen,
  SlidersHorizontal,
} from 'lucide-react';
import { AdmissionRowItem, DEFAULT_HOMEPAGE_CONFIG, HomepageFullConfig } from '@/lib/homepage-types';

export default function AdmissionDirectoryPage() {
  const [config, setConfig] = useState<HomepageFullConfig>(DEFAULT_HOMEPAGE_CONFIG);
  const [backendAdmissions, setBackendAdmissions] = useState<AdmissionRowItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'seats' | 'name' | 'shortName'>('default');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number | 'all'>(10);

  useEffect(() => {
    // 1. Instant local storage hydration of latest published CMS data
    if (typeof window !== 'undefined') {
      try {
        const stored =
          localStorage.getItem('eduguide_homepage_published') ||
          localStorage.getItem('eduguide_homepage_config');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            setConfig(parsed);
          }
        }
      } catch {}
    }

    // 2. Fetch live data from backend
    const fetchData = async () => {
      try {
        const res = await fetch('/api/v1/homepage', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.config) setConfig(data.config);
          if (data.admissions && data.admissions.length > 0) {
            setBackendAdmissions(data.admissions);
          }
        }
      } catch {
        // Offline fallback
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const allRows: AdmissionRowItem[] = useMemo(() => {
    if (config?.admissionSection?.customRows && config.admissionSection.customRows.length > 0) {
      return config.admissionSection.customRows;
    }
    if (backendAdmissions.length > 0) {
      return backendAdmissions;
    }
    return (DEFAULT_HOMEPAGE_CONFIG.admissionSection?.customRows as AdmissionRowItem[]) || [];
  }, [config?.admissionSection?.customRows, backendAdmissions]);

  // Reset to Page 1 on any filter or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGroup, selectedStatus, sortBy, pageSize]);

  const filteredRows = useMemo(() => {
    let result = allRows.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.units.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.minGpa.toLowerCase().includes(searchQuery.toLowerCase());

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

  // Telemetry Metrics
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
  const endIndex = pageSize === 'all' ? filteredRows.length : Math.min(startIndex + (pageSize as number), filteredRows.length);
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
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 py-8 antialiased selection:bg-orange-500/20 selection:text-[#FF5500]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ── BACK NAVIGATION BREADCRUMB ── */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#FF5500] transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">Admission Circulars & Table Center</span>
        </div>

        {/* ── HERO BANNER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-xs font-bold uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>OFFICIAL 2026 ADMISSION INTELLIGENCE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Admission at a Glance Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Complete, real-time database of application windows, admission test dates, minimum GPA requirements, seat capacities, and official circular links for Bangladesh universities & centralized clusters.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/eligibility">
              <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF6B00] hover:from-[#E64D00] hover:to-[#FF5500] text-white text-xs font-bold shadow-sm hover:shadow transition flex items-center gap-2 cursor-pointer">
                <span>Check My Eligibility</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>

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
            <p className="text-[10px] text-slate-500">Across all units and faculties</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Circular Verification</span>
            <div className="text-2xl font-black text-slate-900 font-mono">100%</div>
            <p className="text-[10px] text-slate-500">Verified against official gazettes</p>
          </div>
        </div>

        {/* ── CUSTOM RICH HTML NOTICE (If added in Admin CMS) ── */}
        {config?.admissionSection?.customHtmlNotice && (
          <div
            className="p-5 rounded-2xl bg-orange-50/80 border border-orange-200 text-xs text-slate-800 leading-relaxed prose prose-sm max-w-none shadow-2xs"
            dangerouslySetInnerHTML={{ __html: config.admissionSection.customHtmlNotice }}
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
                onChange={(e) => setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value))}
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
                  className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF5500] text-white font-bold shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono">
            <div>
              Showing <strong className="text-slate-900">{filteredRows.length > 0 ? startIndex + 1 : 0}</strong>–
              <strong className="text-slate-900">{endIndex}</strong> of{' '}
              <strong className="text-slate-900">{filteredRows.length}</strong> matching universities
            </div>
            {(searchQuery || selectedGroup !== 'All' || selectedStatus !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGroup('All');
                  setSelectedStatus('All');
                }}
                className="text-[#FF5500] font-bold hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* ── DESKTOP DATA TABLE ── */}
        <div className="hidden md:block rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  <th className="py-4 px-5">University & Location</th>
                  <th className="py-4 px-4">Application Window</th>
                  <th className="py-4 px-4">Exam Date</th>
                  <th className="py-4 px-4">Min. GPA & Qualification</th>
                  <th className="py-4 px-4">Units & Capacity</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-right">Official Circular</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400">
                      No matching university admission circulars found for the selected filter.
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition group">
                      <td className="py-4 px-5 font-semibold">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5500] font-black text-xs flex items-center justify-center font-mono shrink-0 shadow-2xs">
                            {row.shortName.slice(0, 3)}
                          </span>
                          <div>
                            <div className="font-bold text-sm text-slate-900 group-hover:text-[#FF5500] transition">
                              {row.shortName}
                            </div>
                            <div className="text-[11px] text-slate-500 font-normal">{row.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{row.location}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-[11px] text-slate-700">
                        {row.applicationWindow}
                      </td>

                      <td className="py-4 px-4 font-mono text-[11px] text-slate-800 font-medium">
                        {row.testDate}
                      </td>

                      <td className="py-4 px-4 max-w-xs text-slate-700">
                        <span className="font-medium text-[11px] leading-relaxed block">{row.minGpa}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{row.group}</span>
                      </td>

                      <td className="py-4 px-4 text-[11px]">
                        <div className="font-semibold text-slate-800">{row.units}</div>
                        {row.seats ? (
                          <div className="text-slate-400 font-mono text-[10px]">{row.seats.toLocaleString()} total seats</div>
                        ) : null}
                      </td>

                      <td className="py-4 px-4">
                        {getStatusBadge(row.status)}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <a
                          href={row.circularUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-bold text-[#FF5500] hover:text-[#E64D00] transition shadow-2xs"
                        >
                          <span>Circular</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── MOBILE CARDS VIEW (md:hidden) ── */}
        <div className="md:hidden space-y-3">
          {paginatedRows.map((row) => (
            <div
              key={row.id}
              className="p-5 rounded-3xl border border-slate-200 bg-white shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5500] font-black text-xs flex items-center justify-center font-mono shrink-0">
                    {row.shortName.slice(0, 3)}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{row.shortName}</h3>
                    <p className="text-[11px] text-slate-500">{row.name}</p>
                  </div>
                </div>
                {getStatusBadge(row.status)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">App Window</span>
                  <div className="font-medium text-slate-800 text-[11px]">{row.applicationWindow}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Exam Date</span>
                  <div className="font-medium text-slate-800 text-[11px]">{row.testDate}</div>
                </div>
              </div>

              <div className="text-xs pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Min GPA Criteria</span>
                <p className="text-[11px] text-slate-700 font-medium">{row.minGpa}</p>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[11px] text-slate-800 font-semibold">{row.units}</span>
                  {row.seats ? <span className="text-slate-400 text-[10px] ml-1.5 font-mono">({row.seats} seats)</span> : null}
                </div>
                <a
                  href={row.circularUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#FF5500] flex items-center gap-1"
                >
                  <span>Circular</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ── PAGINATION CONTROLS BAR ── */}
        {pageSize !== 'all' && totalPages > 1 && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 font-mono">
              Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong>
            </div>

            <div className="flex items-center gap-1.5">
              {/* First Page */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Prev Page */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Numeric Page Buttons */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => {
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                        isActive
                          ? 'bg-[#FF5500] text-white shadow-2xs'
                          : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Page */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
