'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { FileCheck, PlusCircle, Search, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminEligibilityPage() {
  const rules = [
    {
      id: 'r1',
      university: 'BUET',
      unit: 'Ka Unit (Engineering & Architecture)',
      group: 'Science',
      minSscGpa: '4.00',
      minHscGpa: '4.50 in Phy, Chem, Math, Eng',
      secondTimeAllowed: false,
      status: 'Verified',
    },
    {
      id: 'r2',
      university: 'DU',
      unit: 'Ka Unit (Faculty of Science)',
      group: 'Science',
      minSscGpa: '3.50',
      minHscGpa: 'Total 8.00 (min 3.50)',
      secondTimeAllowed: false,
      status: 'Verified',
    },
    {
      id: 'r3',
      university: 'KUET / RUET / CUET',
      unit: 'Engineering Cluster',
      group: 'Science',
      minSscGpa: '4.00',
      minHscGpa: 'Total 18.5 GPA points in Phy, Chem, Math, Eng',
      secondTimeAllowed: false,
      status: 'Verified',
    },
    {
      id: 'r4',
      university: 'GST Cluster (24 Public Varsities)',
      unit: 'A Unit (Science)',
      group: 'Science',
      minSscGpa: '3.50',
      minHscGpa: 'Total 7.50 combined',
      secondTimeAllowed: true,
      status: 'Verified',
    },
  ];

  return (
    <AdminShell
      pageTitle="Deterministic Eligibility Rules Engine"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Eligibility' }]}
      actions={
        <button className="btn btn-primary btn-sm font-semibold shadow-sm">
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Rule</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-[var(--eg-surface)] border border-[var(--eg-border)] text-xs text-[var(--eg-text-secondary)]">
          <strong className="text-[var(--eg-text-primary)]">Deterministic Rule System:</strong> These eligibility parameters directly power the student-facing eligibility engine (<code className="text-[var(--eg-primary)]">/eligibility</code>) and automated student qualification audits.
        </div>

        <div className="eg-card p-0 overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left admin-table">
              <thead>
                <tr>
                  <th>University • Unit</th>
                  <th>HSC Group</th>
                  <th>SSC Requirement</th>
                  <th>HSC Subject Cutoff</th>
                  <th>Second Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="font-bold text-xs text-[var(--eg-text-primary)]">{r.university}</div>
                      <div className="text-caption text-[var(--eg-text-muted)]">{r.unit}</div>
                    </td>
                    <td><Badge variant="secondary" size="sm">{r.group}</Badge></td>
                    <td className="text-xs font-semibold text-[var(--eg-text-primary)]">{r.minSscGpa}</td>
                    <td className="text-xs text-[var(--eg-text-secondary)] font-medium max-w-xs">{r.minHscGpa}</td>
                    <td>
                      <Badge variant={r.secondTimeAllowed ? 'success' : 'error'} size="sm">
                        {r.secondTimeAllowed ? 'Allowed' : 'Not Allowed'}
                      </Badge>
                    </td>
                    <td><Badge variant="success" size="sm">{r.status}</Badge></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded hover:bg-[var(--eg-surface-subtle)] text-[var(--eg-text-muted)] hover:text-[var(--eg-text-primary)]">
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
