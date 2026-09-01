'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/admin-shell';
import { BookOpen, PlusCircle, Search, Edit, Eye, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const RichEditor = dynamic(
  () => import('@/components/admin/rich-editor').then((m) => m.RichEditor),
  { ssr: false, loading: () => <div className="h-48 bg-[var(--eg-surface-subtle)] border border-[var(--eg-border)] rounded-xl animate-pulse" /> }
);

export default function AdminLessonsPage() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState("Newton's Mechanics");
  const [body, setBody] = useState('');
  const [msg, setMsg] = useState<{ success: boolean; text: string } | null>(null);

  const lessons = [
    { id: 'l1', title: "Newton's Second Law & Linear Momentum (BUET Standard)", subject: 'Physics', chapter: "Newton's Mechanics", slug: 'newtons-second-law-buet-guide', status: 'Published', views: '2.4k', updated: '2 days ago' },
    { id: 'l2', title: 'Work-Energy Theorem and Conservative Forces', subject: 'Physics', chapter: 'Work, Energy & Power', slug: 'work-energy-theorem', status: 'Published', views: '1.8k', updated: '4 days ago' },
    { id: 'l3', title: 'Electrophilic Aromatic Substitution Reaction Mechanisms', subject: 'Chemistry', chapter: 'Organic Chemistry', slug: 'electrophilic-aromatic-substitution', status: 'Published', views: '3.1k', updated: '1 week ago' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ success: true, text: `Lesson "${title}" published successfully to curriculum!` });
    setShowModal(false);
    setTitle('');
  };

  return (
    <AdminShell
      pageTitle="Curriculum Lessons & Content CMS"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Lessons' }]}
      actions={
        <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm font-semibold shadow-sm">
          <PlusCircle className="w-4 h-4" />
          <span>+ Create Lesson</span>
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

        <div className="eg-card p-0 overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left admin-table">
              <thead>
                <tr>
                  <th>Lesson Title</th>
                  <th>Subject • Chapter</th>
                  <th>Student Views</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <div className="font-bold text-xs text-[var(--eg-text-primary)]">{l.title}</div>
                      <div className="text-caption text-[var(--eg-text-muted)] font-mono">/prepare/lessons/{l.slug}</div>
                    </td>
                    <td>
                      <div className="text-xs font-medium text-[var(--eg-text-primary)]">{l.subject}</div>
                      <div className="text-caption text-[var(--eg-text-muted)]">{l.chapter}</div>
                    </td>
                    <td className="text-xs font-semibold text-[var(--eg-text-secondary)]">{l.views}</td>
                    <td><Badge variant="success" size="sm">{l.status}</Badge></td>
                    <td className="text-caption text-[var(--eg-text-muted)]">{l.updated}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link href={`/prepare/lessons/${l.slug}`} className="p-1.5 rounded hover:bg-[var(--eg-surface-subtle)] text-[var(--eg-text-muted)] hover:text-[var(--eg-primary)]">
                          <Eye className="w-4 h-4" />
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

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[var(--eg-surface)] border border-[var(--eg-border)] rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-modal max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-[var(--eg-border)] pb-3">
                <h3 className="font-bold text-base text-[var(--eg-text-primary)]">Publish Interactive Lesson</h3>
                <button onClick={() => setShowModal(false)} className="text-xs text-[var(--eg-text-muted)]">Close</button>
              </div>
              <form onSubmit={handleCreate} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Lesson Title *</label>
                  <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Projectile Motion Max Height & Trajectory" className="eg-input" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Subject</label>
                    <select value={subject} onChange={(e) => setSubject(e.target.value)} className="eg-input">
                      <option>Physics</option>
                      <option>Chemistry</option>
                      <option>Higher Math</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Chapter</label>
                    <input value={chapter} onChange={(e) => setChapter(e.target.value)} className="eg-input" />
                  </div>
                </div>
                <div>
                  <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Lesson Content (TipTap Rich Editor)</label>
                  <RichEditor placeholder="Write lesson notes, formulas, and examples..." onChange={setBody} />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm font-semibold">Publish Lesson</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
