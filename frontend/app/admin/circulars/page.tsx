'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { Calendar, PlusCircle, Clock, CheckCircle2, AlertTriangle, Eye, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminCircularsPage() {
  const circulars = [
    { id: 'c1', university: 'BUET', session: '2025-2026', publishedDate: 'Nov 15, 2025', appDeadline: 'Dec 31, 2025', examDate: 'Jan 25, 2026', status: 'Active' },
    { id: 'c2', university: 'University of Dhaka (DU)', session: '2025-2026', publishedDate: 'Nov 20, 2025', appDeadline: 'Jan 15, 2026', examDate: 'Feb 15, 2026', status: 'Active' },
    { id: 'c3', university: 'Engineering Cluster (CKRUET)', session: '2025-2026', publishedDate: 'Dec 01, 2025', appDeadline: 'Jan 20, 2026', examDate: 'Mar 02, 2026', status: 'Pending Review' },
  ];

  return (
    <AdminShell
      pageTitle="Admission Circulars & Exam Deadlines"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Circulars' }]}
      actions={
        <button className="btn btn-primary btn-sm font-semibold shadow-sm">
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Circular</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="eg-card p-0 overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left admin-table">
              <thead>
                <tr>
                  <th>University</th>
                  <th>Session</th>
                  <th>Published Date</th>
                  <th>Application Deadline</th>
                  <th>Admission Exam Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {circulars.map((c) => (
                  <tr key={c.id}>
                    <td><span className="font-bold text-xs text-[var(--eg-text-primary)]">{c.university}</span></td>
                    <td className="text-xs text-[var(--eg-text-secondary)]">{c.session}</td>
                    <td className="text-caption text-[var(--eg-text-muted)]">{c.publishedDate}</td>
                    <td>
                      <div className="flex items-center gap-1 text-xs font-semibold text-[var(--eg-error)]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{c.appDeadline}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-xs font-semibold text-[var(--eg-primary)]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{c.examDate}</span>
                      </div>
                    </td>
                    <td>
                      <Badge variant={c.status === 'Active' ? 'success' : 'warning'} size="sm">
                        {c.status}
                      </Badge>
                    </td>
                    <td>
                      <button className="p-1.5 rounded hover:bg-[var(--eg-surface-subtle)] text-[var(--eg-text-muted)] hover:text-[var(--eg-primary)]">
                        <Eye className="w-4 h-4" />
                      </button>
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
