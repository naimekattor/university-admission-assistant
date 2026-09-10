'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  Calendar,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  ExternalLink,
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
  ChevronRight,
  X,
  FileText,
  BadgeAlert,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/custom-toast';

interface CircularItem {
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
  resultDate?: string | null;
  officialUrl?: string | null;
  summary?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UniversityOption {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  location?: string;
}

export default function AdminCircularsPage() {
  const toast = useToast();
  const [circulars, setCirculars] = useState<CircularItem[]>([]);
  const [universities, setUniversities] = useState<UniversityOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState('All');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formUniversityId, setFormUniversityId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formUnit, setFormUnit] = useState('Ka Unit');
  const [formUnitName, setFormUnitName] = useState('');
  const [formSession, setFormSession] = useState('2025-2026');
  const [formYear, setFormYear] = useState(2026);
  const [formGroup, setFormGroup] = useState('Science');
  const [formMinSscGpa, setFormMinSscGpa] = useState<number>(3.5);
  const [formMinHscGpa, setFormMinHscGpa] = useState<number>(3.5);
  const [formMinCombinedGpa, setFormMinCombinedGpa] = useState<number>(7.5);
  const [formAllowSecondTime, setFormAllowSecondTime] = useState(false);
  const [formTotalSeats, setFormTotalSeats] = useState<number>(100);
  const [formApplicationFee, setFormApplicationFee] = useState<number>(1000);
  const [formStatus, setFormStatus] = useState('active');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formExamDate, setFormExamDate] = useState('');
  const [formOfficialUrl, setFormOfficialUrl] = useState('');
  const [formSummary, setFormSummary] = useState('');

  // Delete Dialog State
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    id: string | null;
    title: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    id: null,
    title: '',
    isDeleting: false,
  });

  // Fetch circulars & universities
  const loadData = async () => {
    try {
      setLoading(true);
      const [resCirc, resUnis] = await Promise.all([
        fetch('/api/v1/admin/circulars'),
        fetch('/api/v1/admin/universities/dropdown'),
      ]);

      if (resCirc.ok) {
        const json = await resCirc.json();
        if (json.data && Array.isArray(json.data)) {
          setCirculars(json.data);
        }
      }

      if (resUnis.ok) {
        const json = await resUnis.json();
        if (json.data && Array.isArray(json.data)) {
          setUniversities(json.data);
          if (json.data.length > 0 && !formUniversityId) {
            setFormUniversityId(json.data[0].id);
          }
        }
      }
    } catch (err: any) {
      console.error('Error loading circulars:', err);
      toast.error('Failed to load admission circulars from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered circulars
  const filteredCirculars = useMemo(() => {
    return circulars.filter((c) => {
      const matchesSearch =
        c.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.universityShortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSession = selectedSession === 'All' || c.session === selectedSession;
      const matchesGroup = selectedGroup === 'All' || c.group === selectedGroup;
      const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;

      return matchesSearch && matchesSession && matchesGroup && matchesStatus;
    });
  }, [circulars, searchQuery, selectedSession, selectedGroup, selectedStatus]);

  // Compute KPI metrics
  const stats = useMemo(() => {
    const activeCount = circulars.filter((c) => c.status === 'active').length;
    const secondTimeCount = circulars.filter((c) => c.allowSecondTime).length;
    const totalSeats = circulars.reduce((sum, c) => sum + (c.totalSeats || 0), 0);

    const now = new Date().getTime();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const closingSoon = circulars.filter((c) => {
      if (!c.applicationEndDate) return false;
      const end = new Date(c.applicationEndDate).getTime();
      return end > now && end - now <= thirtyDaysMs;
    }).length;

    return { activeCount, secondTimeCount, totalSeats, closingSoon };
  }, [circulars]);

  // Handle open create modal
  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    if (universities.length > 0) {
      setFormUniversityId(universities[0].id);
    }
    setFormTitle('');
    setFormUnit('Ka Unit');
    setFormUnitName('');
    setFormSession('2025-2026');
    setFormYear(2026);
    setFormGroup('Science');
    setFormMinSscGpa(3.5);
    setFormMinHscGpa(3.5);
    setFormMinCombinedGpa(7.5);
    setFormAllowSecondTime(false);
    setFormTotalSeats(100);
    setFormApplicationFee(1000);
    setFormStatus('active');
    setFormStartDate('');
    setFormEndDate('');
    setFormExamDate('');
    setFormOfficialUrl('');
    setFormSummary('');
    setModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (c: CircularItem) => {
    setIsEditing(true);
    setEditingId(c.id);
    setFormUniversityId(c.universityId);
    setFormTitle(c.title);
    setFormUnit(c.unit);
    setFormUnitName(c.unitName);
    setFormSession(c.session);
    setFormYear(c.year);
    setFormGroup(c.group);
    setFormMinSscGpa(c.minSscGpa);
    setFormMinHscGpa(c.minHscGpa);
    setFormMinCombinedGpa(c.minCombinedGpa);
    setFormAllowSecondTime(c.allowSecondTime);
    setFormTotalSeats(c.totalSeats);
    setFormApplicationFee(c.applicationFee);
    setFormStatus(c.status);
    setFormStartDate(c.applicationStartDate ? c.applicationStartDate.slice(0, 10) : '');
    setFormEndDate(c.applicationEndDate ? c.applicationEndDate.slice(0, 10) : '');
    setFormExamDate(c.examDate ? c.examDate.slice(0, 10) : '');
    setFormOfficialUrl(c.officialUrl || '');
    setFormSummary(c.summary || '');
    setModalOpen(true);
  };

  // Submit save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUniversityId) {
      toast.error('Please select a university.');
      return;
    }
    if (!formTitle.trim()) {
      toast.error('Please provide a circular title.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        universityId: formUniversityId,
        title: formTitle.trim(),
        unit: formUnit.trim(),
        unitName: formUnitName.trim() || formTitle.trim(),
        session: formSession,
        year: formYear,
        group: formGroup,
        allowedGroups: [formGroup],
        minSscGpa: Number(formMinSscGpa),
        minHscGpa: Number(formMinHscGpa),
        minCombinedGpa: Number(formMinCombinedGpa),
        allowSecondTime: formAllowSecondTime,
        totalSeats: Number(formTotalSeats),
        applicationFee: Number(formApplicationFee),
        status: formStatus,
        applicationStartDate: formStartDate ? new Date(formStartDate).toISOString() : null,
        applicationEndDate: formEndDate ? new Date(formEndDate).toISOString() : null,
        examDate: formExamDate ? new Date(formExamDate).toISOString() : null,
        officialUrl: formOfficialUrl.trim() || null,
        summary: formSummary.trim() || null,
      };

      const url = isEditing
        ? `/api/v1/admin/circulars/${editingId}`
        : '/api/v1/admin/circulars';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Server returned an error response.');
      }

      toast.success(
        isEditing
          ? 'Admission circular and eligibility rules updated!'
          : 'New circular created and synced with eligibility engine!'
      );
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      console.error('Error saving circular:', err);
      toast.error(err.message || 'Failed to save circular.');
    } finally {
      setSaving(false);
    }
  };

  // Confirm and delete
  const handleDeleteConfirm = async () => {
    if (!deleteDialog.id) return;
    setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));

    try {
      const res = await fetch(`/api/v1/admin/circulars/${deleteDialog.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete circular.');

      toast.success('Circular deleted successfully.');
      setDeleteDialog({ isOpen: false, id: null, title: '', isDeleting: false });
      loadData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to delete circular.');
      setDeleteDialog((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Format countdown badge helper
  const renderDeadlineBadge = (endDateStr?: string | null) => {
    if (!endDateStr) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
          <Clock className="w-3 h-3" />
          <span>Deadline TBA</span>
        </span>
      );
    }

    const end = new Date(endDateStr);
    const now = new Date();
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-slate-700">
            {end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded w-fit mt-0.5">
            Application Closed
          </span>
        </div>
      );
    }

    if (diffDays <= 7) {
      return (
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-slate-800">
            {end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded w-fit mt-0.5 animate-pulse">
            <Clock className="w-3 h-3" />
            <span>Closes in {diffDays} {diffDays === 1 ? 'day' : 'days'}!</span>
          </span>
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <span className="text-[11px] font-semibold text-slate-800">
          {end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded w-fit mt-0.5">
          <Clock className="w-3 h-3 text-amber-500" />
          <span>{diffDays} days left</span>
        </span>
      </div>
    );
  };

  return (
    <AdminShell
      pageTitle="Admission Circulars & Exam Deadlines"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Circulars & Deadlines' }]}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#FF5500]' : ''}`} />
            <span>Sync</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-1.5 rounded-lg bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Circular</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Circulars</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.activeCount}</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live in student qualifier
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Closing Within 30 Days</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.closingSoon}</h3>
              <p className="text-[11px] text-amber-600 font-semibold mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500" />
                Urgent student deadlines
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Monitored Seats</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalSeats.toLocaleString()}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Across all official units</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">2nd-Time Permitted</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.secondTimeCount}</h3>
              <p className="text-[11px] text-[#FF5500] font-semibold mt-0.5">Second timer eligible</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#FF5500] flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by university, short name, unit (e.g. BUET, Ka Unit)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Groups</option>
              <option value="Science">Science (বিজ্ঞান)</option>
              <option value="Commerce">Commerce (বাণিজ্য)</option>
              <option value="Humanities">Humanities (মানবিক)</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active Circulars</option>
              <option value="upcoming">Upcoming</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Circulars Table */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">University & Unit</th>
                  <th className="py-3 px-4">Group & Stream</th>
                  <th className="py-3 px-4">Eligibility Cutoff</th>
                  <th className="py-3 px-4">Application Window</th>
                  <th className="py-3 px-4">Exam Schedule</th>
                  <th className="py-3 px-4">Seats & Fee</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#FF5500] mb-2" />
                      <span>Loading unified admission circulars...</span>
                    </td>
                  </tr>
                ) : filteredCirculars.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-700">No admission circulars found</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Try adjusting your search filter or click "+ Add Circular" to create one.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredCirculars.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition">
                      {/* University & Unit */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-base shrink-0 shadow-2xs border border-slate-200/60 overflow-hidden p-0.5">
                            {c.universityLogo && (c.universityLogo.startsWith('http') || c.universityLogo.startsWith('/')) ? (
                              <img
                                src={c.universityLogo}
                                alt={`${c.universityShortName || 'University'} logo`}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  if (e.currentTarget.nextElementSibling) {
                                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                                  }
                                }}
                              />
                            ) : null}
                            <span className={`${c.universityLogo && (c.universityLogo.startsWith('http') || c.universityLogo.startsWith('/')) ? 'hidden' : 'block'}`}>
                              {c.universityLogo || '🏛️'}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-xs">{c.universityShortName}</span>
                              <span className="text-[10px] text-slate-400">• {c.session}</span>
                            </div>
                            <p className="text-[11px] font-semibold text-[#FF5500] leading-tight mt-0.5">
                              {c.unitName || c.unit}
                            </p>
                            <p className="text-[10px] text-slate-400 line-clamp-1 max-w-[200px] mt-0.5">
                              {c.universityName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Group & Stream */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {c.group}
                        </span>
                      </td>

                      {/* Eligibility Cutoff */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-semibold text-slate-800">
                            SSC {c.minSscGpa.toFixed(2)} • HSC {c.minHscGpa.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-slate-500">
                              Total ≥ {c.minCombinedGpa.toFixed(2)}
                            </span>
                            {c.allowSecondTime ? (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700">
                                2nd Time
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-500">
                                1st Time Only
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Application Window */}
                      <td className="py-3.5 px-4">{renderDeadlineBadge(c.applicationEndDate)}</td>

                      {/* Exam Schedule */}
                      <td className="py-3.5 px-4">
                        {c.examDate ? (
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-800">
                            <Calendar className="w-3.5 h-3.5 text-[#FF5500]" />
                            <span>
                              {new Date(c.examDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Exam date TBA</span>
                        )}
                      </td>

                      {/* Seats & Fee */}
                      <td className="py-3.5 px-4">
                        <div className="text-[11px]">
                          <span className="font-bold text-slate-900">{c.totalSeats.toLocaleString()}</span>{' '}
                          <span className="text-slate-400">Seats</span>
                          <p className="text-[10px] text-slate-500 mt-0.5">৳{c.applicationFee.toLocaleString()} fee</p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${c.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : c.status === 'upcoming'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : c.status === 'closed'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {c.officialUrl && (
                            <a
                              href={c.officialUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                              title="Official Circular Link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF5500] hover:bg-orange-50 transition cursor-pointer"
                            title="Edit Circular"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteDialog({
                                isOpen: true,
                                id: c.id,
                                title: `${c.universityShortName} - ${c.unit}`,
                                isDeleting: false,
                              })
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Circular"
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

        {/* Informative Footer Box */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Single Source of Truth:</strong> Circular deadlines and eligibility parameters configured here
            directly synchronize with the student-facing <strong>Instant Admission Qualifier</strong> (on the homepage)
            and the <strong>Eligibility Rules directory</strong> (<code className="text-[#FF5500]">/admin/eligibility</code>).
          </p>
        </div>
      </div>

      {/* CREATE / EDIT CIRCULAR MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#FF5500]" />
                  <span>{isEditing ? 'Edit Admission Circular' : 'Add New Admission Circular'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure official unit circular dates, seats, and eligibility criteria.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Section 1: University & Unit Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span>1. University & Unit Identity</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">University *</label>
                    <select
                      value={formUniversityId}
                      onChange={(e) => setFormUniversityId(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                    >
                      {universities.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.shortName} — {u.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Code *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ka Unit, A Unit, Engineering"
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Full Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ka Unit (Faculty of Science & Tech)"
                      value={formUnitName}
                      onChange={(e) => setFormUnitName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Circular Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. BUET Undergraduate Admission Circular 2025-2026"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Session</label>
                    <input
                      type="text"
                      value={formSession}
                      onChange={(e) => setFormSession(e.target.value)}
                      placeholder="2025-2026"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Group</label>
                    <select
                      value={formGroup}
                      onChange={(e) => setFormGroup(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                    >
                      <option value="Science">Science (বিজ্ঞান)</option>
                      <option value="Commerce">Commerce (বাণিজ্য)</option>
                      <option value="Humanities">Humanities (মানবিক)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Circular Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="closed">Closed</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Integrated Eligibility Thresholds */}
              <div className="space-y-4 p-4 rounded-xl bg-orange-50/40 border border-orange-200/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF5500] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>2. Eligibility Criteria (Powers Student Qualifier)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Min SSC GPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={formMinSscGpa}
                      onChange={(e) => setFormMinSscGpa(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Min HSC GPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={formMinHscGpa}
                      onChange={(e) => setFormMinHscGpa(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Min Combined GPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={formMinCombinedGpa}
                      onChange={(e) => setFormMinCombinedGpa(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <label className="relative flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formAllowSecondTime}
                      onChange={(e) => setFormAllowSecondTime(e.target.checked)}
                      className="w-4 h-4 rounded text-[#FF5500] focus:ring-[#FF5500] border-slate-300 cursor-pointer"
                    />
                    <span>Allow Second-Time Applicants (২য় বার ভর্তি পরীক্ষা দেওয়ার সুযোগ আছে)</span>
                  </label>
                </div>
              </div>

              {/* Section 3: Deadlines & Schedules */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span>3. Schedules, Deadlines & Capacity</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Application Start</label>
                    <input
                      type="date"
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Application Deadline</label>
                    <input
                      type="date"
                      value={formEndDate}
                      onChange={(e) => setFormEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Admission Exam Date</label>
                    <input
                      type="date"
                      value={formExamDate}
                      onChange={(e) => setFormExamDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Total Unit Seats</label>
                    <input
                      type="number"
                      value={formTotalSeats}
                      onChange={(e) => setFormTotalSeats(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Application Fee (BDT)</label>
                    <input
                      type="number"
                      value={formApplicationFee}
                      onChange={(e) => setFormApplicationFee(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Circular URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formOfficialUrl}
                      onChange={(e) => setFormOfficialUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Summary / Instructions</label>
                  <textarea
                    rows={2}
                    placeholder="Short description of special requirements, quota rules, or marks deduction..."
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEditing ? 'Save Changes' : 'Publish Circular'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Delete Admission Circular?</h4>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete circular for{' '}
              <strong className="text-slate-900">{deleteDialog.title}</strong>? It will immediately stop appearing in the
              student eligibility engine.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteDialog({ isOpen: false, id: null, title: '', isDeleting: false })}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteDialog.isDeleting}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-60"
              >
                {deleteDialog.isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Circular</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
