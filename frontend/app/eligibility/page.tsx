'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BorderBeamButton } from '@/components/ui/border-beam-button';
import { AnimatedCard } from '@/components/ui/animated-card';
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  SlidersHorizontal,
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

      // Keyword search filter
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
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {!submitted || isEditingProfile ? (
          <>
            {/* Page Header */}
            <div className="mb-8">
              {submitted && (
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Summary Results
                </button>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {submitted ? 'Edit Academic Profile' : 'University Eligibility Checker'}
              </h1>
              <p className="text-muted-foreground">
                Enter your SSC and HSC credentials to instantly evaluate your eligibility across public and engineering university programs.
              </p>
            </div>

            {/* Input Form Card */}
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
              {validationError && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* SSC GPA Input */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    SSC GPA (0.00 - 5.00) <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    step="0.01"
                    value={sscGPA}
                    onChange={(e) => setSscGPA(e.target.value ? parseFloat(e.target.value) : '')}
                    placeholder="e.g. 5.00"
                    className="bg-background border-border text-base"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Secondary School Certificate result</p>
                </div>

                {/* HSC GPA Input */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    HSC GPA (0.00 - 5.00) <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    step="0.01"
                    value={hscGPA}
                    onChange={(e) => setHscGPA(e.target.value ? parseFloat(e.target.value) : '')}
                    placeholder="e.g. 5.00"
                    className="bg-background border-border text-base"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Higher Secondary Certificate result</p>
                </div>

                {/* Academic Group Selection */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    HSC Academic Group <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value as AcademicGroup)}
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Science">Science (বিজ্ঞান)</option>
                    <option value="Commerce">Commerce / Business Studies (ব্যবসায় শিক্ষা)</option>
                    <option value="Humanities">Humanities (মানবিক)</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">Discipline studied during HSC</p>
                </div>

                {/* Passing Year Selection */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    HSC Passing Year <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={passingYear}
                    onChange={(e) => setPassingYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={2024}>2024 (1st Time Applicant)</option>
                    <option value={2023}>2023 (2nd Time Applicant)</option>
                    <option value={2022}>2022</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">Used to evaluate 2nd-time admission restrictions</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <BorderBeamButton
                  onClick={handleCheck}
                  variant="primary"
                  className="flex-1"
                  size="lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {submitted ? 'Recalculate Eligibility Summary' : 'Check Eligibility Summary'}
                </BorderBeamButton>
                {submitted && (
                  <Button
                    onClick={() => setIsEditingProfile(false)}
                    variant="outline"
                    size="lg"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* ========================================================================= */
          /* SUMMARY DASHBOARD VIEW                                                    */
          /* ========================================================================= */
          summary && (
            <div className="space-y-6">
              {/* Back / Reset Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={resetAll}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  Start New Check
                </button>
                <Button
                  onClick={() => setIsEditingProfile(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile Marks
                </Button>
              </div>

              {/* 1. Student Academic Profile Card */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Student Academic Profile</h2>
                      <p className="text-xs text-muted-foreground">
                        Verified Credentials Summary for HSC Batch {summary.profile.passingYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-secondary text-foreground text-xs font-semibold rounded-full border border-border">
                      Group: {summary.profile.group}
                    </span>
                    <span className="px-3 py-1 bg-secondary text-foreground text-xs font-semibold rounded-full border border-border">
                      Year: {summary.profile.passingYear} {summary.profile.passingYear === 2024 ? '(1st Time)' : '(2nd Time)'}
                    </span>
                  </div>
                </div>

                {/* Score Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-secondary/50 rounded-lg border border-border/60">
                    <span className="text-xs text-muted-foreground block">SSC GPA</span>
                    <span className="text-xl font-bold text-foreground">
                      {summary.profile.sscGPA.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">Scale: 5.00</span>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-lg border border-border/60">
                    <span className="text-xs text-muted-foreground block">HSC GPA</span>
                    <span className="text-xl font-bold text-foreground">
                      {summary.profile.hscGPA.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">Scale: 5.00</span>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-lg border border-border/60">
                    <span className="text-xs text-muted-foreground block">Combined GPA (SSC+HSC)</span>
                    <span className="text-xl font-bold text-primary">
                      {(summary.profile.sscGPA + summary.profile.hscGPA).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">Max: 10.00</span>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-lg border border-border/60">
                    <span className="text-xs text-muted-foreground block">Average GPA</span>
                    <span className="text-xl font-bold text-primary">
                      {((summary.profile.sscGPA + summary.profile.hscGPA) / 2).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">Max: 5.00</span>
                  </div>
                </div>
              </div>

              {/* 2. Interactive Tab Bar & Search Filter */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  {/* Tabs */}
                  <div className="flex p-1 bg-secondary rounded-lg border border-border">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 ${
                        activeTab === 'all'
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      All Programs
                      <span className="px-1.5 py-0.2 bg-muted text-[11px] rounded-full">
                        {summary.totalEvaluated}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('eligible')}
                      className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 ${
                        activeTab === 'eligible'
                          ? 'bg-card text-green-700 dark:text-green-400 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Eligible
                      <span className="px-1.5 py-0.2 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 text-[11px] rounded-full font-bold">
                        {summary.eligibleCount}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('ineligible')}
                      className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 ${
                        activeTab === 'ineligible'
                          ? 'bg-card text-rose-700 dark:text-rose-400 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Ineligible
                      <span className="px-1.5 py-0.2 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[11px] rounded-full font-bold">
                        {summary.ineligibleCount}
                      </span>
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-xs">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      type="text"
                      placeholder="Search university or program..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-card border-border text-sm h-9"
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
                        className={`bg-card rounded-xl p-5 md:p-6 transition border-2 ${
                          isEligible
                            ? isPending
                              ? 'border-amber-200 dark:border-amber-900/60 hover:border-amber-400'
                              : 'border-green-200 dark:border-green-900/60 hover:border-green-500'
                            : 'border-rose-200 dark:border-rose-900/60 hover:border-rose-400'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            {/* Card Header & Badges */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                {isEligible ? (
                                  isPending ? (
                                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                  ) : (
                                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                  )
                                ) : (
                                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                                )}
                                <div>
                                  <h3 className="text-lg font-bold text-foreground">
                                    {dept.university} — {dept.program}
                                  </h3>
                                  <p className="text-xs text-muted-foreground">{dept.department}</p>
                                </div>
                              </div>

                              {/* Status Badge */}
                              <div>
                                {isEligible ? (
                                  isPending ? (
                                    <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs rounded-full font-semibold border border-amber-300 dark:border-amber-800">
                                      Provisionally Eligible (Verification Pending)
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-1 bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 text-xs rounded-full font-semibold border border-green-300 dark:border-green-800">
                                      Eligible
                                    </span>
                                  )
                                ) : (
                                  <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs rounded-full font-semibold border border-rose-300 dark:border-rose-800">
                                    Not Eligible
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Informational Metadata Bar */}
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                <strong>{dept.seats}</strong> Seats
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3.5 h-3.5" />
                                <strong>{dept.admissionFee} TK</strong> Fee
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                Deadline: <strong>{dept.applicationDeadline}</strong>
                              </span>
                            </div>

                            {/* Requirements Breakdown: Satisfied Criteria */}
                            {result.satisfiedRequirements.length > 0 && (
                              <div className="space-y-1 pt-2">
                                <span className="text-xs font-semibold text-foreground block">
                                  Requirements Satisfied:
                                </span>
                                <ul className="space-y-1">
                                  {result.satisfiedRequirements.map((req: string, i: number) => (
                                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                      <span>{req}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Requirements Breakdown: Unsatisfied Criteria */}
                            {result.unsatisfiedRequirements.length > 0 && (
                              <div className="space-y-1 pt-2">
                                <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 block">
                                  Requirements Not Satisfied:
                                </span>
                                <ul className="space-y-1">
                                  {result.unsatisfiedRequirements.map((reason: string, i: number) => (
                                    <li key={i} className="text-xs text-rose-600 dark:text-rose-400 flex items-start gap-1.5">
                                      <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                                      <span>{reason}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Unverified Prerequisites / Disclaimers */}
                            {result.unverifiedRequirements.length > 0 && (
                              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg space-y-1 mt-2">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
                                  <Info className="w-3.5 h-3.5" />
                                  <span>Pending Verification Notes:</span>
                                </div>
                                <ul className="space-y-1 pl-4 list-disc text-xs text-amber-700 dark:text-amber-400">
                                  {result.unverifiedRequirements.map((note: string, i: number) => (
                                    <li key={i}>{note}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Action Links */}
                          <div className="flex flex-row md:flex-col gap-2 pt-2 md:pt-0">
                            <Link href={`/universities/${dept.university.toLowerCase()}`}>
                              <Button variant="outline" size="sm" className="w-full text-xs">
                                View Uni <ExternalLink className="w-3 h-3 ml-1" />
                              </Button>
                            </Link>
                            <Link href="/chat">
                              <Button variant="secondary" size="sm" className="w-full text-xs">
                                Ask AI <MessageSquare className="w-3 h-3 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </AnimatedCard>
                    );
                  })}
                </div>
              ) : (
                /* Empty state when filters return 0 results */
                <div className="bg-card border border-border rounded-xl p-8 text-center space-y-4">
                  <AlertTriangle className="w-10 h-10 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-bold text-foreground">No Programs Match Your Filter</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    {searchQuery
                      ? `No programs found matching "${searchQuery}". Try clearing the search query.`
                      : `No programs currently classified under the "${activeTab}" category.`}
                  </p>
                  <div className="flex justify-center gap-3">
                    {searchQuery && (
                      <Button onClick={() => setSearchQuery('')} variant="outline" size="sm">
                        Clear Search
                      </Button>
                    )}
                    <Button onClick={() => setActiveTab('all')} variant="secondary" size="sm">
                      View All Programs
                    </Button>
                  </div>
                </div>
              )}

              {/* Advisory Footer */}
              <div className="bg-secondary/40 border border-border/80 rounded-xl p-4 text-xs text-muted-foreground flex items-start gap-2.5">
                <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Truth-First Disclaimer:</strong> Eligibility summaries are deterministically computed based on official university admission circular parameters. Specific subject grade cutoffs, seat allocations, and dates are subject to periodic circular revisions by individual university authorities. Please verify final criteria on official university portals.
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}
