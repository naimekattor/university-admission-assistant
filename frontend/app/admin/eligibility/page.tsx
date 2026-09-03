'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  FileCheck,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  GraduationCap,
  Scale,
  ShieldCheck,
  BookOpen,
  ArrowUpRight,
  Loader2,
  X,
  Sliders,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/custom-toast';

interface EligibilityRuleItem {
  id: string;
  universityId: string;
  universityName: string;
  universityShortName: string;
  universityLogo?: string;
  title: string;
  unit: string;
  unitName: string;
  session: string;
  year: number;
  group: string;
  allowedGroups: string[];
  minSscGpa: number;
  minHscGpa: number;
  minCombinedGpa: number;
  allowSecondTime: boolean;
  allowedPassingYears: number[];
  requiredSubjects?: string[];
  totalSeats: number;
  applicationFee: number;
  status: string;
  applicationStartDate?: string | null;
  applicationEndDate?: string | null;
  examDate?: string | null;
  officialUrl?: string | null;
  summary?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminEligibilityPage() {
  const toast = useToast();
  const [rules, setRules] = useState<EligibilityRuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'science' | 'commerce' | 'humanities' | 'second_time'>('all');

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedRule, setSelectedRule] = useState<EligibilityRuleItem | null>(null);

  // Form Fields
  const [editMinSscGpa, setEditMinSscGpa] = useState<number>(3.5);
  const [editMinHscGpa, setEditMinHscGpa] = useState<number>(3.5);
  const [editMinCombinedGpa, setEditMinCombinedGpa] = useState<number>(7.5);
  const [editAllowSecondTime, setEditAllowSecondTime] = useState(false);
  const [editGroup, setEditGroup] = useState('Science');
  const [editStatus, setEditStatus] = useState('active');

