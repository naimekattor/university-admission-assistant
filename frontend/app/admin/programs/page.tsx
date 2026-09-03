'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  Layers,
  PlusCircle,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  GraduationCap,
  Users,
  BookOpen,
  Sparkles,
  Building2,
  Loader2,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/custom-toast';

interface ProgramItem {
  id: string;
  name: string;
  shortCode: string;
  degree: string;
  seats: number;
  description?: string | null;
  duration?: string | null;
  cutoffMarks?: number | null;
  universityId: string;
  universityName: string;
  universityShortName: string;
  universityLogo?: string;
  circularId?: string | null;
  unit?: string | null;
  unitName?: string | null;
  createdAt: string;
}

interface UniversityOption {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  location?: string;
}

interface CircularOption {
  id: string;
  universityId: string;
  unit: string;
  unitName: string;
}

export default function AdminProgramsPage() {
  const toast = useToast();
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [universities, setUniversities] = useState<UniversityOption[]>([]);
  const [circulars, setCirculars] = useState<CircularOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('All');
  const [selectedDegree, setSelectedDegree] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formShortCode, setFormShortCode] = useState('');
  const [formUniversityId, setFormUniversityId] = useState('');
  const [formCircularId, setFormCircularId] = useState('');
  const [formDegree, setFormDegree] = useState('B.Sc. Engg.');
  const [formSeats, setFormSeats] = useState<number>(60);
  const [formDuration, setFormDuration] = useState('4 Years');
  const [formDescription, setFormDescription] = useState('');

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

  // Fetch programs, universities, and circulars
  const loadData = async () => {
    try {
      setLoading(true);
      const [resProg, resUnis, resCirc] = await Promise.all([
        fetch('/api/v1/admin/programs'),
        fetch('/api/v1/admin/universities/dropdown'),
        fetch('/api/v1/admin/circulars'),
      ]);

      if (resProg.ok) {
        const json = await resProg.json();
        if (json.data && Array.isArray(json.data)) {
          setPrograms(json.data);
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

      if (resCirc.ok) {
        const json = await resCirc.json();
        if (json.data && Array.isArray(json.data)) {
          setCirculars(
            json.data.map((c: any) => ({
              id: c.id,
              universityId: c.universityId,
              unit: c.unit,
              unitName: c.unitName || c.unit,
            }))
          );
        }
      }
    } catch (err) {
      console.error('Error loading programs:', err);
      toast.error('Failed to load programs from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered circulars for selected university inside modal
  const availableCircularsForModal = useMemo(() => {
    if (!formUniversityId) return [];
    return circulars.filter((c) => c.universityId === formUniversityId);
  }, [circulars, formUniversityId]);

  // Filtered programs
  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.universityShortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.unit && p.unit.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesUni = selectedUniversity === 'All' || p.universityId === selectedUniversity;
      const matchesDegree = selectedDegree === 'All' || p.degree === selectedDegree;

      return matchesSearch && matchesUni && matchesDegree;
    });
  }, [programs, searchQuery, selectedUniversity, selectedDegree]);

  // Compute KPI Stats
  const stats = useMemo(() => {
    const total = programs.length;
    const totalSeats = programs.reduce((sum, p) => sum + (p.seats || 0), 0);
    const engineering = programs.filter((p) => p.degree.includes('Engg') || p.name.includes('Engineering')).length;
    const healthScience = programs.filter((p) => p.degree.includes('MBBS') || p.degree.includes('B.Sc. (Hons)')).length;
    return { total, totalSeats, engineering, healthScience };
  }, [programs]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormName('');
    setFormShortCode('');
    if (universities.length > 0) {
      setFormUniversityId(universities[0].id);
    }
    setFormCircularId('');
    setFormDegree('B.Sc. Engg.');
    setFormSeats(60);
    setFormDuration('4 Years');
    setFormDescription('');
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (p: ProgramItem) => {
    setIsEditing(true);
    setEditingId(p.id);
    setFormName(p.name);
    setFormShortCode(p.shortCode);
    setFormUniversityId(p.universityId);
    setFormCircularId(p.circularId || '');
    setFormDegree(p.degree);
    setFormSeats(p.seats);
    setFormDuration(p.duration || '4 Years');
    setFormDescription(p.description || '');
    setModalOpen(true);
  };

  // Submit Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUniversityId) {
      toast.error('Please select a university.');
      return;
    }
    if (!formName.trim()) {
      toast.error('Please enter a program name.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        universityId: formUniversityId,
        circularId: formCircularId || null,
        name: formName.trim(),
        shortCode: formShortCode.trim() || null,
        degree: formDegree,
        seats: Number(formSeats),
        duration: formDuration,
        description: formDescription.trim() || null,
      };

      const url = isEditing
        ? `/api/v1/admin/programs/${editingId}`
        : '/api/v1/admin/programs';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save program.');

      toast.success(isEditing ? 'Program updated successfully!' : 'New program created and linked!');
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to save academic program.');
    } finally {
      setSaving(false);
    }
  };

  // Confirm and Delete
  const handleDeleteConfirm = async () => {
    if (!deleteDialog.id) return;
    setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));

    try {
      const res = await fetch(`/api/v1/admin/programs/${deleteDialog.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete program.');

      toast.success('Program deleted successfully.');
      setDeleteDialog({ isOpen: false, id: null, title: '', isDeleting: false });
      loadData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to delete program.');
      setDeleteDialog((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  return (
    <AdminShell
      pageTitle="Academic Programs & Degree Directory"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Programs' }]}
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
            <span>Add Program</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Degree Programs</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.total}</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live in directory
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Allocated Seats</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalSeats.toLocaleString()}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Across all departments</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Engineering & Tech</p>
              <h3 className="text-2xl font-black text-[#FF5500] mt-1">{stats.engineering}</h3>
              <p className="text-[11px] text-[#FF5500] font-semibold mt-0.5">B.Sc. Engg. programs</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#FF5500] flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Medical & Science</p>
              <h3 className="text-2xl font-black text-purple-600 mt-1">{stats.healthScience}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">MBBS & B.Sc. (Hons)</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search programs by name, code (e.g. CSE, Software)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Universities</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.shortName}
                </option>
              ))}
            </select>

            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Degrees</option>
              <option value="B.Sc. Engg.">B.Sc. Engg.</option>
              <option value="B.Sc. (Hons)">B.Sc. (Hons)</option>
              <option value="MBBS">MBBS</option>
              <option value="Bachelor">Bachelor</option>
            </select>
          </div>
        </div>

        {/* Programs Table */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Program & Code</th>
                  <th className="py-3 px-4">University • Unit</th>
                  <th className="py-3 px-4">Degree Title</th>
                  <th className="py-3 px-4">Seat Capacity</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#FF5500] mb-2" />
                      <span>Loading academic programs from database...</span>
                    </td>
                  </tr>
                ) : filteredPrograms.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-700">No programs found</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Try adjusting your filters or click "+ Add Program".
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredPrograms.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      {/* Program & Code */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <span className="px-2 py-1 rounded-lg bg-orange-50 text-[#FF5500] font-mono font-bold text-xs shrink-0 border border-orange-200/60">
                            {p.shortCode}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 text-xs">{p.name}</span>
                            {p.description && (
                              <p className="text-[10px] text-slate-400 line-clamp-1 max-w-[280px] mt-0.5">
                                {p.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* University • Unit */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded flex items-center justify-center overflow-hidden shrink-0">
                            {p.universityLogo && (p.universityLogo.startsWith('http') || p.universityLogo.startsWith('/')) ? (
                              <img
                                src={p.universityLogo}
                                alt=""
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  if (e.currentTarget.nextElementSibling) {
                                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'inline';
                                  }
                                }}
                              />
                            ) : null}
                            <span className={`${p.universityLogo && (p.universityLogo.startsWith('http') || p.universityLogo.startsWith('/')) ? 'hidden' : 'inline'} text-sm`}>
                              {p.universityLogo || '🏛️'}
                            </span>
                          </span>
                          <span className="font-bold text-slate-800">{p.universityShortName}</span>
                          <span className="text-slate-300">•</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                            {p.unit || 'Main Unit'}
                          </span>
                        </div>
                      </td>

                      {/* Degree Title */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {p.degree}
                        </span>
                      </td>

                      {/* Seat Capacity */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 text-xs">
                          {p.seats.toLocaleString()}
                        </span>{' '}
                        <span className="text-[10px] text-slate-400">Seats</span>
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 text-slate-600 text-xs">
                        {p.duration || '4 Years'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF5500] hover:bg-orange-50 transition cursor-pointer"
                            title="Edit Program"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteDialog({
                                isOpen: true,
                                id: p.id,
                                title: `${p.universityShortName} - ${p.name}`,
                                isDeleting: false,
                              })
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Program"
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

        {/* Informative Single Source of Truth Banner */}
        <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/70 text-xs text-orange-900 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Unified Academic Hierarchy:</strong> Each program links directly to its parent <strong>University</strong> and <strong>Unit Circular</strong>.
            Total university capacity is automatically calculated from these department seats.
          </p>
        </div>
      </div>

      {/* CREATE / EDIT PROGRAM MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#FF5500]" />
                  <span>{isEditing ? 'Edit Academic Program' : 'Add Academic Program'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure department title, degree, and seat capacity.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Program Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science & Engineering"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Short Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSE, EEE, SE"
                    value={formShortCode}
                    onChange={(e) => setFormShortCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Degree Title *</label>
                  <select
                    value={formDegree}
                    onChange={(e) => setFormDegree(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#FF5500]"
                  >
                    <option value="B.Sc. Engg.">B.Sc. Engg.</option>
                    <option value="B.Sc. (Hons)">B.Sc. (Hons)</option>
                    <option value="MBBS">MBBS</option>
                    <option value="BBA">BBA</option>
                    <option value="B.Pharm.">B.Pharm.</option>
                    <option value="Bachelor">Bachelor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">University *</label>
                  <select
                    value={formUniversityId}
                    onChange={(e) => {
                      setFormUniversityId(e.target.value);
                      setFormCircularId('');
                    }}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#FF5500]"
                  >
                    {universities.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.shortName} — {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Parent Admission Unit</label>
                  <select
                    value={formCircularId}
                    onChange={(e) => setFormCircularId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#FF5500]"
                  >
                    <option value="">Select Parent Unit...</option>
                    {availableCircularsForModal.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.unitName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Total Seats *</label>
                  <input
                    type="number"
                    min="1"
                    value={formSeats}
                    onChange={(e) => setFormSeats(parseInt(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Program Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 4 Years"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional brief description of the faculty or department..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
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
                  <span>{isEditing ? 'Save Changes' : 'Create Program'}</span>
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
                <h4 className="text-sm font-bold text-slate-900">Delete Academic Program?</h4>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900">{deleteDialog.title}</strong>?
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
                <span>Delete Program</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
