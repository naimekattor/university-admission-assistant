'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  FileText,
  PlusCircle,
  Search,
  Eye,
  Edit,
  Trash2,
  Globe,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  BookOpen,
} from 'lucide-react';

const RichEditor = dynamic(
  () => import('@/components/admin/rich-editor').then((m) => m.RichEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 bg-slate-50 border border-slate-200 rounded-2xl animate-pulse" />
    ),
  }
);

export default function AdminGuidesPage() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('University Guide');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [msg, setMsg] = useState<{ success: boolean; text: string } | null>(null);

  const articles = [
    {
      id: 'a1',
      title: 'BUET Admission Test 2026: Complete Preparation & Eligibility Guide',
      category: 'University Guide',
      slug: 'buet-admission-guide-2026',
      views: '4.8k',
      status: 'Published',
      date: '2 days ago',
    },
    {
      id: 'a2',
      title: 'DU Ka Unit Admission Strategy: How to Score High in Physics & Chemistry',
      category: 'Strategy Guide',
      slug: 'du-ka-unit-guide',
      views: '3.2k',
      status: 'Published',
      date: '5 days ago',
    },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ success: true, text: `Article "${title}" published to live SEO feed!` });
    setShowModal(false);
    setTitle('');
  };

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminShell
      pageTitle="SEO Guides & Article Knowledge Base"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Guides' }]}
      actions={
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:shadow-lg transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Write Article</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* ── KPI Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Published Guides</p>
              <h3 className="text-2xl font-black text-slate-900 font-mono">24 Articles</h3>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live on search engine feed
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#FF5500] flex items-center justify-center shadow-2xs shrink-0">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Organic Student Reads</p>
              <h3 className="text-2xl font-black text-slate-900 font-mono">8.0k+ Views</h3>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                +24% this admission month
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center shadow-2xs shrink-0">
              <Globe className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Indexing Health</p>
              <h3 className="text-2xl font-black text-slate-900 font-mono">100% Indexed</h3>
              <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                Sitemap & Schema.org verified
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center shadow-2xs shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ── Success Alert ── */}
        {msg && (
          <div className="p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{msg.text}</span>
          </div>
        )}

        {/* ── Search & Filter Toolbar ── */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search guides by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
            />
          </div>

          <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
            <span>Showing</span>
            <span className="font-bold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
            <span>articles</span>
          </div>
        </div>

        {/* ── Modern Table Container ── */}
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-5">Article Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Organic Reads</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-5 max-w-md">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                        {a.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        /guides/{a.slug}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {a.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-slate-900 text-xs">{a.views}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {a.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-[11px] font-medium">{a.date}</td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/guides/${a.slug}`}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-[#FF5500] text-slate-500 hover:text-white border border-slate-200/70 transition shadow-2xs"
                          title="View Public Article"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setTitle(a.title);
                            setCategory(a.category);
                            setShowModal(true);
                          }}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-600 border border-slate-200/70 transition shadow-2xs cursor-pointer"
                          title="Edit Article"
                        >
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

        {/* ── Modern Create Modal ── */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white border border-slate-200/90 rounded-3xl max-w-3xl w-full p-6 sm:p-7 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-lg text-slate-900">Publish SEO Article Guide</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Write high-ranking admission and prep guides for search engines
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900 block">Article Title *</label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. DU Ka Unit Physics Preparation Blueprint"
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-900 block">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                    >
                      <option>University Guide</option>
                      <option>Strategy Guide</option>
                      <option>Subject Breakdown</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-900 block">SEO Meta Excerpt</label>
                    <input
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Short summary for Google search snippet..."
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900 block">
                    Content (Quill Rich Text Editor)
                  </label>
                  <RichEditor placeholder="Write formatted article content..." onChange={setBody} />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:shadow-lg transition cursor-pointer"
                  >
                    Publish Article
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
