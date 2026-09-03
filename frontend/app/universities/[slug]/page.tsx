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
  GraduationCap,
  Compass,
  Image as ImageIcon,
  Library,
  ShieldCheck,
} from 'lucide-react';

interface ProgramItem {
  id: string;
  name: string;
  degree?: string;
  shortCode?: string;
  duration?: string;
  seats?: number;
  description?: string;
}

interface CircularItem {
  id: string;
  title: string;
  unit: string;
  year?: number;
  officialUrl?: string;
  summary?: string;
  requirements?: any;
}

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
  website?: string;
  description?: string;
  status?: string;
  units?: string;
  seats?: number;
  testDate?: string;
  applicationWindow?: string;
  metadata?: any;
  circulars?: CircularItem[];
  programs?: ProgramItem[];
  events?: any[];
}

export default function UniversityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [uni, setUni] = useState<UniversityDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'facilities' | 'circulars'>('overview');

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
          <p className="text-sm font-bold text-slate-700">Loading university profile...</p>
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
            We could not locate institutional records for <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">{slug}</code> in PostgreSQL.
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

  const isImageLogo = uni.logo && (uni.logo.startsWith('http://') || uni.logo.startsWith('https://') || uni.logo.startsWith('/'));
  const hasActiveCircular = uni.circulars && uni.circulars.length > 0;

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
              Code: {uni.shortName}
            </span>
          </div>

          {/* Main Institution Hero */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
            <div className="flex items-start gap-4 sm:gap-5">
              {/* University Logo / Emblem */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white border border-slate-200/90 flex items-center justify-center p-2 shadow-md shadow-orange-500/10 shrink-0 overflow-hidden">
                {isImageLogo ? (
                  <img
                    src={uni.logo}
                    alt={uni.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-4xl sm:text-5xl">{uni.logo || '🏛️'}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black text-[#FF5500] uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                    {uni.shortName}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    <Building2 className="w-3 h-3 text-[#FF5500]" />
                    <span>Est. {uni.foundedYear || 1950}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    <span>Public Institution</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                  {uni.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {uni.location ? `Located in ${uni.location}. ` : ''}
                  Premier higher education institution recognized for academic excellence, research contributions, and vibrant campus life.
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
                  <span>Official University Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <Link
                href={`/chat?query=Tell+me+about+${encodeURIComponent(uni.shortName)}+faculties+campus+life+and+admission`}
                className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-orange-400" />
                <span>Ask AI Advisor About {uni.shortName}</span>
              </Link>
            </div>
          </div>

          {/* Metrics Highlight Grid: Pure Evergreen Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Main Campus</span>
              <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF5500]" />
                <span className="line-clamp-1">{uni.location || 'Bangladesh'}</span>
              </div>
              <span className="text-[10px] text-slate-500">Campus Location</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Founded Year</span>
              <div className="text-sm font-bold text-slate-900 mt-1 font-mono">
                {uni.foundedYear || 1950}
              </div>
              <span className="text-[10px] text-slate-500">Charter Year</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Academic Programs</span>
              <div className="text-sm font-bold text-slate-900 mt-1 font-mono">
                {uni.programs ? uni.programs.length : 'Multiple'} Degrees
              </div>
              <span className="text-[10px] text-slate-500">Faculties & Departments</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Admission Selection</span>
              <div className="text-sm font-bold text-slate-900 mt-1 capitalize">
                {uni.admissionType || 'Merit Exam'}
              </div>
              <span className="text-[10px] text-slate-500">Entrance Mode</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── DYNAMIC ADMISSION STATUS WIDGET (SESSION NOTICE) ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {hasActiveCircular ? (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-white border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Current Admission Circular Active
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Official intake is open for{' '}
                  <strong className="text-slate-900 font-semibold">
                    {uni.circulars?.map((c) => c.unit).join(', ')}
                  </strong>
                  . Check eligibility requirements and circular details.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('circulars')}
              className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <span>View Active Circulars</span>
              <ArrowLeft className="w-3 h-3 rotate-180" />
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4 text-xs text-slate-600 shadow-2xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Campus admissions open annually based on academic council schedules. Stay tuned for the upcoming session circular.</span>
            </div>
            <Link
              href="/eligibility"
              className="text-[#FF5500] font-bold hover:underline shrink-0"
            >
              Test Eligibility Qualifier →
            </Link>
          </div>
        )}
      </div>

      {/* ── NAVIGATION TABS & EVERGREEN PROFILE CONTENT ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-[#FF5500] text-white shadow-sm shadow-orange-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Campus Overview & Culture</span>
          </button>

          <button
            onClick={() => setActiveTab('departments')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'departments'
                ? 'bg-[#FF5500] text-white shadow-sm shadow-orange-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Faculties & Departments ({uni.programs?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('facilities')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'facilities'
                ? 'bg-[#FF5500] text-white shadow-sm shadow-orange-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Library className="w-3.5 h-3.5" />
            <span>Campus Life & Facilities</span>
          </button>

          <button
            onClick={() => setActiveTab('circulars')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'circulars'
                ? 'bg-[#FF5500] text-white shadow-sm shadow-orange-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Admission Circulars ({uni.circulars?.length || 0})</span>
          </button>
        </div>

        {/* ── TAB 1: CAMPUS OVERVIEW & CULTURE ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Detailed Profile & Quill HTML Box */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#FF5500]" />
                    <span>About {uni.name}</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Institutional Profile</span>
                </div>

                {uni.description ? (
                  <div
                    className="guide-article-prose text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3"
                    dangerouslySetInnerHTML={{ __html: uni.description }}
                  />
                ) : (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {uni.name} is a premier higher education and research institution in Bangladesh. It features dedicated faculties, active student communities, modern laboratories, and a competitive merit-based entrance environment.
                  </p>
                )}
              </div>

              {/* Campus Highlights */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#FF5500]" />
                  <span>Institutional Highlights</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 space-y-1">
                    <span className="text-xs font-bold text-slate-900">Academic Merit</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Admissions conducted strictly on merit across national entrance examination percentiles.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
                    <span className="text-xs font-bold text-slate-900">Research Facilities</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Active research labs, indexed publications, and international academic collaboration.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                    <span className="text-xs font-bold text-slate-900">Alumni Network</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Graduates leading engineering, technology, medicine, and public policy worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Facts */}
            <div className="space-y-6">
              {/* Quick AI Advisor */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 to-slate-900 text-white space-y-4 shadow-xl">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Bot className="w-5 h-5 text-orange-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-white">Ask AI About {uni.shortName}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Have questions about departments, campus hostels, or previous cutoff trends? Ask EduGuide AI.
                  </p>
                </div>
                <Link
                  href={`/chat?query=What+are+the+best+departments+and+campus+facilities+at+${encodeURIComponent(uni.shortName)}?`}
                  className="w-full py-2.5 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <span>Chat With AI Tutor</span>
                </Link>
              </div>

              {/* Institution Quick Facts */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Institution Summary</h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Short Code</span>
                    <span className="font-mono font-bold text-slate-900">{uni.shortName}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Location</span>
                    <span className="font-bold text-slate-900">{uni.location}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Founded</span>
                    <span className="font-mono font-bold text-slate-900">{uni.foundedYear || '1950'}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Academic Category</span>
                    <span className="font-bold text-slate-900">{uni.group || uni.admissionType || 'Higher Education'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Total Departments</span>
                    <span className="font-mono font-bold text-[#FF5500]">{uni.programs?.length || 0} Programs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: FACULTIES & DEPARTMENTS ── */}
        {activeTab === 'departments' && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#FF5500]" />
                  <span>Academic Degree Programs & Departments</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Permanent academic faculties and degrees offered at {uni.name}.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-xs font-mono font-bold">
                {uni.programs?.length || 0} Active Programs
              </span>
            </div>

            {uni.programs && uni.programs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uni.programs.map((prog) => (
                  <div
                    key={prog.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-orange-200 transition shadow-2xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {prog.degree || 'Bachelor'}
                        </span>
                        {prog.seats && (
                          <span className="text-[11px] font-mono text-slate-500 font-semibold">
                            {prog.seats} Seats
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {prog.name}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {prog.description || 'Comprehensive curriculum with hands-on lab training and research projects.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Duration: {prog.duration || '4 Years'}</span>
                      <Link
                        href={`/chat?query=Tell+me+about+${encodeURIComponent(prog.name)}+at+${encodeURIComponent(uni.shortName)}`}
                        className="text-[#FF5500] font-semibold hover:underline"
                      >
                        Ask AI →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
                <Layers className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">No Academic Programs Listed Yet</h4>
                <p className="text-xs text-slate-400">Academic departments for this university can be managed in the Admin Programs Directory.</p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: CAMPUS LIFE & FACILITIES ── */}
        {activeTab === 'facilities' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Library className="w-5 h-5 text-[#FF5500]" />
                <span>Campus Infrastructure, Culture & Student Life</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Life at {uni.name} extends beyond classrooms with rich co-curricular opportunities, libraries, and hostels.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5500] flex items-center justify-center font-bold">
                    🏛️
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Central Library</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Extensive repository of textbooks, international research journals, digital archives, and quiet study zones.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    🏢
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Residential Halls</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    On-campus student dormitories providing secure accommodation, dining halls, and student common rooms.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    🔬
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Advanced Laboratories</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Modern computing clusters, physics, chemical, and engineering labs equipped for undergraduate experiments.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    🎭
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Clubs & Student Societies</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Robotics clubs, debating societies, photographic societies, cultural teams, and sports clubs.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    ⚽
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Sports & Gymnasium</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Football grounds, cricket pitches, basketball courts, and indoor gymnasiums for inter-departmental tournaments.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                    🏥
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Medical Center</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Free primary healthcare, ambulance services, and consultation facilities for all enrolled students.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: ADMISSION CIRCULARS ── */}
        {activeTab === 'circulars' && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#FF5500]" />
                  <span>Admission Circulars & Unit Requirements</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Official intake notices, GPA criteria, and application rules.
                </p>
              </div>

              <Link
                href="/eligibility"
                className="px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold transition shadow-sm"
              >
                Check My Eligibility →
              </Link>
            </div>

            {uni.circulars && uni.circulars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uni.circulars.map((c) => (
                  <div
                    key={c.id}
                    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-50 text-[#FF5500] border border-orange-200">
                          {c.unit}
                        </span>
                        {c.year && (
                          <span className="text-xs text-slate-500 font-mono">
                            Session: {c.year}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {c.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {c.summary || 'Official admission circular criteria verified against published university guidelines.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <Link
                        href="/eligibility"
                        className="text-[#FF5500] font-bold hover:underline"
                      >
                        Verify My GPA & Group →
                      </Link>

                      {c.officialUrl && (
                        <a
                          href={c.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-slate-900 font-semibold flex items-center gap-1"
                        >
                          <span>Circular PDF</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">No Active Circular Published</h4>
                <p className="text-xs text-slate-400">
                  The official admission circular for the upcoming session has not yet been released.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
