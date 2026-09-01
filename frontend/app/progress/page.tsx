'use client';

import React from 'react';
import { StudentShell } from '@/components/layout/student-shell';
import {
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function StudentProgressPage() {
  const subjects = [
    { subject: 'Physics', completedChapters: 12, totalChapters: 16, percentage: 72, questionsSolved: 480, accuracy: 82 },
    { subject: 'Chemistry', completedChapters: 8, totalChapters: 16, percentage: 51, questionsSolved: 320, accuracy: 68 },
    { subject: 'Higher Mathematics', completedChapters: 13, totalChapters: 16, percentage: 81, questionsSolved: 540, accuracy: 88 },
  ];

  const testHistory = [
    { id: 1, title: 'BUET Preliminary Model Test 01', score: 72, max: 100, date: 'Yesterday', trend: '+8%' },
    { id: 2, title: 'DU Ka Unit Standard Test', score: 66, max: 100, date: '3 days ago', trend: '+4%' },
    { id: 3, title: 'Physics Kinematics Chapter Test', score: 90, max: 100, date: '5 days ago', trend: '+12%' },
  ];

  return (
    <StudentShell
      pageTitle="Preparation Progress & Analytics"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Progress' }]}
    >
      <div className="space-y-6">
        
        {/* KPI Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="eg-card space-y-1">
            <div className="text-overline text-[var(--eg-text-muted)]">OVERALL PREPARED</div>
            <div className="text-3xl font-bold text-[var(--eg-primary)]">68%</div>
            <div className="text-caption text-[var(--eg-text-muted)]">33 of 48 Chapters Mastered</div>
          </div>

          <div className="eg-card space-y-1">
            <div className="text-overline text-[var(--eg-text-muted)]">QUESTIONS SOLVED</div>
            <div className="text-3xl font-bold text-[var(--eg-text-primary)]">1,340</div>
            <div className="text-caption text-[var(--eg-success)] font-semibold">79% Overall Accuracy</div>
          </div>

          <div className="eg-card space-y-1">
            <div className="text-overline text-[var(--eg-text-muted)]">STUDY STREAK</div>
            <div className="text-3xl font-bold text-[var(--eg-accent)] flex items-center gap-1.5">
              <Flame className="w-6 h-6 fill-[var(--eg-accent)]" />
              <span>7 Days</span>
            </div>
            <div className="text-caption text-[var(--eg-text-muted)]">Personal Best: 14 Days</div>
          </div>

          <div className="eg-card space-y-1">
            <div className="text-overline text-[var(--eg-text-muted)]">MOCK EXAMS TAKEN</div>
            <div className="text-3xl font-bold text-[var(--eg-text-primary)]">6</div>
            <div className="text-caption text-[var(--eg-text-muted)]">Average Score: 74/100</div>
          </div>
        </div>

        {/* Subject Breakdown Detail */}
        <div className="eg-card space-y-4">
          <h3 className="text-body-lg font-bold text-[var(--eg-text-primary)] border-b border-[var(--eg-border)] pb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--eg-primary)]" />
            <span>Subject-by-Subject Mastery Breakdown</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <div key={s.subject} className="p-4 rounded-xl border border-[var(--eg-border)] bg-[var(--eg-surface-subtle)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[var(--eg-text-primary)]">{s.subject}</span>
                  <span className="text-xs font-bold text-[var(--eg-primary)]">{s.percentage}%</span>
                </div>

                <Progress value={s.percentage} />

                <div className="text-caption text-[var(--eg-text-muted)] space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span>Chapters Completed:</span>
                    <span className="font-semibold text-[var(--eg-text-primary)]">{s.completedChapters} / {s.totalChapters}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions Solved:</span>
                    <span className="font-semibold text-[var(--eg-text-primary)]">{s.questionsSolved}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy Rate:</span>
                    <span className="font-semibold text-[var(--eg-success)]">{s.accuracy}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Mock Test History */}
        <div className="eg-card space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--eg-border)] pb-3">
            <h3 className="text-body-lg font-bold text-[var(--eg-text-primary)] flex items-center gap-2">
              <Award className="w-5 h-5 text-[var(--eg-primary)]" />
              <span>Recent Test History & Score Trends</span>
            </h3>
            <Link href="/mock-tests" className="text-xs font-semibold text-[var(--eg-primary)] hover:underline flex items-center gap-1">
              Take New Test <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-[var(--eg-border)]">
            {testHistory.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--eg-text-primary)]">{t.title}</div>
                  <div className="text-caption text-[var(--eg-text-muted)]">{t.date}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-bold text-[var(--eg-primary)]">{t.score} / {t.max}</div>
                    <span className="text-[11px] font-semibold text-[var(--eg-success)]">{t.trend}</span>
                  </div>
                  <Link href="/mock-tests/buet-prelim-01/result">
                    <button className="btn btn-secondary btn-sm text-xs">Analysis</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </StudentShell>
  );
}
