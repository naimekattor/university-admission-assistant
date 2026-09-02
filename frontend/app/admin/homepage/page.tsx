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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/rich-text/rich-text-editor';
import { PublishModal } from '@/components/admin/homepage/publish-modal';
import {
  DEFAULT_HOMEPAGE_CONFIG,
  HomepageFullConfig,
  AdmissionRowItem,
} from '@/lib/homepage-types';

export default function AdminHomepageCMSPage() {
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

  const fetchAdminData = async () => {
    // 1. Check local storage for drafts
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('eduguide_homepage_draft') || localStorage.getItem('eduguide_homepage_config');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            setDraftConfig(parsed);
          }
        }
      } catch {}
    }

    // 2. Fetch from backend
    try {
      const res = await fetch('/api/v1/admin/homepage');
      if (!res.ok) return;
      const data = await res.json();
      if (data.draftConfig) setDraftConfig(data.draftConfig);
      if (data.publishedConfig) setPublishedConfig(data.publishedConfig);
      if (data.warnings) setWarnings(data.warnings);
      if (data.universities && data.universities.length > 0) setUniversities(data.universities);
      if (data.guides && data.guides.length > 0) setGuides(data.guides);
      if (data.faqs && data.faqs.length > 0) setFaqs(data.faqs);
    } catch {
      // Fallback pre-populated state
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleSaveSection = async (sectionKey: string, sectionData: any) => {
    setSaving(true);
    setSaveSuccess(null);

    const updatedConfig = { ...draftConfig, [sectionKey]: sectionData };
    setDraftConfig(updatedConfig);

    // Save to localStorage immediately so preview and live updates reflect instantly
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('eduguide_homepage_draft', JSON.stringify(updatedConfig));
        localStorage.setItem('eduguide_homepage_config', JSON.stringify(updatedConfig));
      } catch {}
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
      setSaveSuccess(`Section '${sectionKey}' saved as draft.`);
      setTimeout(() => setSaveSuccess(null), 3500);
    } catch {
      setSaveSuccess(`Draft saved locally.`);
      setTimeout(() => setSaveSuccess(null), 3500);
    } finally {
      setSaving(false);
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
      } catch {}
    }

    try {
      const res = await fetch('/api/v1/admin/homepage/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        await fetchAdminData();
      }
    } catch {
      // Offline fallback
    }
  };

  // Admission Row Handlers
  const handleSaveAdmissionRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;

    const currentRows: AdmissionRowItem[] = draftConfig.admissionSection?.customRows || (DEFAULT_HOMEPAGE_CONFIG.admissionSection?.customRows as AdmissionRowItem[]) || [];
    let updatedRows: AdmissionRowItem[];

    const exists = currentRows.some((r) => r.id === editingRow.id);
    if (exists) {
      updatedRows = currentRows.map((r) => (r.id === editingRow.id ? editingRow : r));
    } else {
      updatedRows = [...currentRows, editingRow];
    }

    const updatedAdmissionSection = {
      ...draftConfig.admissionSection,
      customRows: updatedRows,
    };

    handleSaveSection('admissionSection', updatedAdmissionSection);
    setAdmissionModalOpen(false);
    setEditingRow(null);
  };

  const handleDeleteAdmissionRow = (rowId: string) => {
    if (!confirm('Are you sure you want to remove this admission row?')) return;
    const currentRows: AdmissionRowItem[] = draftConfig.admissionSection?.customRows || (DEFAULT_HOMEPAGE_CONFIG.admissionSection?.customRows as AdmissionRowItem[]) || [];
    const updatedRows = currentRows.filter((r) => r.id !== rowId);

    const updatedAdmissionSection = {
      ...draftConfig.admissionSection,
      customRows: updatedRows,
    };

    handleSaveSection('admissionSection', updatedAdmissionSection);
  };

  // FAQ Handlers
  const handleSaveFaqModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;

    try {
      const isNew = !editingFaq.id || editingFaq.id.startsWith('faq-new-');
      const url = isNew
        ? '/api/v1/admin/homepage/faqs'
        : `/api/v1/admin/homepage/faqs/${editingFaq.id}`;
      const method = isNew ? 'POST' : 'PUT';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaq),
      });

      setFaqModalOpen(false);
      setEditingFaq(null);
      await fetchAdminData();
    } catch (err: any) {
      // Fallback local update
      if (editingFaq.id && !editingFaq.id.startsWith('faq-new-')) {
        setFaqs(faqs.map((f) => (f.id === editingFaq.id ? editingFaq : f)));
      } else {
        setFaqs([...faqs, { ...editingFaq, id: `faq-${Date.now()}` }]);
      }
      setFaqModalOpen(false);
      setEditingFaq(null);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await fetch(`/api/v1/admin/homepage/faqs/${id}`, { method: 'DELETE' });
      await fetchAdminData();
    } catch {
      setFaqs(faqs.filter((f) => f.id !== id));
    }
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

  const admissionRows = draftConfig.admissionSection?.customRows || (DEFAULT_HOMEPAGE_CONFIG.admissionSection?.customRows as AdmissionRowItem[]) || [];

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
                  className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                    isActive
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
          <div className="p-4 bg-white border border-slate-200 rounded-2xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Live Version:</span>
              <span className="font-mono font-bold text-[#FF5500]">v{publishedConfig.version || 1}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Published
              </span>
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              Live instant sync enabled for drafts & published state.
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
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                          w.severity === 'high'
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
                    Post, edit, and manage admission rows with ready table templates, plus custom WYSIWYG notices.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingRow({
                        id: `adm-row-${Date.now()}`,
                        name: '',
                        shortName: '',
                        location: 'Dhaka',
                        applicationWindow: 'Jan 15, 2026 – Feb 15, 2026',
                        testDate: 'Mar 01, 2026',
                        minGpa: 'SSC 4.00, HSC 4.00',
                        group: 'Science',
                        units: 'Unit A',
                        seats: 1000,
                        status: 'Applications Open',
                        circularUrl: 'https://',
                      });
                      setAdmissionModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-full border border-orange-200 bg-orange-50 hover:bg-orange-100 text-[#FF5500] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add University Row</span>
                  </button>

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

              {/* ── WYSIWYG / QUILL CIRCULAR NOTICE ── */}
              <div className="space-y-2 p-4 bg-orange-50/40 rounded-2xl border border-orange-200/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Official Circular Rich Notice / Announcement (WYSIWYG Editor)</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Optional HTML / Highlight Box</span>
                </div>
                <RichTextEditor
                  value={draftConfig.admissionSection?.customHtmlNotice || ''}
                  onChange={(val) =>
                    setDraftConfig({
                      ...draftConfig,
                      admissionSection: { ...draftConfig.admissionSection, customHtmlNotice: val },
                    })
                  }
                  placeholder="Type or paste special circular highlights, GPA conversion announcements, or official updates here..."
                  minHeight="100px"
                />
              </div>

              {/* ── READY TABLE TEMPLATE ROWS LIST ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900">
                    Live Table Rows ({admissionRows.length} universities configured)
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    Click edit on any row to change dates, GPA rules, or circular URLs
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 font-mono uppercase">
                      <tr>
                        <th className="py-3 px-3">University</th>
                        <th className="py-3 px-3">App Window</th>
                        <th className="py-3 px-3">Exam Date</th>
                        <th className="py-3 px-3">Min GPA</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {admissionRows.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-3 font-semibold text-slate-900">
                            <span className="text-[#FF5500] font-mono font-bold mr-1.5">[{row.shortName}]</span>
                            <span>{row.name}</span>
                          </td>
                          <td className="py-3 px-3 text-[11px] font-mono text-slate-600">{row.applicationWindow}</td>
                          <td className="py-3 px-3 text-[11px] font-mono text-slate-800 font-medium">{row.testDate}</td>
                          <td className="py-3 px-3 text-[11px] max-w-xs truncate">{row.minGpa}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-[#FF5500] border border-orange-200">
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setEditingRow(row);
                                  setAdmissionModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                title="Edit Row"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAdmissionRow(row.id)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                                title="Delete Row"
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
                  <p className="text-xs text-slate-500">Configure countdown event filters and max displayed events.</p>
                </div>
                <button
                  onClick={() => handleSaveSection('deadlineSection', draftConfig.deadlineSection)}
                  disabled={saving}
                  className="px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Deadlines Draft'}</span>
                </button>
              </div>

              <div className="space-y-4">
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
                          className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                            isSelected
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
                <div>
                  <h3 className="font-bold text-lg text-slate-900">AI Advisor Interactive Preview Editor</h3>
                  <p className="text-xs text-slate-500">Configure suggested questions chips and admission prompt examples.</p>
                </div>
                <button
                  onClick={() => handleSaveSection('aiAdvisor', draftConfig.aiAdvisor)}
                  disabled={saving}
                  className="px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save AI Draft'}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Section Title</label>
                  <input
                    type="text"
                    value={draftConfig.aiAdvisor?.title || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        aiAdvisor: { ...draftConfig.aiAdvisor, title: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Description</label>
                  <input
                    type="text"
                    value={draftConfig.aiAdvisor?.description || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        aiAdvisor: { ...draftConfig.aiAdvisor, description: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF5500]"
                  />
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
                  <p className="text-xs text-slate-500">Pick featured guide articles and article showcases.</p>
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

              <div className="space-y-4">
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
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 9: PREPARATION PLATFORM CTA
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'preparation' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Preparation Conversion Banner Editor</h3>
                  <p className="text-xs text-slate-500">Edit headline, feature bullets, and student conversion CTA.</p>
                </div>
                <button
                  onClick={() => handleSaveSection('preparation', draftConfig.preparation)}
                  disabled={saving}
                  className="px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Prep Draft'}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Conversion Headline</label>
                  <input
                    type="text"
                    value={draftConfig.preparation?.headline || ''}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        preparation: { ...draftConfig.preparation, headline: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF5500]"
                  />
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
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
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
