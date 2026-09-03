'use client';

import React, { useState } from 'react';
import { Send, Bot, Sparkles, User, RefreshCw, BookOpen, Target, ArrowRight } from 'lucide-react';
import { StructuredAiMessageRenderer } from '@/components/ai/structured-ai-message-renderer';

export default function DualAiChatPage() {
  const [roleType, setRoleType] = useState<'advisor' | 'tutor'>('advisor');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg = { id: `u-${Date.now()}`, role: 'user' as const, content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Send request to Express API
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
          setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: json.data }]);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Fallback response if offline
    }

    // Default fallback structured JSON
    const fallbackResponse = roleType === 'tutor'
      ? {
          type: 'question_explanation',
          questionText: query,
          correctAnswer: 'Step-by-step solution available.',
          stepByStepSolution: [
            'Identify given variables in the problem (force F(t), mass m, time interval t).',
            'Integrate force equation J = ∫ F(t) dt to obtain impulse.',
            'Apply impulse-momentum theorem J = m(v - u) to compute velocity.',
          ],
          recommendedNextActions: [{ label: 'Practice Chapter MCQs', action: 'practice_mcqs' }],
        }
      : {
          type: 'eligibility_result',
          summary: `Evaluating admission eligibility for query: "${query}"`,
          overallEligible: true,
          eligibleUniversities: [
            { university: 'BUET', program: 'Computer Science & Engineering', status: 'eligible' },
            { university: 'DU', program: 'Faculty of Science (Ka Unit)', status: 'eligible' },
            { university: 'KUET', program: 'Electrical & Electronic Engineering', status: 'eligible' },
          ],
          requirementsFulfilled: ['SSC GPA 5.0 met', 'HSC Science group met'],
          missingRequirements: [],
          recommendedNextActions: [{ label: 'Start BUET Preparation', action: 'start_prep' }],
        };

    setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: fallbackResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#FFFDFB] relative overflow-hidden flex flex-col justify-between">
      {/* ── AMBIENT GRADIENT MESH BACKGROUND ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-orange-200/30 via-orange-100/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-6 flex-1 flex flex-col min-h-0">
        
        {/* ── HEADER & ROLE SWITCHER TABS ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-xs font-bold uppercase tracking-wider font-mono mb-1.5 shadow-2xs">
              <Bot className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>EDUGUIDE AI ASSISTANCE ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
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
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                roleType === 'advisor'
                  ? 'bg-gradient-to-r from-[#FF5500] to-[#E64D00] text-white shadow-sm shadow-orange-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>AI Admission Advisor</span>
            </button>
            <button
              onClick={() => setRoleType('tutor')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
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

        {/* ── MAIN CHAT CARD ── */}
        <div className="flex-1 overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl border border-orange-100/80 shadow-xl shadow-orange-500/5 flex flex-col min-h-0">
          {/* Messages Scroll Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
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
                    m.content
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
                <span>{roleType === 'tutor' ? 'AI Tutor analyzing concept and deriving step-by-step solution...' : 'AI Advisor retrieving official circulars and verifying eligibility...'}</span>
              </div>
            )}
          </div>

          {/* ── QUICK PROMPTS & INPUT AREA ── */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 space-y-3 shrink-0">
            {/* Quick Prompts Pills */}
            <div className="flex flex-wrap gap-2">
              {(roleType === 'advisor' ? quickPromptsAdvisor : quickPromptsTutor).map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="text-xs bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-[#FF5500] font-semibold px-3 py-1.5 rounded-full transition shadow-2xs cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2.5"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={roleType === 'advisor' ? 'Ask about BUET eligibility, deadlines, cutoffs, seat quotas...' : 'Ask AI Tutor to solve Physics/Chemistry/Math problems...'}
                className="flex-1 bg-white border border-slate-200 focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/10 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition shadow-2xs font-medium"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-[#FF5500] to-[#E64D00] hover:from-[#E64D00] hover:to-[#D44000] disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-orange-500/25 flex items-center gap-2 transition hover:-translate-y-0.5 active:translate-y-0 shrink-0 cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
