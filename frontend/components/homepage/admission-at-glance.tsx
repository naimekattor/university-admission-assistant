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
    'See important admission schedules, application dates, and GPA criteria across Bangladesh universities.';

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
            Not Announced
          </span>
        );
    }
  };

  return (
    <section id="admission-table" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="space-y-6">
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5500] font-mono">
              OFFICIAL 2026 SCHEDULES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {title}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {description}
            </p>
          </div>

          <Link href="/universities" className="shrink-0">
            <button className="text-xs font-semibold text-[#FF5500] hover:text-[#E64D00] flex items-center gap-1 px-3 py-2 rounded-full bg-orange-50 border border-orange-200 transition cursor-pointer">
              <span>View All Universities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {/* ── SEARCH & FILTERS BAR ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by university, acronym (BUET, DU), or unit..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-transparent border-0 focus:outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-3">
            <span className="text-xs text-slate-500 font-medium shrink-0">Group:</span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
            >
              <option value="All">All Groups</option>
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Humanities">Humanities</option>
            </select>
          </div>
        </div>

        {/* ── DESKTOP DATA TABLE ── */}
        <div className="hidden md:block rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">University</th>
                <th className="py-3.5 px-4">Application Window</th>
                <th className="py-3.5 px-4">Admission Test</th>
                <th className="py-3.5 px-4">Min. GPA</th>
                <th className="py-3.5 px-4">Units</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredAdmissions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-sm shrink-0">
                        {item.logo || '🏛️'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{item.shortName}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{item.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{item.applicationWindow}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#FF5500]">{item.testDate}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{item.minGpa}</td>
                  <td className="py-3.5 px-4 text-slate-600">{item.units}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                  <td className="py-3.5 px-4 text-center">
                    <a
                      href={item.circularUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF5500] hover:text-[#E64D00] px-2.5 py-1 rounded-full bg-orange-50 hover:bg-orange-100 border border-orange-200 transition"
                    >
                      <span>Circular</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── MOBILE CARDS ── */}
        <div className="md:hidden space-y-3">
          {filteredAdmissions.map((item) => (
            <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-sm">
                    {item.logo || '🏛️'}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">{item.shortName}</div>
                    <div className="text-[10px] text-slate-500">{item.location}</div>
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400">Exam Date:</span>
                  <div className="font-semibold text-[#FF5500]">{item.testDate}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Min GPA:</span>
                  <div className="font-bold text-slate-800">{item.minGpa}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
