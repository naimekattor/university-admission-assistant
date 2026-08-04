'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StatsData {
  totalSessions: number;
  activeSessions24h: number;
  totalMessages: number;
  userMsgCount: number;
  assistantMsgCount: number;
  tokenUsage: {
    estimatedPromptTokens: number;
    estimatedCompletionTokens: number;
    estimatedTotalTokens: number;
    totalPromptChars: number;
    totalCompletionChars: number;
  };
  knowledgeBase: {
    totalIndexedChunks: number;
    totalIndexedFiles: number;
  };
  activities: { action: string; count: number }[];
}

interface DocumentItem {
  id: string;
  university: string;
  unit: string;
  year: number | string;
  type: string;
  originalFileName: string;
  filePath: string;
  page?: number;
  snippet?: string;
  fullTextLength?: number;
  chunkCount?: number;
}

interface SessionItem {
  id: string;
  sessionToken: string;
  createdAt: string;
  lastActiveAt: string;
  userAgent: string;
  ipAddress: string;
  messageCount: number;
  tokens: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

const universities = ['BUET', 'DU', 'JU', 'RU', 'CU', 'GST', 'KUET', 'RUET', 'CUET', 'SUST', 'JNU', 'MBSTU', 'Other'];
const docTypes = ['circular', 'prospectus', 'faq', 'notice', 'regulation'];
const predefinedUnits = [
  { label: 'Auto Detect', value: 'auto' },
  { label: 'Ka Unit (ক ইউনিট - Science / A Unit)', value: 'Ka Unit (Science / A Unit)' },
  { label: 'Kha Unit (খ ইউনিট - Arts / B Unit)', value: 'Kha Unit (Arts / B Unit)' },
  { label: 'Ga Unit (গ ইউনিট - Commerce / C Unit)', value: 'Ga Unit (Commerce / C Unit)' },
  { label: 'Gha Unit (ঘ ইউনিট - Combined / D Unit)', value: 'Gha Unit (Combined / D Unit)' },
  { label: 'Cha Unit (চ ইউনিট - Fine Arts)', value: 'Cha Unit (Fine Arts)' },
  { label: 'All Units', value: 'All Units' },
  { label: 'Custom / Other', value: 'custom' },
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'analytics' | 'knowledge' | 'sessions'>('analytics');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [sessionsList, setSessionsList] = useState<SessionItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Upload Form state
  const [file, setFile] = useState<File | null>(null);
  const [university, setUniversity] = useState('');
  const [unit, setUnit] = useState('auto');
  const [customUnit, setCustomUnit] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [docType, setDocType] = useState('circular');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Document management filter & deletion state
  const [docSearch, setDocSearch] = useState('');
  const [selectedUniFilter, setSelectedUniFilter] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Transcript viewer modal state
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [transcriptMessages, setTranscriptMessages] = useState<ChatMessage[]>([]);
  const [transcriptLoading, setTranscriptLoading] = useState(false);

  // Check auth on load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/check-auth');
      if (res.ok) {
        setAuthenticated(true);
        fetchDashboardData();
      } else {
        setAuthenticated(false);
      }
    } catch {
      setAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAuthenticated(true);
        fetchDashboardData();
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch {
      setLoginError('Failed to connect to server');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
  };

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      const [statsRes, docsRes, sessRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/documents'),
        fetch('/api/admin/sessions'),
      ]);

