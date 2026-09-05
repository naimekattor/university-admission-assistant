'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Lock,
  User,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Successful login, refresh router and navigate to target URL
        router.refresh();
        router.push(redirectUrl);
      } else {
        setError(data.error || 'Invalid credentials. Please verify your admin credentials.');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('admin');
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF5500] to-[#E64D00] text-white shadow-lg shadow-orange-500/30 mb-2">
          <Shield className="w-7 h-7" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-[11px] font-bold uppercase tracking-wider font-mono shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PORTAL AUTHENTICATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Admin Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Sign in to manage admission circulars, universities, and student datasets.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-orange-500/10 space-y-5">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center justify-between">
              <span>Username</span>
              <span className="text-[#FF5500]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 text-sm font-medium focus:outline-none focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/10 transition shadow-2xs"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center justify-between">
              <span>Password</span>
              <span className="text-[#FF5500]">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 text-sm font-medium focus:outline-none focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/10 transition shadow-2xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-2 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#E64D00] hover:from-[#E64D00] hover:to-[#D44000] text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Admin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Fill Helper */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Default: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">admin</code> / <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">admin</code></span>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[#FF5500] hover:text-[#E64D00] font-bold transition cursor-pointer hover:underline"
          >
            Fill Demo
          </button>
        </div>
      </div>

      {/* Return to Public Site */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#FF5500] transition"
        >
          <span>← Return to EduGuide Public Portal</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#FFFDFB] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-orange-200/35 via-orange-100/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <Suspense fallback={
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-3 border-orange-500/20 border-t-[#FF5500] rounded-full animate-spin" />
        </div>
      }>
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}