  const loadRules = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/admin/circulars');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setRules(json.data);
        }
      }
    } catch (err: any) {
      console.error('Error loading rules:', err);
      toast.error('Failed to load eligibility rules from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  // Filtered rules
  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      const matchesSearch =
        r.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.universityShortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.unitName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 'science') return r.group === 'Science';
      if (activeTab === 'commerce') return r.group === 'Commerce';
      if (activeTab === 'humanities') return r.group === 'Humanities';
      if (activeTab === 'second_time') return r.allowSecondTime === true;
      return true;
    });
  }, [rules, searchQuery, activeTab]);

  // KPI Stats
  const stats = useMemo(() => {
    const total = rules.length;
    const science = rules.filter((r) => r.group === 'Science').length;
    const commerce = rules.filter((r) => r.group === 'Commerce').length;
    const humanities = rules.filter((r) => r.group === 'Humanities').length;
    const secondTime = rules.filter((r) => r.allowSecondTime).length;
    return { total, science, commerce, humanities, secondTime };
  }, [rules]);

  // Open Edit Modal
  const handleOpenEdit = (r: EligibilityRuleItem) => {
    setSelectedRule(r);
    setEditMinSscGpa(r.minSscGpa);
    setEditMinHscGpa(r.minHscGpa);
    setEditMinCombinedGpa(r.minCombinedGpa);
    setEditAllowSecondTime(r.allowSecondTime);
    setEditGroup(r.group);
    setEditStatus(r.status);
    setEditModalOpen(true);
  };

  // Submit Edit Modal
  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRule) return;

    setSaving(true);
    try {
      const payload = {
        minSscGpa: Number(editMinSscGpa),
        minHscGpa: Number(editMinHscGpa),
        minCombinedGpa: Number(editMinCombinedGpa),
        allowSecondTime: editAllowSecondTime,
        group: editGroup,
        allowedGroups: [editGroup],
        status: editStatus,
      };

      const res = await fetch(`/api/v1/admin/circulars/${selectedRule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update eligibility rule.');

      toast.success(`Updated eligibility rules for ${selectedRule.universityShortName} - ${selectedRule.unit}!`);
      setEditModalOpen(false);
      loadRules();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update rule.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      pageTitle="Deterministic Eligibility Rules Engine"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Eligibility Rules' }]}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={loadRules}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#FF5500]' : ''}`} />
            <span>Sync</span>
          </button>
          <Link
            href="/admin/circulars"
            className="px-3.5 py-1.5 rounded-lg bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Manage in Circulars</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Monitored Units</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.total}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active in Qualifier
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Science Units</p>
            <h3 className="text-2xl font-black text-blue-600 mt-1">{stats.science}</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Engineering & Medical</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Commerce Units</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{stats.commerce}</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Business & IBA</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Humanities Units</p>
            <h3 className="text-2xl font-black text-purple-600 mt-1">{stats.humanities}</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Arts & Social Sciences</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">2nd-Time Permitted</p>
            <h3 className="text-2xl font-black text-[#FF5500] mt-1">{stats.secondTime}</h3>
            <p className="text-[11px] text-[#FF5500] font-semibold mt-0.5">Second timers allowed</p>
          </div>
        </div>

        {/* Informative Rule System Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50/80 via-white to-amber-50/80 border border-orange-200/70 shadow-2xs flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#FF5500]/10 text-[#FF5500] flex items-center justify-center shrink-0 mt-0.5">
            <Scale className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs leading-relaxed text-slate-700">
            <p className="font-bold text-slate-900 text-sm">Deterministic Rule System (Zero Hallucinations)</p>
            <p className="mt-0.5 text-slate-600">
              These threshold parameters directly evaluate students who use the <strong>Instant Admission Qualifier</strong> on the homepage.
              Because this data is unified with <Link href="/admin/circulars" className="text-[#FF5500] font-semibold underline underline-offset-2">/admin/circulars</Link>,
              any adjustment made here automatically updates circulars and live student audits in real time.
            </p>
          </div>
        </div>

        {/* Tabs & Search Toolbar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              All Rules ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('science')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === 'science' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Science ({stats.science})
            </button>
            <button
              onClick={() => setActiveTab('commerce')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === 'commerce' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Commerce ({stats.commerce})
            </button>
            <button
              onClick={() => setActiveTab('humanities')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === 'humanities' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Humanities ({stats.humanities})
            </button>
            <button
              onClick={() => setActiveTab('second_time')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === 'second_time' ? 'bg-white text-[#FF5500] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              2nd-Time ({stats.secondTime})
            </button>
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
            />
          </div>
        </div>

        {/* Rules Table */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">University & Unit</th>
                  <th className="py-3 px-4">Target Group</th>
                  <th className="py-3 px-4">SSC Cutoff</th>
                  <th className="py-3 px-4">HSC Cutoff</th>
                  <th className="py-3 px-4">Combined Threshold</th>
                  <th className="py-3 px-4">Second Time Policy</th>
                  <th className="py-3 px-4">Engine Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#FF5500] mb-2" />
                      <span>Loading deterministic rules from PostgreSQL...</span>
                    </td>
                  </tr>
                ) : filteredRules.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <ShieldCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-700">No eligibility rules found</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Add an admission circular in Circulars & Deadlines to automatically populate this engine.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredRules.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition">
                      {/* University & Unit */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-base shrink-0 shadow-2xs border border-slate-200/60">
                            {r.universityLogo || '🏛️'}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 text-xs">{r.universityShortName}</span>
                            <p className="text-[11px] font-semibold text-[#FF5500] leading-tight mt-0.5">
                              {r.unitName || r.unit}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{r.universityName}</p>
                          </div>
                        </div>
                      </td>

                      {/* Group */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${r.group === 'Science'
                              ? 'bg-blue-50 text-blue-700 border border-blue-100'
                              : r.group === 'Commerce'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-purple-50 text-purple-700 border border-purple-100'
                            }`}
                        >
                          {r.group}
                        </span>
                      </td>

                      {/* SSC Cutoff */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {r.minSscGpa.toFixed(2)}
                        </span>
                      </td>

                      {/* HSC Cutoff */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {r.minHscGpa.toFixed(2)}
                        </span>
                      </td>

                      {/* Combined */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-[#FF5500] bg-orange-50 px-2 py-0.5 rounded text-xs border border-orange-100">
                            ≥ {r.minCombinedGpa.toFixed(2)}
                          </span>
                        </div>
                      </td>

                      {/* Second Time */}
                      <td className="py-3.5 px-4">
                        {r.allowSecondTime ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Allowed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <X className="w-3 h-3 text-rose-500" />
                            <span>1st Time Only</span>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Verified Rule</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(r)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-200 hover:text-[#FF5500] text-slate-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-2xs"
                            title="Edit Rule Cutoffs"
                          >
                            <Sliders className="w-3 h-3 text-[#FF5500]" />
                            <span>Tune</span>
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

      {/* QUICK TUNE ELIGIBILITY RULE MODAL */}
      {editModalOpen && selectedRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#FF5500]" />
                  <span>Tune Eligibility Rules</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedRule.universityShortName} — {selectedRule.unit}
                </p>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="p-5 space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Group</label>
                  <select
                    value={editGroup}
                    onChange={(e) => setEditGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value="Science">Science (বিজ্ঞান)</option>
                    <option value="Commerce">Commerce (বাণিজ্য)</option>
                    <option value="Humanities">Humanities (মানবিক)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Rule Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value="active">Active (Evaluating)</option>
                    <option value="draft">Draft (Paused)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Min SSC</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="5"
                    value={editMinSscGpa}
                    onChange={(e) => setEditMinSscGpa(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-mono font-bold text-slate-900 focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Min HSC</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="5"
                    value={editMinHscGpa}
                    onChange={(e) => setEditMinHscGpa(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-mono font-bold text-slate-900 focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Combined</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={editMinCombinedGpa}
                    onChange={(e) => setEditMinCombinedGpa(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-mono font-bold text-[#FF5500] focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <label className="relative flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={editAllowSecondTime}
                    onChange={(e) => setEditAllowSecondTime(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FF5500] focus:ring-[#FF5500] border-slate-300 cursor-pointer"
                  />
                  <span>Allow Second-Time Applicants (২য় বার ভর্তি পরীক্ষা)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Rule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
