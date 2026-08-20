import React from 'react';
import Link from 'next/link';
import { Target, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface GoalCardProps {
  university: string;
  program: string;
  daysRemaining: number;
  eligibilityStatus?: 'Eligible' | 'Conditional' | 'Pending';
}

export function GoalCard({
  university = 'BUET',
  program = 'Computer Science & Engineering',
  daysRemaining = 61,
  eligibilityStatus = 'Eligible',
}: GoalCardProps) {
  return (
    <div className="eg-card flex flex-col justify-between space-y-4 bg-gradient-to-br from-[var(--eg-surface)] to-[var(--eg-primary-soft)]/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-overline text-[var(--eg-text-muted)]">
          <Target className="w-4 h-4 text-[var(--eg-primary)]" />
          <span>YOUR TARGET GOAL</span>
        </div>
        <Badge variant="success" size="sm">{eligibilityStatus}</Badge>
      </div>

      <div className="space-y-1">
        <div className="text-xl font-bold text-[var(--eg-text-primary)]">{university}</div>
        <div className="text-body font-medium text-[var(--eg-text-secondary)]">{program}</div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--eg-border)] text-caption">
        <div className="flex items-center gap-1.5 font-semibold text-[var(--eg-text-primary)]">
          <Calendar className="w-4 h-4 text-[var(--eg-primary)]" />
          <span>Exam in {daysRemaining} days</span>
        </div>
        <div className="flex gap-2">
          <Link
            href="/universities/buet"
            className="text-xs font-semibold text-[var(--eg-primary)] hover:underline flex items-center gap-1"
          >
            View Circular <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
