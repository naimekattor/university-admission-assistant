'use client';

import React from 'react';
import { CheckCircle2, GraduationCap, Award, Sparkles } from 'lucide-react';
import { CommunityRole } from '@/lib/community-types';

interface ContributorBadgeProps {
  role?: CommunityRole;
  isVerified?: boolean;
  customBadge?: string | null;
  className?: string;
}

export function ContributorBadge({
  role = 'student',
  isVerified = false,
  customBadge,
  className = '',
}: ContributorBadgeProps) {
  if (role === 'teacher' || isVerified) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs ${className}`}
      >
        <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100" />
        <span>{customBadge || 'Verified Teacher'}</span>
      </span>
    );
  }

  if (role === 'senior') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-[#FF5500] border border-orange-200/80 shadow-2xs ${className}`}
      >
        <Award className="w-3 h-3 text-[#FF5500]" />
        <span>{customBadge || 'Senior Mentor'}</span>
      </span>
    );
  }

  if (role === 'admin') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-900 text-white border border-slate-700 shadow-2xs ${className}`}
      >
        <Sparkles className="w-3 h-3 text-amber-400" />
        <span>EduGuide Team</span>
      </span>
    );
  }

  // Student default
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/80 ${className}`}
    >
      <GraduationCap className="w-3 h-3 text-slate-400" />
      <span>{customBadge || 'Student'}</span>
    </span>
  );
}
