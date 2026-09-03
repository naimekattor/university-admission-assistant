'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  GraduationCap,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Trash2,
  Edit,
  ExternalLink,
  Calendar,
  CheckCircle2,
  MapPin,
  Building2,
  Users,
  AlertTriangle,
  Loader2,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/components/ui/custom-toast';
import { RichTextEditor } from '@/components/rich-text/rich-text-editor';
import { UnifiedImageUploader } from '@/components/ui/unified-image-uploader';

interface FacilityItem {
  title: string;
  icon?: string;
  description: string;
}

const DEFAULT_FACILITIES: FacilityItem[] = [
  { title: 'Central Library', icon: '📚', description: 'Extensive repository of textbooks, digital journals, IEEE archives, and quiet study zones.' },
  { title: 'Residential Halls', icon: '🏢', description: 'On-campus dormitories providing secure accommodation, dining halls, and common rooms.' },
  { title: 'Advanced Laboratories', icon: '🔬', description: 'Modern computing clusters, physics, chemical, and engineering labs for research.' },
  { title: 'Clubs & Student Societies', icon: '🎭', description: 'Robotics clubs, debating societies, photographic societies, and cultural teams.' },
  { title: 'Sports & Gymnasium', icon: '⚽', description: 'Football grounds, basketball courts, and indoor gymnasiums for inter-departmental tournaments.' },
  { title: 'Medical Center', icon: '🏥', description: 'Free primary healthcare, ambulance services, and consultation facilities for all enrolled students.' },
];

interface UniversityItem {
  id: string;
  name: string;
  shortName: string;
  slug?: string;
  location: string;
  logo: string;
  foundedYear?: number;
  admissionType?: string;
  cutoffMarks?: number;
  group?: string;
  applicationWindow?: string;
  testDate?: string;
  minGpa?: string;
  units?: string;
  seats?: number;
  status?: string;
  website?: string;
  description?: string;
  campusArea?: string;
  studentCount?: string;
  facultyCount?: string;
  hallsCount?: string;
  culture?: string;
  gallery?: string[];
  facilities?: FacilityItem[];
  circularsCount?: number;
  programsCount?: number;
  metadata?: any;
}

