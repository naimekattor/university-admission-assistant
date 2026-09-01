import React from 'react';
import { Award, BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export interface SubjectStat {
  subject: string;
  percentage: number;
  completedChapters: number;
  totalChapters: number;
  color?: string;
}

export interface SubjectProgressProps {
  overallPercentage?: number;
  subjects?: SubjectStat[];
}

export function SubjectProgress({
  overallPercentage = 68,
  subjects = [
    { subject: 'Physics', percentage: 72, completedChapters: 12, totalChapters: 16 },
    { subject: 'Chemistry', percentage: 51, completedChapters: 8, totalChapters: 16 },
    { subject: 'Higher Mathematics', percentage: 81, completedChapters: 13, totalChapters: 16 },
  ],
}: SubjectProgressProps) {
  return (
    <div className="eg-card space-y-5">
      {/* Overall Prep Header */}
      <div className="flex items-center justify-between border-b border-[var(--eg-border)] pb-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[var(--eg-primary)]" />
          <h3 className="text-body-lg font-bold text-[var(--eg-text-primary)]">Curriculum Mastery</h3>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-[var(--eg-primary)]">{overallPercentage}%</span>
          <span className="text-caption text-[var(--eg-text-muted)] block">Overall Prepared</span>
        </div>
      </div>

      <div className="space-y-4">
        {subjects.map((sub) => (
          <div key={sub.subject} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--eg-text-primary)]">{sub.subject}</span>
              <span className="font-bold text-[var(--eg-text-secondary)]">
                {sub.completedChapters}/{sub.totalChapters} Ch ({sub.percentage}%)
              </span>
            </div>
            <Progress
              value={sub.percentage}
              indicatorColor={
                sub.percentage >= 75
                  ? 'bg-[var(--eg-success)]'
                  : sub.percentage >= 55
                  ? 'bg-[var(--eg-primary)]'
                  : 'bg-[var(--eg-warning)]'
              }
            />
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-[var(--eg-border)]">
        <Link
          href="/prepare"
          className="text-xs font-semibold text-[var(--eg-primary)] hover:underline flex items-center justify-between"
        >
          <span>Explore All 48 HSC Chapters</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
