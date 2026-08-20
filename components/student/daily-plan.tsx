import React from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, Circle, Clock, ArrowRight, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface PlanItem {
  id: string;
  subject: string;
  topic: string;
  type: 'Lesson' | 'Practice' | 'Revision' | 'Mock Test';
  duration: string;
  completed: boolean;
  href: string;
}

export interface DailyPlanProps {
  items?: PlanItem[];
}

export function DailyPlan({
  items = [
    {
      id: 'p1',
      subject: 'Physics',
      topic: "Newton's Laws & Linear Momentum",
      type: 'Lesson',
      duration: '35 mins',
      completed: true,
      href: '/prepare/lessons/newtons-second-law-buet-guide',
    },
    {
      id: 'p2',
      subject: 'Chemistry',
      topic: 'Organic Reaction Mechanisms',
      type: 'Lesson',
      duration: '40 mins',
      completed: false,
      href: '/prepare',
    },
    {
      id: 'p3',
      subject: 'Higher Math',
      topic: 'Calculus Differentiation 20 MCQs',
      type: 'Practice',
      duration: '25 mins',
      completed: false,
      href: '/practice',
    },
    {
      id: 'p4',
      subject: 'All Subjects',
      topic: 'Review 5 Mistakes from Mistake Notebook',
      type: 'Revision',
      duration: '15 mins',
      completed: false,
      href: '/mistakes',
    },
  ],
}: DailyPlanProps) {
  const completedCount = items.filter((i) => i.completed).length;

  return (
    <div className="eg-card space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--eg-border)] pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[var(--eg-primary)]" />
          <h3 className="text-body-lg font-bold text-[var(--eg-text-primary)]">Today's Study Plan</h3>
        </div>
        <span className="text-xs font-semibold text-[var(--eg-text-muted)]">
          {completedCount} of {items.length} Completed
        </span>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-lg border transition flex items-center justify-between gap-3 ${
              item.completed
                ? 'bg-[var(--eg-surface-subtle)] border-[var(--eg-border)] opacity-75'
                : 'bg-[var(--eg-surface)] border-[var(--eg-border)] hover:border-[var(--eg-primary)]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-[var(--eg-success)] shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-[var(--eg-text-disabled)] shrink-0" />
              )}
              <div className="min-w-0">
                <div
                  className={`text-sm font-semibold truncate ${
                    item.completed ? 'line-through text-[var(--eg-text-muted)]' : 'text-[var(--eg-text-primary)]'
                  }`}
                >
                  {item.topic}
                </div>
                <div className="text-caption text-[var(--eg-text-muted)] flex items-center gap-2">
                  <span className="font-medium text-[var(--eg-text-secondary)]">{item.subject}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.duration}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge variant={item.type === 'Lesson' ? 'default' : item.type === 'Practice' ? 'accent' : 'secondary'} size="sm">
                {item.type}
              </Badge>
              {!item.completed && (
                <Link href={item.href}>
                  <button className="btn btn-primary btn-sm">
                    <Play className="w-3 h-3 fill-white" /> Start
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 flex justify-end">
        <Link
          href="/prepare/study-plan"
          className="text-xs font-semibold text-[var(--eg-primary)] hover:underline flex items-center gap-1"
        >
          View Full 30-Day Personalized Schedule <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
