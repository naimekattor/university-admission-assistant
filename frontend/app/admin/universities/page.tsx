'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  GraduationCap,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Trash2,
  Edit,
  ExternalLink,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const RichEditor = dynamic(
  () => import('@/components/admin/rich-editor').then((m) => m.RichEditor),
  { ssr: false, loading: () => <div className="h-48 bg-[var(--eg-surface-subtle)] border border-[var(--eg-border)] rounded-xl animate-pulse" /> }
);

export default function AdminUniversitiesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [msg, setMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Form states
  const [uniName, setUniName] = useState('');
  const [uniSlug, setUniSlug] = useState('');
  const [uniLocation, setUniLocation] = useState('');
  const [uniType, setUniType] = useState('Engineering');
  const [uniDeadline, setUniDeadline] = useState('December 31, 2025');
  const [uniBody, setUniBody] = useState('');

  const universities = [
    {
      id: 'u1',
      name: 'Bangladesh University of Engineering and Technology (BUET)',
      shortName: 'BUET',
      location: 'Dhaka',
      type: 'Engineering',
      programsCount: 16,
      circularStatus: 'Published',
      deadline: 'Dec 31, 2025',
      lastUpdated: '2 hours ago',
    },
    {
      id: 'u2',
      name: 'University of Dhaka (DU)',
      shortName: 'DU',
      location: 'Dhaka',
      type: 'General Public',
      programsCount: 84,
      circularStatus: 'Published',
      deadline: 'Jan 15, 2026',
      lastUpdated: '1 day ago',
    },
    {
      id: 'u3',
      name: 'Khulna University of Engineering & Technology (KUET)',
      shortName: 'KUET',
      location: 'Khulna',
      type: 'Engineering',
      programsCount: 14,
      circularStatus: 'Pending Verification',
      deadline: 'Jan 20, 2026',
      lastUpdated: '3 days ago',
    },
  ];

  const handleCreateUni = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ success: true, text: `University "${uniName}" published successfully!` });
    setShowAddModal(false);
    setUniName('');
  };

  return (
    <AdminShell
      pageTitle="University Directory & Circular Intelligence"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Universities' }]}
      actions={
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary btn-sm font-semibold shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add University</span>
        </button>
      }
    >
      <div className="space-y-6">
        
        {msg && (
          <div className="p-4 rounded-xl text-xs font-semibold flex items-center gap-2 bg-[var(--eg-success-soft)] text-[var(--eg-success)] border border-[var(--eg-success)]/20">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{msg.text}</span>
          </div>
        )}

        {/* Toolbar Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--eg-text-muted)]" />
            <input
              type="text"
              placeholder="Search universities by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="eg-input pl-9"
            />
          </div>

          <div className="flex gap-2">
            <select className="eg-input w-auto text-xs font-medium">
              <option>All Types</option>
              <option>Engineering</option>
              <option>General Public</option>
              <option>Medical</option>
            </select>
          </div>
        </div>

        {/* Universities Table */}
        <div className="eg-card p-0 overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left admin-table">
              <thead>
                <tr>
                  <th>University</th>
                  <th>Type</th>
                  <th>Programs</th>
                  <th>Next Deadline</th>
                  <th>Circular Status</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {universities.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div>
                        <div className="font-bold text-[var(--eg-text-primary)]">{u.name}</div>
                        <div className="text-caption text-[var(--eg-text-muted)]">{u.location}</div>
                      </div>
                    </td>
                    <td>
                      <Badge variant="secondary" size="sm">{u.type}</Badge>
                    </td>
                    <td className="font-semibold text-xs text-[var(--eg-text-primary)]">
                      {u.programsCount} Units/Dept
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--eg-text-primary)] font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[var(--eg-primary)]" />
                        <span>{u.deadline}</span>
                      </div>
                    </td>
                    <td>
                      <Badge
                        variant={u.circularStatus === 'Published' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {u.circularStatus}
                      </Badge>
                    </td>
                    <td className="text-caption text-[var(--eg-text-muted)]">{u.lastUpdated}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link href="/universities/buet" className="p-1.5 rounded hover:bg-[var(--eg-surface-subtle)] text-[var(--eg-text-muted)] hover:text-[var(--eg-primary)]">
                          <Eye className="w-4 h-4" />
                        </Link>
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

        {/* Modal: Add University */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[var(--eg-surface)] border border-[var(--eg-border)] rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-modal max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[var(--eg-border)] pb-3">
                <h3 className="font-bold text-lg text-[var(--eg-text-primary)]">
                  Add University & Admission Circular
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-xs text-[var(--eg-text-muted)] hover:text-[var(--eg-text-primary)]">
                  Close
                </button>
              </div>

              <form onSubmit={handleCreateUni} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">University Full Name *</label>
                    <input
                      required
                      value={uniName}
                      onChange={(e) => setUniName(e.target.value)}
                      placeholder="e.g. Bangladesh University of Engineering and Technology"
                      className="eg-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Location / City *</label>
                    <input
                      required
                      value={uniLocation}
                      onChange={(e) => setUniLocation(e.target.value)}
                      placeholder="e.g. Dhaka"
                      className="eg-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">University Type</label>
                    <select value={uniType} onChange={(e) => setUniType(e.target.value)} className="eg-input">
                      <option>Engineering</option>
                      <option>General Public</option>
                      <option>Medical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Application Deadline</label>
                    <input
                      value={uniDeadline}
                      onChange={(e) => setUniDeadline(e.target.value)}
                      className="eg-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">
                    Detailed Admission Overview (Quill Rich Editor)
                  </label>
                  <RichEditor
                    placeholder="Write detailed admission instructions, eligibility criteria, and unit test details..."
                    onChange={setUniBody}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm font-semibold">
                    Publish University
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminShell>
  );
}
