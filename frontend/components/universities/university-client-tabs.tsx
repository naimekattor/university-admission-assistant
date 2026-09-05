'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  BookOpen,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Award,
  Globe,
  Bot,
  Layers,
  FileText,
  HelpCircle,
  Zap,
  GraduationCap,
  Image as ImageIcon,
  Library,
  ShieldCheck,
  ExternalLink,
  Share2,
  Bookmark,
} from 'lucide-react';

export interface UniversityClientTabsProps {
  uni: any;
}

export function UniversityClientTabs({ uni }: UniversityClientTabsProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'departments' | 'facilities' | 'circulars'
  >('overview');
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="space-y-8">
      {/* ── NAVIGATION TABS ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none text-xs sm:text-sm font-semibold">
        {[
          { id: 'overview', label: 'Overview & Target', icon: BookOpen },
          { id: 'departments', label: 'Departments & Seats', icon: Layers },
          { id: 'circulars', label: 'Official Circulars', icon: FileText },
          { id: 'facilities', label: 'Campus & Facilities', icon: Library },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2 pl-4">
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-2.5 rounded-full border transition cursor-pointer ${
              bookmarked
                ? 'bg-orange-50 border-orange-200 text-[#FF5500]'
                : 'border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title={bookmarked ? 'Saved to bookmarks' : 'Bookmark university'}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-[#FF5500]' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── TAB CONTENT: OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Total Seats</div>
              <div className="text-2xl font-black text-slate-900">
                {uni.seats ? Number(uni.seats).toLocaleString() : '1,300+'}
              </div>
              <div className="text-xs text-slate-500">Undergraduate</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Required GPA</div>
              <div className="text-2xl font-black text-[#FF5500]">{uni.minGpa || '5.00'}</div>
              <div className="text-xs text-slate-500">SSC + HSC Minimum</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Admission Type</div>
              <div className="text-2xl font-black text-slate-900">
                {uni.admissionType || 'Autonomous'}
              </div>
              <div className="text-xs text-slate-500">Independent Exam</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Next Exam Date</div>
              <div className="text-2xl font-black text-emerald-600">
                {uni.testDate ? uni.testDate.split(' ')[0] : 'TBA'}
              </div>
              <div className="text-xs text-slate-500">{uni.testDate || 'Session 2026'}</div>
            </div>
          </div>

          {/* Description Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FF5500]" />
              <span>About {uni.name}</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {uni.description ||
                `${uni.name} (${uni.shortName}) is one of the premier academic institutions in Bangladesh, offering accredited undergraduate programs in engineering, technology, sciences, and humanities.`}
            </p>
          </div>
        </div>
      )}

      {/* ── TAB CONTENT: DEPARTMENTS & SEATS ── */}
      {activeTab === 'departments' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Undergraduate Programs & Department Breakdown</h3>
            <p className="text-xs text-slate-500">Seat allocations according to the latest official university circular.</p>
          </div>

          <div className="divide-y divide-slate-100">
            {(uni.programs && Array.isArray(uni.programs) && uni.programs.length > 0
              ? uni.programs
              : [
                  { name: 'Computer Science & Engineering', seats: 120, degree: 'B.Sc. Engg.' },
                  { name: 'Electrical & Electronic Engineering', seats: 120, degree: 'B.Sc. Engg.' },
                  { name: 'Mechanical Engineering', seats: 120, degree: 'B.Sc. Engg.' },
                  { name: 'Civil Engineering', seats: 130, degree: 'B.Sc. Engg.' },
                  { name: 'Chemical Engineering', seats: 60, degree: 'B.Sc. Engg.' },
                ]
            ).map((prog: any, idx: number) => (
              <div key={idx} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">{prog.name}</div>
                  <div className="text-[10px] text-slate-400">{prog.degree || 'Bachelor Degree'}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-slate-900">{prog.seats || '60'} Seats</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Merit Open</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB CONTENT: CIRCULARS ── */}
      {activeTab === 'circulars' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Official Circular Notices & Guidelines</h3>
            <p className="text-xs text-slate-500">Direct links to authentic university circular PDFs and portal guidelines.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-sm">{uni.name} Admission Circular 2026</div>
                <div className="text-xs text-slate-600">Unit-wise eligibility qualifier and online registration instructions.</div>
              </div>
              {uni.circularUrl ? (
                <a
                  href={uni.circularUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#FF5500] hover:bg-[#E64D00] text-white rounded-full text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  <span>Download Circular</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-xs text-slate-400 font-mono">Awaiting Official PDF</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB CONTENT: FACILITIES ── */}
      {activeTab === 'facilities' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
          {[
            { title: 'Central Research Library', desc: 'Over 100,000 reference textbooks and digital IEEE access.' },
            { title: 'High-Speed Campus WiFi', desc: 'Full gigabit fiber connectivity across labs and residential halls.' },
            { title: 'Modern Laboratories', desc: 'Specialized fabrication, robotics, physics, and computing labs.' },
            { title: 'Residential Halls', desc: 'On-campus dormitories with dining and recreational facilities.' },
          ].map((fac, idx) => (
            <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF5500]" />
                <span>{fac.title}</span>
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">{fac.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
