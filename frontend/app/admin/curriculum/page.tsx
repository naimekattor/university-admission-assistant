'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { Layers, PlusCircle, ChevronRight, BookOpen, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminCurriculumPage() {
  const [activeSubject, setActiveSubject] = useState('Physics');

  const curriculum = {
    Physics: [
      {
        chapter: "Newton's Mechanics (Paper 1, Chapter 4)",
        topics: [
          { name: "Newton's First & Second Laws", lessonsCount: 3, status: 'Published' },
          { name: 'Linear Impulse & Momentum Integration', lessonsCount: 2, status: 'Published' },
          { name: 'Centripetal Force & Banking of Road', lessonsCount: 3, status: 'Published' },
          { name: 'Moment of Inertia & Angular Momentum', lessonsCount: 4, status: 'Published' },
        ],
      },
      {
        chapter: 'Work, Energy & Power (Paper 1, Chapter 5)',
        topics: [
          { name: 'Work-Energy Theorem', lessonsCount: 2, status: 'Published' },
          { name: 'Conservative Forces & Spring Potential', lessonsCount: 3, status: 'Published' },
        ],
      },
    ],
    Chemistry: [
      {
        chapter: 'Organic Chemistry (Paper 2, Chapter 2)',
        topics: [
          { name: 'IUPAC Nomenclature & Isomerism', lessonsCount: 4, status: 'Published' },
          { name: 'Electrophilic Aromatic Substitution', lessonsCount: 3, status: 'Published' },
        ],
      },
    ],
    'Higher Mathematics': [
      {
        chapter: 'Differential Calculus (Paper 1, Chapter 9)',
        topics: [
          { name: 'Limits & L\'Hopital Rule', lessonsCount: 3, status: 'Published' },
          { name: 'First Principle Differentiation', lessonsCount: 4, status: 'Published' },
        ],
      },
    ],
  };

  return (
    <AdminShell
      pageTitle="Curriculum Hierarchy (Subject → Chapter → Topic Tree)"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Curriculum' }]}
      actions={
        <button className="btn btn-primary btn-sm font-semibold shadow-sm">
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Topic Node</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Subject Tabs */}
        <div className="flex gap-2 border-b border-[var(--eg-border)] pb-2">
          {['Physics', 'Chemistry', 'Higher Mathematics'].map((s) => (
            <button
              key={s}
              onClick={() => setActiveSubject(s)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeSubject === s
                  ? 'bg-[var(--eg-primary)] text-white shadow-sm'
                  : 'text-[var(--eg-text-secondary)] hover:bg-[var(--eg-surface-subtle)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Tree Container */}
        <div className="space-y-4">
          {(curriculum as any)[activeSubject]?.map((ch: any, idx: number) => (
            <div key={idx} className="eg-card space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--eg-border)] pb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[var(--eg-primary)]" />
                  <span className="font-bold text-sm text-[var(--eg-text-primary)]">{ch.chapter}</span>
                </div>
                <Badge variant="secondary" size="sm">{ch.topics.length} Topics</Badge>
              </div>

              <div className="divide-y divide-[var(--eg-border)] pl-4">
                {ch.topics.map((t: any, i: number) => (
                  <div key={i} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[var(--eg-text-muted)] font-mono">{i + 1}.</span>
                      <span className="font-semibold text-[var(--eg-text-primary)]">{t.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-caption text-[var(--eg-text-muted)]">{t.lessonsCount} Lessons</span>
                      <Badge variant="success" size="sm">{t.status}</Badge>
                      <button className="p-1 rounded hover:bg-[var(--eg-surface-subtle)] text-[var(--eg-text-muted)]">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
