'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Maximize2,
  RefreshCw,
  Target,
  BookOpen,
  ArrowRight,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  actions?: Array<{ label: string; href?: string; query?: string }>;
}

export function FloatingAiChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [roleType, setRoleType] = useState<'advisor' | 'tutor'>('advisor');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      text: 'Hi! I am your EduGuide AI Admission Advisor & Tutor. Ask me about 2026 university eligibility cutoffs, circular deadlines, or step-by-step problem solving!',
      actions: [
        { label: 'Check BUET Eligibility', query: 'What is BUET CSE eligibility requirement for 2026?' },
        { label: 'Compare DU vs BUET', query: 'Compare DU Ka Unit vs BUET Ka Unit seats and cutoffs' },
        { label: 'Solve Physics Problem', query: 'Explain Newton\'s Second Law with an impulse example' },
      ],
    },
  ]);

  // Don't render floating widget on the dedicated full-screen /chat page
  const isDedicatedChatPage = pathname === '/chat';

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (customQuery?: string) => {
    const query = customQuery || inputQuery;
    if (!query.trim() || isLoading) return;

    setHasInteracted(true);
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleType,
          userQuery: query,
          studentContext: {
            primaryGoal: 'BUET CSE',
            sscGpa: 5.0,
            hscGpa: 5.0,
            academicGroup: 'Science',
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const aiText =
            typeof json.data === 'string'
              ? json.data
              : json.data.summary ||
              json.data.questionText ||
              json.data.title ||
              'Here is what I found for your admission inquiry.';

          const actions = json.data.recommendedNextActions?.map((act: any) => ({
            label: act.label,
            href: '/prepare',
          }));

          setMessages((prev) => [
            ...prev,
            {
              id: `a-${Date.now()}`,
              role: 'assistant',
              text: aiText,
              actions,
            },
          ]);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Handled by fallback
    }

    // Fallback answer
    setTimeout(() => {
      const fallbackText =
        roleType === 'tutor'
          ? `For "${query}":\n• Step 1: Identify given quantities.\n• Step 2: Apply core formulas (F = ma, J = ∫F dt).\n• Step 3: Solve for unknown variables with unit verification.`
          : `Official 2026 Circular Status for "${query}":\n• BUET & Engineering clusters require SSC & HSC GPA 4.00+ with Math, Physics, Chemistry.\n• Medical DGHS permits 2nd-time applicants (Pass years: 2024, 2025, 2026).\n• Circulars for 2026-2027 are actively scheduled for release.`;

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: fallbackText,
          actions: [
            { label: 'Explore Full Eligibility', href: '/eligibility' },
            { label: 'Open Dedicated Chat', href: '/chat' },
          ],
        },
      ]);
      setIsLoading(false);
    }, 400);
  };

  if (isDedicatedChatPage) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* ── FLOATING CHAT WINDOW MODAL ── */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-[420px] h-[560px] max-h-[82vh] bg-white/95 backdrop-blur-xl border border-orange-100/90 rounded-3xl shadow-2xl shadow-orange-500/15 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">

          {/* Header Bar */}
          <div className="px-5 py-3.5 bg-white border-b border-orange-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-2xl bg-orange-50 border border-orange-200 overflow-hidden flex items-center justify-center shadow-2xs">
                <Image
                  src="/images/ai-advisor-icon.svg"
                  alt="AI Advisor"
                  width={36}
                  height={36}
                  className="object-contain"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-slate-900">EduGuide AI</h3>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-orange-50 text-[#FF5500] border border-orange-200 font-mono">
                    ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Admission Advisor & Tutor</p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <Link
                href="/chat"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                title="Open Fullscreen Chat"
              >
                <Maximize2 className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Role Mode Toggle Strip */}
          <div className="px-5 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Mode:</span>
            <div className="flex p-0.5 bg-slate-200/80 rounded-xl">
              <button
                onClick={() => setRoleType('advisor')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${roleType === 'advisor'
                    ? 'bg-gradient-to-r from-[#FF5500] to-[#E64D00] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Target className="w-3 h-3" />
                <span>Advisor</span>
              </button>
              <button
                onClick={() => setRoleType('tutor')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${roleType === 'tutor'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>Tutor</span>
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-orange-50 border border-orange-200 text-[#FF5500] flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] text-xs leading-relaxed space-y-2.5 ${m.role === 'user'
                      ? 'bg-gradient-to-r from-[#FF5500] to-[#E64D00] text-white font-medium p-3.5 rounded-2xl rounded-tr-xs shadow-sm shadow-orange-500/20'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 p-3.5 rounded-2xl rounded-tl-xs shadow-2xs'
                    }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Suggestion / Action Chips */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.actions.map((act, i) =>
                        act.href ? (
                          <Link key={i} href={act.href}>
                            <button className="px-2.5 py-1 bg-white hover:bg-orange-50 border border-orange-200 text-[#FF5500] text-[10px] font-bold rounded-lg flex items-center gap-1 transition shadow-2xs cursor-pointer">
                              <span>{act.label}</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          </Link>
                        ) : (
                          <button
                            key={i}
                            onClick={() => handleSend(act.query || act.label)}
                            className="px-2.5 py-1 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-[#FF5500] text-[10px] font-bold rounded-lg flex items-center gap-1 transition shadow-2xs cursor-pointer"
                          >
                            <span>{act.label}</span>
                            <Sparkles className="w-2.5 h-2.5 text-[#FF5500]" />
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#FF5500] font-bold p-2.5 bg-orange-50/80 border border-orange-100 rounded-xl w-fit animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FF5500]" />
                <span>Thinking & retrieving data...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={roleType === 'advisor' ? 'Ask about eligibility, cutoffs, dates...' : 'Ask Physics/Chemistry/Math problem...'}
                className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition font-medium"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="px-4 py-2.5 bg-gradient-to-r from-[#FF5500] to-[#E64D00] hover:from-[#E64D00] hover:to-[#D44000] disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/25 flex items-center justify-center transition cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── FLOATING TRIGGER BUTTON (AVATAR ICON) ── */}
      <div className="relative group">
        {!isOpen && !hasInteracted && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-white border border-orange-200 shadow-lg text-xs font-bold text-slate-800 whitespace-nowrap pointer-events-none flex items-center gap-1.5 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Chat with AI Advisor</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-orange-200 hover:border-[#FF5500] p-1.5 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
          aria-label="Open EduGuide AI Chat"
        >
          {/* Subtle Ambient Pulse Ring */}
          <span className="absolute inset-0 rounded-full bg-[#FF5500]/20 animate-ping pointer-events-none" />

          {/* AI Advisor Avatar from public/images/ai-advisor-icon.svg */}
          <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
            <Image
              src="/images/ai-advisor-icon.svg"
              alt="EduGuide AI Advisor"
              width={56}
              height={56}
              className="object-contain transform group-hover:scale-110 transition duration-300"
            />
          </div>

          {/* Active Status Dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
        </button>
      </div>
    </div>
  );
}
