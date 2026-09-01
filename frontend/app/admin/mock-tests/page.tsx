'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/admin-shell';
import { Award, PlusCircle, Clock, Play, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminMockTestsPage() {
  const tests = [
    { id: 'buet-prelim-01', title: 'BUET Preliminary Model Test 01', university: 'BUET', unit: 'Ka Unit', duration: '15 mins', questionsCount: 10, totalAttempts: 420, avgScore: '74%', status: 'Active' },
    { id: 'du-ka-01', title: 'DU Ka Unit Full Standard Model Test', university: 'DU', unit: 'Ka Unit', duration: '30 mins', questionsCount: 20, totalAttempts: 680, avgScore: '68%', status: 'Active' },
    { id: 'kuet-prelim-01', title: 'Engineering Cluster Mock Test 01', university: 'CKRUET', unit: 'All Units', duration: '45 mins', questionsCount: 30, totalAttempts: 290, avgScore: '62%', status: 'Active' },
  ];

  return (
    <AdminShell
      pageTitle="Admission Mock Test Series Management"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Mock Tests' }]}
      actions={
        <button className="btn btn-primary btn-sm font-semibold shadow-sm">
          <PlusCircle className="w-4 h-4" />
          <span>+ Create Mock Test</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="eg-card p-0 overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left admin-table">
              <thead>
                <tr>
                  <th>Test Title</th>
                  <th>Target University</th>
                  <th>Duration • MCQs</th>
                  <th>Total Student Attempts</th>
                  <th>Average Score</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className="font-bold text-xs text-[var(--eg-text-primary)]">{t.title}</div>
                      <div className="text-caption text-[var(--eg-text-muted)] font-mono">/mock-tests/{t.id}</div>
                    </td>
                    <td><Badge variant="secondary" size="sm">{t.university} • {t.unit}</Badge></td>
                    <td className="text-xs text-[var(--eg-text-secondary)] font-medium">{t.duration} ({t.questionsCount} Qs)</td>
                    <td className="text-xs font-bold text-[var(--eg-primary)]">{t.totalAttempts} attempts</td>
                    <td className="text-xs font-bold text-[var(--eg-success)]">{t.avgScore}</td>
                    <td><Badge variant="success" size="sm">{t.status}</Badge></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link href={`/mock-tests/${t.id}`} className="p-1.5 rounded hover:bg-[var(--eg-surface-subtle)] text-[var(--eg-text-muted)] hover:text-[var(--eg-primary)]">
                          <Play className="w-4 h-4" />
                        </Link>
                        <button className="p-1.5 rounded hover:bg-[var(--eg-surface-subtle)] text-[var(--eg-text-muted)]">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
