'use client';

import React from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  Calendar,
  BookOpen,
  ExternalLink,
  Users,
  Sparkles,
  Clock,
  AlertTriangle,
  GraduationCap,
  HelpCircle,
} from 'lucide-react';

interface ResultItem {
  id: string;
  university?: string;
  department?: any;
  program?: string;
  status: string;
  isEligible?: boolean;
  isPending?: boolean;
  deadline?: string;
  testDate?: string;
  minGpa?: string;
  gpaMargin?: number;
  allowSecondTime?: boolean;
  satisfiedRequirements?: any[];
  unsatisfiedRequirements?: any[];
}

interface EligibilityResultsDisplayProps {
  evaluationResult: {
    profile?: {
      sscGPA: number;
      hscGPA: number;
      group: string;
      passingYear: number;
    };
    totalEvaluated?: number;
    eligibleCount?: number;
    ineligibleCount?: number;
    results?: ResultItem[];
  } | null;
}

export function EligibilityResultsDisplay({
  evaluationResult,
}: EligibilityResultsDisplayProps) {
  if (!evaluationResult || !evaluationResult.results) {
    return null;
  }

  const { profile, totalEvaluated, eligibleCount = 0, results = [] } = evaluationResult;

  // Helper to parse deadline and check expiration
  const checkDeadlineStatus = (dateStr?: string | null) => {
    if (!dateStr || dateStr === 'TBA') {
      return { isExpired: false, daysRemaining: null, formattedDate: 'Deadline TBA' };
    }

    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) {
      return { isExpired: false, daysRemaining: null, formattedDate: dateStr };
    }

    const now = new Date();
    const diffDays = Math.ceil((parsed.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const formattedDate = parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return {
      isExpired: diffDays < 0,
      daysRemaining: diffDays,
      formattedDate,
    };
  };

  // Compute breakdown of open vs expired among eligible
  const eligibleItems = results.filter((r) => r.isEligible || r.status === 'eligible' || r.status === 'eligible_pending');
  const closedEligibleCount = eligibleItems.filter((r) => {
    const rawDate =
      r.testDate ||
      (typeof r.department === 'object' && r.department !== null ? r.department.applicationDeadline : undefined) ||
      r.deadline;
    return checkDeadlineStatus(rawDate).isExpired;
  }).length;
  const openEligibleCount = eligibleItems.length - closedEligibleCount;

  return (
    <div className="space-y-6 pt-4 animate-in fade-in-50 duration-300">
      {/* ── HEADER SUMMARY BAR ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#FF5500]" />
            <h3 className="font-bold text-base text-slate-900">
              Admission Qualification Results
            </h3>
          </div>
          {profile && (
            <p className="text-xs text-slate-600 mt-1">
              Evaluated for <span className="font-bold text-[#FF5500]">{profile.group}</span> • SSC:{' '}
              <span className="font-mono font-bold text-slate-900">
                {typeof profile.sscGPA === 'number' ? profile.sscGPA.toFixed(2) : profile.sscGPA}
              </span>{' '}
              • HSC:{' '}
              <span className="font-mono font-bold text-slate-900">
                {typeof profile.hscGPA === 'number' ? profile.hscGPA.toFixed(2) : profile.hscGPA}
              </span>{' '}
              • Batch: <span className="font-mono font-bold text-slate-900">{profile.passingYear}</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Total Qualified Badge */}
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{eligibleCount} Qualified Units</span>
          </div>

          {/* Deadline Closed Badge (if any) */}
          {closedEligibleCount > 0 && (
            <div className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-1 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{closedEligibleCount} Session Closed</span>
            </div>
          )}

          {/* Total Evaluated */}
          <div className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold font-mono">
            <span>{totalEvaluated || results.length} Evaluated</span>
          </div>
        </div>
      </div>

      {/* ── MATCHING UNITS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {results.map((res, idx) => {
          const isEligible = res.isEligible || res.status === 'eligible' || res.status === 'eligible_pending';

          // Safely extract University Name
          const universityName: string =
            typeof res.university === 'string'
              ? res.university
              : typeof res.department === 'object' && res.department !== null && typeof res.department.university === 'string'
              ? res.department.university
              : 'University Admission';

          // Safely extract Department / Program Name
          const departmentName: string =
            typeof res.department === 'string'
              ? res.department
              : typeof res.department === 'object' && res.department !== null
              ? res.department.department || res.department.program || 'Undergraduate Program'
              : typeof res.program === 'string'
              ? res.program
              : 'Undergraduate Admission';

          // Safely extract Seats and Deadlines
          const seats =
            typeof res.department === 'object' && res.department !== null && res.department.seats
              ? res.department.seats
              : undefined;

          const rawDateStr =
            res.testDate ||
            (typeof res.department === 'object' && res.department !== null ? res.department.applicationDeadline : undefined) ||
            res.deadline ||
            'TBA';

          // Calculate deadline status
          const { isExpired, daysRemaining, formattedDate } = checkDeadlineStatus(rawDateStr);

          // Check second-time eligibility policy
          const allowSecondTime: boolean =
            typeof res.department === 'object' && res.department !== null && typeof res.department.allowSecondTime === 'boolean'
              ? res.department.allowSecondTime
              : Boolean(res.allowSecondTime);

          // Safely extract requirements messages
          const satisfiedNote =
            res.satisfiedRequirements && res.satisfiedRequirements.length > 0
              ? typeof res.satisfiedRequirements[0] === 'string'
                ? res.satisfiedRequirements[0]
                : typeof res.satisfiedRequirements[0]?.message === 'string'
                ? res.satisfiedRequirements[0].message
                : null
              : null;

          const unsatisfiedNote =
            res.unsatisfiedRequirements && res.unsatisfiedRequirements.length > 0
              ? typeof res.unsatisfiedRequirements[0] === 'string'
                ? res.unsatisfiedRequirements[0]
                : typeof res.unsatisfiedRequirements[0]?.message === 'string'
                ? res.unsatisfiedRequirements[0].message
                : null
              : null;

          return (
            <div
              key={res.id || idx}
              className={`p-5 rounded-3xl border transition-all ${
                !isEligible
                  ? 'bg-slate-50/80 border-slate-200 opacity-85'
                  : isExpired
                  ? 'bg-white border-amber-200/90 shadow-2xs hover:border-amber-300'
                  : 'bg-white border-emerald-200/90 shadow-2xs hover:border-emerald-300'
              } flex flex-col justify-between space-y-3.5`}
            >
              {/* Card Header: University + Status Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {universityName}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {departmentName}
                  </p>
                </div>

                {/* Status Badge */}
                {!isEligible ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                    Ineligible
                  </span>
                ) : isExpired ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 shadow-2xs">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>Qualified • Closed</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Eligible</span>
                  </span>
                )}
              </div>

              {/* Requirement Notes & Context */}
              <div className="space-y-1.5 text-xs">
                {isEligible && isExpired && (
                  <div className="flex items-start gap-2 text-amber-800 bg-amber-50/80 p-2.5 rounded-2xl border border-amber-200/70 leading-relaxed text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span>
                        You meet all academic GPA and group requirements for this unit, but the application submission window closed on{' '}
                        <strong className="font-semibold text-slate-900">{formattedDate}</strong>.
                      </span>
                      {allowSecondTime && (
                        <p className="mt-1 font-semibold text-emerald-700">
                          ✓ This unit allows 2nd-time candidates, so you can apply in the upcoming session!
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {satisfiedNote && (
                  <div className="flex items-start gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{satisfiedNote}</span>
                  </div>
                )}

                {unsatisfiedNote && (
                  <div className="flex items-start gap-1.5 text-rose-600">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{unsatisfiedNote}</span>
                  </div>
                )}
              </div>

              {/* Seats, Deadlines & Actions */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>
                    Deadline:{' '}
                    {isExpired ? (
                      <strong className="text-rose-600 font-mono font-semibold">
                        Closed ({formattedDate})
                      </strong>
                    ) : (
                      <strong className="text-[#FF5500] font-mono">
                        {formattedDate}
                        {daysRemaining !== null && daysRemaining <= 7 && (
                          <span className="text-rose-600 font-bold text-[10px] ml-1 animate-pulse">
                            ({daysRemaining}d left!)
                          </span>
                        )}
                      </strong>
                    )}
                  </span>
                  {seats && (
                    <span className="hidden sm:inline-block text-slate-400">
                      • {seats.toLocaleString()} Seats
                    </span>
                  )}
                </div>

                {/* Contextual Action Button */}
                {!isEligible ? (
                  <Link href="/eligibility">
                    <button className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-full shadow-2xs transition flex items-center gap-1 cursor-pointer">
                      <span>Explore</span>
                    </button>
                  </Link>
                ) : isExpired ? (
                  allowSecondTime ? (
                    <Link href="/prepare">
                      <button className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full shadow-2xs transition flex items-center gap-1 cursor-pointer">
                        <GraduationCap className="w-3.5 h-3.5 text-[#FF5500]" />
                        <span>Next Session (2nd Time)</span>
                      </button>
                    </Link>
                  ) : (
                    <Link href="/guides">
                      <button className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-full shadow-2xs transition flex items-center gap-1 cursor-pointer">
                        <span>Circular Details</span>
                      </button>
                    </Link>
                  )
                ) : (
                  <Link href="/prepare">
                    <button className="px-3.5 py-1.5 bg-gradient-to-r from-[#FF5500] to-[#FF6B00] hover:from-[#E64D00] hover:to-[#FF5500] text-white text-xs font-bold rounded-full shadow-2xs hover:shadow transition flex items-center gap-1 cursor-pointer">
                      <BookOpen className="w-3 h-3" />
                      <span>Prepare Now</span>
                    </button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
