'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { Layers, PlusCircle, Search, Eye, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminProgramsPage() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState<{ success: boolean; text: string } | null>(null);

  const [name, setName] = useState('');
  const [university, setUniversity] = useState('BUET');
  const [unit, setUnit] = useState('Ka Unit');
  const [seats, setSeats] = useState('120');
  const [degree, setDegree] = useState('B.Sc. Engg.');

  const programs = [
    { id: 'p1', name: 'Computer Science & Engineering', shortCode: 'CSE', university: 'BUET', unit: 'Ka Unit', degree: 'B.Sc. Engg.', seats: 120, status: 'Active' },
    { id: 'p2', name: 'Electrical & Electronic Engineering', shortCode: 'EEE', university: 'BUET', unit: 'Ka Unit', degree: 'B.Sc. Engg.', seats: 195, status: 'Active' },
    { id: 'p3', name: 'Civil Engineering', shortCode: 'CE', university: 'BUET', unit: 'Ka Unit', degree: 'B.Sc. Engg.', seats: 195, status: 'Active' },
    { id: 'p4', name: 'Applied Chemistry & Chemical Engineering', shortCode: 'ACCE', university: 'DU', unit: 'Ka Unit', degree: 'B.Sc. (Hons)', seats: 60, status: 'Active' },
    { id: 'p5', name: 'Software Engineering', shortCode: 'SE', university: 'DU (IIT)', unit: 'Ka Unit', degree: 'B.Sc. Engg.', seats: 50, status: 'Active' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ success: true, text: `Program "${name}" added successfully to ${university}!` });
    setShowModal(false);
    setName('');
  };

  return (
    <AdminShell
      pageTitle="Academic Programs & Degree Directory"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Programs' }]}
      actions={
        <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm font-semibold shadow-sm">
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Program</span>
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--eg-text-muted)]" />
            <input
              type="text"
              placeholder="Search programs by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="eg-input pl-9"
            />
          </div>
          <select className="eg-input w-auto text-xs font-medium">
            <option>All Universities</option>
            <option>BUET</option>
            <option>DU</option>
            <option>KUET</option>
          </select>
        </div>

        <div className="eg-card p-0 overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left admin-table">
              <thead>
                <tr>
                  <th>Program Name</th>
                  <th>University • Unit</th>
                  <th>Degree Title</th>
                  <th>Seat Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="font-bold text-xs text-[var(--eg-text-primary)]">{p.name}</div>
                      <div className="text-caption text-[var(--eg-text-muted)] font-mono">{p.shortCode}</div>
                    </td>
                    <td className="text-xs font-medium text-[var(--eg-text-primary)]">{p.university} • {p.unit}</td>
                    <td className="text-xs text-[var(--eg-text-secondary)]">{p.degree}</td>
                    <td className="text-xs font-bold text-[var(--eg-primary)]">{p.seats} Seats</td>
                    <td>
                      <Badge variant="success" size="sm">{p.status}</Badge>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded hover:bg-[var(--eg-surface-subtle)] text-[var(--eg-text-muted)] hover:text-[var(--eg-text-primary)]">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-[var(--eg-error-soft)] text-[var(--eg-text-muted)] hover:text-[var(--eg-error)]">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-[var(--eg-surface)] border border-[var(--eg-border)] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-modal">
              <div className="flex justify-between items-center border-b border-[var(--eg-border)] pb-3">
                <h3 className="font-bold text-base text-[var(--eg-text-primary)]">Add Academic Program</h3>
                <button onClick={() => setShowModal(false)} className="text-xs text-[var(--eg-text-muted)]">Close</button>
              </div>
              <form onSubmit={handleCreate} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Program Name *</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Biomedical Engineering" className="eg-input" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">University</label>
                    <select value={university} onChange={(e) => setUniversity(e.target.value)} className="eg-input">
                      <option>BUET</option>
                      <option>DU</option>
                      <option>KUET</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Unit Tag</label>
                    <input value={unit} onChange={(e) => setUnit(e.target.value)} className="eg-input" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Degree Title</label>
                    <input value={degree} onChange={(e) => setDegree(e.target.value)} className="eg-input" />
                  </div>
                  <div>
                    <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Total Seats</label>
                    <input value={seats} onChange={(e) => setSeats(e.target.value)} className="eg-input" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm font-semibold">Save Program</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
