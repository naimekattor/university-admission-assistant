'use client';

import React, { useState, useMemo } from 'react';
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
  CheckCircle2,
  Clock,
  Layers,
  Award,
} from 'lucide-react';

export interface UniversityItem {
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

interface UniversityFilterIslandProps {
  initialUniversities: UniversityItem[];
}

export function UniversityFilterIsland({ initialUniversities }: UniversityFilterIslandProps) {
  const [universities] = useState<UniversityItem[]>(initialUniversities);
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

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
          matchesGroup =
            text.includes('buet') ||
            text.includes('kuet') ||
            text.includes('ruet') ||
            text.includes('cuet') ||
            text.includes('butex') ||
            text.includes('mist') ||
            text.includes('engineering');
        } else if (selectedGroup === 'Medical') {
          matchesGroup =
            text.includes('medical') ||
            text.includes('dghs') ||
            text.includes('mbbs') ||
            text.includes('dental');
        } else if (selectedGroup === 'Science & Tech') {
          matchesGroup =
            text.includes('sust') ||
            text.includes('just') ||
            text.includes('hstu') ||
            text.includes('science') ||
            text.includes('technology');
        } else if (selectedGroup === 'Agriculture') {
          matchesGroup =
            text.includes('agriculture') ||
            text.includes('bau') ||
            text.includes('bsmrau') ||
            text.includes('sau');
        } else if (selectedGroup === 'General Public') {
          matchesGroup =
            text.includes('du') ||
            text.includes('ru') ||
            text.includes('cu') ||
            text.includes('ju') ||
            text.includes('cluster') ||
            text.includes('gst');
        }
      }

      let matchesStatus = true;
      if (selectedStatus !== 'All') {
        matchesStatus = uni.status === selectedStatus;
      }

      return matchesSearch && matchesGroup && matchesStatus;
    });
  }, [universities, search, selectedGroup, selectedStatus]);

  const handleLogoError = (id: string) => {
    setFailedLogos((prev) => new Set(prev).add(id));
  };

  return (
    <div className="space-y-8">
      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by university name, short code, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500] transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {['All', 'Applications Open', 'Upcoming'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-[#FF5500] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Academic Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs border-t border-slate-100 pt-3">
          {groups.map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap cursor-pointer ${
                selectedGroup === grp
                  ? 'bg-orange-50 text-[#FF5500] font-bold border border-orange-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
          Showing {filteredUniversities.length} {filteredUniversities.length === 1 ? 'University' : 'Universities'}
        </span>
      </div>

      {/* ── UNIVERSITIES GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUniversities.map((uni) => {
          const detailSlug =
            uni.slug ||
            uni.shortName.toLowerCase().replace(/[^a-z0-9]/g, '') ||
            uni.id;

          const hasFailedLogo = failedLogos.has(uni.id) || !uni.logo;

          return (
            <div
              key={uni.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Header: Logo + Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/60 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                    {hasFailedLogo ? (
                      <div className="w-full h-full rounded-xl bg-orange-50 text-[#FF5500] font-black text-xs flex items-center justify-center">
                        {uni.shortName?.slice(0, 3) || 'UNI'}
                      </div>
                    ) : (
                      <Image
                        src={uni.logo}
                        alt={`${uni.shortName} Logo`}
                        width={44}
                        height={44}
                        className="object-contain max-h-full"
                        onError={() => handleLogoError(uni.id)}
                      />
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        uni.status === 'Applications Open'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : uni.status === 'Exam Date Announced'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {uni.status || 'Upcoming'}
                    </span>
                    {uni.foundedYear && (
                      <span className="text-[10px] text-slate-400 font-mono">Est. {uni.foundedYear}</span>
                    )}
                  </div>
                </div>

                {/* Title & Location */}
                <div className="space-y-1">
                  <Link href={`/universities/${detailSlug}`} className="hover:text-[#FF5500] transition">
                    <h3 className="font-extrabold text-base text-slate-900 line-clamp-1 group-hover:text-[#FF5500]">
                      {uni.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{uni.location || 'Bangladesh'}</span>
                  </div>
                </div>

                {/* Badges / Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Total Seats</div>
                    <div className="font-extrabold text-slate-800">
                      {uni.seats ? uni.seats.toLocaleString() : 'TBA'}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Min GPA</div>
                    <div className="font-extrabold text-[#FF5500]">{uni.minGpa || 'Available'}</div>
                  </div>
                </div>

                {/* Exam Date or Window */}
                {uni.testDate && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-orange-50/50 border border-orange-100/60 p-2 rounded-xl">
                    <Calendar className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />
                    <span className="line-clamp-1">Exam: {uni.testDate}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/universities/${detailSlug}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#FF5500] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs group/btn"
                >
                  <span>Admission Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>

                {uni.circularUrl && (
                  <a
                    href={uni.circularUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition"
                    title="Official Circular"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
