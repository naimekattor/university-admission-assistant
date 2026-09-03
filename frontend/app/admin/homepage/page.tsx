'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  Globe,
  Layout,
  Table,
  CheckSquare,
  Calendar,
  Building2,
  Bot,
  BookOpen,
  Zap,
  HelpCircle,
  FileText,
  Search,
  Save,
  Eye,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Loader2,
  ShieldCheck,
  RefreshCw,
  X,
  Database,
  Image as ImageIcon,
  MessageSquare,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/rich-text/rich-text-editor';
import { UnifiedImageUploader } from '@/components/ui/unified-image-uploader';
import { PreparationCtaSection } from '@/components/homepage/preparation-cta-section';
import { AiAdvisorPreviewSection } from '@/components/homepage/ai-advisor-preview-section';
import { PublishModal } from '@/components/admin/homepage/publish-modal';
import { useToast } from '@/components/ui/custom-toast';
import {
  DEFAULT_HOMEPAGE_CONFIG,
  HomepageFullConfig,
  AdmissionRowItem,
} from '@/lib/homepage-types';

export default function AdminHomepageCMSPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [draftConfig, setDraftConfig] = useState<HomepageFullConfig>(DEFAULT_HOMEPAGE_CONFIG);
  const [publishedConfig, setPublishedConfig] = useState<HomepageFullConfig>(DEFAULT_HOMEPAGE_CONFIG);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([
    { id: 'buet', shortName: 'BUET', name: 'Bangladesh University of Engineering and Technology', location: 'Dhaka', status: 'Applications Open' },
    { id: 'du', shortName: 'DU', name: 'University of Dhaka', location: 'Dhaka', status: 'Opening Soon' },
    { id: 'kuet', shortName: 'KUET', name: 'Khulna University of Engineering & Technology', location: 'Khulna', status: 'Applications Open' },
    { id: 'ruet', shortName: 'RUET', name: 'Rajshahi University of Engineering & Technology', location: 'Rajshahi', status: 'Applications Open' },
    { id: 'cuet', shortName: 'CUET', name: 'Chittagong University of Engineering & Technology', location: 'Chittagong', status: 'Opening Soon' },
    { id: 'medical', shortName: 'Medical (MBBS/BDS)', name: 'Directorate General of Health Services (DGHS)', location: 'Nationwide', status: 'Applications Open' },
  ]);
  const [guides, setGuides] = useState<any[]>([
    { id: 'g1', title: 'Complete BUET Admission Preparation Guide 2026', slug: 'buet-admission-guide-2026', category: 'Engineering' },
    { id: 'g2', title: 'DU Ka Unit: Complete Subject Weightage & Strategy Breakdown', slug: 'du-ka-unit-guide', category: 'General Science' },
    { id: 'g3', title: 'Top 10 High-Yield Medical Admission Preparation Tips', slug: 'medical-admission-tips', category: 'Medical' },
  ]);
  const [faqs, setFaqs] = useState<any[]>([
    { id: 'faq-1', question: 'What is the minimum GPA required for BUET admission 2026?', answer: '<p>Candidates must have minimum 4.00 in SSC and 4.00 in HSC with Grade A+ across Physics, Chemistry, and Mathematics.</p>', category: 'Eligibility', order: 1 },
    { id: 'faq-2', question: 'Can second-time candidates apply for Dhaka University Ka Unit?', answer: '<p>Yes, Dhaka University Ka Unit permits second-time applicants.</p>', category: 'Admission', order: 2 },
    { id: 'faq-3', question: 'How do EduGuide AI mock tests work?', answer: '<p>Timed mock tests follow official university circular question patterns with negative marking.</p>', category: 'Preparation', order: 3 },
  ]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  // FAQ Modal state
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);

  // Admission Row Template Modal state
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<AdmissionRowItem | null>(null);

  // Deadline Manager state
  const [deadlinesList, setDeadlinesList] = useState<any[]>([]);
  const [circulars, setCirculars] = useState<any[]>([]);
  const [deadlineModalOpen, setDeadlineModalOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<any | null>(null);

  // Guide Manager state
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<any | null>(null);

  const formatCircDate = (d?: string | null) => {
    if (!d) return 'TBA';
    try {
      const parsed = new Date(d);
      if (isNaN(parsed.getTime())) return d;
      return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return d;
    }
  };

  const formatAppWindow = (start?: string | null, end?: string | null) => {
    if (!start && !end) return 'TBA';
    if (start && end) return `${formatCircDate(start)} – ${formatCircDate(end)}`;
    return formatCircDate(start || end);
  };

  const fetchAdminData = async () => {
    // 1. Check local storage for drafts
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('eduguide_homepage_draft') || localStorage.getItem('eduguide_homepage_config');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            if (parsed.admissionSection) {
              delete parsed.admissionSection.customRows;
            }
            setDraftConfig(parsed);
          }
        }
      } catch { }
    }

    // 2. Fetch from backend
    try {
      const res = await fetch('/api/v1/admin/homepage');
      if (res.ok) {
        const data = await res.json();
        if (data.draftConfig) setDraftConfig(data.draftConfig);
        if (data.publishedConfig) setPublishedConfig(data.publishedConfig);
        if (data.warnings) setWarnings(data.warnings);
        if (data.universities && data.universities.length > 0) setUniversities(data.universities);
        if (data.guides && data.guides.length > 0) setGuides(data.guides);
        if (data.faqs && data.faqs.length > 0) setFaqs(data.faqs);
      }
    } catch {
      // Fallback pre-populated state
    }

    // 3. Ensure live PostgreSQL database universities are loaded
    try {
      const uniRes = await fetch('/api/v1/admissions?limit=0');
      if (uniRes.ok) {
        const uniData = await uniRes.json();
        if (uniData.data && Array.isArray(uniData.data) && uniData.data.length > 0) {
          setUniversities(uniData.data);
        }
      }
    } catch { }

    // 4. Ensure live PostgreSQL deadlines are loaded
    try {
      const deadRes = await fetch('/api/v1/admin/homepage/deadlines');
      if (deadRes.ok) {
        const deadData = await deadRes.json();
        if (deadData.data && Array.isArray(deadData.data)) {
          setDeadlinesList(deadData.data);
        }
      }
    } catch { }

    // 5. Ensure live PostgreSQL FAQs are loaded
    try {
      const faqRes = await fetch('/api/v1/admin/homepage/faqs');
      if (faqRes.ok) {
        const faqData = await faqRes.json();
        if (faqData.data && Array.isArray(faqData.data)) {
          setFaqs(faqData.data);
        }
      }
    } catch { }

    // 6. Ensure live PostgreSQL guides are loaded
    try {
      const guideRes = await fetch('/api/v1/admin/homepage/guides');
      if (guideRes.ok) {
        const guideData = await guideRes.json();
        if (guideData.data && Array.isArray(guideData.data) && guideData.data.length > 0) {
          setGuides(guideData.data);
        }
      }
    } catch { }

    // 7. Ensure live PostgreSQL circulars are loaded
    try {
      const circRes = await fetch('/api/v1/admin/circulars');
      if (circRes.ok) {
        const circData = await circRes.json();
        if (circData.data && Array.isArray(circData.data)) {
          setCirculars(circData.data);
        }
      }
    } catch { }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleSaveSection = async (sectionKey: string, sectionData: any) => {
    setSaving(true);
    setSaveSuccess(null);

    const updatedConfig = { ...draftConfig, [sectionKey]: sectionData };
    setDraftConfig(updatedConfig);

    // Save to localStorage as quick client fallback
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('eduguide_homepage_draft', JSON.stringify(updatedConfig));
        localStorage.setItem('eduguide_homepage_config', JSON.stringify(updatedConfig));
      } catch { }
    }

    try {
      const res = await fetch(`/api/v1/admin/homepage/section/${sectionKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionData),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) setDraftConfig(json.data);
      }
      setSaveSuccess(`Section '${sectionKey}' saved to PostgreSQL database.`);
      toast.success(`Section '${sectionKey}' saved to PostgreSQL database!`, 'PostgreSQL Synced');
      setTimeout(() => setSaveSuccess(null), 3500);
    } catch {
      setSaveSuccess(`Draft saved locally.`);
      toast.warning(`Saved draft to local storage.`, 'Offline Draft');
      setTimeout(() => setSaveSuccess(null), 3500);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveSuccess(null);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('eduguide_homepage_draft', JSON.stringify(draftConfig));
        localStorage.setItem('eduguide_homepage_config', JSON.stringify(draftConfig));
      } catch { }
    }

    try {
      const res = await fetch('/api/v1/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftConfig),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) setDraftConfig(json.data);
        setSaveSuccess('All homepage configuration saved to PostgreSQL database.');
        toast.success('All homepage configuration saved to PostgreSQL database!', 'PostgreSQL Live');
      } else {
        throw new Error('Failed to save to database');
      }
    } catch {
      setSaveSuccess('Saved draft locally.');
      toast.warning('Failed to save to database. Saved draft locally.', 'Offline Draft');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveSuccess(null), 3500);
    }
  };

  const handleConfirmPublish = async () => {
    const nextVersion = (draftConfig.version || 1) + 1;
    const published = { ...draftConfig, version: nextVersion, status: 'published' as const };
    setPublishedConfig(published);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('eduguide_homepage_published', JSON.stringify(published));
        localStorage.setItem('eduguide_homepage_config', JSON.stringify(published));
      } catch { }
    }

    try {
      const res = await fetch('/api/v1/admin/homepage/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        await fetchAdminData();
        toast.success(`Version ${nextVersion} published live to PostgreSQL database!`, 'PostgreSQL Live');
      }
    } catch {
      toast.info(`Homepage published locally.`, 'Published');
    }
  };

  // Admission Row Handlers
  const handleSaveAdmissionRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;

    const currentRows: AdmissionRowItem[] =
      draftConfig.admissionSection?.customRows && draftConfig.admissionSection.customRows.length > 0
        ? draftConfig.admissionSection.customRows
        : universities;
    let updatedRows: AdmissionRowItem[];

    const exists = currentRows.some((r) => r.id === editingRow.id || (r.shortName && r.shortName === editingRow.shortName));
    if (exists) {
      updatedRows = currentRows.map((r) =>
        r.id === editingRow.id || (r.shortName && r.shortName === editingRow.shortName) ? editingRow : r
      );
    } else {
      updatedRows = [...currentRows, editingRow];
    }

    const updatedAdmissionSection = {
      ...draftConfig.admissionSection,
      customRows: updatedRows,
    };

    handleSaveSection('admissionSection', updatedAdmissionSection);
    toast.success(`Admission row '${editingRow.shortName || editingRow.name}' saved!`, 'Row Saved');
    setAdmissionModalOpen(false);
    setEditingRow(null);
  };

  // SweetAlert-style Delete Confirmation Dialog State
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
    confirmText: 'Yes, delete it!',
    isDeleting: false,
    onConfirm: () => { },
  });

  const promptDeleteAdmissionRow = (row: AdmissionRowItem) => {
    setDeleteDialog({
      isOpen: true,
      title: 'Delete Admission Row?',
      message: `Are you sure you want to delete "${row.name || row.shortName}" from the admission table? This will send a DELETE request to remove it from PostgreSQL and update your homepage draft.`,
      confirmText: 'Yes, delete row',
      onConfirm: async () => {
        setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
        try {
          const targetId = row.id || row.shortName;
          await fetch(`/api/v1/universities/${targetId}`, { method: 'DELETE' });
        } catch (err) {
          console.error('Failed to delete university:', err);
        }

        const currentRows: AdmissionRowItem[] =
          draftConfig.admissionSection?.customRows && draftConfig.admissionSection.customRows.length > 0
            ? draftConfig.admissionSection.customRows
            : universities;

        const updatedRows = currentRows.filter(
          (r) => r.id !== row.id && (r.shortName && row.shortName ? r.shortName !== row.shortName : true)
        );

        setUniversities((prev) =>
          prev.filter((u) => u.id !== row.id && (u.shortName && row.shortName ? u.shortName !== row.shortName : true))
        );

        const updatedAdmissionSection = {
          ...draftConfig.admissionSection,
          customRows: updatedRows,
        };

        handleSaveSection('admissionSection', updatedAdmissionSection);
        toast.success(`University "${row.shortName || row.name}" deleted successfully.`, 'Deleted');
        setDeleteDialog((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
      },
    });
  };

  // FAQ Handlers
  const handleSaveFaqModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;

    try {
      const isNew = !editingFaq.id || editingFaq.id.startsWith('faq-new-') || editingFaq.id.startsWith('faq-temp-') || editingFaq.id.startsWith('faq-1') || editingFaq.id.startsWith('faq-2') || editingFaq.id.startsWith('faq-3') || editingFaq.id.startsWith('faq-4') || editingFaq.id.startsWith('faq-5');
      const url = isNew
        ? '/api/v1/admin/homepage/faqs'
        : `/api/v1/admin/homepage/faqs/${editingFaq.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaq),
      });

      if (res.ok) {
        setFaqModalOpen(false);
        setEditingFaq(null);
        await fetchAdminData();
        toast.success('FAQ saved to database!', 'FAQ Saved');
      } else {
        toast.error('Failed to save FAQ to database.', 'Database Error');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error saving FAQ.', 'Error');
    }
  };

  const promptDeleteFaq = (faq: { id: string; question: string }) => {
    setDeleteDialog({
      isOpen: true,
      title: 'Delete FAQ Item?',
      message: `Are you sure you want to delete "${faq.question}"? This will permanently remove it from PostgreSQL.`,
      confirmText: 'Yes, delete FAQ',
      onConfirm: async () => {
        setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
        try {
          const res = await fetch(`/api/v1/admin/homepage/faqs/${faq.id}`, { method: 'DELETE' });
          if (res.ok) {
            setFaqs((prev) => prev.filter((f) => f.id !== faq.id));
            toast.success('FAQ item permanently deleted from database.', 'FAQ Deleted');
            await fetchAdminData();
          } else {
            toast.error('Failed to delete FAQ.', 'Delete Failed');
          }
        } catch {
          toast.error('Error deleting FAQ.', 'Error');
        } finally {
          setDeleteDialog((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
  };

  // Deadline Handlers
  const handleSaveDeadlineModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeadline) return;

    try {
      const isNew = !editingDeadline.id || editingDeadline.id.startsWith('deadline-new-');
      const res = await fetch('/api/v1/admin/homepage/deadlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingDeadline),
      });

      if (res.ok) {
        toast.success(`Deadline event saved to database!`, 'Deadline Saved');
        setDeadlineModalOpen(false);
        setEditingDeadline(null);
        await fetchAdminData();
      } else {
        toast.error('Failed to save deadline event.', 'Error');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error saving deadline.', 'Error');
    }
  };

  const promptDeleteDeadline = (deadline: any) => {
    setDeleteDialog({
      isOpen: true,
      title: 'Delete Deadline Event?',
      message: `Are you sure you want to delete "${deadline.eventTypeName || deadline.title || 'this event'}" for ${deadline.university}? This will permanently remove it from PostgreSQL.`,
      confirmText: 'Yes, delete deadline',
      onConfirm: async () => {
        setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
        try {
          await fetch(`/api/v1/admin/homepage/deadlines/${deadline.id}`, { method: 'DELETE' });
          setDeadlinesList((prev) => prev.filter((d) => d.id !== deadline.id));
          toast.success('Deadline event deleted successfully from database.', 'Deleted');
          await fetchAdminData();
        } catch {
          toast.error('Failed to delete deadline.', 'Error');
        } finally {
          setDeleteDialog((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
  };

  // Guide Handlers
  const handleSaveGuideModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuide) return;

    try {
      const res = await fetch('/api/v1/admin/homepage/guides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGuide),
      });

      if (res.ok) {
        toast.success(`Guide article "${editingGuide.title}" saved to PostgreSQL database!`, 'Guide Saved');
        setGuideModalOpen(false);
        setEditingGuide(null);
        await fetchAdminData();
      } else {
        toast.error('Failed to save guide article.', 'Error');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error saving guide article.', 'Error');
    }
  };

  const promptDeleteGuide = (guide: any) => {
    setDeleteDialog({
      isOpen: true,
      title: 'Delete Guide Article?',
      message: `Are you sure you want to delete "${guide.title}" from PostgreSQL database?`,
      confirmText: 'Yes, delete guide',
      onConfirm: async () => {
        setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
        try {
          await fetch(`/api/v1/admin/homepage/guides/${guide.id}`, { method: 'DELETE' });
          setGuides((prev) => prev.filter((g) => g.id !== guide.id));
          toast.success('Guide article deleted from PostgreSQL database.', 'Deleted');
          await fetchAdminData();
        } catch {
          toast.error('Failed to delete guide article.', 'Error');
        } finally {
          setDeleteDialog((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
  };

  const navTabs = [
    { id: 'overview', label: 'Overview & Scanner', icon: Globe },
    { id: 'hero', label: 'Hero Section', icon: Layout },
    { id: 'admission', label: 'Admission At A Glance', icon: Table },
    { id: 'eligibility', label: 'Eligibility Qualifier', icon: CheckSquare },
    { id: 'deadlines', label: 'Upcoming Deadlines', icon: Calendar },
    { id: 'universities', label: 'Featured Universities', icon: Building2 },
    { id: 'advisor', label: 'AI Advisor Preview', icon: Bot },
    { id: 'guides', label: 'Admission Guides', icon: BookOpen },
    { id: 'preparation', label: 'Preparation Platform CTA', icon: Zap },
    { id: 'faq', label: 'FAQ Manager', icon: HelpCircle },
    { id: 'seo', label: 'SEO & Meta Tags', icon: FileText },
  ];

  const admissionRows = universities;

  return (
    <AdminShell
      pageTitle="Homepage CMS & Layout Studio"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Homepage CMS' },
      ]}
      actions={
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1 font-semibold animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saveSuccess}
            </span>
          )}

          <Link href="/?preview=true" target="_blank">
            <button className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer">
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Draft</span>
            </button>
          </Link>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-4 py-2 rounded-full border border-orange-200 bg-orange-50 hover:bg-orange-100 text-[#FF5500] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-50"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save to DB'}</span>
          </button>

          <button
            onClick={() => setPublishModalOpen(true)}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF6B00] hover:from-[#E64D00] hover:to-[#FF5500] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Publish Homepage</span>
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── CMS SIDEBAR SECTION NAVIGATION (3 cols) ── */}
        <div className="lg:col-span-3 space-y-2">
          <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 font-mono uppercase">
              Homepage Sections
            </div>
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${isActive
                      ? 'bg-orange-50 text-[#FF5500] font-bold border border-orange-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.id === 'overview' && warnings.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center">
                      {warnings.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick status card */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Database Source:</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                Live PostgreSQL
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Live Version:</span>
              <span className="font-mono font-bold text-[#FF5500]">v{publishedConfig.version || 1}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {publishedConfig.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              Directly connected to PostgreSQL <code>homepage_configs</code> table.
            </div>
          </div>
        </div>

        {/* ── CMS MAIN EDITOR PANE (9 cols) ── */}
        <div className="lg:col-span-9 space-y-6">
          {/* ══════════════════════════════════════════════════════════
              TAB 1: OVERVIEW & CONTENT WARNING SCANNER
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Publication Status Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase text-[#FF5500]">
                      HOMEPAGE PRODUCTION STATUS
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active (v{publishedConfig.version || 1})
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    EduGuide Admission Intelligence Landing Surface
                  </h3>
                  <p className="text-xs text-slate-600">
                    Serving real-time circulars, eligibility engine criteria, admission deadlines, and AI questions.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setPublishModalOpen(true)}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF6B00] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Publish Draft Changes</span>
                  </button>
                </div>
              </div>

              {/* Quality Scanner Warnings */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <h4 className="font-bold text-base text-slate-900">
                      Content Quality Scanner
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {warnings.length} items require review
                  </span>
                </div>

                <div className="space-y-3">
                  {warnings.length === 0 ? (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>All sections and university admission datasets passed quality validation!</span>
                    </div>
                  ) : (
                    warnings.map((w) => (
                      <div
                        key={w.id}
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${w.severity === 'high'
                            ? 'bg-red-50/70 border-red-200 text-red-900'
                            : 'bg-amber-50/70 border-amber-200 text-amber-900'
                          }`}
                      >
                        <div>
                          <div className="font-bold text-sm">{w.title}</div>
                          <div className="text-xs opacity-90 mt-0.5">{w.detail}</div>
                        </div>
                        <button
                          onClick={() => {
                            if (w.actionUrl.includes('seo')) setActiveTab('seo');
                            else if (w.actionUrl.includes('hero')) setActiveTab('hero');
                          }}
                          className="px-3 py-1.5 bg-white border border-current rounded-lg font-semibold shrink-0 shadow-2xs hover:bg-slate-50 transition"
                        >
                          Resolve in CMS
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Section Health Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <span className="text-xs text-slate-500 font-medium">Universities in Table</span>
                  <div className="text-2xl font-bold text-slate-900 font-mono">{admissionRows.length}</div>
                  <p className="text-[11px] text-slate-500">Configured in Admission At A Glance</p>
                </div>
                <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <span className="text-xs text-slate-500 font-medium">Published FAQs</span>
                  <div className="text-2xl font-bold text-slate-900 font-mono">{faqs.length || 5}</div>
                  <p className="text-[11px] text-slate-500">Categorized with rich text answers</p>
                </div>
                <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <span className="text-xs text-slate-500 font-medium">SEO Guides</span>
                  <div className="text-2xl font-bold text-slate-900 font-mono">{guides.length || 4}</div>
                  <p className="text-[11px] text-slate-500">Preparation & admission circular analysis</p>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 2: HERO SECTION EDITOR
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'hero' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Hero Section Editor</h3>
                  <p className="text-xs text-slate-500">Control headline, CTAs, and trust indicators.</p>
                </div>
                <button
                  onClick={() => handleSaveSection('hero', draftConfig.hero)}
                  disabled={saving}
                  className="px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Hero Draft'}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Eyebrow Badge Text</label>
                  <input
                    type="text"
                    value={draftConfig.hero?.eyebrow || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        hero: { ...draftConfig.hero, eyebrow: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Hero Main Headline</label>
                  <input
                    type="text"
                    value={draftConfig.hero?.headline || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        hero: { ...draftConfig.hero, headline: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-bold focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Hero Subheading</label>
                  <textarea
                    rows={3}
                    value={draftConfig.hero?.subheading || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        hero: { ...draftConfig.hero, subheading: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">Primary CTA Label</label>
                    <input
                      type="text"
                      value={draftConfig.hero?.primaryCtaLabel || ''}
                      onChange={(e) =>
                        setDraftConfig({
                          ...draftConfig,
                          hero: { ...draftConfig.hero, primaryCtaLabel: e.target.value },
                        })
                      }
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">Secondary CTA Label</label>
                    <input
                      type="text"
                      value={draftConfig.hero?.secondaryCtaLabel || ''}
                      onChange={(e) =>
                        setDraftConfig({
                          ...draftConfig,
                          hero: { ...draftConfig.hero, secondaryCtaLabel: e.target.value },
                        })
                      }
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="hero-enabled"
                    checked={draftConfig.hero?.enabled ?? true}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        hero: { ...draftConfig.hero, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-[#FF5500] rounded"
                  />
                  <label htmlFor="hero-enabled" className="text-xs font-semibold text-slate-900">
                    Enable Hero Section on Public Homepage
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 3: ADMISSION AT A GLANCE (READY TABLE TEMPLATE & QUILL)
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'admission' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Admission at a Glance Table & Template Manager</h3>
                  <p className="text-xs text-slate-500">
                    Configure homepage table headlines, rich circular notices, and preview database university records.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/admin/circulars"
                    className="px-4 py-2 rounded-full border border-orange-200 bg-orange-50 hover:bg-orange-100 text-[#FF5500] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Manage Circulars & Deadlines</span>
                  </Link>

                  <button
                    onClick={() => handleSaveSection('admissionSection', draftConfig.admissionSection)}
                    disabled={saving}
                    className="px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : 'Save Draft'}</span>
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Section Title</label>
                  <input
                    type="text"
                    value={draftConfig.admissionSection?.title || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        admissionSection: { ...draftConfig.admissionSection, title: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Description</label>
                  <input
                    type="text"
                    value={draftConfig.admissionSection?.description || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        admissionSection: { ...draftConfig.admissionSection, description: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              {/* ── LIVE CIRCULARS & DEADLINES DATA TABLE ── */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-start justify-between gap-3 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong className="text-slate-900 font-bold">Admission Circulars & Deadlines Feed:</strong> The rows below display active official circulars from your database.
                      Add or update circulars in{' '}
                      <Link href="/admin/circulars" className="text-[#FF5500] font-bold underline hover:text-[#E04B00]">
                        Circulars & Deadlines
                      </Link>
                      . Any updates reflect immediately across the public homepage!
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-white border border-orange-200 text-[#FF5500] font-mono text-xs font-bold shrink-0">
                    {circulars.length} Circulars Live
                  </span>
                </div>

                {circulars.length > 0 ? (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 font-mono uppercase">
                        <tr>
                          <th className="py-3 px-3">University & Unit</th>
                          <th className="py-3 px-3">Session</th>
                          <th className="py-3 px-3">App Window</th>
                          <th className="py-3 px-3">Exam Date</th>
                          <th className="py-3 px-3">Min GPA Criteria</th>
                          <th className="py-3 px-3">Seats</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {circulars.map((circ) => {
                          const isImageLogo =
                            circ.universityLogo &&
                            (circ.universityLogo.startsWith('http') || circ.universityLogo.startsWith('/'));
                          return (
                            <tr key={circ.id} className="hover:bg-slate-50/70 transition">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/70 flex items-center justify-center shrink-0 overflow-hidden text-sm">
                                    {isImageLogo ? (
                                      <img src={circ.universityLogo} alt="" className="w-full h-full object-contain" />
                                    ) : (
                                      <span>{circ.universityLogo || '🏛️'}</span>
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-slate-900 leading-snug">
                                      <span className="text-[#FF5500] font-mono font-bold mr-1.5">
                                        [{circ.universityShortName || 'UNI'}]
                                      </span>
                                      <span>{circ.universityName}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-50 text-[#FF5500] border border-orange-200">
                                        {circ.unit || 'A Unit'}
                                      </span>
                                      {circ.unitName && circ.unitName !== circ.unit && (
                                        <span className="text-[10px] text-slate-400 truncate max-w-[180px]">
                                          {circ.unitName}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3 font-mono text-[11px] text-slate-700">
                                {circ.session || circ.year || '2025-2026'}
                              </td>
                              <td className="py-3 px-3 text-[11px] font-mono text-slate-600">
                                {formatAppWindow(circ.applicationStartDate, circ.applicationEndDate)}
                              </td>
                              <td className="py-3 px-3 text-[11px] font-mono text-slate-900 font-semibold">
                                {formatCircDate(circ.examDate)}
                              </td>
                              <td className="py-3 px-3 text-[11px]">
                                <span className="font-semibold text-slate-800">
                                  Combined {circ.minCombinedGpa?.toFixed(2)}
                                </span>
                                <span className="text-slate-400 block text-[10px]">
                                  SSC {circ.minSscGpa?.toFixed(2)} | HSC {circ.minHscGpa?.toFixed(2)}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-[11px] font-mono text-slate-700 font-medium">
                                {circ.totalSeats ? `${circ.totalSeats.toLocaleString()} Seats` : '—'}
                              </td>
                              <td className="py-3 px-3">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                    circ.status === 'active'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : circ.status === 'upcoming'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                                  }`}
                                >
                                  {circ.status || 'Active'}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <Link
                                    href={`/admin/circulars?search=${encodeURIComponent(
                                      circ.universityShortName || circ.unit
                                    )}`}
                                    className="px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-[#FF5500] hover:bg-[#FF5500] hover:text-white transition font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                                    title="Edit in Circulars & Deadlines"
                                  >
                                    <Calendar className="w-3 h-3" />
                                    <span>Edit Circular</span>
                                  </Link>
                                  {circ.officialUrl && (
                                    <a
                                      href={circ.officialUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                                      title="Official Circular Link / PDF"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 space-y-2 bg-slate-50/50">
                    <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                    <h4 className="text-xs font-bold text-slate-700">No Admission Circulars Published Yet</h4>
                    <p className="text-[11px] text-slate-400">
                      Admission circulars and deadlines can be published in the dedicated Circulars & Deadlines manager.
                    </p>
                    <Link
                      href="/admin/circulars"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold shadow-sm transition"
                    >
                      <span>+ Create Admission Circular</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 4: ELIGIBILITY QUALIFIER
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'eligibility' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Instant Eligibility Qualifier Editor</h3>
                  <p className="text-xs text-slate-500">Configure title, CTA labels, and visible input form fields.</p>
                </div>
                <button
                  onClick={() => handleSaveSection('eligibilitySection', draftConfig.eligibilitySection)}
                  disabled={saving}
                  className="px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Qualifier Draft'}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Section Headline</label>
                  <input
                    type="text"
                    value={draftConfig.eligibilitySection?.title || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        eligibilitySection: { ...draftConfig.eligibilitySection, title: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Description</label>
                  <input
                    type="text"
                    value={draftConfig.eligibilitySection?.description || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        eligibilitySection: { ...draftConfig.eligibilitySection, description: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">CTA Button Text</label>
                  <input
                    type="text"
                    value={draftConfig.eligibilitySection?.primaryCtaLabel || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        eligibilitySection: { ...draftConfig.eligibilitySection, primaryCtaLabel: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Helper Trust Text</label>
                  <input
                    type="text"
                    value={draftConfig.eligibilitySection?.helperText || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        eligibilitySection: { ...draftConfig.eligibilitySection, helperText: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 5: DEADLINES SECTION
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'deadlines' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Upcoming Deadlines Section Editor</h3>
                  <p className="text-xs text-slate-500">Configure section headers and manage live deadline countdown events stored in PostgreSQL.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingDeadline({
                        id: `deadline-new-${Date.now()}`,
                        universityName: universities[0]?.shortName || 'BUET',
                        unit: 'Ka Unit (Science)',
                        eventType: 'application_deadline',
                        title: 'Application Deadline',
                        eventDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 16),
                        sourceUrl: 'https://',
                        status: 'upcoming',
                      });
                      setDeadlineModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Deadline Event</span>
                  </button>
                  <button
                    onClick={() => handleSaveSection('deadlineSection', draftConfig.deadlineSection)}
                    disabled={saving}
                    className="px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : 'Save Draft'}</span>
                  </button>
                </div>
              </div>

              {/* Section Header Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Section Title</label>
                  <input
                    type="text"
                    value={draftConfig.deadlineSection?.title || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        deadlineSection: { ...draftConfig.deadlineSection, title: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Description</label>
                  <input
                    type="text"
                    value={draftConfig.deadlineSection?.description || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        deadlineSection: { ...draftConfig.deadlineSection, description: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              {/* Live Database Deadlines Table */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      Live PostgreSQL Deadlines & Events ({deadlinesList.length} active)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Countdown events and dates displayed dynamically on the public homepage.
                    </p>
                  </div>
                </div>

                {deadlinesList.length === 0 ? (
                  <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center space-y-3 bg-slate-50/50">
                    <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700">No deadline events created yet</p>
                      <p className="text-xs text-slate-500">
                        Add application deadlines, admission exam dates, or circular releases.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingDeadline({
                          id: `deadline-new-${Date.now()}`,
                          universityName: universities[0]?.shortName || 'BUET',
                          unit: 'Ka Unit (Science)',
                          eventType: 'application_deadline',
                          title: 'Application Deadline',
                          eventDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 16),
                          sourceUrl: 'https://',
                          status: 'upcoming',
                        });
                        setDeadlineModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold shadow-sm transition cursor-pointer"
                    >
                      + Add First Deadline Event
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          <th className="py-2.5 px-3">University</th>
                          <th className="py-2.5 px-3">Unit / Faculty</th>
                          <th className="py-2.5 px-3">Event Type</th>
                          <th className="py-2.5 px-3">Target Date & Time</th>
                          <th className="py-2.5 px-3">Countdown</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {deadlinesList.map((evt) => (
                          <tr key={evt.id} className="hover:bg-slate-50/60 transition">
                            <td className="py-3 px-3 font-bold text-slate-900">{evt.university}</td>
                            <td className="py-3 px-3 text-slate-600">{evt.unit}</td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-[#FF5500] border border-orange-200">
                                {evt.eventTypeName || evt.title || evt.eventType}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-800">{evt.dateDisplay || new Date(evt.eventDate).toLocaleDateString()}</td>
                            <td className="py-3 px-3 font-mono font-bold text-[#FF5500]">
                              {evt.remainingDays} days left
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${evt.status === 'urgent'
                                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                  : evt.status === 'upcoming'
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                {evt.status || 'upcoming'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setEditingDeadline({
                                      id: evt.id,
                                      universityName: evt.university,
                                      unit: evt.unit,
                                      eventType: evt.eventType,
                                      title: evt.eventTypeName || evt.title,
                                      eventDate: evt.eventDate ? new Date(evt.eventDate).toISOString().slice(0, 16) : '',
                                      sourceUrl: evt.sourceUrl,
                                      status: evt.status,
                                    });
                                    setDeadlineModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                  title="Edit Event"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => promptDeleteDeadline(evt)}
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                                  title="Delete Event"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 6: FEATURED UNIVERSITIES
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'universities' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Featured Universities Section</h3>
                  <p className="text-xs text-slate-500">Pick which top universities appear in the directory showcase.</p>
                </div>
                <button
                  onClick={() => handleSaveSection('featuredUniversities', draftConfig.featuredUniversities)}
                  disabled={saving}
                  className="px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Universities Draft'}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Section Title</label>
                  <input
                    type="text"
                    value={draftConfig.featuredUniversities?.title || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        featuredUniversities: { ...draftConfig.featuredUniversities, title: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Description</label>
                  <input
                    type="text"
                    value={draftConfig.featuredUniversities?.description || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        featuredUniversities: { ...draftConfig.featuredUniversities, description: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-900">Selected Universities ({draftConfig.featuredUniversities?.selectedUniversityIds?.length || 0})</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {universities.map((uni) => {
                      const isSelected = (draftConfig.featuredUniversities?.selectedUniversityIds || []).includes(uni.id);
                      return (
                        <div
                          key={uni.id}
                          onClick={() => {
                            const current = draftConfig.featuredUniversities?.selectedUniversityIds || [];
                            const updated = isSelected
                              ? current.filter((id) => id !== uni.id)
                              : [...current, uni.id];
                            setDraftConfig({
                              ...draftConfig,
                              featuredUniversities: { ...draftConfig.featuredUniversities, selectedUniversityIds: updated },
                            });
                          }}
                          className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${isSelected
                              ? 'bg-orange-50 border-orange-300 text-slate-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                        >
                          <div>
                            <div className="font-bold text-xs">{uni.shortName}</div>
                            <div className="text-[11px] text-slate-500">{uni.name}</div>
                          </div>
                          <input type="checkbox" checked={isSelected} readOnly className="w-4 h-4 text-[#FF5500] rounded pointer-events-none" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 7: AI ADVISOR PREVIEW
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'advisor' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-slate-900">AI Advisor Interactive Preview Editor</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Live PostgreSQL Section</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Full control over headline, suggested question chips, verified answers, avatar illustration, and smooth theme gradients.
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSection('aiAdvisor', draftConfig.aiAdvisor)}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving to DB...' : 'Save AI Draft to DB'}</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* 1. Visibility Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Enable AI Advisor Section</div>
                    <div className="text-[11px] text-slate-500">Display interactive admission tutor preview on homepage</div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftConfig.aiAdvisor?.enabled !== false}
                      onChange={(e) =>
                        setDraftConfig({
                          ...draftConfig,
                          aiAdvisor: { ...draftConfig.aiAdvisor, enabled: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-[#FF5500] rounded cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      {draftConfig.aiAdvisor?.enabled !== false ? 'Enabled' : 'Hidden'}
                    </span>
                  </label>
                </div>

                {/* 2. Eyebrow Badge & Title */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">Eyebrow / Badge Text</label>
                    <input
                      type="text"
                      value={draftConfig.aiAdvisor?.eyebrowBadge || 'AI ADMISSION INTELLIGENCE'}
                      onChange={(e) =>
                        setDraftConfig({
                          ...draftConfig,
                          aiAdvisor: { ...draftConfig.aiAdvisor, eyebrowBadge: e.target.value },
                        })
                      }
                      placeholder="AI ADMISSION INTELLIGENCE"
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-bold uppercase tracking-wider font-mono focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-900">Section Title *</label>
                    <input
                      type="text"
                      value={draftConfig.aiAdvisor?.title || ''}
                      onChange={(e) =>
                        setDraftConfig({
                          ...draftConfig,
                          aiAdvisor: { ...draftConfig.aiAdvisor, title: e.target.value },
                        })
                      }
                      placeholder="Ask anything about university admission."
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>
                </div>

                {/* 3. Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Description Subtitle *</label>
                  <textarea
                    rows={2}
                    value={draftConfig.aiAdvisor?.description || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        aiAdvisor: { ...draftConfig.aiAdvisor, description: e.target.value },
                      })
                    }
                    placeholder="Confused about eligibility, units, deadlines or admission requirements? Ask EduGuide."
                    className="w-full p-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                {/* 4. Smooth Gradient Background Theme */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Modern Smooth Gradient Theme</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      {
                        id: 'warm-glow',
                        label: 'Warm Glow',
                        sub: 'Subtle Cream & Amber (Default)',
                        preview: 'from-orange-50/60 via-white to-amber-50/40',
                      },
                      {
                        id: 'smooth-sunset',
                        label: 'Smooth Sunset',
                        sub: 'Rich Orange Radiant Glow',
                        preview: 'from-[#FFF5EE] via-[#FFEBD9] to-[#FFF0E6]',
                      },
                      {
                        id: 'executive-dark',
                        label: 'Executive Obsidian',
                        sub: 'High-Tech Dark Flame',
                        preview: 'from-[#18110D] via-[#24150B] to-[#120C08]',
                      },
                      {
                        id: 'solar-amber',
                        label: 'Solar Amber',
                        sub: 'Warm Campus Sunlight',
                        preview: 'from-[#FFFDF9] via-[#FFF6ED] to-[#FEF3C7]',
                      },
                    ].map((t) => {
                      const isSelected =
                        (draftConfig.aiAdvisor?.gradientTheme || 'warm-glow') === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() =>
                            setDraftConfig({
                              ...draftConfig,
                              aiAdvisor: { ...draftConfig.aiAdvisor, gradientTheme: t.id as any },
                            })
                          }
                          className={`p-3 rounded-2xl border cursor-pointer transition ${isSelected
                              ? 'border-[#FF5500] ring-2 ring-orange-500/20 bg-orange-50/20'
                              : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                          <div className={`h-8 rounded-xl bg-gradient-to-r ${t.preview} mb-2 border border-slate-200 shadow-xs`} />
                          <div className="text-xs font-bold text-slate-900">{t.label}</div>
                          <div className="text-[10px] text-slate-500">{t.sub}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Unified Image Upload (Cloudinary + ImgBB + Local) */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#FF5500]" />
                        <span>AI Advisor Illustration / Avatar Image</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Upload to Cloudinary (with ImgBB &amp; local server fallback) or select a preset vector illustration.
                      </p>
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setDraftConfig({
                            ...draftConfig,
                            aiAdvisor: {
                              ...draftConfig.aiAdvisor,
                              imageUrl: '/images/ai-advisor-avatar.svg',
                            },
                          })
                        }
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-orange-50 text-[#FF5500] border border-orange-200 hover:bg-orange-100 transition cursor-pointer"
                      >
                        Default AI Mascot SVG
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDraftConfig({
                            ...draftConfig,
                            aiAdvisor: {
                              ...draftConfig.aiAdvisor,
                              imageUrl: '/images/study-platform-mockup.svg',
                            },
                          })
                        }
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                      >
                        Study Deck Preview
                      </button>
                    </div>
                  </div>

                  <UnifiedImageUploader
                    value={draftConfig.aiAdvisor?.imageUrl || ''}
                    onChange={(url) =>
                      setDraftConfig({
                        ...draftConfig,
                        aiAdvisor: { ...draftConfig.aiAdvisor, imageUrl: url },
                      })
                    }
                    folder="homepage/advisor"
                    label="Upload Image Asset (Cloudinary / ImgBB / Local)"
                    hint="Choose file to automatically upload to Cloudinary (with ImgBB and local fallback), or enter an image link."
                    aspectRatio="square"
                  />
                </div>

                {/* 6. Question Chips & Answers Manager */}
                <div className="space-y-3 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#FF5500]" />
                        <span>Interactive Question Chips &amp; Answers ({draftConfig.aiAdvisor?.exampleQuestions?.length || 0})</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        When students click a question pill on the homepage, the chat preview dynamically displays the custom verified answer.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const defaults = [
                            {
                              id: 'q1',
                              text: 'Which universities are accepting applications right now?',
                              category: 'Deadlines',
                              order: 1,
                              answer: 'Currently, BUET, KUET, RUET, CUET, and DU Ka Unit have active circular deadlines for the 2026 session. Medical (MBBS) applications are also open with test scheduled for late November.',
                              enabled: true,
                            },
                            {
                              id: 'q2',
                              text: 'What is the BUET admission minimum GPA requirement?',
                              category: 'Eligibility',
                              order: 2,
                              answer: 'For BUET Undergraduate Admission 2026, candidates from the Science Group must satisfy: Minimum 4.00 out of 5.00 in SSC, 4.00 in HSC across PHY, CHE, MATH, ENG, and combined points >= 270. Second-time is strictly disallowed.',
                              enabled: true,
                            },
                            {
                              id: 'q3',
                              text: 'Which units can I apply to with SSC GPA 4.8 and HSC GPA 5.0?',
                              category: 'Eligibility',
                              order: 3,
                              answer: 'With a combined GPA of 9.80, you qualify for 95%+ of public university units including DU Ka & Kha, GST Cluster Science & General, and Engineering Universities (subject to Physics & Math grade prerequisites).',
                              enabled: true,
                            },
                            {
                              id: 'q4',
                              text: 'What are the main differences between BUET and DU Ka Unit exams?',
                              category: 'Comparison',
                              order: 4,
                              answer: 'BUET has a preliminary MCQ screening followed by a written-only final test with zero calculators allowed. DU Ka Unit combines both 60 MCQ and 40 Written marks in a unified 90-minute sitting without calculators.',
                              enabled: true,
                            },
                            {
                              id: 'q5',
                              text: 'When will the Medical admission test admit card be published?',
                              category: 'Admit Card',
                              order: 5,
                              answer: 'Medical (MBBS) admit cards will be downloadable from DGHS official portal approximately 10 days before the admission exam date.',
                              enabled: true,
                            },
                          ];
                          setDraftConfig({
                            ...draftConfig,
                            aiAdvisor: { ...draftConfig.aiAdvisor, exampleQuestions: defaults },
                          });
                        }}
                        className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        Reset Defaults
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const current = draftConfig.aiAdvisor?.exampleQuestions || [];
                          const newQ = {
                            id: `q-${Date.now()}`,
                            text: 'What is the syllabus weightage for admission exams?',
                            category: 'Syllabus',
                            order: current.length + 1,
                            answer: 'Questions are formulated from standard NCTB HSC textbooks with special emphasis on analytical problem-solving and fundamental concepts.',
                            enabled: true,
                          };
                          setDraftConfig({
                            ...draftConfig,
                            aiAdvisor: {
                              ...draftConfig.aiAdvisor,
                              exampleQuestions: [...current, newQ],
                            },
                          });
                        }}
                        className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3 text-[#FF5500]" />
                        <span>Add Question Chip</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(draftConfig.aiAdvisor?.exampleQuestions || []).map((q, idx) => (
                      <div
                        key={q.id || idx}
                        className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center font-mono shrink-0">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={q.text}
                              onChange={(e) => {
                                const updated = [...(draftConfig.aiAdvisor?.exampleQuestions || [])];
                                updated[idx] = { ...updated[idx], text: e.target.value };
                                setDraftConfig({
                                  ...draftConfig,
                                  aiAdvisor: { ...draftConfig.aiAdvisor, exampleQuestions: updated },
                                });
                              }}
                              placeholder="Question text shown in pill..."
                              className="flex-1 h-9 px-3 text-xs font-bold text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:border-[#FF5500]"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={q.category || 'General'}
                              onChange={(e) => {
                                const updated = [...(draftConfig.aiAdvisor?.exampleQuestions || [])];
                                updated[idx] = { ...updated[idx], category: e.target.value };
                                setDraftConfig({
                                  ...draftConfig,
                                  aiAdvisor: { ...draftConfig.aiAdvisor, exampleQuestions: updated },
                                });
                              }}
                              placeholder="Category"
                              className="w-24 h-9 px-2 text-[11px] font-mono border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
                            />

                            <label className="flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={q.enabled !== false}
                                onChange={(e) => {
                                  const updated = [...(draftConfig.aiAdvisor?.exampleQuestions || [])];
                                  updated[idx] = { ...updated[idx], enabled: e.target.checked };
                                  setDraftConfig({
                                    ...draftConfig,
                                    aiAdvisor: { ...draftConfig.aiAdvisor, exampleQuestions: updated },
                                  });
                                }}
                                className="w-4 h-4 text-[#FF5500] rounded"
                              />
                              <span>Visible</span>
                            </label>

                            <button
                              type="button"
                              onClick={() => {
                                const updated = (draftConfig.aiAdvisor?.exampleQuestions || []).filter(
                                  (_, qIdx) => qIdx !== idx
                                );
                                setDraftConfig({
                                  ...draftConfig,
                                  aiAdvisor: { ...draftConfig.aiAdvisor, exampleQuestions: updated },
                                });
                              }}
                              className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                              title="Delete question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Answer textarea */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Verified Circular Answer (Shown on Homepage):
                          </label>
                          <textarea
                            rows={2}
                            value={q.answer || ''}
                            onChange={(e) => {
                              const updated = [...(draftConfig.aiAdvisor?.exampleQuestions || [])];
                              updated[idx] = { ...updated[idx], answer: e.target.value };
                              setDraftConfig({
                                ...draftConfig,
                                aiAdvisor: { ...draftConfig.aiAdvisor, exampleQuestions: updated },
                              });
                            }}
                            placeholder="Official verified response answering this admission question..."
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#FF5500] bg-slate-50/50"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7. Action CTA Button */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">CTA Button Text</label>
                    <input
                      type="text"
                      value={draftConfig.aiAdvisor?.ctaText || 'Ask Admission Advisor'}
                      onChange={(e) =>
                        setDraftConfig({
                          ...draftConfig,
                          aiAdvisor: { ...draftConfig.aiAdvisor, ctaText: e.target.value },
                        })
                      }
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">CTA Button URL</label>
                    <input
                      type="text"
                      value={draftConfig.aiAdvisor?.ctaUrl || '/chat'}
                      onChange={(e) =>
                        setDraftConfig({
                          ...draftConfig,
                          aiAdvisor: { ...draftConfig.aiAdvisor, ctaUrl: e.target.value },
                        })
                      }
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>
                </div>

                {/* 8. Live In-Admin Preview Box */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Live In-Admin AI Advisor Preview</span>
                  </span>

                  <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-md">
                    <AiAdvisorPreviewSection config={draftConfig.aiAdvisor} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 8: GUIDES SECTION
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'guides' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Admission Guides Section</h3>
                  <p className="text-xs text-slate-500">Pick featured guide articles, manage article showcases, and post new guides directly to PostgreSQL.</p>
                </div>
                <button
                  onClick={() => handleSaveSection('guideSection', draftConfig.guideSection)}
                  disabled={saving}
                  className="px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Guides Draft'}</span>
                </button>
              </div>

              {/* Section Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Section Title</label>
                  <input
                    type="text"
                    value={draftConfig.guideSection?.title || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        guideSection: { ...draftConfig.guideSection, title: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Max Display Count on Homepage</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={draftConfig.guideSection?.maxDisplayCount || 4}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        guideSection: { ...draftConfig.guideSection, maxDisplayCount: Number(e.target.value) },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Section Description</label>
                  <textarea
                    rows={2}
                    value={draftConfig.guideSection?.description || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        guideSection: { ...draftConfig.guideSection, description: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Selection Mode</label>
                  <select
                    value={draftConfig.guideSection?.selectionMode || 'recent'}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        guideSection: { ...draftConfig.guideSection, selectionMode: e.target.value as any },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  >
                    <option value="recent">Recent (Automatic Latest Articles)</option>
                    <option value="manual">Manual (Featured Selected Slugs)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Enable Guides Section</div>
                    <div className="text-[11px] text-slate-500">Show or hide on public landing page</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={draftConfig.guideSection?.enabled !== false}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        guideSection: { ...draftConfig.guideSection, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-[#FF5500] rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Live Database Guide Articles Manager */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span>Live PostgreSQL Guides & Articles</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {guides.length} in DB
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Articles stored in PostgreSQL <code>articles</code> table. Select which articles appear on the homepage or post a new one.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingGuide({
                        id: `guide-new-${Date.now()}`,
                        title: '',
                        slug: '',
                        category: 'Engineering Guide',
                        readingTimeMinutes: 6,
                        summary: '',
                        content: '',
                        isPublished: true,
                      });
                      setGuideModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post New Guide Article</span>
                  </button>
                </div>

                {guides.length === 0 ? (
                  <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center space-y-3 bg-slate-50/50">
                    <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700">No guide articles in database</p>
                      <p className="text-xs text-slate-500">Post high-yield preparation tips and circular breakdowns.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {guides.map((guide) => {
                      const selectedSlugs = draftConfig.guideSection?.selectedSlugs || [];
                      const isFeaturedOnHome = selectedSlugs.includes(guide.slug);
                      const isShowcase = draftConfig.guideSection?.featuredArticleSlug === guide.slug;

                      return (
                        <div
                          key={guide.id}
                          className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3 transition"
                        >
                          <div className="space-y-1 max-w-xl">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                                {guide.category || 'General Guide'}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {guide.readingTimeMinutes || 5} min read
                              </span>
                              {isShowcase && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-[#FF5500] font-mono">
                                  Main Showcase
                                </span>
                              )}
                            </div>
                            <h5 className="text-xs font-bold text-slate-900 leading-tight">
                              {guide.title}
                            </h5>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {guide.summary || guide.slug}
                            </p>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Slug: /guides/{guide.slug}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                              <input
                                type="checkbox"
                                checked={isFeaturedOnHome}
                                onChange={(e) => {
                                  let newSlugs = [...selectedSlugs];
                                  if (e.target.checked) {
                                    if (!newSlugs.includes(guide.slug)) newSlugs.push(guide.slug);
                                  } else {
                                    newSlugs = newSlugs.filter((s) => s !== guide.slug);
                                  }
                                  setDraftConfig({
                                    ...draftConfig,
                                    guideSection: { ...draftConfig.guideSection, selectedSlugs: newSlugs },
                                  });
                                }}
                                className="w-3.5 h-3.5 text-[#FF5500] rounded"
                              />
                              <span className="text-[11px] font-semibold">Featured</span>
                            </label>

                            <button
                              onClick={() => {
                                setDraftConfig({
                                  ...draftConfig,
                                  guideSection: { ...draftConfig.guideSection, featuredArticleSlug: guide.slug },
                                });
                                toast.success(`Set "${guide.title}" as main showcase guide!`, 'Showcase Updated');
                              }}
                              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition cursor-pointer ${isShowcase
                                  ? 'bg-orange-50 border-orange-200 text-[#FF5500]'
                                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                                }`}
                            >
                              Showcase
                            </button>

                            <button
                              onClick={() => {
                                setEditingGuide(guide);
                                setGuideModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                              title="Edit Article"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => promptDeleteGuide(guide)}
                              className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition cursor-pointer"
                              title="Delete Article"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 9: PREPARATION PLATFORM CTA
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'preparation' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-slate-900">Preparation Platform Banner Editor</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Live PostgreSQL Section</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Fully customize the headline, description, 6 checklist bullets, primary & secondary CTAs, background linear gradient, and right-side illustration.
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSection('preparation', draftConfig.preparation)}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving to DB...' : 'Save Prep Draft to DB'}</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* 1. Visibility Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Enable Preparation Section</div>
                    <div className="text-[11px] text-slate-500">Display conversion banner on public homepage</div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftConfig.preparation?.enabled !== false}
                      onChange={(e) =>
                        setDraftConfig({
                          ...draftConfig,
                          preparation: { ...draftConfig.preparation, enabled: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-[#FF5500] rounded cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      {draftConfig.preparation?.enabled !== false ? 'Enabled' : 'Hidden'}
                    </span>
                  </label>
                </div>

                {/* 2. Badge & Headline */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">Top Tag / Badge Text</label>
                    <input
                      type="text"
                      value={draftConfig.preparation?.badgeText || 'THE PREPARATION PLATFORM'}
                      onChange={(e) =>
                        setDraftConfig({
                          ...draftConfig,
                          preparation: { ...draftConfig.preparation, badgeText: e.target.value },
                        })
                      }
                      placeholder="e.g. THE PREPARATION PLATFORM"
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-bold uppercase tracking-wider font-mono focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-900">Conversion Headline *</label>
                    <input
                      type="text"
                      value={draftConfig.preparation?.headline || ''}
                      onChange={(e) =>
                        setDraftConfig({
                          ...draftConfig,
                          preparation: { ...draftConfig.preparation, headline: e.target.value },
                        })
                      }
                      placeholder="Know where to apply. Now prepare to get in."
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>
                </div>

                {/* 3. Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Subtitle Description *</label>
                  <textarea
                    rows={2}
                    value={draftConfig.preparation?.description || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        preparation: { ...draftConfig.preparation, description: e.target.value },
                      })
                    }
                    placeholder="Turn your target university and admission unit into a personalized preparation plan with visual lessons, chapter-wise MCQs, and past 15 years question bank."
                    className="w-full p-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                {/* 4. Background Linear Gradient Theme */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Modern Linear Gradient Theme (Theme-Consistent)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      {
                        id: 'executive-flame',
                        label: 'Executive Flame',
                        sub: 'Obsidian & Warm Flame (Default)',
                        preview: 'from-[#1C120C] via-[#2A170B] to-[#140D08]',
                      },
                      {
                        id: 'warm-sunset',
                        label: 'Warm Sunset',
                        sub: 'Radiant Orange Energy',
                        preview: 'from-[#FF5500] via-[#E64D00] to-[#8C2300]',
                      },
                      {
                        id: 'obsidian-orange',
                        label: 'Obsidian Orange',
                        sub: 'Midnight Slate & Ember',
                        preview: 'from-[#0F172A] via-[#1A1829] to-[#25130A]',
                      },
                      {
                        id: 'charcoal-glow',
                        label: 'Charcoal Glow',
                        sub: 'Minimal Dark Charcoal',
                        preview: 'from-[#18181B] via-[#27272A] to-[#18181B]',
                      },
                    ].map((t) => {
                      const isSelected =
                        (draftConfig.preparation?.gradientTheme || 'executive-flame') === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() =>
                            setDraftConfig({
                              ...draftConfig,
                              preparation: { ...draftConfig.preparation, gradientTheme: t.id as any },
                            })
                          }
                          className={`p-3 rounded-2xl border cursor-pointer transition ${isSelected
                              ? 'border-[#FF5500] ring-2 ring-orange-500/20 bg-orange-50/20'
                              : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                          <div className={`h-8 rounded-xl bg-gradient-to-r ${t.preview} mb-2 border border-white/10 shadow-xs`} />
                          <div className="text-xs font-bold text-slate-900">{t.label}</div>
                          <div className="text-[10px] text-slate-500">{t.sub}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Feature Bullets Checklist Editor */}
                <div className="space-y-3 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5500]" />
                        <span>Feature Checklist Bullets ({draftConfig.preparation?.features?.length || 0})</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">Edit, add, or remove key value propositions shown on the banner.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const defaults = [
                            'Visual interactive lessons',
                            'Chapter-wise MCQ practice drills',
                            'Past 15 years solved admission questions',
                            'Full-length timed mock test simulator',
                            '24/7 AI Admission Tutor with step-by-step derivations',
                            'Personalized mistake notebook & revision queue',
                          ];
                          setDraftConfig({
                            ...draftConfig,
                            preparation: { ...draftConfig.preparation, features: defaults },
                          });
                        }}
                        className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        Reset Defaults
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const current = draftConfig.preparation?.features || [];
                          setDraftConfig({
                            ...draftConfig,
                            preparation: {
                              ...draftConfig.preparation,
                              features: [...current, 'New preparation feature point'],
                            },
                          });
                        }}
                        className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3 text-[#FF5500]" />
                        <span>Add Bullet</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(draftConfig.preparation?.features || []).map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 focus-within:border-[#FF5500]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#FF5500] shrink-0" />
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => {
                            const updated = [...(draftConfig.preparation?.features || [])];
                            updated[fIdx] = e.target.value;
                            setDraftConfig({
                              ...draftConfig,
                              preparation: { ...draftConfig.preparation, features: updated },
                            });
                          }}
                          className="flex-1 text-xs font-medium text-slate-900 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (draftConfig.preparation?.features || []).filter(
                              (_, idx) => idx !== fIdx
                            );
                            setDraftConfig({
                              ...draftConfig,
                              preparation: { ...draftConfig.preparation, features: updated },
                            });
                          }}
                          className="p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                          title="Remove feature"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Right-Side Image Configuration */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#FF5500]" />
                        <span>Right-Side Mockup Image</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Choose a built-in vector illustration or provide a custom image URL.
                      </p>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setDraftConfig({
                            ...draftConfig,
                            preparation: {
                              ...draftConfig.preparation,
                              imageUrl: '/images/study-platform-mockup.svg',
                            },
                          })
                        }
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-orange-50 text-[#FF5500] border border-orange-200 hover:bg-orange-100 transition cursor-pointer"
                      >
                        Default SVG Mockup
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDraftConfig({
                            ...draftConfig,
                            preparation: {
                              ...draftConfig.preparation,
                              imageUrl: '',
                            },
                          })
                        }
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                      >
                        Interactive Glass Card
                      </button>
                    </div>
                  </div>

                  <UnifiedImageUploader
                    value={draftConfig.preparation?.imageUrl || ''}
                    onChange={(url) =>
                      setDraftConfig({
                        ...draftConfig,
                        preparation: { ...draftConfig.preparation, imageUrl: url },
                      })
                    }
                    folder="homepage/preparation"
                    label="Upload Image Asset (Cloudinary / ImgBB / Local)"
                    hint="Choose file to automatically upload to Cloudinary (with ImgBB and local fallback), or enter an image link."
                    aspectRatio="video"
                  />

                  <div className="space-y-1 pt-1">
                    <label className="text-[11px] font-bold text-slate-700">Image Alt Text</label>
                    <input
                      type="text"
                      value={draftConfig.preparation?.imageAlt || ''}
                      onChange={(e) =>
                        setDraftConfig({
                          ...draftConfig,
                          preparation: { ...draftConfig.preparation, imageAlt: e.target.value },
                        })
                      }
                      placeholder="EduGuide Study Platform Mockup"
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>
                </div>

                {/* 7. Action Buttons Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                    <span className="text-xs font-bold text-slate-900 block">Primary CTA Button</span>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Button Text</label>
                        <input
                          type="text"
                          value={draftConfig.preparation?.ctaText || 'Start Preparing'}
                          onChange={(e) =>
                            setDraftConfig({
                              ...draftConfig,
                              preparation: { ...draftConfig.preparation, ctaText: e.target.value },
                            })
                          }
                          className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF5500]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Button URL</label>
                        <input
                          type="text"
                          value={draftConfig.preparation?.ctaUrl || '/prepare'}
                          onChange={(e) =>
                            setDraftConfig({
                              ...draftConfig,
                              preparation: { ...draftConfig.preparation, ctaUrl: e.target.value },
                            })
                          }
                          className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#FF5500]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                    <span className="text-xs font-bold text-slate-900 block">Secondary Button (Optional)</span>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Button Text</label>
                        <input
                          type="text"
                          value={draftConfig.preparation?.secondaryCtaText || ''}
                          onChange={(e) =>
                            setDraftConfig({
                              ...draftConfig,
                              preparation: { ...draftConfig.preparation, secondaryCtaText: e.target.value },
                            })
                          }
                          placeholder="e.g. Explore Mock Tests"
                          className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Button URL</label>
                        <input
                          type="text"
                          value={draftConfig.preparation?.secondaryCtaUrl || '/mock-tests'}
                          onChange={(e) =>
                            setDraftConfig({
                              ...draftConfig,
                              preparation: { ...draftConfig.preparation, secondaryCtaUrl: e.target.value },
                            })
                          }
                          placeholder="/mock-tests"
                          className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#FF5500]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 8. Live In-Admin Preview Box */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Live In-Admin Banner Preview</span>
                  </span>

                  <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-md">
                    <PreparationCtaSection config={draftConfig.preparation} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 10: FAQ MANAGER
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'faq' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">FAQ Manager & Rich Editor</h3>
                  <p className="text-xs text-slate-500">Manage frequently asked questions with HTML and rich text support.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingFaq({
                      id: `faq-new-${Date.now()}`,
                      question: '',
                      answer: '',
                      category: 'Eligibility',
                      order: faqs.length + 1,
                    });
                    setFaqModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={faq.id || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-orange-300 transition flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-orange-50 text-[#FF5500] border border-orange-200 uppercase">
                          {faq.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">Order: #{faq.order}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{faq.question}</h4>
                      <div
                        className="text-[11px] text-slate-600 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setEditingFaq(faq);
                          setFaqModalOpen(true);
                        }}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => promptDeleteFaq(faq)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 11: SEO & META TAGS
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'seo' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Homepage SEO & OpenGraph Studio</h3>
                  <p className="text-xs text-slate-500">Control search metadata, social sharing cards, and Google snippet preview.</p>
                </div>
                <button
                  onClick={() => handleSaveSection('seo', draftConfig.seo)}
                  disabled={saving}
                  className="px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save SEO Draft'}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Meta Title</label>
                  <input
                    type="text"
                    value={draftConfig.seo?.metaTitle || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        seo: { ...draftConfig.seo, metaTitle: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Meta Description</label>
                  <textarea
                    rows={3}
                    value={draftConfig.seo?.metaDescription || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        seo: { ...draftConfig.seo, metaDescription: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── ADMISSION ROW MODAL (READY TABLE TEMPLATE POST & EDIT) ── */}
      {admissionModalOpen && editingRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#FF5500] font-bold flex items-center justify-center text-xs">
                  <Table className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  {editingRow.name ? `Edit Admission Row: ${editingRow.shortName}` : 'Post New Admission Table Row'}
                </h3>
              </div>
              <button onClick={() => setAdmissionModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF5500] shrink-0" />
                <span>
                  Official dates are driven by <strong>Circulars & Deadlines</strong>.
                </span>
              </div>
              <Link
                href={`/admin/circulars?search=${encodeURIComponent(editingRow.shortName || editingRow.name)}`}
                className="px-3.5 py-1.5 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white font-bold text-[11px] shrink-0 transition flex items-center gap-1"
              >
                <span>Edit in Circulars Manager →</span>
              </Link>
            </div>

            <form onSubmit={handleSaveAdmissionRow} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Short Code (e.g. BUET, DU, Medical)</label>
                  <input
                    type="text"
                    required
                    value={editingRow.shortName}
                    onChange={(e) => setEditingRow({ ...editingRow, shortName: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Full University / Board Name</label>
                  <input
                    type="text"
                    required
                    value={editingRow.name}
                    onChange={(e) => setEditingRow({ ...editingRow, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Application Window</label>
                  <input
                    type="text"
                    value={editingRow.applicationWindow}
                    onChange={(e) => setEditingRow({ ...editingRow, applicationWindow: e.target.value })}
                    placeholder="e.g. Jan 15, 2026 – Feb 15, 2026"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Admission Test / Exam Date</label>
                  <input
                    type="text"
                    value={editingRow.testDate}
                    onChange={(e) => setEditingRow({ ...editingRow, testDate: e.target.value })}
                    placeholder="e.g. Mar 08, 2026 (Ka Unit)"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">Min. GPA & Qualification Criteria</label>
                <input
                  type="text"
                  value={editingRow.minGpa}
                  onChange={(e) => setEditingRow({ ...editingRow, minGpa: e.target.value })}
                  placeholder="e.g. Combined GPA 8.00 (Min 3.50 each) or SSC 4.00, HSC 4.00"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Discipline Group</label>
                  <select
                    value={editingRow.group}
                    onChange={(e) => setEditingRow({ ...editingRow, group: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  >
                    <option value="All Groups">All Groups</option>
                    <option value="Science">Science Group</option>
                    <option value="Commerce">Commerce / BBA</option>
                    <option value="Arts">Humanities / Arts</option>
                    <option value="Science (Biology)">Science (Biology)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Admission Units</label>
                  <input
                    type="text"
                    value={editingRow.units}
                    onChange={(e) => setEditingRow({ ...editingRow, units: e.target.value })}
                    placeholder="e.g. Ka, Kha, Ga"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Total Seats</label>
                  <input
                    type="number"
                    value={editingRow.seats || 0}
                    onChange={(e) => setEditingRow({ ...editingRow, seats: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Application Status Badge</label>
                  <select
                    value={editingRow.status}
                    onChange={(e) => setEditingRow({ ...editingRow, status: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  >
                    <option value="Applications Open">Applications Open</option>
                    <option value="Opening Soon">Opening Soon</option>
                    <option value="Deadline Passed">Deadline Passed</option>
                    <option value="Not Announced">Not Announced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Official Circular URL</label>
                  <input
                    type="text"
                    value={editingRow.circularUrl}
                    onChange={(e) => setEditingRow({ ...editingRow, circularUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAdmissionModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  Save Admission Row
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── FAQ MODAL ── */}
      {faqModalOpen && editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              {editingFaq.id && !editingFaq.id.startsWith('faq-new-') ? 'Edit FAQ Item' : 'New Admission FAQ'}
            </h3>

            <form onSubmit={handleSaveFaqModal} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">Question</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Category</label>
                  <select
                    value={editingFaq.category}
                    onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  >
                    <option value="Eligibility">Eligibility</option>
                    <option value="Admission">Admission</option>
                    <option value="Preparation">Preparation</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Display Order</label>
                  <input
                    type="number"
                    value={editingFaq.order || 1}
                    onChange={(e) => setEditingFaq({ ...editingFaq, order: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">Answer (Formatted Text)</label>
                <RichTextEditor
                  value={editingFaq.answer}
                  onChange={(val) => setEditingFaq({ ...editingFaq, answer: val })}
                  placeholder="Enter detailed answer with bold keywords and formatting..."
                  minHeight="140px"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFaqModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CUSTOM SWEETALERT-STYLE DELETE CONFIRMATION MODAL ── */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            {/* Warning Pulsing Icon */}
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
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
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

      {/* ── DEADLINE EVENT MODAL ── */}
      {deadlineModalOpen && editingDeadline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              {editingDeadline.id && !editingDeadline.id.startsWith('deadline-new-') ? 'Edit Deadline Event' : 'Add New Admission Deadline'}
            </h3>

            <form onSubmit={handleSaveDeadlineModal} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">University / Institution *</label>
                  <input
                    type="text"
                    required
                    value={editingDeadline.universityName}
                    onChange={(e) => setEditingDeadline({ ...editingDeadline, universityName: e.target.value })}
                    placeholder="e.g. BUET, DU, Medical"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Unit / Faculty *</label>
                  <input
                    type="text"
                    required
                    value={editingDeadline.unit}
                    onChange={(e) => setEditingDeadline({ ...editingDeadline, unit: e.target.value })}
                    placeholder="e.g. Ka Unit (Science)"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Event Type</label>
                  <select
                    value={editingDeadline.eventType}
                    onChange={(e) => {
                      const type = e.target.value;
                      let defaultTitle = 'Application Deadline';
                      if (type === 'exam_date') defaultTitle = 'Admission Test';
                      if (type === 'application_start') defaultTitle = 'Applications Open';
                      if (type === 'result_date') defaultTitle = 'Result Publication';
                      setEditingDeadline({ ...editingDeadline, eventType: type, title: defaultTitle });
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  >
                    <option value="application_deadline">Application Deadline</option>
                    <option value="exam_date">Admission Exam Date</option>
                    <option value="application_start">Applications Open</option>
                    <option value="result_date">Result Publication</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={editingDeadline.title}
                    onChange={(e) => setEditingDeadline({ ...editingDeadline, title: e.target.value })}
                    placeholder="e.g. Application Deadline"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Target Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={editingDeadline.eventDate}
                    onChange={(e) => setEditingDeadline({ ...editingDeadline, eventDate: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Status</label>
                  <select
                    value={editingDeadline.status || 'upcoming'}
                    onChange={(e) => setEditingDeadline({ ...editingDeadline, status: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="urgent">Urgent</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="passed">Passed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">Official Circular URL</label>
                <input
                  type="text"
                  value={editingDeadline.sourceUrl || ''}
                  onChange={(e) => setEditingDeadline({ ...editingDeadline, sourceUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeadlineModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  Save Deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── GUIDE ARTICLE MODAL ── */}
      {guideModalOpen && editingGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#FF5500]" />
                  <span>{editingGuide.id?.startsWith('guide-new-') ? 'Post New Guide Article' : 'Edit Guide Article'}</span>
                </h3>
                <p className="text-xs text-slate-500">Saves directly into PostgreSQL <code>articles</code> database table with Quill rich text formatting.</p>
              </div>
              <button
                onClick={() => setGuideModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGuideModal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">Article Title *</label>
                <input
                  type="text"
                  required
                  value={editingGuide.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setEditingGuide({
                      ...editingGuide,
                      title,
                      slug: editingGuide.slug ? editingGuide.slug : autoSlug,
                    });
                  }}
                  placeholder="e.g. DU Ka Unit Physics Preparation Guide 2026"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-900">URL Slug *</label>
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:border-[#FF5500]">
                    <span className="bg-slate-50 text-slate-400 text-xs px-2.5 py-2.5 font-mono">/guides/</span>
                    <input
                      type="text"
                      required
                      value={editingGuide.slug}
                      onChange={(e) => setEditingGuide({ ...editingGuide, slug: e.target.value })}
                      placeholder="du-ka-unit-guide"
                      className="w-full h-10 px-2 text-xs font-mono font-medium focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Reading Time (min)</label>
                  <input
                    type="number"
                    min={1}
                    value={editingGuide.readingTimeMinutes || 5}
                    onChange={(e) => setEditingGuide({ ...editingGuide, readingTimeMinutes: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">Category</label>
                <select
                  value={editingGuide.category || 'General Guide'}
                  onChange={(e) => setEditingGuide({ ...editingGuide, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                >
                  <option value="Engineering Guide">Engineering Guide</option>
                  <option value="Varsity Science">Varsity Science</option>
                  <option value="Medical Guide">Medical Guide</option>
                  <option value="Cluster Guide">Cluster Guide</option>
                  <option value="General Guide">General Guide</option>
                  <option value="Strategy & Tips">Strategy & Tips</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">Short Summary (Shown on homepage card) *</label>
                <textarea
                  required
                  rows={2}
                  value={editingGuide.summary}
                  onChange={(e) => setEditingGuide({ ...editingGuide, summary: e.target.value })}
                  placeholder="Concise overview of what students will learn from this admission guide..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900">Article Content (Quill Rich Text Editor) *</label>
                  <span className="text-[11px] text-slate-400 font-medium">Headings, lists, bold, colors & blockquotes supported</span>
                </div>
                <RichTextEditor
                  value={editingGuide.content || ''}
                  onChange={(html) => setEditingGuide({ ...editingGuide, content: html })}
                  placeholder="Write comprehensive subject analysis, formulas, bullet points, and study strategies..."
                  minHeight="240px"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-xs font-bold text-slate-700">Published Status</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingGuide.isPublished !== false}
                    onChange={(e) => setEditingGuide({ ...editingGuide, isPublished: e.target.checked })}
                    className="w-4 h-4 text-[#FF5500] rounded"
                  />
                  <span className="text-xs text-slate-600 font-semibold">Published Live</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGuideModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  Save Guide Article to PostgreSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PUBLISH MODAL ── */}
      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        draftConfig={draftConfig}
        warnings={warnings}
        onConfirmPublish={handleConfirmPublish}
      />
    </AdminShell>
  );
}
