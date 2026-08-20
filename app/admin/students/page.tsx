'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  Users,
  Search,
  Filter,
  Eye,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminStudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState('All');

  const students = [
    {
      id: 's1',
      name: 'Tanvir Hossain',
      group: 'Science',
      sscGpa: 5.0,
      hscGpa: 5.0,
      target: 'BUET CSE',
      progress: '68%',
      subscription: 'Premium Pass',
      lastActive: '10 mins ago',
      status: 'Active',
    },
    {
      id: 's2',
      name: 'Nusrat Jahan',
      group: 'Science',
      sscGpa: 5.0,
      hscGpa: 4.92,
      target: 'DU Ka Unit',
      progress: '52%',
      subscription: 'Free Starter',
      lastActive: '45 mins ago',
      status: 'Active',
    },
    {
      id: 's3',
      name: 'Rahim Ahmed',
      group: 'Science',
      sscGpa: 4.8,
      hscGpa: 4.75,
      target: 'KUET EEE',
      progress: '44%',
      subscription: 'Premium Pass',
      lastActive: '2 hours ago',
      status: 'Active',
    },
    {
      id: 's4',
      name: 'Farida Khanam',
      group: 'Science',
      sscGpa: 5.0,
      hscGpa: 5.0,
      target: 'BUET Architecture',
      progress: '35%',
      subscription: 'Free Starter',
      lastActive: '5 hours ago',
      status: 'Inactive',
    },
  ];

  return (
    <AdminShell
      pageTitle="Registered Student Directory & Telemetry"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Students' }]}
    >
      <div className="space-y-6">
        
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--eg-text-muted)]" />
            <input
              type="text"
              placeholder="Search students by name or target goal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="eg-input pl-9"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="eg-input w-auto text-xs font-medium"
            >
              <option value="All">All Groups</option>
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Humanities">Humanities</option>
            </select>
          </div>
        </div>

        {/* Students Directory Table */}
        <div className="eg-card p-0 overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left admin-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Group</th>
                  <th>SSC / HSC GPA</th>
                  <th>Primary Target</th>
                  <th>Prep Progress</th>
                  <th>Plan Tier</th>
                  <th>Last Active</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[var(--eg-primary-soft)] text-[var(--eg-primary)] font-bold text-xs flex items-center justify-center">
                          {s.name[0]}
                        </div>
                        <span className="font-bold text-xs text-[var(--eg-text-primary)]">{s.name}</span>
                      </div>
                    </td>
                    <td>{s.group}</td>
                    <td className="font-mono font-bold text-xs text-[var(--eg-text-primary)]">
                      {s.sscGpa} / {s.hscGpa}
                    </td>
                    <td className="font-semibold text-xs text-[var(--eg-primary)]">{s.target}</td>
                    <td>
                      <span className="font-bold text-xs text-[var(--eg-text-primary)]">{s.progress}</span>
                    </td>
                    <td>
                      <Badge variant={s.subscription === 'Premium Pass' ? 'accent' : 'secondary'} size="sm">
                        {s.subscription}
                      </Badge>
                    </td>
                    <td className="text-caption text-[var(--eg-text-muted)] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {s.lastActive}
                    </td>
                    <td>
                      <Badge variant={s.status === 'Active' ? 'success' : 'secondary'} size="sm">
                        {s.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button className="p-1.5 rounded hover:bg-[var(--eg-surface-subtle)] text-[var(--eg-text-muted)] hover:text-[var(--eg-primary)]">
                          <Eye className="w-4 h-4" />
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
