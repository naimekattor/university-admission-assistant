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
import { useToast } from '@/components/ui/custom-toast';
import { AlertTriangle, Loader2 } from 'lucide-react';

const RichEditor = dynamic(
  () => import('@/components/admin/rich-editor').then((m) => m.RichEditor),
  { ssr: false, loading: () => <div className="h-48 bg-[var(--eg-surface-subtle)] border border-[var(--eg-border)] rounded-xl animate-pulse" /> }
);

export default function AdminUniversitiesPage() {
  const toast = useToast();
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

  // SweetAlert-style Delete Dialog State
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isDeleting?: boolean;
    onConfirm: () => Promise<void> | void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    isDeleting: false,
    onConfirm: () => {},
  });

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
        toast.success(`University "${uniName}" saved to database!`, 'University Created');
        setMsg({ success: true, text: `University "${uniName}" saved to PostgreSQL database!` });
        setShowAddModal(false);
        setUniName('');
        setUniShortName('');
        setUniLocation('');
        setUniWebsite('');
        setUniBody('');
        loadUniversities();
      } else {
        toast.error('Failed to save university to database.', 'Database Error');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error creating university.', 'Error');
    }
  };

  const promptDeleteUni = (id: string, name: string) => {
    setDeleteDialog({
      isOpen: true,
      title: 'Delete University?',
      message: `Are you sure you want to permanently delete "${name}" from PostgreSQL? This action cannot be undone.`,
      onConfirm: async () => {
        setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
        try {
          const res = await fetch(`/api/v1/universities/${id}`, { method: 'DELETE' });
          if (res.ok) {
            toast.success(`University "${name}" deleted.`, 'Deleted');
            loadUniversities();
          } else {
            toast.error('Failed to delete university from database.', 'Delete Failed');
          }
        } catch {
          toast.error('Error deleting university.', 'Error');
        } finally {
          setDeleteDialog((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
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
                              onClick={() => promptDeleteUni(u.id, u.name)}
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

        {/* ── CUSTOM SWEETALERT-STYLE DELETE CONFIRMATION MODAL ── */}
        {deleteDialog.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
              {/* Warning Pulsing Icon */}
              <div className="mx-auto w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/10">
                <AlertTriangle className="w-8 h-8 text-rose-600 animate-pulse" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900">{deleteDialog.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  {deleteDialog.message}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={deleteDialog.isDeleting}
                  onClick={() => setDeleteDialog((prev) => ({ ...prev, isOpen: false }))}
                  className="px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteDialog.isDeleting}
                  onClick={deleteDialog.onConfirm}
                  className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {deleteDialog.isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Yes, delete it!</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminShell>
  );
}