      if (statsRes.ok) {
        const d = await statsRes.json();
        setStats(d.stats);
      }
      if (docsRes.ok) {
        const d = await docsRes.json();
        setDocuments(d.documents || []);
      }
      if (sessRes.ok) {
        const d = await sessRes.json();
        setSessionsList(d.sessions || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setUploadResult(null);

    const effectiveUnit = unit === 'custom' ? customUnit : unit;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('university', university);
    formData.append('unit', effectiveUnit);
    formData.append('year', year);
    formData.append('documentType', docType);

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setUploadResult({ success: true, message: data.message });
        setFile(null);
        fetchDashboardData();
      } else {
        setUploadResult({ success: false, message: data.error || 'Upload failed' });
      }
    } catch {
      setUploadResult({ success: false, message: 'Upload network error' });
    } finally {
      setUploading(false);
    }
  };

  // Document delete modal & toast state
  const [docToDelete, setDocToDelete] = useState<{ id: string; fileName: string; filePath?: string } | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', title: string, message: string) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 6000);
  };

  const handleDeleteDocument = (pointId: string, fileName?: string, filePath?: string) => {
    setDocToDelete({ id: pointId, fileName: fileName || 'Unknown Document', filePath });
  };

  const executeDeleteDocument = async () => {
    if (!docToDelete) return;
    const { id, fileName, filePath } = docToDelete;
    setDeletingId(id);
    setDocToDelete(null);

    try {
      const res = await fetch('/api/admin/documents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: id, fileName, filePath }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(
          'success',
          'Document Purged Successfully',
          data.message || `Document "${fileName}" was removed from PostgreSQL, Qdrant vectors, and server storage.`
        );
        fetchDashboardData();
      } else {
        showToast('error', 'Deletion Failed', data.error || 'Failed to delete document');
      }
    } catch (err: any) {
      showToast('error', 'Deletion Error', err.message || 'Failed to delete document');
    } finally {
      setDeletingId(null);
    }
  };

  const viewSessionTranscript = async (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setTranscriptLoading(true);
    try {
      const res = await fetch(`/api/admin/sessions?sessionId=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setTranscriptMessages(data.messages || []);
      }
    } catch {
      console.error('Failed to load transcript');
    } finally {
      setTranscriptLoading(false);
    }
  };

  // Render Login View if not authenticated
  if (authenticated === false) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              🛡️
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
            <p className="text-zinc-400 text-sm mt-1">University Admission Assistant</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                Admin Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
                {loginError}
              </div>
            )}

            <Button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl transition-all"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Admin Panel'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.originalFileName.toLowerCase().includes(docSearch.toLowerCase()) ||
      doc.university.toLowerCase().includes(docSearch.toLowerCase()) ||
      doc.unit.toLowerCase().includes(docSearch.toLowerCase()) ||
      (doc.snippet || '').toLowerCase().includes(docSearch.toLowerCase());
    const matchesUni = selectedUniFilter ? doc.university === selectedUniFilter : true;
    return matchesSearch && matchesUni;
  });

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">Admin Dashboard</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                Live
              </span>
            </div>
            <p className="text-zinc-400 text-sm mt-1">
              Manage admission circulars, vector search items, user analytics, and token metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={fetchDashboardData}
              disabled={loadingData}
              className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs h-9"
            >
              🔄 {loadingData ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 text-xs h-9"
            >
              🚪 Logout
            </Button>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5">
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Total Sessions</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-white">{stats?.totalSessions || 0}</span>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                {stats?.activeSessions24h || 0} active (24h)
              </span>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5">
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Total Chat Messages</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-white">{stats?.totalMessages || 0}</span>
              <span className="text-xs text-zinc-400">
                {stats?.userMsgCount || 0} user / {stats?.assistantMsgCount || 0} AI
              </span>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5">
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Estimated LLM Tokens</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-blue-400">
                {(stats?.tokenUsage.estimatedTotalTokens || 0).toLocaleString()}
              </span>
              <span className="text-xs text-zinc-400">
                ~{(stats?.tokenUsage.estimatedPromptTokens || 0).toLocaleString()} prompt
              </span>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5">
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Knowledge Base Chunks</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-purple-400">
                {stats?.knowledgeBase.totalIndexedChunks || 0}
              </span>
              <span className="text-xs text-zinc-400">
                {stats?.knowledgeBase.totalIndexedFiles || 0} files indexed
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 space-x-4">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📊 Analytics & Tokens
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'knowledge'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📚 Knowledge Base & Uploads ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'sessions'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            💬 User Sessions & Chat Logs ({sessionsList.length})
          </button>
        </div>

        {/* TAB 1: Analytics & Token Usage */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Token Consumption Breakdown */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-base font-semibold text-white mb-4">Token Usage Breakdown</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>Prompt Input Tokens</span>
                      <span>{(stats?.tokenUsage.estimatedPromptTokens || 0).toLocaleString()} tokens</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{
                          width: `${
                            stats?.tokenUsage.estimatedTotalTokens
                              ? (stats.tokenUsage.estimatedPromptTokens / stats.tokenUsage.estimatedTotalTokens) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>Completion Output Tokens</span>
                      <span>{(stats?.tokenUsage.estimatedCompletionTokens || 0).toLocaleString()} tokens</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-500 h-full rounded-full"
                        style={{
                          width: `${
                            stats?.tokenUsage.estimatedTotalTokens
                              ? (stats.tokenUsage.estimatedCompletionTokens / stats.tokenUsage.estimatedTotalTokens) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 pt-3 flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Total Characters Processed</span>
                    <span className="text-zinc-200 font-mono">
                      {((stats?.tokenUsage.totalPromptChars || 0) + (stats?.tokenUsage.totalCompletionChars || 0)).toLocaleString()} chars
                    </span>
                  </div>
                </div>
              </div>

              {/* Activity Actions Breakdown */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-base font-semibold text-white mb-4">User Activity Logs</h3>
                {stats?.activities && stats.activities.length > 0 ? (
                  <div className="space-y-3">
                    {stats.activities.map((act) => (
                      <div key={act.action} className="flex justify-between items-center bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/60">
                        <span className="text-xs font-mono text-blue-400">{act.action}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {act.count} events
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-sm">No activity events recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Knowledge Base & Uploads */}
        {activeTab === 'knowledge' && (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-base font-semibold text-white mb-2">Upload & Index New Document</h3>
              <p className="text-zinc-400 text-xs mb-4">
                Upload university admission circulars, prospectuses, FAQs, or regulations. Processed text chunks will be embedded directly into vector search.
              </p>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                    dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/40'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const f = e.dataTransfer.files[0];
                    if (f) setFile(f);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.html,.png,.jpg,.jpeg,.webp"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  {file ? (
                    <div>
                      <p className="text-blue-400 font-medium text-sm">📄 {file.name}</p>
                      <p className="text-zinc-500 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-zinc-300 text-sm">Drop circular file here or click to browse</p>
                      <p className="text-zinc-500 text-xs mt-1">Supports PDF, DOCX, TXT, HTML, PNG, JPG (Bangla & English)</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">University</label>
                    <select
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full h-9 rounded-lg border border-zinc-800 bg-zinc-950 text-white px-2.5 text-xs"
                    >
                      <option value="">Select University</option>
                      {universities.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Unit</label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full h-9 rounded-lg border border-zinc-800 bg-zinc-950 text-white px-2.5 text-xs"
                    >
                      {predefinedUnits.map((u) => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Year</label>
                    <Input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 text-white text-xs h-9"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Type</label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full h-9 rounded-lg border border-zinc-800 bg-zinc-950 text-white px-2.5 text-xs"
                    >
                      {docTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {unit === 'custom' && (
                  <div>
                    <Input
                      type="text"
                      placeholder="Custom unit name (e.g. IBA / Unit 1)"
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 text-white text-xs"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!file || uploading}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-5 h-9"
                >
                  {uploading ? 'Processing & Embedding...' : 'Upload & Embed into Vector DB'}
                </Button>
              </form>

              {uploadResult && (
                <div className={`mt-4 p-3 rounded-lg text-xs ${
                  uploadResult.success ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
                }`}>
                  {uploadResult.message}
                </div>
              )}
            </div>

            {/* Document Management Table */}
            {/* Document Management Table */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-semibold text-white">Uploaded Documents & Circulars</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">Manage raw files, inspect uploaded documents, and remove vector indexes</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedUniFilter}
                    onChange={(e) => setSelectedUniFilter(e.target.value)}
                    className="h-8 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 text-xs px-2"
                  >
                    <option value="">All Universities</option>
                    {universities.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>

                  <Input
                    type="text"
                    placeholder="Search documents..."
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    className="h-8 w-48 bg-zinc-950 border-zinc-800 text-zinc-200 text-xs"
                  />
                </div>
              </div>

              {filteredDocs.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-sm">
                  No uploaded documents found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-mono border-b border-zinc-800">
                      <tr>
                        <th className="p-3">Document Name</th>
                        <th className="p-3">University</th>
                        <th className="p-3">Unit</th>
                        <th className="p-3">Type & Year</th>
                        <th className="p-3">Chunks Count</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                      {filteredDocs.map((doc) => (
                        <tr key={doc.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="p-3 font-mono font-medium text-blue-400 max-w-[240px] truncate" title={doc.originalFileName}>
                            📄 {doc.originalFileName}
                          </td>
                          <td className="p-3">{doc.university}</td>
                          <td className="p-3 text-zinc-400">{doc.unit}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] uppercase">
                              {doc.type} ({doc.year})
                            </span>
                          </td>
                          <td className="p-3 font-mono text-purple-400 font-semibold">
                            {doc.chunkCount ? `${doc.chunkCount} chunk(s)` : 'Indexed'}
                          </td>
                          <td className="p-3 text-right space-x-2">
                            {doc.filePath && (
                              <a
                                href={doc.filePath.startsWith('/') ? doc.filePath : `/${doc.filePath}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-xs px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 rounded border border-blue-500/20 inline-block"
                              >
                                👁️ View File
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteDocument(doc.id, doc.originalFileName, doc.filePath)}
                              disabled={deletingId === doc.id}
                              className="text-red-400 hover:text-red-300 text-xs px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 rounded border border-red-500/20"
                            >
                              {deletingId === doc.id ? 'Deleting...' : '🗑️ Remove Document'}
                            </button>
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

        {/* TAB 3: User Sessions & Chat Logs */}
        {activeTab === 'sessions' && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-base font-semibold text-white mb-4">User Sessions & Token Usage</h3>

            {sessionsList.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-sm">No user sessions found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-mono border-b border-zinc-800">
                    <tr>
                      <th className="p-3">Session Token</th>
                      <th className="p-3">Last Active</th>
                      <th className="p-3">Messages</th>
                      <th className="p-3">Estimated Tokens</th>
                      <th className="p-3 text-right">Transcript</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {sessionsList.map((sess) => (
                      <tr key={sess.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="p-3 font-mono text-zinc-400">{sess.sessionToken.slice(0, 18)}...</td>
                        <td className="p-3 text-zinc-400">{new Date(sess.lastActiveAt).toLocaleString()}</td>
                        <td className="p-3 font-medium text-white">{sess.messageCount} msgs</td>
                        <td className="p-3 font-mono text-blue-400">{sess.tokens.totalTokens} tokens</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => viewSessionTranscript(sess.id)}
                            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs"
                          >
                            👁️ View Chat
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Transcript Modal */}
        {selectedSessionId && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-white text-sm">Session Chat Transcript</h3>
                  <p className="text-zinc-500 font-mono text-xs mt-0.5">{selectedSessionId}</p>
                </div>
                <button
                  onClick={() => setSelectedSessionId(null)}
                  className="text-zinc-400 hover:text-white text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 overflow-y-auto space-y-3 flex-1">
                {transcriptLoading ? (
                  <div className="text-center py-6 text-zinc-400 text-xs">Loading transcript messages...</div>
                ) : transcriptMessages.length === 0 ? (
                  <div className="text-center py-6 text-zinc-500 text-xs">No chat messages found in this session.</div>
                ) : (
                  transcriptMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        m.role === 'user'
                          ? 'bg-blue-600/10 border border-blue-500/20 text-blue-200 ml-8'
                          : 'bg-zinc-950 border border-zinc-800 text-zinc-300 mr-8'
                      }`}
                    >
                      <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                        <span className="uppercase font-semibold">{m.role}</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-zinc-800 text-right">
                <Button
                  onClick={() => setSelectedSessionId(null)}
                  variant="outline"
                  className="border-zinc-800 bg-zinc-950 text-zinc-300 text-xs h-8"
                >
                  Close Transcript
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {docToDelete && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-red-400">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-xl">
                  🗑️
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Confirm Document Deletion</h3>
                  <p className="text-xs text-zinc-400">Permanently purge file from storage & database</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-2">
                <p className="font-medium text-white">Are you sure you want to remove document:</p>
                <p className="font-mono text-blue-400 break-all bg-blue-500/5 p-2 rounded border border-blue-500/10">
                  "{docToDelete.fileName}"
                </p>
                <p className="text-[11px] text-zinc-400 pt-1 leading-relaxed">
                  This action will delete all vector chunks from <strong className="text-zinc-200">Qdrant</strong>, delete metadata from <strong className="text-zinc-200">PostgreSQL</strong>, and remove the physical file from server storage.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDocToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDeleteDocument}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20 transition-colors"
                >
                  Delete Document Everywhere
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Toast Notification */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 max-w-md ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/90 border-red-500/40 text-red-200'
          }`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold ${
              toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {toast.type === 'success' ? '✓' : '⚠️'}
            </div>
            <div className="flex-1 pr-2">
              <h4 className="font-semibold text-xs text-white">{toast.title}</h4>
              <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-zinc-400 hover:text-white text-xs p-1">
              ✕
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
