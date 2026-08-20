import React from 'react';
import Link from 'next/link';
import { Play, Sparkles, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface StudyRecommendationProps {
  subject: string;
  chapter: string;
  topic: string;
  accuracy: number;
  reason: string;
  recommendedMinutes: number;
  lessonHref: string;
}

export function StudyRecommendation({
  subject = 'Chemistry',
  chapter = 'Organic Chemistry',
  topic = 'Electrophilic Aromatic Substitution & Reagents',
  accuracy = 43,
  reason = 'Weak topic detected from recent practice tests (accuracy below 50%).',
  recommendedMinutes = 35,
  lessonHref = '/prepare/lessons/newtons-second-law-buet-guide',
}: StudyRecommendationProps) {
  return (
    <div className="eg-card bg-gradient-to-br from-[var(--eg-surface)] via-[var(--eg-surface)] to-[var(--eg-accent-soft)]/40 border-[var(--eg-accent)]/30 space-y-4 shadow-elevated relative overflow-hidden">
      {/* Accent Header Ribbon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--eg-accent)] text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-overline text-[var(--eg-accent)] font-bold">
            WHAT SHOULD YOU STUDY NOW?
          </span>
        </div>
        <Badge variant="warning" size="sm">High Priority</Badge>
      </div>

      {/* Main Focus Topic */}
      <div className="space-y-1">
        <div className="text-caption font-semibold text-[var(--eg-text-muted)] uppercase tracking-wider">
          {subject} • {chapter}
        </div>
        <div className="text-xl font-bold text-[var(--eg-text-primary)]">
          {topic}
        </div>
      </div>

      {/* Accuracy & Reason Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[var(--eg-surface)] rounded-lg border border-[var(--eg-border)] text-caption">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[var(--eg-warning)] shrink-0" />
          <div>
            <span className="text-[var(--eg-text-muted)]">Current Accuracy: </span>
            <span className="font-bold text-[var(--eg-error)]">{accuracy}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--eg-primary)] shrink-0" />
          <div>
            <span className="text-[var(--eg-text-muted)]">Allocated Time: </span>
            <span className="font-semibold text-[var(--eg-text-primary)]">{recommendedMinutes} mins</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-[var(--eg-text-secondary)] leading-relaxed">
        {reason}
      </p>

      {/* Action CTA */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Link href={lessonHref} className="flex-1 sm:flex-initial">
          <button className="btn btn-primary btn-lg w-full sm:w-auto font-bold shadow-sm">
            <Play className="w-4 h-4 fill-white" />
            <span>Start Learning This Topic</span>
          </button>
        </Link>
        <Link
          href="/practice"
          className="text-xs font-semibold text-[var(--eg-primary)] hover:underline flex items-center justify-center gap-1"
        >
          Practice 15 MCQs Instead <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
