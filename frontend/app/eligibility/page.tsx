'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatedCard } from '@/components/ui/animated-card';
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  GraduationCap,
  Calendar,
  DollarSign,
  Users,
  ExternalLink,
  MessageSquare,
  Edit3,
  RotateCcw,
  Sparkles,
  Info,
  ArrowRight,
  BookOpen,
  Award,
  Check,
  Compass,
} from 'lucide-react';
import {
  evaluateEligibilitySummary,
  type StudentProfile,
  type AcademicGroup,
  type EligibilitySummaryEvaluation,
  type DepartmentEligibilityResult,
} from '@/lib/services/eligibility-engine';

export default function EligibilityPage() {
  // Input Form State
  const [sscGPA, setSscGPA] = useState<number | ''>('');
  const [hscGPA, setHscGPA] = useState<number | ''>('');
  const [group, setGroup] = useState<AcademicGroup>('Science');
  const [passingYear, setPassingYear] = useState<number>(2024);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Summary State
  const [summary, setSummary] = useState<EligibilitySummaryEvaluation | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Interactive UI State
  const [activeTab, setActiveTab] = useState<'all' | 'eligible' | 'ineligible'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCheck = () => {
    const sscVal = typeof sscGPA === 'number' ? sscGPA : parseFloat(sscGPA as string);
    const hscVal = typeof hscGPA === 'number' ? hscGPA : parseFloat(hscGPA as string);

    if (isNaN(sscVal) || sscVal < 0 || sscVal > 5) {
      setValidationError('Please enter a valid SSC GPA between 0.00 and 5.00');
      return;
    }

    if (isNaN(hscVal) || hscVal < 0 || hscVal > 5) {
      setValidationError('Please enter a valid HSC GPA between 0.00 and 5.00');
      return;
    }

    setValidationError(null);

    const student: StudentProfile = {
      sscGPA: Number(sscVal.toFixed(2)),
      hscGPA: Number(hscVal.toFixed(2)),
      group,
      passingYear: Number(passingYear) || 2024,
    };

    const evaluation = evaluateEligibilitySummary(student);
    setSummary(evaluation);
    setSubmitted(true);
    setIsEditingProfile(false);
  };

  const resetAll = () => {
    setSscGPA('');
    setHscGPA('');
    setGroup('Science');
    setPassingYear(2024);
    setSummary(null);
    setSubmitted(false);
    setIsEditingProfile(false);
    setSearchQuery('');
    setActiveTab('all');
    setValidationError(null);
  };

  // Filtered department results
  const filteredResults = useMemo(() => {
    if (!summary) return [];

    return summary.results.filter((item: DepartmentEligibilityResult) => {
      // Tab filter
      if (activeTab === 'eligible' && !item.isEligible) return false;
      if (activeTab === 'ineligible' && item.isEligible) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchUni = item.department.university.toLowerCase().includes(query);
        const matchDept = item.department.department.toLowerCase().includes(query);
        const matchProg = item.department.program.toLowerCase().includes(query);
        if (!matchUni && !matchDept && !matchProg) return false;
      }

      return true;
    });
  }, [summary, activeTab, searchQuery]);

  return (
    <main className="min-h-screen bg-[#FFFDFB] relative overflow-hidden">
      {/* ── AMBIENT GRADIENT MESH BACKGROUND ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-orange-200/35 via-orange-100/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 max-w-5xl">
        {!submitted || isEditingProfile ? (
          <>
            {/* ── PAGE HEADER ── */}
            <div className="text-center max-w-2xl mx-auto mb-10">
              {submitted && (
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5500] hover:text-[#E64D00] mb-4 transition cursor-pointer px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Results</span>
                </button>
              )}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>OFFICIAL 2026 ELIGIBILITY QUALIFIER</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {submitted ? 'Edit Academic Profile' : 'University Eligibility'}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5500] via-[#FF6A1A] to-[#E64D00]">
                  Checker
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
                Enter your SSC and HSC credentials to instantly evaluate your eligibility across public, engineering, and medical admission units.
              </p>
            </div>

            {/* ── INPUT FORM CARD ── */}
            <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-orange-500/5 space-y-8">
              {validationError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* SSC GPA Input */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#FF5500]" />
                      <span>SSC GPA (0.00 – 5.00)</span>
                    </span>
                    <span className="text-xs text-[#FF5500]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.01"
                      value={sscGPA}
                      onChange={(e) => setSscGPA(e.target.value ? parseFloat(e.target.value) : '')}
                      placeholder="e.g. 5.00"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 font-semibold text-sm focus:outline-none focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/10 transition shadow-2xs"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">Secondary School Certificate result</p>
                </div>

                {/* HSC GPA Input */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#FF5500]" />
                      <span>HSC GPA (0.00 – 5.00)</span>
                    </span>
                    <span className="text-xs text-[#FF5500]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.01"
                      value={hscGPA}
                      onChange={(e) => setHscGPA(e.target.value ? parseFloat(e.target.value) : '')}
                      placeholder="e.g. 5.00"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 font-semibold text-sm focus:outline-none focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/10 transition shadow-2xs"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">Higher Secondary Certificate result</p>
                </div>

                {/* Academic Group Selection */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#FF5500]" />
                      <span>HSC Academic Group</span>
                    </span>
                    <span className="text-xs text-[#FF5500]">*</span>
                  </label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value as AcademicGroup)}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 font-semibold text-sm focus:outline-none focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/10 transition shadow-2xs cursor-pointer"
                  >
                    <option value="Science">Science (বিজ্ঞান)</option>
                    <option value="Commerce">Commerce / Business Studies (ব্যবসায় শিক্ষা)</option>
                    <option value="Humanities">Humanities (মানবিক)</option>
                  </select>
                  <p className="text-[11px] text-slate-500">Discipline studied during HSC</p>
                </div>

                {/* Passing Year Selection */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#FF5500]" />
                      <span>HSC Passing Year</span>
                    </span>
                    <span className="text-xs text-[#FF5500]">*</span>
                  </label>
                  <select
                    value={passingYear}
                    onChange={(e) => setPassingYear(parseInt(e.target.value))}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 font-semibold text-sm focus:outline-none focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/10 transition shadow-2xs cursor-pointer"
                  >
                    <option value={2024}>2024 (1st Time Applicant)</option>
                    <option value={2023}>2023 (2nd Time Applicant)</option>
                    <option value={2022}>2022</option>
                  </select>
                  <p className="text-[11px] text-slate-500">Used to evaluate 2nd-time admission restrictions</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCheck}
                  className="flex-1 h-13 px-8 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#E64D00] hover:from-[#E64D00] hover:to-[#D44000] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{submitted ? 'Recalculate Eligibility' : 'Check Eligibility Summary'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {submitted && (
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="h-13 px-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* ========================================================================= */
          /* SUMMARY DASHBOARD VIEW                                                    */
          /* ========================================================================= */
          summary && (
            <div className="space-y-8">
              {/* Back / Reset Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={resetAll}
                  className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Start New Check</span>
                </button>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center gap-2 text-xs font-bold text-[#FF5500] hover:text-[#E64D00] transition px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 shadow-2xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile Marks</span>
                </button>
              </div>

              {/* 1. Student Academic Profile Card */}
              <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-orange-500/5 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 text-[#FF5500] flex items-center justify-center font-bold text-xl shadow-2xs">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-extrabold text-slate-900">Student Academic Profile</h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                          VERIFIED
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Verified Credentials Summary for HSC Batch {summary.profile.passingYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-50 text-slate-700 text-xs font-bold rounded-full border border-slate-200">
                      Group: {summary.profile.group}
                    </span>
                    <span className="px-3 py-1 bg-slate-50 text-slate-700 text-xs font-bold rounded-full border border-slate-200">
                      Year: {summary.profile.passingYear} {summary.profile.passingYear === 2024 ? '(1st Time)' : '(2nd Time)'}
                    </span>
                  </div>
                </div>

                {/* Score Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">SSC GPA</span>
                    <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">
                      {summary.profile.sscGPA.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">Scale: 5.00</span>
                  </div>
                  <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">HSC GPA</span>
                    <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">
                      {summary.profile.hscGPA.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">Scale: 5.00</span>
                  </div>
                  <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200/80">
                    <span className="text-xs font-mono font-bold text-[#FF5500] uppercase tracking-wider block">Combined GPA</span>
                    <span className="text-2xl font-extrabold text-[#FF5500] mt-0.5 block">
                      {(summary.profile.sscGPA + summary.profile.hscGPA).toFixed(2)}
                    </span>
                    <span className="text-[11px] text-[#FF5500]/70 block font-mono">Max: 10.00</span>
                  </div>
                  <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">Average GPA</span>
                    <span className="text-2xl font-extrabold text-slate-800 mt-0.5 block">
                      {((summary.profile.sscGPA + summary.profile.hscGPA) / 2).toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">Max: 5.00</span>
                  </div>
                </div>
              </div>

              {/* 2. Interactive Tab Bar & Search Filter */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  {/* Tabs */}
                  <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        activeTab === 'all'
                          ? 'bg-[#FF5500] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>All Programs</span>
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {summary.totalEvaluated}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('eligible')}
                      className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        activeTab === 'eligible'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>Eligible</span>
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${activeTab === 'eligible' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                        {summary.eligibleCount}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('ineligible')}
                      className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        activeTab === 'ineligible'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>Ineligible</span>
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${activeTab === 'ineligible' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'}`}>
                        {summary.ineligibleCount}
                      </span>
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-xs">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search university or program..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/10 transition shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Program Cards List */}
              {filteredResults.length > 0 ? (
                <div className="space-y-4">
                  {filteredResults.map((result: DepartmentEligibilityResult, idx: number) => {
                    const dept = result.department;
                    const isEligible = result.isEligible;
                    const isPending = result.isPending;

                    return (
                      <AnimatedCard
                        key={dept.id}
                        delay={idx * 0.05}
                        className={`rounded-3xl p-6 transition-all border-2 bg-white ${
                          isEligible
                            ? isPending
                              ? 'border-amber-200 shadow-sm hover:border-amber-400'
                              : 'border-emerald-200 shadow-sm hover:border-emerald-400 hover:shadow-md'
                            : 'border-slate-200 shadow-2xs hover:border-slate-300 opacity-90'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                          <div className="flex-1 space-y-3">
                            {/* Card Header & Badges */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-3">
                                {isEligible ? (
                                  isPending ? (
                                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                                      <AlertTriangle className="w-5 h-5" />
                                    </div>
                                  ) : (
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                                      <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                  )
                                ) : (
                                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                                    <XCircle className="w-5 h-5" />
                                  </div>
                                )}
                                <div>
                                  <h3 className="text-lg font-extrabold text-slate-900">
                                    {dept.university} — {dept.program}
                                  </h3>
                                  <p className="text-xs text-slate-500 font-medium">{dept.department}</p>
                                </div>
                              </div>

                              {/* Status Badge */}
                              <div>
                                {isEligible ? (
                                  isPending ? (
                                    <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-bold border border-amber-200 flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3" />
                                      <span>Verification Pending</span>
                                    </span>
                                  ) : (
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full font-bold border border-emerald-200 flex items-center gap-1">
                                      <Check className="w-3 h-3" />
                                      <span>Eligible to Apply</span>
                                    </span>
                                  )
                                ) : (
                                  <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs rounded-full font-bold border border-rose-200 flex items-center gap-1">
                                    <XCircle className="w-3 h-3" />
                                    <span>Criteria Not Met</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Informational Metadata Bar */}
                            <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-1 font-medium">
                              <span className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                <strong>{dept.seats}</strong> Seats
                              </span>
                              <span className="flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                                <strong>{dept.admissionFee} TK</strong> Fee
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                Deadline: <strong>{dept.applicationDeadline}</strong>
                              </span>
                            </div>

                            {/* Requirements Breakdown: Satisfied Criteria */}
                            {result.satisfiedRequirements.length > 0 && (
                              <div className="space-y-1.5 pt-2">
                                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono block">
                                  Satisfied Criteria:
                                </span>
                                <ul className="space-y-1">
                                  {result.satisfiedRequirements.map((req: string, i: number) => (
                                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                      <span>{req}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Requirements Breakdown: Unsatisfied Criteria */}
                            {result.unsatisfiedRequirements.length > 0 && (
                              <div className="space-y-1.5 pt-2">
                                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider font-mono block">
                                  Missing Requirements:
                                </span>
                                <ul className="space-y-1">
                                  {result.unsatisfiedRequirements.map((reason: string, i: number) => (
                                    <li key={i} className="text-xs text-rose-600 flex items-start gap-1.5">
                                      <XCircle className="w-3.5 h-3.5 text-rose-600 mt-0.5 flex-shrink-0" />
                                      <span>{reason}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Unverified Prerequisites / Disclaimers */}
                            {result.unverifiedRequirements.length > 0 && (
                              <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1 mt-2">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                                  <Info className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Pending Verification Notes:</span>
                                </div>
                                <ul className="space-y-1 pl-4 list-disc text-xs text-amber-700">
                                  {result.unverifiedRequirements.map((note: string, i: number) => (
                                    <li key={i}>{note}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Action Links */}
                          <div className="flex flex-row md:flex-col gap-2 pt-2 md:pt-0 shrink-0">
                            {isEligible && (
                              <Link href="/prepare">
                                <button className="w-full px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#FF5500] text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs">
                                  <span>Start Prep</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </Link>
                            )}
                            <Link href="/universities">
                              <button className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer">
                                <span>Uni Details</span>
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                              </button>
                            </Link>
                            <Link href="/chat">
                              <button className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer">
                                <span>Ask AI</span>
                                <MessageSquare className="w-3 h-3 text-slate-400" />
                              </button>
                            </Link>
                          </div>
                        </div>
                      </AnimatedCard>
                    );
                  })}
                </div>
              ) : (
                /* Empty state when filters return 0 results */
                <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4 shadow-sm">
                  <AlertTriangle className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900">No Programs Match Your Filter</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                    {searchQuery
                      ? `No programs found matching "${searchQuery}". Try clearing the search query.`
                      : `No programs currently classified under the "${activeTab}" category.`}
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition"
                      >
                        Clear Search
                      </button>
                    )}
                    <button
                      onClick={() => setActiveTab('all')}
                      className="px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#FF5500] hover:bg-orange-100 cursor-pointer transition"
                    >
                      View All Programs
                    </button>
                  </div>
                </div>
              )}

              {/* Advisory Footer */}
              <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 text-xs text-slate-600 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#FF5500] mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">
                  <strong>Official Circular Standard:</strong> Eligibility summaries are deterministically computed based on official university admission circular parameters. Specific subject grade cutoffs, seat allocations, and dates are subject to periodic circular revisions by individual university authorities.
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}
