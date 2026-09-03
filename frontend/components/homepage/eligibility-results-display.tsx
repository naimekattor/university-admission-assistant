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
  satisfiedRequirements?: any[];
  unsatisfiedRequirements?: any[];
  unverifiedRequirements?: any[];
}

interface EligibilityResultsDisplayProps {
  evaluation: {
    profile?: {
      sscGPA: number;
      hscGPA: number;
      group: string;
      passingYear: number;
    };
    totalEvaluated?: number;
    eligibleCount?: number;
    ineligibleCount?: number;
    pendingCount?: number;
    results?: ResultItem[];
  };
}

export function EligibilityResultsDisplay({ evaluation }: EligibilityResultsDisplayProps) {
  const { profile, results = [], eligibleCount = 0, totalEvaluated = 0 } = evaluation;

  return (
    <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* ── SUMMARY STATS BAR ── */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
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
              </span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{eligibleCount} Eligible Units</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold font-mono">
            <span>{totalEvaluated || results.length} Evaluated</span>
          </div>
        </div>
      </div>

      {/* ── MATCHING UNITS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {results.map((res, idx) => {
          const isEligible = res.isEligible || res.status === 'eligible' || res.status === 'eligible_pending';

          // Safely extract University Name (handles both flat string and nested department object)
          const universityName: string =
            typeof res.university === 'string'
              ? res.university
              : typeof res.department === 'object' && res.department !== null && typeof res.department.university === 'string'
              ? res.department.university
              : 'University Admission';

          // Safely extract Department / Program Name (never renders object)
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

          const dateDisplay =
            res.testDate ||
            (typeof res.department === 'object' && res.department !== null ? res.department.applicationDeadline : undefined) ||
            res.deadline ||
            'TBA';

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
                isEligible
                  ? 'bg-white border-emerald-200/90 shadow-2xs hover:border-emerald-300'
                  : 'bg-slate-50/80 border-slate-200 opacity-80'
              } flex flex-col justify-between space-y-3.5`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {universityName}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {departmentName}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                    isEligible
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-2xs'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {isEligible ? 'Eligible' : 'Ineligible'}
                </span>
              </div>

              {/* Requirement Notes */}
              <div className="space-y-1 text-xs">
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

              {/* Seats, Exam date & Actions */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>
                    Deadline/Date: <strong className="text-[#FF5500] font-mono">{dateDisplay}</strong>
                  </span>
                  {seats && (
                    <span className="hidden sm:inline-block text-slate-400">
                      • {seats} Seats
                    </span>
                  )}
                </div>

                <Link href="/prepare">
                  <button className="px-3.5 py-1.5 bg-gradient-to-r from-[#FF5500] to-[#FF6B00] hover:from-[#E64D00] hover:to-[#FF5500] text-white text-xs font-bold rounded-full shadow-2xs hover:shadow transition flex items-center gap-1 cursor-pointer">
                    <BookOpen className="w-3 h-3" />
                    <span>Prepare</span>
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
