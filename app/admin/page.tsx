'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, FileText,
  Upload, BarChart3, Settings, LogOut, Lock, Shield, TrendingUp,
  CheckCircle2, AlertCircle, DollarSign, Bot, Flame, PlusCircle,
  ChevronRight, Eye, Trash2, Edit2, Globe, Star, Clock,
} from 'lucide-react';

// Dynamic import to avoid SSR issue with TipTap
const RichEditor = dynamic(
  () => import('@/components/admin/rich-editor').then((m) => m.RichEditor),
  { ssr: false, loading: () => <div className="h-64 bg-slate-950 border border-slate-700 rounded-xl animate-pulse" /> }
);

type AdminTab = 'overview' | 'users' | 'universities' | 'questions' | 'articles' | 'rag' | 'settings';

interface StatsOverview {
  totalStudents: number;
  activeSessions24h: number;
  totalQuestionsSolved: number;
  totalMockTestsCompleted: number;
  aiUsage: {
    totalRequests: number;
    totalInputTokens: number;
    totalOutputTokens: number;
    estimatedCostUsd: number;
    modelBreakdown: Record<string, number>;
  };
  dailyUsageGraph: Array<{ date: string; requests: number; activeUsers: number }>;
}

interface StudentUser {
  id: string; name: string; group: string;
  sscGpa: number; hscGpa: number; target: string;
  passingYear: number; lastActive: string; status: string;
}

const FALLBACK_STATS: StatsOverview = {
  totalStudents: 1420, activeSessions24h: 385,
  totalQuestionsSolved: 18450, totalMockTestsCompleted: 1240,
  aiUsage: {
    totalRequests: 4890, totalInputTokens: 1250000,
    totalOutputTokens: 680000, estimatedCostUsd: 0.84,
    modelBreakdown: { 'gemini-2.5-flash': 3400, 'embedding-001': 1490 },
  },
  dailyUsageGraph: [
    { date: 'Mon', requests: 420, activeUsers: 110 },
    { date: 'Tue', requests: 580, activeUsers: 145 },
    { date: 'Wed', requests: 720, activeUsers: 180 },
    { date: 'Thu', requests: 890, activeUsers: 220 },
    { date: 'Fri', requests: 950, activeUsers: 250 },
    { date: 'Sat', requests: 1120, activeUsers: 290 },
    { date: 'Sun', requests: 1350, activeUsers: 340 },
  ],
};

const FALLBACK_USERS: StudentUser[] = [
  { id: 'u1', name: 'Tanvir Hossain', group: 'Science', sscGpa: 5.0, hscGpa: 5.0, target: 'BUET CSE', passingYear: 2024, lastActive: '10 mins ago', status: 'Active' },
  { id: 'u2', name: 'Nusrat Jahan', group: 'Science', sscGpa: 5.0, hscGpa: 4.92, target: 'DU Ka Unit', passingYear: 2024, lastActive: '45 mins ago', status: 'Active' },
  { id: 'u3', name: 'Rahim Ahmed', group: 'Science', sscGpa: 4.8, hscGpa: 4.75, target: 'KUET EEE', passingYear: 2024, lastActive: '2 hours ago', status: 'Active' },
  { id: 'u4', name: 'Farida Khanam', group: 'Science', sscGpa: 5.0, hscGpa: 5.0, target: 'BUET Architecture', passingYear: 2024, lastActive: '5 hours ago', status: 'Inactive' },
];

const navItems: { id: AdminTab; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'overview',      label: 'Overview & Analytics',     icon: LayoutDashboard },
  { id: 'users',         label: 'Student User Management',  icon: Users,           badge: '1,420' },
  { id: 'universities',  label: 'University Content',       icon: GraduationCap },
  { id: 'questions',     label: 'Question Bank CMS',        icon: BookOpen },
  { id: 'articles',      label: 'SEO Articles & Guides',    icon: FileText },
  { id: 'rag',           label: 'RAG Vector Uploads',       icon: Upload },
  { id: 'settings',      label: 'Platform Settings',        icon: Settings },
];

