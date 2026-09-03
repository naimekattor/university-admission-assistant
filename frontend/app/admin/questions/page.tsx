'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  BookOpen,
  PlusCircle,
  Search,
  CheckCircle2,
  Trash2,
  Edit,
  Eye,
  HelpCircle,
  Layers,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export default function AdminQuestionsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [msg, setMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Question Form state
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState("Newton's Mechanics");
  const [topic, setTopic] = useState('Impulse & Momentum');
  const [qText, setQText] = useState('');
  const [opts, setOpts] = useState(['8 Ns', '12 Ns', '16 Ns', '20 Ns']);
  const [correctIdx, setCorrectIdx] = useState(1);
  const [explanation, setExplanation] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [source, setSource] = useState('BUET 2023');

  const questions = [
    {
      id: 'q1',
      subject: 'Physics',
      chapter: "Newton's Mechanics",
      topic: 'Impulse & Momentum Integration',
      text: 'একটি 5 kg ভরের বস্তুর ওপর F(t) = (3t^2 + 2) N বল কাজ করছে...',
      difficulty: 'Medium',
      source: 'BUET 2023',
      status: 'Published',
      updated: '1 day ago',
    },
    {
      id: 'q2',
      subject: 'Chemistry',
      chapter: 'Chemical Bonding',
      topic: 'Hybridization Geometry',
      text: 'sp^3d সংকরণ (hybridization)-এর ক্ষেত্রে অণুর জ্যামিতিক আকৃতি কোনটি?',
      difficulty: 'Easy',
      source: 'KUET 2023',
      status: 'Published',
      updated: '2 days ago',
    },
    {
      id: 'q3',
      subject: 'Higher Math',
      chapter: 'Calculus',
      topic: 'Limits & Derivatives',
      text: 'lim (x->0) (sin 5x / x) এর মান কত?',
      difficulty: 'Easy',
      source: 'DU 2022',
      status: 'Published',
      updated: '3 days ago',
    },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ success: true, text: 'Question published to Question Bank successfully!' });
    setShowAddModal(false);
    setQText('');
  };

  const filtered = questions.filter((q) => {
    const matchesSearch =
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || q.subject === selectedSubject;
    const matchesDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesSubject && matchesDiff;
  });

  return (
    <AdminShell
      pageTitle="Question Bank & MCQ Management"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Questions' }]}
      actions={
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:shadow-lg transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Question</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* ── KPI Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Question Bank Size</p>
              <h3 className="text-2xl font-black text-slate-900 font-mono">4,850 MCQs</h3>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Verified with step-by-step solutions
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#FF5500] flex items-center justify-center shadow-2xs shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Practice Attempts</p>
              <h3 className="text-2xl font-black text-slate-900 font-mono">18,450 Solved</h3>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                Across BUET, DU, Medical past questions
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center shadow-2xs shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Core Disciplines</p>
              <h3 className="text-2xl font-black text-slate-900 font-mono">3 Subjects</h3>
              <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                Physics, Chemistry, Higher Math
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center shadow-2xs shrink-0">
              <BookOpen className="w-6 h-6" />
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
              placeholder="Search question bank by keyword, topic, or source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
            >
              <option value="All">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Higher Math">Higher Math</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap pl-1">
              <span className="font-bold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded-full">
                {filtered.length}
              </span>{' '}
              questions
            </span>
          </div>
        </div>

        {/* ── Modern Table Container ── */}
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-5">Question</th>
                  <th className="py-3.5 px-4">Subject • Chapter</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Updated</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-5 max-w-md">
                      <div className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">
                        {q.text}
                      </div>
                      <div className="text-[11px] text-[#FF5500] font-semibold mt-1 flex items-center gap-1">
                        <span>•</span>
                        <span>{q.topic}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900 text-xs">{q.subject}</div>
                      <div className="text-[11px] text-slate-500">{q.chapter}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        {q.source}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {q.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-[11px] font-medium">{q.updated}</td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setQText(q.text);
                            setSubject(q.subject);
                            setChapter(q.chapter);
                            setTopic(q.topic);
                            setShowAddModal(true);
                          }}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-600 border border-slate-200/70 transition shadow-2xs cursor-pointer"
                          title="Edit Question"
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

        {/* ── Modern Create MCQ Modal ── */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white border border-slate-200/90 rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    Create Practice MCQ with Explanation
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add verified question with step-by-step solutions for student tests
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-900 block">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                    >
                      <option>Physics</option>
                      <option>Chemistry</option>
                      <option>Higher Math</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-900 block">Chapter</label>
                    <input
                      value={chapter}
                      onChange={(e) => setChapter(e.target.value)}
                      placeholder="e.g. Newton's Mechanics"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-900 block">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900 block">
                    Question Text (Bangla / English) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    placeholder="Enter question statement or formula..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {opts.map((opt, i) => (
                    <div key={i} className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Option {String.fromCharCode(65 + i)}
                      </label>
                      <input
                        value={opt}
                        onChange={(e) => {
                          const n = [...opts];
                          n[i] = e.target.value;
                          setOpts(n);
                        }}
                        className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-900 block">Correct Option</label>
                    <select
                      value={correctIdx}
                      onChange={(e) => setCorrectIdx(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                    >
                      {opts.map((_, i) => (
                        <option key={i} value={i}>
                          Option {String.fromCharCode(65 + i)} ({opts[i] || 'Empty'})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-900 block">
                      Past Admission Source Tag
                    </label>
                    <input
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      placeholder="e.g. BUET 2023, DU 2024"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900 block">
                    Step-by-Step Solution Explanation
                  </label>
                  <textarea
                    rows={3}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Detailed explanation and formulas for students..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500] resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:shadow-lg transition cursor-pointer"
                  >
                    Publish Question
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