export default function AdminUniversitiesPage() {
  const toast = useToast();
  const [universitiesList, setUniversitiesList] = useState<UniversityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'identity' | 'scale' | 'culture' | 'facilities' | 'gallery'>('identity');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields: Core Identity
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [location, setLocation] = useState('');
  const [group, setGroup] = useState('Science');
  const [website, setWebsite] = useState('');
  const [logo, setLogo] = useState('🏛️');
  const [foundedYear, setFoundedYear] = useState(1950);
  const [description, setDescription] = useState('');

  // Form Fields: Scale & Numbers
  const [campusArea, setCampusArea] = useState('85 Acres');
  const [studentCount, setStudentCount] = useState('10,500+');
  const [facultyCount, setFacultyCount] = useState('650+');
  const [hallsCount, setHallsCount] = useState('8 Halls');

  // Form Fields: Culture & Traditions
  const [culture, setCulture] = useState('');

  // Form Fields: Dynamic Facilities
  const [facilities, setFacilities] = useState<FacilityItem[]>(DEFAULT_FACILITIES);

  // Form Fields: Gallery Images
  const [gallery, setGallery] = useState<string[]>([]);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  // Delete Dialog State
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    isDeleting?: boolean;
    onConfirm: () => Promise<void> | void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Yes, delete university',
    isDeleting: false,
    onConfirm: () => { },
  });

  const loadUniversities = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/universities');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setUniversitiesList(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to load universities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUniversities();
  }, []);

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setModalTab('identity');
    setName('');
    setShortName('');
    setLocation('Dhaka');
    setGroup('Science');
    setWebsite('https://');
    setLogo('🏛️');
    setFoundedYear(1950);
    setDescription('');
    setCampusArea('85 Acres');
    setStudentCount('10,500+');
    setFacultyCount('650+');
    setHallsCount('8 Halls');
    setCulture('');
    setFacilities(DEFAULT_FACILITIES);
    setGallery([]);
    setGalleryUrlInput('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (u: UniversityItem) => {
    setIsEditing(true);
    setEditingId(u.id);
    setModalTab('identity');
    setName(u.name || '');
    setShortName(u.shortName || '');
    setLocation(u.location || 'Bangladesh');
    setGroup(u.group || u.admissionType || 'Science');
    setWebsite(u.website || '');
    setLogo(u.logo || '🏛️');
    setFoundedYear(u.foundedYear || 1950);
    setDescription(u.description || u.metadata?.overview || '');

    // Scale & numbers
    setCampusArea(u.campusArea || u.metadata?.campus_area || '85 Acres');
    setStudentCount(u.studentCount || u.metadata?.student_count || '10,500+');
    setFacultyCount(u.facultyCount || u.metadata?.faculty_count || '650+');
    setHallsCount(u.hallsCount || u.metadata?.halls_count || '8 Halls');

    // Culture
    setCulture(u.culture || u.metadata?.culture || '');

    // Facilities
    const existingFacilities = (Array.isArray(u.facilities) && u.facilities.length > 0)
      ? u.facilities
      : (Array.isArray(u.metadata?.facilities) && u.metadata.facilities.length > 0)
        ? u.metadata.facilities
        : DEFAULT_FACILITIES;
    setFacilities(existingFacilities);

    // Gallery
    const existingGallery = (Array.isArray(u.gallery) && u.gallery.length > 0)
      ? u.gallery
      : (Array.isArray(u.metadata?.gallery) && u.metadata.gallery.length > 0)
        ? u.metadata.gallery
        : [];
    setGallery(existingGallery);
    setGalleryUrlInput('');

    setModalOpen(true);
  };

  const handleAddFacility = () => {
    setFacilities([...facilities, { title: 'New Campus Facility', icon: '🏛️', description: 'Facility description and available services for students.' }]);
  };

  const handleUpdateFacility = (index: number, field: keyof FacilityItem, value: string) => {
    const updated = [...facilities];
    updated[index] = { ...updated[index], [field]: value };
    setFacilities(updated);
  };

  const handleRemoveFacility = (index: number) => {
    setFacilities(facilities.filter((_, i) => i !== index));
  };

  const handleAddGalleryImage = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (!gallery.includes(trimmed)) {
      setGallery([...gallery, trimmed]);
    }
    setGalleryUrlInput('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleSaveUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        shortName: shortName.toUpperCase(),
        location,
        group,
        admissionType: group.toLowerCase(),
        website,
        logo,
        foundedYear: Number(foundedYear),
        description,
        campusArea,
        studentCount,
        facultyCount,
        hallsCount,
        culture,
        facilities,
        gallery,
      };

      const url = isEditing && editingId ? `/api/v1/universities/${editingId}` : '/api/v1/universities';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(
          isEditing ? `University "${shortName}" updated successfully!` : `University "${name}" created in PostgreSQL!`,
          isEditing ? 'University Updated' : 'University Created'
        );
        setModalOpen(false);
        await loadUniversities();
      } else {
        toast.error('Failed to save university to database.', 'Database Error');
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred.', 'Save Failed');
    }
  };

  const promptDeleteUni = (id: string, name: string) => {
    setDeleteDialog({
      isOpen: true,
      title: 'Delete University?',
      message: `Are you sure you want to permanently delete "${name}" and all associated circulars & programs from PostgreSQL?`,
      confirmText: 'Yes, delete university',
      onConfirm: async () => {
        setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
        try {
          const res = await fetch(`/api/v1/universities/${id}`, { method: 'DELETE' });
          if (res.ok) {
            toast.success(`University "${name}" deleted.`, 'Deleted');
            await loadUniversities();
          } else {
            toast.error('Failed to delete university from database.', 'Delete Failed');
          }
        } catch {
          toast.error('Error deleting university.', 'Error');
        } finally {
          setDeleteDialog((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
  };

  const filteredUniversities = universitiesList.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      u.name.toLowerCase().includes(q) ||
      u.shortName.toLowerCase().includes(q) ||
      (u.location && u.location.toLowerCase().includes(q));

    let matchesType = true;
    if (selectedType !== 'All') {
      matchesType = u.group === selectedType || u.admissionType === selectedType.toLowerCase();
    }

    return matchesSearch && matchesType;
  });

  return (
    <AdminShell
      pageTitle="University Directory & Intelligence Manager"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Universities' }]}
      actions={
        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add University</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Top Filter & Metrics Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search universities by name, short code, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500] bg-slate-50/50 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5500] bg-slate-50/50 cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Engineering">Engineering</option>
              <option value="Medical">Medical</option>
              <option value="Science">Science & Tech</option>
              <option value="General">General Public</option>
            </select>

            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-xl whitespace-nowrap">
              Total: <strong className="text-slate-900">{filteredUniversities.length}</strong> in PostgreSQL
            </span>
          </div>
        </div>

        {/* Universities Management Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  <th className="py-3 px-4">University</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Units & Group</th>
                  <th className="py-3 px-4">Seats</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Exam Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                      Loading database records...
                    </td>
                  </tr>
                ) : filteredUniversities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                      No universities found. Click "+ Add University" to create a new record.
                    </td>
                  </tr>
                ) : (
                  filteredUniversities.map((u) => {
                    const isOpen = u.status === 'Applications Open';
                    const isOpeningSoon = u.status === 'Opening Soon';
                    const targetSlug = (u.slug || u.shortName || u.id).toLowerCase().trim().replace(/[^a-z0-9]/g, '-');

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-2.5">
                            {u.logo && (u.logo.startsWith('http') || u.logo.startsWith('/')) ? (
                              <img
                                src={u.logo}
                                alt={u.shortName || u.name}
                                className="w-8 h-8 rounded-full object-contain bg-white border border-slate-200 p-0.5 shadow-2xs shrink-0"
                              />
                            ) : (
                              <span className="text-xl shrink-0">{u.logo || '🏛️'}</span>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs font-black text-[#FF5500]">{u.shortName}</span>
                              </div>
                              <span className="text-slate-700 font-medium text-xs line-clamp-1">{u.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{u.location}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-slate-800 font-semibold">{u.units || 'All Units'}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-slate-500 capitalize">{u.group || u.admissionType}</span>
                            {u.circularsCount !== undefined && u.circularsCount > 0 && (
                              <Link
                                href={`/admin/circulars?search=${encodeURIComponent(u.shortName || u.name)}`}
                                className="text-[10px] font-bold text-[#FF5500] hover:underline"
                              >
                                • {u.circularsCount} Unit{u.circularsCount > 1 ? 's' : ''} →
                              </Link>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-900">
                            {u.seats ? Number(u.seats).toLocaleString() : '—'}
                          </span>
                          {u.programsCount !== undefined && u.programsCount > 0 && (
                            <Link
                              href={`/admin/programs?search=${encodeURIComponent(u.shortName || u.name)}`}
                              className="block text-[10px] font-medium text-slate-500 hover:text-slate-900 mt-0.5"
                            >
                              {u.programsCount} Program{u.programsCount > 1 ? 's' : ''} →
                            </Link>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isOpen
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : isOpeningSoon
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : isOpeningSoon ? 'bg-amber-500' : 'bg-slate-400'}`} />
                            <span>{u.status || 'Scheduled'}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">{u.testDate || 'TBA'}</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/universities/${targetSlug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                              title="Preview Details Page"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleOpenEditModal(u)}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                              title="Edit University"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => promptDeleteUni(u.id, u.shortName || u.name)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                              title="Delete University"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── CREATE / EDIT UNIVERSITY MODAL ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {isEditing ? `Edit University Details (${shortName})` : 'Create New Bangladesh University'}
                </h3>
                <p className="text-xs text-slate-500">Save complete admission intelligence directly into PostgreSQL.</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setModalTab('identity')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  modalTab === 'identity'
                    ? 'bg-[#FF5500] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>1. Core Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('scale')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  modalTab === 'scale'
                    ? 'bg-[#FF5500] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>2. Campus Numbers</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('culture')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  modalTab === 'culture'
                    ? 'bg-[#FF5500] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3. Culture & Traditions</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('facilities')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  modalTab === 'facilities'
                    ? 'bg-[#FF5500] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>4. Facilities ({facilities.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('gallery')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  modalTab === 'gallery'
                    ? 'bg-[#FF5500] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>5. Photo Gallery ({gallery.length})</span>
              </button>
            </div>

            <form onSubmit={handleSaveUniversity} className="space-y-4 pt-1">
              {/* ── TAB 1: CORE PROFILE ── */}
              {modalTab === 'identity' && (
                <div className="space-y-4">
                  {/* Guidance Callout */}
                  <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-start gap-2.5 text-xs text-slate-700">
                    <Sparkles className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong className="text-slate-900 font-bold">Unified Admission Architecture:</strong> Units, GPA cutoffs, seats, and deadlines are automatically derived from{' '}
                      <Link href="/admin/circulars" className="text-[#FF5500] font-semibold underline hover:text-[#E04B00]">
                        Circulars
                      </Link>{' '}
                      and{' '}
                      <Link href="/admin/programs" className="text-[#FF5500] font-semibold underline hover:text-[#E04B00]">
                        Programs
                      </Link>
                      . Save all-time institutional profile details here.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-900">University Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Bangladesh University of Engineering and Technology"
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-900">Short Code (Acronym) *</label>
                      <input
                        type="text"
                        required
                        value={shortName}
                        onChange={(e) => setShortName(e.target.value)}
                        placeholder="e.g. BUET, DU"
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-[#FF5500]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-900">Campus City / Location</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Palashi, Dhaka"
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-900">Category Group</label>
                      <select
                        value={group}
                        onChange={(e) => setGroup(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                      >
                        <option value="Science">Science & Engineering</option>
                        <option value="Medical">Medical & Dental</option>
                        <option value="General">General Public</option>
                        <option value="Agriculture">Agricultural Science</option>
                        <option value="All Groups">All Groups</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-900">Founded Year</label>
                      <input
                        type="number"
                        value={foundedYear}
                        onChange={(e) => setFoundedYear(Number(e.target.value))}
                        placeholder="1962"
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-none focus:border-[#FF5500]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-900">Official Portal / Website URL</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://buet.ac.bd"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>

                  {/* University Emblem / Logo Uploader with Emoji Fallback */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>🏛️ University Emblem / Official Logo</span>
                      </label>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Quick Emoji:</span>
                        {['🏛️', '🎓', '🏥', '⚙️', '🌐', '🔬', '📚'].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setLogo(emoji)}
                            className={`px-1.5 py-0.5 rounded text-sm hover:bg-white transition cursor-pointer ${
                              logo === emoji ? 'bg-white shadow-2xs border border-orange-200 scale-110' : ''
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <UnifiedImageUploader
                      value={logo.startsWith('http') || logo.startsWith('/') ? logo : ''}
                      onChange={(url) => setLogo(url || '🏛️')}
                      folder="universities"
                      aspectRatio="square"
                      label=""
                      hint="Upload PNG/SVG/JPG official emblem (saved to 'universities' folder) or paste external logo URL"
                      placeholder="https://... or click to browse image"
                    />

                    {!logo.startsWith('http') && !logo.startsWith('/') && (
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs text-slate-500">Current Emoji Fallback:</span>
                        <span className="text-xl px-2.5 py-0.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                          {logo || '🏛️'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#FF5500]" />
                        <span>Description / Overview (Quill Rich Text Editor)</span>
                      </label>
                      <span className="text-[10px] font-mono text-slate-400">Rich HTML Support</span>
                    </div>
                    <RichTextEditor
                      value={description}
                      onChange={setDescription}
                      placeholder="Provide an overview of faculties, research, campus facilities, and history..."
                      minHeight="140px"
                    />
                  </div>
                </div>
              )}

              {/* ── TAB 2: SCALE & NUMBERS ── */}
              {modalTab === 'scale' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-950 leading-relaxed">
                    <strong>Permanent Institutional Scale:</strong> These statistics represent the enduring campus size and capacity, displayed dynamically in the public university overview.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-900">Campus Area / Size</label>
                      <input
                        type="text"
                        value={campusArea}
                        onChange={(e) => setCampusArea(e.target.value)}
                        placeholder="e.g. 85 Acres, 600 Acres"
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                      />
                      <span className="text-[10px] text-slate-400">Total university physical campus land area</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-900">Total Student Body</label>
                      <input
                        type="text"
                        value={studentCount}
                        onChange={(e) => setStudentCount(e.target.value)}
                        placeholder="e.g. 10,500+ Students"
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                      />
                      <span className="text-[10px] text-slate-400">Current enrolled undergraduate & graduate students</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-900">Faculty Members / Professors</label>
                      <input
                        type="text"
                        value={facultyCount}
                        onChange={(e) => setFacultyCount(e.target.value)}
                        placeholder="e.g. 650+ Faculty"
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                      />
                      <span className="text-[10px] text-slate-400">Academic teachers, researchers, and professors</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-900">Residential Halls / Dormitories</label>
                      <input
                        type="text"
                        value={hallsCount}
                        onChange={(e) => setHallsCount(e.target.value)}
                        placeholder="e.g. 8 Residential Halls"
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                      />
                      <span className="text-[10px] text-slate-400">Number of student residential living halls</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 3: CULTURE & TRADITIONS ── */}
              {modalTab === 'culture' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-slate-900 block">
                        Campus Culture, Student Traditions & Co-Curriculars
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Describe campus life, cultural festivals, student societies, robotics, sports, and debating traditions.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Rich HTML Support</span>
                  </div>

                  <RichTextEditor
                    value={culture}
                    onChange={setCulture}
                    placeholder="Describe student clubs, annual tech fests, inter-hall tournaments, and campus traditions..."
                    minHeight="220px"
                  />
                </div>
              )}

              {/* ── TAB 4: FACILITIES MANAGER ── */}
              {modalTab === 'facilities' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-slate-900 block">
                        Campus Facilities & Infrastructure
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Manage facilities shown dynamically on the public university profile.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddFacility}
                      className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <span>+ Add Facility</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {facilities.map((fac, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 relative group"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={fac.icon || '🏛️'}
                            onChange={(e) => handleUpdateFacility(idx, 'icon', e.target.value)}
                            placeholder="Emoji"
                            className="w-12 h-9 text-center text-lg bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF5500]"
                          />
                          <input
                            type="text"
                            value={fac.title}
                            onChange={(e) => handleUpdateFacility(idx, 'title', e.target.value)}
                            placeholder="Facility Title (e.g. Central Library)"
                            className="flex-1 h-9 px-3 text-xs font-bold bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF5500]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFacility(idx)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Remove facility"
                          >
                            ✕
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          value={fac.description}
                          onChange={(e) => handleUpdateFacility(idx, 'description', e.target.value)}
                          placeholder="Facility description and resources available to students..."
                          className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF5500] resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB 5: PHOTO GALLERY ── */}
              {modalTab === 'gallery' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-900 block">
                      Campus Photo Showcase ({gallery.length} Images)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Upload or paste URLs of iconic campus spots, aerial views, auditoriums, and labs.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <UnifiedImageUploader
                      value=""
                      onChange={(url) => {
                        if (url) handleAddGalleryImage(url);
                      }}
                      folder="universities/gallery"
                      aspectRatio="landscape"
                      label="Upload Campus Photo"
                      hint="Upload high-res JPG/PNG of campus building, library, or auditorium"
                    />

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                      <input
                        type="text"
                        value={galleryUrlInput}
                        onChange={(e) => setGalleryUrlInput(e.target.value)}
                        placeholder="Or paste direct image URL (https://...)"
                        className="flex-1 h-9 px-3 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF5500]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddGalleryImage(galleryUrlInput)}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {gallery.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1">
                      {gallery.map((imgUrl, idx) => (
                        <div key={idx} className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video">
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-950/70 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition cursor-pointer hover:bg-rose-600"
                            title="Remove photo"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                      No campus photos added yet. Upload or paste URLs above.
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Section: <strong className="text-slate-700 capitalize">{modalTab}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition cursor-pointer"
                  >
                    {isEditing ? 'Update University Profile' : 'Save to Database'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CUSTOM SWEETALERT DELETE DIALOG ── */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/10">
              <AlertTriangle className="w-8 h-8 text-rose-600 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">{deleteDialog.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                {deleteDialog.message}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={deleteDialog.isDeleting}
                onClick={() => setDeleteDialog((prev) => ({ ...prev, isOpen: false }))}
                className="px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteDialog.isDeleting}
                onClick={deleteDialog.onConfirm}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {deleteDialog.isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{deleteDialog.confirmText || 'Yes, delete it!'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
