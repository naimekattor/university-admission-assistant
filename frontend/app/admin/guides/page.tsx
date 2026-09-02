'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/admin-shell';
import { FileText, PlusCircle, Search, Eye, Edit, Trash2, Globe, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const RichEditor = dynamic(
  () => import('@/components/admin/rich-editor').then((m) => m.RichEditor),
  { ssr: false, loading: () => <div className="h-48 bg-[var(--eg-surface-subtle)] border border-[var(--eg-border)] rounded-xl animate-pulse" /> }
);

export default function AdminGuidesPage() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('University Guide');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [msg, setMsg] = useState<{ success: boolean; text: string } | null>(null);

  const articles = [
    { id: 'a1', title: 'BUET Admission Test 2026: Complete Preparation & Eligibility Guide', category: 'University Guide', slug: 'buet-admission-guide-2026', views: '4.8k', status: 'Published', date: '2 days ago' },
    { id: 'a2', title: 'DU Ka Unit Admission Strategy: How to Score High in Physics & Chemistry', category: 'Strategy Guide', slug: 'du-ka-unit-guide', views: '3.2k', status: 'Published', date: '5 days ago' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ success: true, text: `Article "${title}" published to live SEO feed!` });
    setShowModal(false);
    setTitle('');
  };

  return (
    <AdminShell
      pageTitle="SEO Guides & Article Knowledge Base"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Guides' }]}
      actions={
        <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm font-semibold shadow-sm">
          <PlusCircle className="w-4 h-4" />
          <span>+ Write Article</span>
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
                  <th>Article Title</th>
                  <th>Category</th>
                  <th>Organic Reads</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="font-bold text-xs text-[var(--eg-text-primary)]">{a.title}</div>
                      <div className="text-caption text-[var(--eg-text-muted)] font-mono">/guides/{a.slug}</div>
                    </td>
                    <td><Badge variant="secondary" size="sm">{a.category}</Badge></td>
                    <td className="text-xs font-bold text-[var(--eg-text-primary)]">{a.views}</td>
                    <td><Badge variant="success" size="sm">{a.status}</Badge></td>
                    <td className="text-caption text-[var(--eg-text-muted)]">{a.date}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link href={`/guides/${a.slug}`} className="p-1.5 rounded hover:bg-[var(--eg-surface-subtle)] text-[var(--eg-text-muted)] hover:text-[var(--eg-primary)]">
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
                <h3 className="font-bold text-base text-[var(--eg-text-primary)]">Publish SEO Article Guide</h3>
                <button onClick={() => setShowModal(false)} className="text-xs text-[var(--eg-text-muted)]">Close</button>
              </div>
              <form onSubmit={handleCreate} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Article Title *</label>
                  <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. DU Ka Unit Physics Preparation Blueprint" className="eg-input" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="eg-input">
                      <option>University Guide</option>
                      <option>Strategy Guide</option>
                      <option>Subject Breakdown</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">SEO Meta Excerpt</label>
                    <input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short summary for Google..." className="eg-input" />
                  </div>
                </div>
                <div>
                  <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Content (Quill Rich Editor)</label>
                  <RichEditor placeholder="Write formatted article content..." onChange={setBody} />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm font-semibold">Publish Article</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