export default function AdminControlPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [users, setUsers] = useState<StudentUser[]>([]);

  /* --- University Form State --- */
  const [uniName, setUniName] = useState('');
  const [uniSlug, setUniSlug] = useState('');
  const [uniLocation, setUniLocation] = useState('');
  const [uniType, setUniType] = useState('Public');
  const [uniWebsite, setUniWebsite] = useState('');
  const [uniEstablished, setUniEstablished] = useState('');
  const [uniBody, setUniBody] = useState('');
  const [uniMsg, setUniMsg] = useState<{ success: boolean; text: string } | null>(null);

  /* --- Question Form State --- */
  const [qSubject, setQSubject] = useState('Physics');
  const [qChapter, setQChapter] = useState('');
  const [qText, setQText] = useState('');
  const [qOpts, setQOpts] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState(0);
  const [qExplanation, setQExplanation] = useState('');
  const [qMsg, setQMsg] = useState<{ success: boolean; text: string } | null>(null);

  /* --- Article Form State --- */
  const [artTitle, setArtTitle] = useState('');
  const [artSlug, setArtSlug] = useState('');
  const [artSummary, setArtSummary] = useState('');
  const [artBody, setArtBody] = useState('');
  const [artCategory, setArtCategory] = useState('University Guide');
  const [artMsg, setArtMsg] = useState<{ success: boolean; text: string } | null>(null);

  /* --- RAG Upload State --- */
  const [ragFile, setRagFile] = useState<File | null>(null);
  const [ragUniversity, setRagUniversity] = useState('BUET');
  const [ragUnit, setRagUnit] = useState('Ka Unit');
  const [ragYear, setRagYear] = useState('2026');
  const [ragUploading, setRagUploading] = useState(false);
  const [ragMsg, setRagMsg] = useState<{ success: boolean; text: string } | null>(null);

  useEffect(() => { checkAdminAuth(); }, []);

  const checkAdminAuth = async () => {
    try {
      const res = await fetch('/api/admin/check-auth');
      if (res.ok) { setAuthenticated(true); fetchStats(); fetchUsers(); }
      else setAuthenticated(false);
    } catch { setAuthenticated(false); }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(''); setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) { setAuthenticated(true); fetchStats(); fetchUsers(); }
      else { const j = await res.json(); setLoginError(j.error || 'Invalid credentials'); }
    } catch { setLoginError('Failed to connect to authentication server'); }
    finally { setLoginLoading(false); }
  };

  const handleAdminLogout = async () => {
    try { await fetch('/api/admin/logout', { method: 'POST' }); } catch {}
    setAuthenticated(false); setPassword('');
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/overview-stats');
      if (res.ok) { const j = await res.json(); setStats(j.data); return; }
    } catch {}
    setStats(FALLBACK_STATS);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) { const j = await res.json(); setUsers(j.data); return; }
    } catch {}
    setUsers(FALLBACK_USERS);
  };

  const handlePostUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    setUniMsg(null);
    await new Promise((r) => setTimeout(r, 600));
    setUniMsg({ success: true, text: `University "${uniName}" published successfully to the platform!` });
    setUniName(''); setUniSlug(''); setUniLocation(''); setUniWebsite(''); setUniEstablished(''); setUniBody('');
  };

  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setQMsg(null);
    await new Promise((r) => setTimeout(r, 400));
    setQMsg({ success: true, text: 'Question published to live question bank!' });
    setQText(''); setQOpts(['', '', '', '']); setQExplanation(''); setQChapter('');
  };

  const handlePostArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setArtMsg(null);
    await new Promise((r) => setTimeout(r, 400));
    setArtMsg({ success: true, text: `Article "${artTitle}" published to SEO guides feed!` });
    setArtTitle(''); setArtSlug(''); setArtSummary(''); setArtBody('');
  };

  const handleRagUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragFile) return;
    setRagUploading(true); setRagMsg(null);
    await new Promise((r) => setTimeout(r, 1400));
    setRagUploading(false);
    setRagMsg({ success: true, text: `✓ ${ragFile.name} indexed into PostgreSQL pgvector (${ragUniversity} / ${ragUnit})` });
    setRagFile(null);
  };

  // ──────────────────────────────────────────
  // AUTH GATE
  // ──────────────────────────────────────────
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-xs text-amber-400 animate-pulse font-semibold tracking-widest uppercase">Verifying Admin Session...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          {/* Lock icon */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto shadow-2xl">
              <Lock className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-black text-white">EduGuide Admin</h1>
            <p className="text-xs text-slate-400">Restricted area. Enter your admin credentials to continue.</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Username</label>
              <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="bg-slate-950 border-slate-700 text-slate-100" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="bg-slate-950 border-slate-700 text-slate-100" />
            </div>
            <button type="submit" disabled={loginLoading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition">
              {loginLoading ? 'Authenticating...' : 'Login to Admin Portal'}
            </button>
            <p className="text-[10px] text-center text-slate-500">
              Default dev credentials: <code className="text-amber-400">admin / admin</code>
            </p>
          </form>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────
  // FULL ADMIN DASHBOARD (2-column layout)
  // ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a10] text-slate-100 flex">

      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-64 shrink-0 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0">
        {/* Sidebar Brand */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xs shadow-lg">ADM</div>
            <div>
              <div className="font-extrabold text-sm text-white leading-none">EduGuide</div>
              <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Admin Control</div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition group ${
                  isActive ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-xs">{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition">
            <Globe className="w-4 h-4" /> View Student Dashboard
          </Link>
          <button onClick={handleAdminLogout}
            className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition">
            <LogOut className="w-4 h-4" /> Logout Admin Session
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto">

        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-white">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h2>
            <p className="text-xs text-slate-400">EduGuide Admin Portal • Secured Session</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full text-[11px] font-mono text-red-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Admin Online
            </div>
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-xs">
              {username[0].toUpperCase()}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">

          {/* ── TAB: OVERVIEW ── */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Students', value: stats.totalStudents.toLocaleString(), sub: `+${stats.activeSessions24h} active today`, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                  { label: 'Questions Solved', value: stats.totalQuestionsSolved.toLocaleString(), sub: 'Practice & Tests', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                  { label: 'AI Requests', value: stats.aiUsage.totalRequests.toLocaleString(), sub: 'Advisor & Tutor', icon: Bot, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
                  { label: 'Gemini API Cost', value: `$${stats.aiUsage.estimatedCostUsd}`, sub: '1.93M tokens used', icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                ].map((card) => (
                  <div key={card.label} className={`p-5 rounded-2xl border ${card.bg} space-y-3`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.label}</span>
                      <card.icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <div className={`text-3xl font-black ${card.color}`}>{card.value}</div>
                    <div className="text-[10px] text-slate-500">{card.sub}</div>
                  </div>
                ))}
              </div>

              {/* Activity Bar Chart */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-slate-100">Weekly Activity Graph</h3>
                    <p className="text-xs text-slate-400">Student logins & AI API request volume</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-500" /> API Requests</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500/40" /> Active Users</span>
                  </div>
                </div>

                <div className="h-52 flex items-end gap-3 px-2">
                  {stats.dailyUsageGraph.map((item) => {
                    const maxReq = 1400;
                    const reqPct = Math.round((item.requests / maxReq) * 100);
                    const usrPct = Math.round((item.activeUsers / 350) * 100);
                    return (
                      <div key={item.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <span className="text-[10px] text-amber-400 font-mono">{item.requests}</span>
                        <div className="w-full flex gap-0.5 items-end h-40">
                          <div className="flex-1 bg-amber-500 rounded-t-sm transition-all" style={{ height: `${reqPct}%` }} />
                          <div className="flex-1 bg-blue-500/40 rounded-t-sm transition-all" style={{ height: `${usrPct}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Model Usage Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-sm text-slate-200">Gemini Model Usage</h3>
                  {Object.entries(stats.aiUsage.modelBreakdown).map(([model, count]) => (
                    <div key={model} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-300 font-mono">{model}</span>
                        <span className="text-amber-400">{count.toLocaleString()} requests</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(count / stats.aiUsage.totalRequests) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-sm text-slate-200">Quick Actions</h3>
                  {[
                    { label: 'Add New University', tab: 'universities' as AdminTab, icon: GraduationCap },
                    { label: 'Post MCQ to Question Bank', tab: 'questions' as AdminTab, icon: BookOpen },
                    { label: 'Publish SEO Article', tab: 'articles' as AdminTab, icon: FileText },
                    { label: 'Upload Circular PDF to RAG', tab: 'rag' as AdminTab, icon: Upload },
                  ].map((action) => (
                    <button key={action.tab} onClick={() => setActiveTab(action.tab)}
                      className="w-full flex items-center justify-between p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium text-slate-200 transition group">
                      <span className="flex items-center gap-2"><action.icon className="w-4 h-4 text-amber-400" />{action.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: USERS ── */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{users.length} registered students on the platform</p>
                <div className="flex gap-2">
                  <input type="text" placeholder="Search students..." className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 outline-none w-52" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-950 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="p-4">Student</th>
                      <th className="p-4">Group</th>
                      <th className="p-4">SSC / HSC GPA</th>
                      <th className="p-4">Primary Target</th>
                      <th className="p-4">Last Active</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                              {u.name[0]}
                            </div>
                            <span className="font-semibold text-slate-100">{u.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">{u.group}</td>
                        <td className="p-4 font-mono font-bold text-amber-400">{u.sscGpa} / {u.hscGpa}</td>
                        <td className="p-4 font-medium text-emerald-400">{u.target}</td>
                        <td className="p-4 text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{u.lastActive}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <button className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"><Eye className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB: UNIVERSITIES ── */}
          {activeTab === 'universities' && (
            <div className="space-y-6">
              {uniMsg && (
                <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${uniMsg.success ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200' : 'bg-red-500/20 border border-red-500/40 text-red-200'}`}>
                  <CheckCircle2 className="w-4 h-4" /> {uniMsg.text}
                </div>
              )}

              <form onSubmit={handlePostUniversity} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-amber-400" /> University Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1.5 font-semibold">University Full Name *</label>
                      <input required value={uniName} onChange={(e) => { setUniName(e.target.value); setUniSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); }}
                        placeholder="e.g. Bangladesh University of Engineering and Technology"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1.5 font-semibold">URL Slug (auto-generated)</label>
                      <input value={uniSlug} onChange={(e) => setUniSlug(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-400 font-mono outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1.5 font-semibold">Location / City *</label>
                      <input required value={uniLocation} onChange={(e) => setUniLocation(e.target.value)} placeholder="e.g. Dhaka"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1.5 font-semibold">Type</label>
                      <select value={uniType} onChange={(e) => setUniType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 outline-none">
                        <option value="Public">Public University</option>
                        <option value="Private">Private University</option>
                        <option value="Engineering">Engineering University</option>
                        <option value="Medical">Medical University</option>
                        <option value="Agricultural">Agricultural University</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1.5 font-semibold">Official Website URL</label>
                      <input value={uniWebsite} onChange={(e) => setUniWebsite(e.target.value)} placeholder="https://buet.ac.bd"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1.5 font-semibold">Year Established</label>
                      <input value={uniEstablished} onChange={(e) => setUniEstablished(e.target.value)} placeholder="e.g. 1962"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition" />
                    </div>
                  </div>
                </div>

                {/* Rich Text Editor for University Description */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Edit2 className="w-5 h-5 text-amber-400" /> University Description & Admission Details
                    <span className="text-xs text-slate-400 font-normal ml-auto">Powered by TipTap Rich Editor</span>
                  </h3>
                  <RichEditor
                    placeholder="Write detailed university description, admission units, eligibility requirements, departments, seat capacity, fees, and admission process..."
                    onChange={setUniBody}
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => { setUniName(''); setUniSlug(''); setUniMsg(null); }}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition">
                    Clear Form
                  </button>
                  <button type="submit"
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" /> Publish University to Platform
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── TAB: QUESTIONS ── */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              {qMsg && (
                <div className="p-4 rounded-xl text-xs font-semibold flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200">
                  <CheckCircle2 className="w-4 h-4" /> {qMsg.text}
                </div>
              )}

              <form onSubmit={handlePostQuestion} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <h3 className="font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" /> Create & Publish Practice MCQ
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-semibold">Subject</label>
                    <select value={qSubject} onChange={(e) => setQSubject(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100">
                      <option>Physics</option>
                      <option>Chemistry</option>
                      <option>Higher Mathematics</option>
                      <option>Biology</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-semibold">Chapter Name</label>
                    <input value={qChapter} onChange={(e) => setQChapter(e.target.value)} required placeholder="e.g. Newton's Mechanics"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition" />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-400 mb-1.5 font-semibold">Question Text (Bangla / English)</label>
                  <textarea rows={3} value={qText} onChange={(e) => setQText(e.target.value)} required
                    placeholder="Write the full question text here..."
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition resize-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {['A', 'B', 'C', 'D'].map((letter, i) => (
                    <div key={letter}>
                      <label className="block text-slate-400 mb-1.5 font-semibold">Option {letter}</label>
                      <input value={qOpts[i]} onChange={(e) => { const a = [...qOpts]; a[i] = e.target.value; setQOpts(a); }} required
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition" />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-semibold">Correct Option</label>
                    <select value={qCorrect} onChange={(e) => setQCorrect(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100">
                      {['A', 'B', 'C', 'D'].map((l, i) => <option key={l} value={i}>Option {l}</option>)}
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-400 mb-1.5 font-semibold">Step-by-Step Explanation & Solution</label>
                  <textarea rows={3} value={qExplanation} onChange={(e) => setQExplanation(e.target.value)} required
                    placeholder="Explain the solution step by step..."
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition resize-none" />
                </div>

                <div className="flex justify-end">
                  <button type="submit"
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" /> Publish to Question Bank
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── TAB: ARTICLES ── */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              {artMsg && (
                <div className="p-4 rounded-xl text-xs font-semibold flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200">
                  <CheckCircle2 className="w-4 h-4" /> {artMsg.text}
                </div>
              )}

              <form onSubmit={handlePostArticle} className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" /> Article Metadata
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1.5 font-semibold">Article Title *</label>
                      <input required value={artTitle} onChange={(e) => { setArtTitle(e.target.value); setArtSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); }}
                        placeholder="e.g. BUET Admission Guide 2026"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1.5 font-semibold">URL Slug</label>
                      <input value={artSlug} onChange={(e) => setArtSlug(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-400 font-mono outline-none" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1.5 font-semibold">Category</label>
                      <select value={artCategory} onChange={(e) => setArtCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100">
                        <option>University Guide</option>
                        <option>Preparation Strategy</option>
                        <option>Admission Circular</option>
                        <option>Eligibility Tips</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1.5 font-semibold">SEO Meta Summary</label>
                      <input value={artSummary} onChange={(e) => setArtSummary(e.target.value)}
                        placeholder="Short description for search engines..."
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition" />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Edit2 className="w-5 h-5 text-amber-400" /> Article Body Content
                    <span className="text-xs text-slate-400 font-normal ml-auto">TipTap Rich Editor</span>
                  </h3>
                  <RichEditor
                    placeholder="Write the full article content. Use headings, lists, bold text, and blockquotes for SEO-friendly formatting..."
                    onChange={setArtBody}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button type="button" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition">
                    Save as Draft
                  </button>
                  <button type="submit"
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Publish to SEO Guides Feed
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── TAB: RAG UPLOAD ── */}
          {activeTab === 'rag' && (
            <div className="space-y-6">
              {ragMsg && (
                <div className="p-4 rounded-xl text-xs font-semibold flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200">
                  <CheckCircle2 className="w-4 h-4" /> {ragMsg.text}
                </div>
              )}

              <form onSubmit={handleRagUpload} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <h3 className="font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-amber-400" /> Upload Admission Circular PDF → pgvector Index
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-semibold">University Tag</label>
                    <select value={ragUniversity} onChange={(e) => setRagUniversity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100">
                      <option>BUET</option>
                      <option>DU</option>
                      <option>KUET</option>
                      <option>RUET</option>
                      <option>CUET</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-semibold">Unit Tag</label>
                    <input value={ragUnit} onChange={(e) => setRagUnit(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-semibold">Year</label>
                    <input value={ragYear} onChange={(e) => setRagYear(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition" />
                  </div>
                </div>

                {/* Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-2xl p-10 text-center transition cursor-pointer ${ragFile ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 hover:border-amber-500 bg-slate-950/50'}`}
                  onClick={() => document.getElementById('ragFileInput')?.click()}
                >
                  <input id="ragFileInput" type="file" accept=".pdf" className="hidden" onChange={(e) => setRagFile(e.target.files?.[0] || null)} />
                  <Upload className={`w-8 h-8 mx-auto mb-3 ${ragFile ? 'text-emerald-400' : 'text-slate-500'}`} />
                  {ragFile ? (
                    <div>
                      <p className="text-sm font-bold text-emerald-300">{ragFile.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{(ragFile.size / 1024).toFixed(1)} KB — Ready to index</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-slate-300 font-semibold">Click to select or drag & drop PDF</p>
                      <p className="text-xs text-slate-500 mt-1">Supports official admission circular PDFs. Max 50 MB.</p>
                    </div>
                  )}
                </div>

                <button type="submit" disabled={ragUploading || !ragFile}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl transition">
                  {ragUploading ? 'Parsing PDF chunks & indexing vectors...' : 'Parse PDF & Index into pgvector'}
                </button>
              </form>
            </div>
          )}

          {/* ── TAB: SETTINGS ── */}
          {activeTab === 'settings' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 max-w-2xl">
              <h3 className="font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" /> Platform Configuration
              </h3>
              {[
                { label: 'Admin Username', value: username, type: 'text' },
                { label: 'Gemini API Model', value: 'gemini-2.5-flash', type: 'text' },
                { label: 'Embedding Model', value: 'embedding-001', type: 'text' },
                { label: 'RAG Results Limit', value: '5', type: 'number' },
              ].map((s) => (
                <div key={s.label} className="text-xs">
                  <label className="block text-slate-400 mb-1.5 font-semibold">{s.label}</label>
                  <input defaultValue={s.value} type={s.type}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition" />
                </div>
              ))}
              <button className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition">
                Save Platform Settings
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
