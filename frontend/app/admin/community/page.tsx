'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  MessageSquare,
  Shield,
  Flag,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Trash2,
  Award,
  Users,
  Search,
  Filter,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/community`
  : 'http://localhost:4000/api/community';

export default function AdminCommunityPage() {
  const [activeTab, setActiveTab] = useState<'questions' | 'reports' | 'contributors' | 'categories'>('questions');
  const [questions, setQuestions] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'questions') {
        const res = await fetch(`${API_BASE}/admin/questions?status=${statusFilter}`);
        const data = await res.json();
        setQuestions(data.data || []);
      } else if (activeTab === 'reports') {
        const res = await fetch(`${API_BASE}/admin/reports`);
        const data = await res.json();
        setReports(data.data || []);
      } else if (activeTab === 'categories') {
        const res = await fetch(`${API_BASE}/categories`);
        const data = await res.json();
        setCategories(data.data || []);
      }
    } catch (err) {
      console.warn('[AdminCommunity] Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, statusFilter]);

  const handleModerateQuestion = async (id: string, action: 'hide' | 'restore' | 'flag' | 'delete') => {
    try {
      const res = await fetch(`${API_BASE}/admin/questions/${id}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      setActionFeedback(`Question ${id.substring(0, 8)}... action applied: ${action}`);
      setTimeout(() => setActionFeedback(null), 3000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Moderation action failed');
    }
  };

  const handleResolveReport = async (reportId: string, action: 'resolve' | 'dismiss') => {
    try {
      await fetch(`${API_BASE}/admin/reports/${reportId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      setActionFeedback(`Report ${reportId.substring(0, 8)} marked as ${action}`);
      setTimeout(() => setActionFeedback(null), 3000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update report');
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (!searchQuery.trim()) return true;
    const s = searchQuery.toLowerCase();
    return (
      q.title?.toLowerCase().includes(s) ||
      q.author_name?.toLowerCase().includes(s) ||
      q.category_name?.toLowerCase().includes(s)
    );
  });

  return (
    <AdminShell
      pageTitle="Community Q&A Moderation & Management"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Community Q&A' }]}
      actions={
        <Link
          href="/community"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-2xs"
        >
          <span>Open Public Feed</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Action feedback banner */}
        {actionFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{actionFeedback}</span>
            </div>
            <button onClick={() => setActionFeedback(null)} className="text-emerald-600 hover:text-emerald-900 font-bold">
              ×
            </button>
          </div>
        )}

        {/* ── TOP TABS ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('questions')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'questions'
                  ? 'bg-[#FF5500] text-white shadow-2xs shadow-orange-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Questions</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-[#FF5500] text-white shadow-2xs shadow-orange-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Flag className="w-4 h-4" />
              <span>Reports Queue</span>
            </button>

            <button
              onClick={() => setActiveTab('contributors')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'contributors'
                  ? 'bg-[#FF5500] text-white shadow-2xs shadow-orange-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Contributor Badges</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#FF5500] text-white shadow-2xs shadow-orange-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Categories</span>
            </button>
          </div>

          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* ── TAB 1: QUESTIONS MODERATION ── */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions or author..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="hidden">Hidden</option>
                  <option value="flagged">Flagged</option>
                  <option value="deleted">Deleted</option>
                </select>
              </div>
            </div>

            {/* Questions Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Question</th>
                      <th className="py-3 px-4">Author</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Metrics</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400">
                          Loading community questions...
                        </td>
                      </tr>
                    ) : filteredQuestions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400">
                          No questions matching the selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredQuestions.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-4 max-w-sm">
                            <Link
                              href={`/community/questions/${q.slug}`}
                              target="_blank"
                              className="font-bold text-slate-900 hover:text-[#FF5500] line-clamp-1 block mb-0.5"
                            >
                              {q.title}
                            </Link>
                            <span className="text-[11px] text-slate-400 line-clamp-1">
                              {q.content?.replace(/\$+/g, '').substring(0, 90)}...
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-semibold text-slate-800 block">
                              {q.author_name || 'HSC Student'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {q.author_role}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                              {q.category_name || 'General'}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                            <div className="flex items-center gap-2">
                              <span>↑ {q.vote_count || 0}</span>
                              <span>·</span>
                              <span>💬 {q.answer_count || 0}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                q.status === 'published'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : q.status === 'hidden'
                                  ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                  : q.status === 'flagged'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {q.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              {q.status !== 'published' ? (
                                <button
                                  type="button"
                                  onClick={() => handleModerateQuestion(q.id, 'restore')}
                                  title="Restore & Publish"
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleModerateQuestion(q.id, 'hide')}
                                  title="Hide from public feed"
                                  className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                                >
                                  <EyeOff className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleModerateQuestion(q.id, 'flag')}
                                title="Flag as suspicious"
                                className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition cursor-pointer"
                              >
                                <Flag className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleModerateQuestion(q.id, 'delete')}
                                title="Soft delete"
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
          </div>
        )}

        {/* ── TAB 2: REPORTS QUEUE ── */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Flag className="w-4 h-4 text-rose-500" />
              <span>Reported Content Queue</span>
            </h3>

            {loading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading reports...</p>
            ) : reports.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-xs font-semibold text-slate-600">No pending reports</p>
                <p className="text-[11px] text-slate-400">The community content is healthy and clear.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold uppercase text-[10px]">
                          {r.reason}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          Reported on {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {r.question_title && (
                        <p className="font-bold text-slate-900">
                          Question: {r.question_title}
                        </p>
                      )}
                      {r.description && (
                        <p className="text-slate-600 italic">
                          "{r.description}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleResolveReport(r.id, 'dismiss')}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleResolveReport(r.id, 'resolve')}
                        className="px-3 py-1.5 rounded-lg bg-[#FF5500] hover:bg-[#E64D00] text-white font-bold cursor-pointer"
                      >
                        Action Taken
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: CONTRIBUTORS & BADGES ── */}
        {activeTab === 'contributors' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#FF5500]" />
                <span>Verified Mentors & Educators</span>
              </h3>
              <p className="text-xs text-slate-500">
                Manage badges that appear next to author handles in the community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Teacher Badge</span>
                </div>
                <p className="text-xs text-slate-600">
                  Assigned to experienced admission instructors, college lecturers, and subject experts.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/50 space-y-2">
                <div className="flex items-center gap-2 text-[#FF5500] font-bold text-xs">
                  <Award className="w-4 h-4 text-[#FF5500]" />
                  <span>Senior Mentor Badge</span>
                </div>
                <p className="text-xs text-slate-600">
                  Assigned to top-scoring university seniors (e.g. BUET, DU, Medical) guiding HSC aspirants.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span>Student Contributor</span>
                </div>
                <p className="text-xs text-slate-600">
                  Default role for everyone asking questions and collaborating without authentication.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: CATEGORIES ── */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#FF5500]" />
              <span>Community Categories</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <div key={cat.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color || '#FF5500' }}
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">{cat.name}</span>
                      <span className="text-[11px] text-slate-400">{cat.description}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 font-mono text-[11px] text-slate-600 font-semibold">
                    {cat.question_count || 0} questions
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
