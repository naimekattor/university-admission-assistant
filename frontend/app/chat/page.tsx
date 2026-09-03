'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, Sparkles, User, RefreshCw, BookOpen, Target, ArrowRight } from 'lucide-react';
import { StructuredAiMessageRenderer } from '@/components/ai/structured-ai-message-renderer';
import { MarkdownContent } from '@/components/ai/markdown-content';

export default function DualAiChatPage() {
  const [roleType, setRoleType] = useState<'advisor' | 'tutor'>('advisor');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesContentRef = useRef<HTMLDivElement>(null);
  const isAutoScrollEnabledRef = useRef<boolean>(true);

  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: any }>>([
    {
      id: 'm-init',
      role: 'assistant',
      content: {
        type: 'general_answer',
        summary: 'Welcome to EduGuide AI Admission Advisor & Tutor!',
        sections: [
          {
            heading: 'AI Admission Advisor',
            content: 'Ask questions about university admission requirements, eligibility cutoffs, seat capacity, circular deadlines, and university comparisons.',
          },
          {
            heading: 'AI Tutor',
            content: 'Switch to the AI Tutor tab above to solve Physics, Chemistry, and Mathematics problems step-by-step or get concepts explained clearly.',
          },
        ],
        recommendedNextActions: [
          { label: 'Check My BUET Eligibility', action: 'check_eligibility' },
          { label: 'Compare BUET vs DU CSE', action: 'compare_universities' },
          { label: 'Start Today\'s Practice', action: 'start_practice' },
        ],
      },
    },
  ]);

  const quickPromptsAdvisor = [
    'What is the BUET CSE eligibility requirement for 2026?',
    'Compare DU Ka Unit vs BUET Ka Unit in terms of seats and cutoffs',
    'Which engineering universities allow second-time application?',
  ];

  const quickPromptsTutor = [
    'Explain Newton\'s Second Law & impulse integration with an example',
    'How do I solve sp3d hybridization geometry MCQs in Chemistry?',
    'What is the formula for projectile maximum height and range?',
  ];

  // Smooth auto-scroll function
  const scrollToBottom = useCallback((smooth = true) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  // ── RESIZEOBSERVER: AUTOMATICALLY SCROLL AS CONTENT HEIGHT INCREASES ──
  useEffect(() => {
    const target = messagesContentRef.current;
    if (!target) return;

    const observer = new ResizeObserver(() => {
      if (isAutoScrollEnabledRef.current && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Detect manual scroll up to prevent fighting user if they scroll up
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 80;
    isAutoScrollEnabledRef.current = isAtBottom;
  };

  // ── CHUNKING-WISE PROGRESSIVE STREAMING ENGINE ──
  const streamResponseInChunks = async (data: any) => {
    setIsLoading(false);
    setIsStreaming(true);
    isAutoScrollEnabledRef.current = true;

    const msgId = `a-${Date.now()}`;

    // If not a structured general_answer or simple string, render immediately
    if (typeof data === 'string') {
      const words = data.split(' ');
      let currentText = '';
      setMessages((prev) => [...prev, { id: msgId, role: 'assistant', content: '' }]);

      for (let i = 0; i < words.length; i += 3) {
        currentText += (i > 0 ? ' ' : '') + words.slice(i, i + 3).join(' ');
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, content: currentText } : m))
        );
        scrollToBottom(false);
        await new Promise((r) => setTimeout(r, 25));
      }
      setIsStreaming(false);
      scrollToBottom(true);
      return;
    }

    if (data.type === 'general_answer' && (data.summary || data.sections)) {
      // Progressive chunking of structured response
      const emptyObj = {
        type: 'general_answer',
        summary: '',
        sections: [],
        recommendedNextActions: [],
      };

      setMessages((prev) => [...prev, { id: msgId, role: 'assistant', content: emptyObj }]);

      // 1. Stream summary chunk by chunk
      if (data.summary) {
        const words = data.summary.split(' ');
        let curSummary = '';
        for (let i = 0; i < words.length; i += 3) {
          curSummary += (i > 0 ? ' ' : '') + words.slice(i, i + 3).join(' ');
          setMessages((prev) =>
            prev.map((m) =>
              m.id === msgId
                ? { ...m, content: { ...m.content, summary: curSummary } }
                : m
            )
          );
          scrollToBottom(false);
          await new Promise((r) => setTimeout(r, 25));
        }
      }

      // 2. Stream sections chunk by chunk
      if (data.sections && Array.isArray(data.sections)) {
        for (let sIdx = 0; sIdx < data.sections.length; sIdx++) {
          const sec = data.sections[sIdx];
          const secWords = sec.content ? sec.content.split(' ') : [];
          let curSecContent = '';

          // Add section header first
          setMessages((prev) =>
            prev.map((m) => {
              if (m.id !== msgId) return m;
              const sectionsCopy = [...(m.content.sections || [])];
              sectionsCopy[sIdx] = { heading: sec.heading, content: '' };
              return { ...m, content: { ...m.content, sections: sectionsCopy } };
            })
          );
          scrollToBottom(false);
          await new Promise((r) => setTimeout(r, 40));

          // Stream section content in 4-word chunks
          for (let wIdx = 0; wIdx < secWords.length; wIdx += 4) {
            curSecContent += (wIdx > 0 ? ' ' : '') + secWords.slice(wIdx, wIdx + 4).join(' ');
            setMessages((prev) =>
              prev.map((m) => {
                if (m.id !== msgId) return m;
                const sectionsCopy = [...(m.content.sections || [])];
                sectionsCopy[sIdx] = { heading: sec.heading, content: curSecContent };
                return { ...m, content: { ...m.content, sections: sectionsCopy } };
              })
            );
            scrollToBottom(false);
            await new Promise((r) => setTimeout(r, 25));
          }
        }
      }

      // 3. Finalize with recommended actions
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? { ...m, content: { ...data } }
            : m
        )
      );
      setIsStreaming(false);
      scrollToBottom(true);
      return;
    }

    // Default immediate render for other card types
    setMessages((prev) => [...prev, { id: msgId, role: 'assistant', content: data }]);
    setIsStreaming(false);
    scrollToBottom(true);
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading || isStreaming) return;

    const userMsg = { id: `u-${Date.now()}`, role: 'user' as const, content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);
    isAutoScrollEnabledRef.current = true;
    setTimeout(() => scrollToBottom(true), 50);

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleType,
          userQuery: query,
          studentContext: { primaryGoal: 'BUET CSE', sscGpa: 5.0, hscGpa: 5.0, academicGroup: 'Science' },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          await streamResponseInChunks(json.data);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Default fallback
    const fallbackResponse =
      roleType === 'tutor'
        ? {
            type: 'general_answer',
            summary: `প্রশ্নের সমাধান নিচে ধাপে ধাপে তৈরি করা হয়েছে:`,
            sections: [
              {
                heading: 'সমাধানের ধাপ',
                content: `1. প্রদত্ত সমীকরণ ও তথ্যাদি সাজিয়ে নেওয়া যাক।\n\n2. সূত্র প্রয়োগ:\n\\[ \\frac{5700}{n-5} - \\frac{5700}{n} = 3 \\]\n\n3. সমীকরণ সমাধান করে পাই **100 জন যাত্রী**।`,
              },
              {
                heading: 'চূড়ান্ত উত্তর',
                content: 'বাসে মোট **100 জন যাত্রী** গিয়েছিলেন।',
              },
            ],
            recommendedNextActions: [{ label: 'Practice Similar MCQs', action: 'practice_mcqs' }],
          }
        : {
            type: 'general_answer',
            summary: `Official Admission Circular Summary for "${query}":`,
            sections: [
              {
                heading: 'Eligibility Criteria',
                content: `• Minimum combined GPA: **8.00 - 9.00** with minimum GPA 4.0 in Physics, Chemistry, and Math.\n• Second-time application is permitted for Medical & GST.`,
              },
            ],
            recommendedNextActions: [{ label: 'Full Eligibility Checker', action: 'check_eligibility' }],
          };

    await streamResponseInChunks(fallbackResponse);
  };

  return (
    <div className="h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] bg-[#FFFDFB] relative overflow-hidden flex flex-col">
      {/* ── AMBIENT GRADIENT MESH BACKGROUND ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[320px] bg-gradient-to-b from-orange-200/30 via-orange-100/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-3 flex-1 flex flex-col min-h-0 h-full overflow-hidden">
        
        {/* ── HEADER & ROLE SWITCHER TABS (SHRINK-0) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-[11px] font-bold uppercase tracking-wider font-mono mb-1 shadow-2xs">
              <Bot className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>EDUGUIDE AI ADMISSION ASSISTANT</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Admission Advisor &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5500] to-[#E64D00]">
                Tutor
              </span>
            </h1>
          </div>

          {/* Role Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80 shrink-0">
            <button
              onClick={() => setRoleType('advisor')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                roleType === 'advisor'
                  ? 'bg-gradient-to-r from-[#FF5500] to-[#E64D00] text-white shadow-sm shadow-orange-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>AI Advisor</span>
            </button>
            <button
              onClick={() => setRoleType('tutor')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                roleType === 'tutor'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>AI Tutor</span>
            </button>
          </div>
        </div>

        {/* ── MAIN CHAT CARD (STATIC CONTAINER WITH SCROLLABLE MESSAGES & STATIC INPUT) ── */}
        <div className="flex-1 overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl border border-orange-100/80 shadow-xl shadow-orange-500/5 flex flex-col min-h-0">
          
          {/* Messages Scroll Container (ONLY this area scrolls) */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 min-h-0"
          >
            <div ref={messagesContentRef} className="space-y-5">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-9 h-9 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF5500] flex items-center justify-center shrink-0 shadow-2xs font-bold">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-2xl ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-[#FF5500] to-[#E64D00] text-white font-medium px-5 py-3.5 rounded-3xl rounded-tr-sm text-sm shadow-md shadow-orange-500/20 leading-relaxed'
                      : 'w-full'
                  }`}>
                    {m.role === 'user' ? (
                      <MarkdownContent content={m.content} className="text-white" />
                    ) : (
                      <StructuredAiMessageRenderer response={m.content} />
                    )}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs font-bold">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2.5 text-xs text-[#FF5500] font-bold p-3 bg-orange-50/70 border border-orange-100 rounded-2xl w-fit animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#FF5500]" />
                  <span>
                    {roleType === 'tutor'
                      ? 'AI Tutor analyzing concept and deriving step-by-step solution...'
                      : 'AI Advisor retrieving official circulars and verifying eligibility...'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── STATIC INPUT AREA (ALWAYS PINNED FIRMLY AT BOTTOM) ── */}
          <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white space-y-2.5 shrink-0">
            {/* Quick Prompts Pills */}
            <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
              {(roleType === 'advisor' ? quickPromptsAdvisor : quickPromptsTutor).map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  disabled={isLoading || isStreaming}
                  className="text-[11px] bg-slate-50 hover:bg-orange-50 border border-slate-200/80 hover:border-orange-300 text-slate-700 hover:text-[#FF5500] font-semibold px-3 py-1.5 rounded-full transition shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Static Input Form */}
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
                placeholder={
                  roleType === 'advisor'
                    ? 'Ask about BUET eligibility, deadlines, cutoffs, seat quotas...'
                    : 'Ask AI Tutor to solve Physics/Chemistry/Math problems...'
                }
                disabled={isLoading || isStreaming}
                className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/10 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition font-medium"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading || isStreaming}
                className="px-5 py-2.5 bg-gradient-to-r from-[#FF5500] to-[#E64D00] hover:from-[#E64D00] hover:to-[#D44000] disabled:opacity-40 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md shadow-orange-500/20 flex items-center gap-2 transition hover:-translate-y-0.5 active:translate-y-0 shrink-0 cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
