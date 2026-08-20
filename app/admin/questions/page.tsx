'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  BookOpen,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Edit,
  Eye,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminQuestionsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
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

  return (
    <AdminShell
      pageTitle="Question Bank & MCQ Management"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Questions' }]}
      actions={
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary btn-sm font-semibold shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Question</span>
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--eg-text-muted)]" />
            <input
              type="text"
              placeholder="Search question bank by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="eg-input pl-9"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="eg-input w-auto text-xs font-medium"
            >
              <option value="All">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Higher Math">Higher Math</option>
            </select>
          </div>
        </div>

        {/* Questions Table */}
        <div className="eg-card p-0 overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left admin-table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Subject • Chapter</th>
                  <th>Difficulty</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id}>
                    <td className="max-w-md">
                      <div className="font-semibold text-xs text-[var(--eg-text-primary)] truncate">
                        {q.text}
                      </div>
                      <div className="text-caption text-[var(--eg-text-muted)]">{q.topic}</div>
                    </td>
                    <td>
                      <div className="text-xs font-medium text-[var(--eg-text-primary)]">{q.subject}</div>
                      <div className="text-caption text-[var(--eg-text-muted)]">{q.chapter}</div>
                    </td>
                    <td>
                      <Badge
                        variant={q.difficulty === 'Easy' ? 'success' : q.difficulty === 'Medium' ? 'default' : 'error'}
                        size="sm"
                      >
                        {q.difficulty}
                      </Badge>
                    </td>
                    <td className="text-caption font-semibold text-[var(--eg-text-secondary)]">{q.source}</td>
                    <td>
                      <Badge variant="success" size="sm">{q.status}</Badge>
                    </td>
                    <td className="text-caption text-[var(--eg-text-muted)]">{q.updated}</td>
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

        {/* Modal: Add MCQ */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[var(--eg-surface)] border border-[var(--eg-border)] rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-modal max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[var(--eg-border)] pb-3">
                <h3 className="font-bold text-lg text-[var(--eg-text-primary)]">
                  Create Practice MCQ with Explanation
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-xs text-[var(--eg-text-muted)]">
                  Close
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  <div>
                    <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Difficulty</label>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="eg-input">
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Question Text (Bangla / English) *</label>
                  <textarea
                    rows={3}
                    required
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    placeholder="Enter question text..."
                    className="eg-input h-auto py-2"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {opts.map((opt, i) => (
                    <div key={i}>
                      <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Option {String.fromCharCode(65 + i)}</label>
                      <input
                        value={opt}
                        onChange={(e) => {
                          const n = [...opts];
                          n[i] = e.target.value;
                          setOpts(n);
                        }}
                        className="eg-input"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Correct Option</label>
                    <select
                      value={correctIdx}
                      onChange={(e) => setCorrectIdx(Number(e.target.value))}
                      className="eg-input"
                    >
                      {opts.map((_, i) => (
                        <option key={i} value={i}>Option {String.fromCharCode(65 + i)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Past Admission Source Tag</label>
                    <input
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      placeholder="e.g. BUET 2023"
                      className="eg-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Step-by-Step Solution Explanation</label>
                  <textarea
                    rows={3}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Detailed explanation..."
                    className="eg-input h-auto py-2"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm font-semibold">
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
