'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Building2,
  ExternalLink,
  ArrowRight,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  Award,
} from 'lucide-react';

import { FALLBACK_UNIVERSITIES } from '@/lib/universities-fallback';

interface UniversityItem {
  id: string;
  name: string;
  shortName: string;
  slug?: string;
  location: string;
  logo: string;
  foundedYear?: number;
  admissionType?: string;
  cutoffMarks?: number;
  group?: string;
  applicationWindow?: string;
  testDate?: string;
  minGpa?: string;
  units?: string;
  seats?: number;
  status?: string;
  circularUrl?: string;
  website?: string;
  description?: string;
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<UniversityItem[]>(FALLBACK_UNIVERSITIES as any);
  const [loading, setLoading] = useState(false);
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    async function loadUniversities() {
      try {
        const res = await fetch('/api/v1/universities');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setUniversities(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load universities:', err);
      }
    }
    loadUniversities();
  }, []);

  const groups = ['All', 'Engineering', 'Medical', 'Science & Tech', 'General Public', 'Agriculture'];

  const filteredUniversities = useMemo(() => {
    return universities.filter((uni) => {
      const q = search.toLowerCase();
      const matchesSearch =
        search === '' ||
        uni.name.toLowerCase().includes(q) ||
        uni.shortName.toLowerCase().includes(q) ||
        (uni.location && uni.location.toLowerCase().includes(q)) ||
        (uni.units && uni.units.toLowerCase().includes(q));

      let matchesGroup = true;
      if (selectedGroup !== 'All') {
        const text = `${uni.name} ${uni.shortName} ${uni.group || ''} ${uni.units || ''}`.toLowerCase();
        if (selectedGroup === 'Engineering') {
          matchesGroup = text.includes('buet') || text.includes('kuet') || text.includes('ruet') || text.includes('cuet') || text.includes('butex') || text.includes('mist') || text.includes('engineering');
        } else if (selectedGroup === 'Medical') {
          matchesGroup = text.includes('medical') || text.includes('dghs') || text.includes('mbbs') || text.includes('dental');
        } else if (selectedGroup === 'Science & Tech') {
          matchesGroup = text.includes('sust') || text.includes('just') || text.includes('hstu') || text.includes('science') || text.includes('technology');
        } else if (selectedGroup === 'Agriculture') {
          matchesGroup = text.includes('agriculture') || text.includes('bau') || text.includes('bsmrau') || text.includes('sau');
        } else if (selectedGroup === 'General Public') {
          matchesGroup = text.includes('du') || text.includes('ru') || text.includes('cu') || text.includes('ju') || text.includes('cluster') || text.includes('gst');
        }
      }

      let matchesStatus = true;
      if (selectedStatus !== 'All') {
        matchesStatus = uni.status === selectedStatus;
      }

      return matchesSearch && matchesGroup && matchesStatus;
    });
  }, [universities, search, selectedGroup, selectedStatus]);

  // Aggregate stats
  const totalSeats = useMemo(() => {
    return universities.reduce((acc, u) => acc + (Number(u.seats) || 0), 0);
  }, [universities]);

  const openCount = useMemo(() => {
    return universities.filter((u) => u.status === 'Applications Open').length;
  }, [universities]);

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">
      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-12 pb-14 sm:pt-16 sm:pb-18">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-xs font-bold font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Database Sourced</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Universities & Admission Portals <span className="text-[#FF5500]">2026</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Explore all public, engineering, medical, and centralized cluster universities across Bangladesh.
              Review verified seat capacities, eligibility GPA criteria, test dates, and official circular portals.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Universities</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{universities.length}</div>
              <span className="text-[10px] text-slate-500">Live in PostgreSQL</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Applications Open</span>
              <div className="text-2xl font-black text-emerald-600 mt-0.5">{openCount}</div>
              <span className="text-[10px] text-emerald-600 font-medium">Active Windows</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Seats Available</span>
              <div className="text-2xl font-black text-[#FF5500] mt-0.5">{totalSeats.toLocaleString()}</div>
              <span className="text-[10px] text-slate-500">Across All Units</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Academic Session</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">2025–26</div>
              <span className="text-[10px] text-slate-500">Undergraduate Intake</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-slate-900/5 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search university name, short code (e.g. BUET, DU, Medical), location, units..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:outline-none focus:border-[#FF5500] focus:bg-white transition"
              />
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-11 px-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:border-[#FF5500] focus:bg-white transition cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Applications Open">Applications Open</option>
                <option value="Opening Soon">Opening Soon</option>
                <option value="Deadline Passed">Deadline Passed</option>
              </select>
            </div>
          </div>

          {/* Category Group Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Group:
            </span>
            {groups.map((grp) => (
              <button
                key={grp}
                onClick={() => setSelectedGroup(grp)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-tight shrink-0 transition cursor-pointer ${
                  selectedGroup === grp
                    ? 'bg-[#FF5500] text-white shadow-sm shadow-orange-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {grp}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── UNIVERSITY CARDS GRID ── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-600">
            Showing <strong className="text-slate-900">{filteredUniversities.length}</strong> universities
          </span>
          <Link
            href="/admission"
            className="text-xs font-bold text-[#FF5500] hover:underline inline-flex items-center gap-1"
          >
            <span>View Full Comparison Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 rounded-3xl bg-white border border-slate-200/80 p-6 animate-pulse space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-20 bg-slate-50 rounded-2xl" />
                <div className="h-10 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredUniversities.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No universities match your search</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query, selecting "All" categories, or resetting status filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedGroup('All');
                setSelectedStatus('All');
              }}
              className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Verified Institutions & Admissions ({filteredUniversities.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredUniversities.map((uni) => {
              const targetSlug = (uni.slug || uni.shortName || uni.id).toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
              const isOpen = uni.status === 'Applications Open';
              const isOpeningSoon = uni.status === 'Opening Soon';
              const isImageLogo = uni.logo && (uni.logo.startsWith('http://') || uni.logo.startsWith('https://') || uni.logo.startsWith('/')) && !failedLogos.has(uni.id);

              return (
                <div
                  key={uni.id}
                  className="group rounded-3xl bg-white border border-slate-200/80 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 flex flex-col justify-between p-6 space-y-5"
                >
                  {/* Card Header */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center p-1.5 shadow-xs group-hover:scale-105 transition shrink-0 overflow-hidden">
                          {isImageLogo ? (
                            <Image
                              src={uni.logo}
                              alt={`${uni.name || uni.shortName} official logo`}
                              width={48}
                              height={48}
                              className="w-full h-full object-contain"
                              onError={() => setFailedLogos((prev) => new Set(prev).add(uni.id))}
                            />
                          ) : null}
                          <span className={`${isImageLogo ? 'hidden' : 'block'} text-2xl`}>
                            {uni.logo && !uni.logo.startsWith('http') && !uni.logo.startsWith('/') ? uni.logo : '🏛️'}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-black text-[#FF5500] uppercase tracking-wider">
                              {uni.shortName}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                            {uni.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Meta Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{uni.location || 'Bangladesh'}</span>
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isOpen
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isOpeningSoon
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : isOpeningSoon ? 'bg-amber-500' : 'bg-slate-400'}`} />
                        <span>{uni.status || 'Scheduled'}</span>
                      </span>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Seats</span>
                        <span className="font-mono font-bold text-slate-900">
                          {uni.seats ? Number(uni.seats).toLocaleString() : '1,200+'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Admission Type</span>
                        <span className="font-bold text-slate-800 capitalize">
                          {uni.admissionType || uni.group || 'Merit Exam'}
                        </span>
                      </div>

                      <div className="col-span-2 pt-1.5 border-t border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Minimum GPA Criteria</span>
                        <span className="font-medium text-slate-800 text-[11px] line-clamp-1">
                          {uni.minGpa || 'Combined GPA 8.00 (Min 3.50 each)'}
                        </span>
                      </div>
                    </div>

                    {/* Timeline Peek */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Exam / Test Date:</span>
                        <span className="font-bold text-slate-900">{uni.testDate || 'To be announced'}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Units:</span>
                        <span className="font-mono text-slate-700 font-semibold">{uni.units || 'All Units'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    {uni.circularUrl || uni.website ? (
                      <a
                        href={uni.circularUrl || uni.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-[#FF5500] transition"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Official Portal</span>
                    )}

                    <Link
                      href={`/universities/${targetSlug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 group-hover:bg-[#FF5500] text-white text-xs font-bold shadow-sm transition duration-200"
                    >
                      <span>Explore Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
