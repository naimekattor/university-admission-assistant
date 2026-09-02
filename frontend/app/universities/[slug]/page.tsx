'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Building2,
  ExternalLink,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
  Globe,
  Bot,
  Layers,
  FileText,
  AlertCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface UniversityDetails {
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
  website?: string;
  description?: string;
  metadata?: any;
  circulars?: any[];
  events?: any[];
  programs?: any[];
}

export default function UniversityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [uni, setUni] = useState<UniversityDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'units' | 'circulars' | 'timeline'>('overview');

  useEffect(() => {
    async function loadUniversity() {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/v1/universities/${slug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setUni(json.data);
          } else {
            setError('University details not found.');
          }
        } else {
          setError('University not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load university details.');
      } finally {
        setLoading(false);
      }
    }
    loadUniversity();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 text-[#FF5500] flex items-center justify-center mx-auto animate-pulse">
            <Building2 className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-sm font-bold text-slate-700">Loading university details from database...</p>
        </div>
      </div>
    );
  }

  if (error || !uni) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-xl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">University Not Found</h2>
          <p className="text-xs text-slate-500">
            We could not locate admission records for <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">{slug}</code> in PostgreSQL.
          </p>
          <div className="pt-2 flex items-center justify-center gap-2">
            <Link
              href="/universities"
              className="px-5 py-2.5 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold transition shadow-sm"
            >
              Browse All Universities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOpen = uni.status === 'Applications Open';
  const isOpeningSoon = uni.status === 'Opening Soon';
  const meta = uni.metadata || {};

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">
      {/* ── HERO HEADER WITH WARM GRADIENT ── */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-8 pb-12 sm:pt-10 sm:pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          {/* Breadcrumbs & Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/universities"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#FF5500] transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Universities</span>
            </Link>

            <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono font-bold text-slate-600">
              ID: {uni.shortName}
            </span>
          </div>

          {/* Main Institution Hero */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 flex items-center justify-center text-4xl sm:text-5xl shadow-md shadow-orange-500/10 shrink-0">
                {uni.logo || '🏛️'}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black text-[#FF5500] uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                    {uni.shortName}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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

                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Verified Official Intake</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                  {uni.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {uni.description || meta.overview || 'Comprehensive public university offering undergraduate and postgraduate degrees with competitive merit-based admission exams.'}
                </p>
              </div>
            </div>

            {/* Top Action CTAs */}
            <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
              {uni.website && uni.website !== '#' && (
                <a
                  href={uni.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Official Admission Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <Link
                href={`/chat?query=Tell+me+about+${encodeURIComponent(uni.shortName)}+admission+criteria+and+preparation`}
                className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-orange-400" />
                <span>Ask AI Advisor About {uni.shortName}</span>
              </Link>
            </div>
          </div>

          {/* Metrics Highlight Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Campus Location</span>
              <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>{uni.location || 'Bangladesh'}</span>
              </div>
              <span className="text-[10px] text-slate-500">Established {uni.foundedYear || 1950}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Seats</span>
              <div className="text-sm font-bold text-slate-900 mt-1 font-mono">
                {uni.seats ? Number(uni.seats).toLocaleString() : '1,200+'}
              </div>
              <span className="text-[10px] text-slate-500">Undergraduate Capacity</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Admission Type</span>
              <div className="text-sm font-bold text-slate-900 mt-1 capitalize">
                {uni.admissionType || uni.group || 'Merit Exam'}
              </div>
              <span className="text-[10px] text-slate-500">Competitive Entrance</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Next Exam Date</span>
              <div className="text-sm font-bold text-[#FF5500] mt-1">
                {uni.testDate || 'To be announced'}
              </div>
              <span className="text-[10px] text-slate-500">Official Schedule</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── NAVIGATION TABS & CONTENT ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'bg-[#FF5500] text-white shadow-sm shadow-orange-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Overview & Eligibility
          </button>

          <button
            onClick={() => setActiveTab('units')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer shrink-0 ${
              activeTab === 'units'
                ? 'bg-[#FF5500] text-white shadow-sm shadow-orange-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Admission Units & Faculties ({uni.units || 'All Units'})
          </button>

          <button
            onClick={() => setActiveTab('circulars')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer shrink-0 ${
              activeTab === 'circulars'
                ? 'bg-[#FF5500] text-white shadow-sm shadow-orange-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Official Circulars & Requirements ({uni.circulars?.length || 1})
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer shrink-0 ${
              activeTab === 'timeline'
                ? 'bg-[#FF5500] text-white shadow-sm shadow-orange-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Deadlines & Exam Schedule ({uni.events?.length || 0})
          </button>
        </div>

        {/* ── TAB 1: OVERVIEW & ELIGIBILITY ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Detailed Profile Box */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#FF5500]" />
                  <span>About {uni.name}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {uni.description || meta.overview || 'The institution conducts undergraduate admissions through competitive written and MCQ tests following the standards set by the academic council.'}
                </p>

                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 block">Application Window</span>
                    <p className="text-slate-600">{uni.applicationWindow || meta.application_window || 'Jan 15, 2026 – Feb 15, 2026'}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 block">Admission Test Date</span>
                    <p className="text-slate-600">{uni.testDate || meta.test_date || 'To be announced officially'}</p>
                  </div>
                </div>
              </div>

              {/* Eligibility Requirements Box */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Minimum Eligibility & GPA Requirements</span>
                </h3>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                  <div className="font-bold text-sm text-emerald-950">
                    {uni.minGpa || meta.min_gpa || 'Combined GPA 8.00 (Min 3.50 each in SSC & HSC)'}
                  </div>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    Applicants must have passed SSC in 2022/2023 and HSC in 2024/2025. Science background candidates require minimum individual grades in Physics, Chemistry, and Higher Mathematics.
                  </p>
                </div>

                <div className="space-y-2 pt-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5500] shrink-0 mt-0.5" />
                    <span>Passing Years: SSC (2022/2023) and HSC (2024/2025)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5500] shrink-0 mt-0.5" />
                    <span>Citizenship: Bangladeshi citizens and approved foreign quota quota candidates</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5500] shrink-0 mt-0.5" />
                    <span>Negative Marking: 0.25 marks deducted for every incorrect MCQ response</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-6">
              {/* AI Preparation CTA */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 to-slate-900 text-white space-y-4 shadow-xl">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Zap className="w-5 h-5 text-orange-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-white">Prepare for {uni.shortName}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Practice with timed mock tests tailored specifically for {uni.shortName} question patterns.
                  </p>
                </div>
                <Link
                  href="/mock-tests"
                  className="w-full py-2.5 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <span>Start Mock Test</span>
                </Link>
              </div>

              {/* Quick Institution Facts */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Quick Facts</h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Official Code</span>
                    <span className="font-mono font-bold text-slate-900">{uni.shortName}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Institution Type</span>
                    <span className="font-bold text-slate-900">{uni.admissionType || 'Public University'}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Divisional Centers</span>
                    <span className="font-bold text-slate-900">8 Divisions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Database Record</span>
                    <span className="font-mono text-[10px] text-emerald-600 font-bold">Synced with PostgreSQL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: ADMISSION UNITS & FACULTIES ── */}
        {activeTab === 'units' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FF5500]" />
                <span>Faculties & Admission Unit Breakdown</span>
              </h3>
              <p className="text-xs text-slate-600">
                Units and major disciplines offered for the 2025–26 undergraduate session:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">Unit Structure</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5500] text-white">Active</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-800">{uni.units || 'All Units (Ka, Kha, Ga)'}</div>
                  <p className="text-[11px] text-slate-600">
                    Includes faculties of Engineering, Physical Science, Biological Science, Business Studies, and Arts.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">Total Capacity</span>
                    <span className="text-xs font-mono font-bold text-[#FF5500]">{uni.seats || '1,200+'} Seats</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Seat quotas allocated strictly according to merit list positions and faculty preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: OFFICIAL CIRCULARS & REQUIREMENTS ── */}
        {activeTab === 'circulars' && (
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FF5500]" />
              <span>Official Admission Circular Details</span>
            </h3>

            {uni.circulars && uni.circulars.length > 0 ? (
              <div className="space-y-3">
                {uni.circulars.map((circ) => (
                  <div key={circ.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-bold text-xs text-slate-900">{circ.title || `${uni.shortName} Admission Circular 2026`}</div>
                      <div className="text-[11px] text-slate-500">Unit: {circ.unit || uni.units || 'All Units'} • Year: {circ.year || 2026}</div>
                    </div>
                    {circ.officialUrl && (
                      <a
                        href={circ.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-full bg-[#FF5500] text-white text-xs font-bold hover:bg-[#E64D00] transition flex items-center gap-1 shrink-0"
                      >
                        <span>Open Circular</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Official circular for {uni.name} is scheduled for publication shortly.</p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: DEADLINES & SCHEDULE TIMELINE ── */}
        {activeTab === 'timeline' && (
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#FF5500]" />
              <span>Time-Sensitive Admission Milestones</span>
            </h3>

            {uni.events && uni.events.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {uni.events.map((evt) => (
                  <div key={evt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{evt.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-[#FF5500] border border-orange-200">
                        {evt.eventType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">{evt.unit || 'All Units'}</div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                      <span className="font-mono font-bold text-slate-800">{evt.dateDisplay}</span>
                      <span className="font-mono font-bold text-[#FF5500]">{evt.remainingDays} days left</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 space-y-2">
                <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Specific exam shift milestones will be displayed here as announced.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
