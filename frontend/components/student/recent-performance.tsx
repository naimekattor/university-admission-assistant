import React from 'react';
import Link from 'next/link';
import { TrendingUp, Award, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface RecentPerformanceProps {
  testTitle?: string;
  score?: number;
  maxScore?: number;
  accuracy?: number;
  improvementPercentage?: number;
  weakestSubject?: string;
  strongestSubject?: string;
  resultHref?: string;
}

export function RecentPerformance({
  testTitle = 'BUET Preliminary Model Test 01',
  score = 72,
  maxScore = 100,
  accuracy = 86,
  improvementPercentage = 8,
  weakestSubject = 'Chemistry (58%)',
  strongestSubject = 'Physics (92%)',
  resultHref = '/mock-tests/buet-prelim-01/result',
}: RecentPerformanceProps) {
  return (
    <div className="eg-card space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--eg-border)] pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[var(--eg-success)]" />
          <h3 className="text-body-lg font-bold text-[var(--eg-text-primary)]">Recent Test Performance</h3>
        </div>
        <Badge variant="success" size="sm">
          +{improvementPercentage}% improvement
        </Badge>
      </div>

      <div className="space-y-1">
        <div className="text-sm font-semibold text-[var(--eg-text-primary)]">{testTitle}</div>
        <div className="text-2xl font-bold text-[var(--eg-primary)]">
          {score} <span className="text-sm font-normal text-[var(--eg-text-muted)]">/ {maxScore} Marks</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 bg-[var(--eg-surface-subtle)] rounded-lg text-caption border border-[var(--eg-border)]">
        <div>
          <span className="text-[var(--eg-text-muted)]">Strongest:</span>
          <div className="font-semibold text-[var(--eg-success)]">{strongestSubject}</div>
        </div>
        <div>
          <span className="text-[var(--eg-text-muted)]">Needs Work:</span>
          <div className="font-semibold text-[var(--eg-warning)]">{weakestSubject}</div>
        </div>
      </div>

      <div className="pt-1 flex justify-end">
        <Link
          href={resultHref}
          className="text-xs font-semibold text-[var(--eg-primary)] hover:underline flex items-center gap-1"
        >
          View Full Exam Analysis <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
