'use client';

import React, { useState } from 'react';
import { Send, Bot, Sparkles, User, RefreshCw, BookOpen, Target, Award } from 'lucide-react';
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
      // Send request to Express API or mock fallbacks
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-4xl mx-auto flex flex-col h-[calc(100vh-2rem)]">
      
      {/* Header & Role Switcher Tabs */}
      <div className="space-y-4 border-b border-slate-800 pb-4 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Bot className="w-4 h-4" /> EduGuide AI Assistance Engine
            </div>
            <h1 className="text-2xl font-black text-white">AI Admission Advisor & Tutor</h1>
          </div>

          {/* Role Tabs */}
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setRoleType('advisor')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${roleType === 'advisor' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Target className="w-4 h-4" /> AI Admission Advisor
            </button>
            <button
              onClick={() => setRoleType('tutor')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${roleType === 'tutor' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <BookOpen className="w-4 h-4" /> AI Tutor
            </button>
          </div>
        </div>
      </div>

      {/* Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl ${m.role === 'user' ? 'bg-amber-500 text-slate-950 font-medium px-4 py-3 rounded-2xl rounded-tr-none text-sm' : 'w-full'}`}>
              {m.role === 'user' ? (
                m.content
              ) : (
                <StructuredAiMessageRenderer response={m.content} />
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>{roleType === 'tutor' ? 'AI Tutor analyzing concept and deriving solution...' : 'AI Advisor retrieving official circulars and verifying eligibility...'}</span>
          </div>
        )}
      </div>

      {/* Quick Prompts & Input Area */}
      <div className="space-y-3 shrink-0 pt-2 border-t border-slate-800">
        <div className="flex flex-wrap gap-2">
          {(roleType === 'advisor' ? quickPromptsAdvisor : quickPromptsTutor).map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-xs bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 px-3 py-1.5 rounded-lg transition"
            >
              {p}
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
            placeholder={roleType === 'advisor' ? 'Ask about BUET eligibility, deadlines, cutoffs...' : 'Ask AI Tutor to solve Physics/Math problems...'}
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-2 transition shrink-0"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </div>

    </div>
  );
}
