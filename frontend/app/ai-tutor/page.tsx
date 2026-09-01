'use client';

import React, { useState } from 'react';
import { StudentShell } from '@/components/layout/student-shell';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  AlertCircle,
  Clock,
  ArrowRight,
  User,
  PanelRightOpen,
  PanelRightClose,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AiTutorPage() {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContext, setShowContext] = useState(true);

  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([
    {
      id: 'm1',
      role: 'assistant',
      content:
        'Hello Naim! I am your AI Admission Tutor. I have loaded your current goal (BUET CSE) and recent weak topics (Organic Chemistry & Newton\'s Mechanics). How can I assist with your preparation today?',
    },
  ]);

  const quickPrompts = [
    "Explain Impulse integration formula: J = ∫ F(t) dt with an example",
    "Why does benzene undergo electrophilic substitution instead of addition?",
    "Solve limit x->0 (sin 5x / x) step-by-step",
  ];

  const handleSend = async (queryToSend?: string) => {
    const query = queryToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', content: query }]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleType: 'tutor',
          userQuery: query,
          studentContext: { primaryGoal: 'BUET CSE', weakTopic: 'Organic Chemistry' },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.summary) {
          setMessages((prev) => [
            ...prev,
            { id: `a-${Date.now()}`, role: 'assistant', content: json.data.summary },
          ]);
          setIsLoading(false);
          return;
        }
      }
    } catch {}

    // Fallback response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: `Here is the step-by-step concept breakdown for "${query}":\n\n1. **Core Principle**: In physics and admission math, identifying the given differential variables first gives immediate clarity.\n2. **Formula Derivation**: Apply standard integration bounds or reagent conditions.\n3. **BUET / DU Standard Tip**: When answering under 60-second time limits, simplify constants first to avoid calculation errors.`,
        },
      ]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <StudentShell
      pageTitle="AI Personal Admission Tutor"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'AI Tutor' }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start h-[calc(100vh-12rem)]">
        
        {/* LEFT COLUMN: CONVERSATION STREAM (2/3) */}
        <div className="lg:col-span-2 eg-card flex flex-col h-full p-0 overflow-hidden">
          
          {/* Tutor Chat Header */}
          <div className="p-4 border-b border-[var(--eg-border)] bg-[var(--eg-surface)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--eg-primary-soft)] text-[var(--eg-primary)] flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--eg-text-primary)]">AI Admission Tutor</div>
                <div className="text-caption text-[var(--eg-text-muted)]">Context-aware physics, math & chemistry tutoring</div>
              </div>
            </div>

            <button
              onClick={() => setShowContext(!showContext)}
              className="lg:hidden p-1.5 rounded-lg border border-[var(--eg-border)] text-xs text-[var(--eg-text-secondary)]"
            >
              {showContext ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-[var(--eg-primary-soft)] text-[var(--eg-primary)] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-4 rounded-xl text-sm leading-relaxed max-w-xl ${
                    m.role === 'user'
                      ? 'bg-[var(--eg-primary)] text-white font-medium rounded-tr-none'
                      : 'bg-[var(--eg-surface-subtle)] text-[var(--eg-text-primary)] border border-[var(--eg-border)] rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-[var(--eg-text-primary)] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                    N
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[var(--eg-primary)] font-semibold p-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI Tutor analyzing question and retrieving admission guidelines...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts & Input Box */}
          <div className="p-4 border-t border-[var(--eg-border)] bg-[var(--eg-surface)] space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp)}
                  className="text-caption bg-[var(--eg-surface-subtle)] hover:bg-[var(--eg-primary-soft)] text-[var(--eg-text-secondary)] hover:text-[var(--eg-primary)] px-2.5 py-1 rounded-md border border-[var(--eg-border)] transition text-left"
                >
                  {qp}
                </button>
              ))}
            </div>

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
                placeholder="Ask AI Tutor to solve a physics, math, or chemistry question..."
                className="eg-input flex-1"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="btn btn-primary font-bold shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Ask Tutor</span>
              </button>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: STUDENT ADAPTIVE CONTEXT PANEL (1/3) */}
        {showContext && (
          <div className="space-y-4">
            
            {/* Student Context Card */}
            <div className="eg-card space-y-3">
              <div className="text-overline text-[var(--eg-text-muted)]">ACTIVE STUDENT CONTEXT</div>
              
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[var(--eg-surface-subtle)] border border-[var(--eg-border)] flex items-center justify-between">
                  <span className="text-[var(--eg-text-muted)]">Target Goal:</span>
                  <span className="font-bold text-[var(--eg-primary)]">BUET — CSE</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--eg-surface-subtle)] border border-[var(--eg-border)] flex items-center justify-between">
                  <span className="text-[var(--eg-text-muted)]">Active Lesson:</span>
                  <span className="font-semibold text-[var(--eg-text-primary)]">Newton's Second Law</span>
                </div>
              </div>
            </div>

            {/* Identified Weak Topics Card */}
            <div className="eg-card space-y-3">
              <div className="text-overline text-[var(--eg-error)] font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>IDENTIFIED WEAK TOPICS</span>
              </div>

              <div className="space-y-2 text-xs">
                <div
                  onClick={() => handleSend('How do I master Organic Chemistry reaction reagents for BUET?')}
                  className="p-2.5 rounded-lg bg-[var(--eg-error-soft)] border border-[var(--eg-error)]/20 cursor-pointer hover:border-[var(--eg-error)] transition"
                >
                  <div className="font-semibold text-[var(--eg-text-primary)]">Organic Chemistry Reagents</div>
                  <div className="text-[11px] text-[var(--eg-error)]">43% accuracy • Click to ask tutor</div>
                </div>

                <div
                  onClick={() => handleSend('Explain impulse momentum integration in Newton Mechanics')}
                  className="p-2.5 rounded-lg bg-[var(--eg-warning-soft)] border border-[var(--eg-warning)]/20 cursor-pointer hover:border-[var(--eg-warning)] transition"
                >
                  <div className="font-semibold text-[var(--eg-text-primary)]">Newton Impulse Integration</div>
                  <div className="text-[11px] text-[var(--eg-warning)]">48% accuracy • Click to ask tutor</div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </StudentShell>
  );
}
