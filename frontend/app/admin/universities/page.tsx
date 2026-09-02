'use client';

import React, { useState, useEffect } from 'react';
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
  const [uniShortName, setUniShortName] = useState('');
  const [uniLocation, setUniLocation] = useState('');
  const [uniType, setUniType] = useState('Engineering');
  const [uniDeadline, setUniDeadline] = useState('December 31, 2026');
  const [uniWebsite, setUniWebsite] = useState('');
  const [uniBody, setUniBody] = useState('');
  const [universitiesList, setUniversitiesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUniversities = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/universities');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setUniversitiesList(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to load universities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUniversities();
  }, []);

  const handleCreateUni = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: uniName,
        shortName: uniShortName || uniName.split(' ').map(w => w[0]).join('').toUpperCase(),
        location: uniLocation,
        admissionType: uniType.toLowerCase(),
        website: uniWebsite || undefined,
        description: uniBody || undefined,
      };

      const res = await fetch('/api/v1/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMsg({ success: true, text: `University "${uniName}" saved to PostgreSQL database!` });
        setShowAddModal(false);
        setUniName('');
        setUniShortName('');
        setUniLocation('');
        setUniWebsite('');
        setUniBody('');
        loadUniversities();
      } else {
        setMsg({ success: false, text: 'Failed to save university to database.' });
      }
    } catch (err: any) {
      setMsg({ success: false, text: err.message || 'Error creating university.' });
    }
  };

  const handleDeleteUni = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/v1/universities/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg({ success: true, text: `University "${name}" deleted.` });
        loadUniversities();
      }
    } catch (err: any) {
      setMsg({ success: false, text: 'Failed to delete university.' });
    }
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
                  <th>University & Code</th>
                  <th>Location</th>
                  <th>Units / Programs</th>
                  <th>Seats</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {universitiesList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-xs text-[var(--eg-text-muted)]">
                      {loading ? 'Loading universities from database...' : 'No universities found in database.'}
                    </td>
                  </tr>
                ) : (
                  universitiesList
                    .filter(
                      (u) =>
                        searchQuery === '' ||
                        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.shortName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.location?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div>
                            <div className="font-bold text-[var(--eg-text-primary)]">{u.name}</div>
                            <div className="text-caption font-mono text-[var(--eg-primary)]">{u.shortName}</div>
                          </div>
                        </td>
                        <td className="text-xs text-[var(--eg-text-muted)] font-medium">{u.location || 'Bangladesh'}</td>
                        <td className="font-semibold text-xs text-[var(--eg-text-primary)]">
                          {u.units || 'Multiple Units'}
                        </td>
                        <td className="text-xs font-mono font-semibold text-[var(--eg-text-primary)]">
                          {u.seats ? `${u.seats.toLocaleString()} Seats` : '—'}
                        </td>
                        <td>
                          <Badge
                            variant={u.status === 'Applications Open' ? 'success' : u.status === 'Deadline Passed' ? 'error' : 'warning'}
                            size="sm"
                          >
                            {u.status || 'Active'}
                          </Badge>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            {u.circularUrl && (
                              <a
                                href={u.circularUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded hover:bg-[var(--eg-surface-subtle)] text-[var(--eg-text-muted)] hover:text-[var(--eg-primary)]"
                                title="Visit Website"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteUni(u.id, u.name)}
                              className="p-1.5 rounded hover:bg-rose-950/20 text-slate-500 hover:text-rose-400 transition"
                              title="Delete University"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
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
                  Add University to PostgreSQL Database
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-xs text-[var(--eg-text-muted)] hover:text-[var(--eg-text-primary)]">
                  Close
                </button>
              </div>

              <form onSubmit={handleCreateUni} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
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
                    <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Short Code *</label>
                    <input
                      required
                      value={uniShortName}
                      onChange={(e) => setUniShortName(e.target.value)}
                      placeholder="e.g. BUET"
                      className="eg-input font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <div>
                    <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Official Website / Circular URL</label>
                    <input
                      value={uniWebsite}
                      onChange={(e) => setUniWebsite(e.target.value)}
                      placeholder="https://..."
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
                      <option>Agriculture</option>
                      <option>Science & Tech</option>
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
                    Save to Database
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
