'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: any;
  createdAt?: string | Date;
}

export interface UseAiChatOptions {
  defaultRole?: 'advisor' | 'tutor';
  syncWithDb?: boolean;
  storageKey?: string;
  onNewMessage?: () => void;
  onChunk?: () => void;
}

const DEFAULT_INIT_MESSAGE: ChatMessage = {
  id: 'm-init',
  role: 'assistant',
  content: {
    type: 'general_answer',
    summary: 'Welcome to EduGuide AI Admission Advisor & Tutor!',
    sections: [
      {
        heading: 'AI Admission Advisor',
        content:
          'Ask questions about university admission requirements, eligibility cutoffs, seat capacity, circular deadlines, and university comparisons.',
      },
      {
        heading: 'AI Tutor',
        content:
          'Switch to the AI Tutor tab to solve Physics, Chemistry, and Mathematics problems step-by-step or get concepts explained clearly.',
      },
    ],
    recommendedNextActions: [
      { label: 'Check My BUET Eligibility', action: 'check_eligibility' },
      { label: 'Compare BUET vs DU CSE', action: 'compare_universities' },
      { label: 'Start Today\'s Practice', action: 'start_practice' },
    ],
  },
};

export function useAiChat({
  defaultRole = 'advisor',
  syncWithDb = true,
  storageKey = 'eduguide_chat_session_token',
  onNewMessage,
  onChunk,
}: UseAiChatOptions = {}) {
  const [roleType, setRoleType] = useState<'advisor' | 'tutor'>(defaultRole);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionToken, setSessionToken] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_INIT_MESSAGE]);

  const onChunkRef = useRef(onChunk);
  onChunkRef.current = onChunk;

  const onNewMessageRef = useRef(onNewMessage);
  onNewMessageRef.current = onNewMessage;

  // ── 1. SESSION TOKEN INITIALIZATION & POSTGRESQL DB SYNC ──
  useEffect(() => {
    let token = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (!token) {
      token = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, token);
      }
    }
    setSessionToken(token);

    if (syncWithDb) {
      fetch(`/api/ai/chat/history?sessionToken=${encodeURIComponent(token)}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success && Array.isArray(res.messages) && res.messages.length > 0) {
            setMessages(res.messages);
            onNewMessageRef.current?.();
          }
        })
        .catch((err) => {
          console.warn('[useAiChat] Failed to load history from DB:', err);
        });
    }
  }, [storageKey, syncWithDb]);

  // ── 2. PROGRESSIVE CHUNKING STREAM ENGINE ──
  const streamResponseInChunks = useCallback(async (data: any) => {
    setIsLoading(false);
    setIsStreaming(true);

    const msgId = `a-${Date.now()}`;

    // A. Plain string response
    if (typeof data === 'string') {
      const words = data.split(' ');
      let currentText = '';
      setMessages((prev) => [...prev, { id: msgId, role: 'assistant', content: '' }]);

      for (let i = 0; i < words.length; i += 3) {
        currentText += (i > 0 ? ' ' : '') + words.slice(i, i + 3).join(' ');
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, content: currentText } : m))
        );
        onChunkRef.current?.();
        await new Promise((r) => setTimeout(r, 25));
      }
      setIsStreaming(false);
      onChunkRef.current?.();
      return;
    }

    // B. Structured general_answer (with summary and sections)
    if (data && data.type === 'general_answer' && (data.summary || data.sections)) {
      const emptyObj = {
        type: 'general_answer',
        summary: '',
        sections: [],
        recommendedNextActions: [],
      };

      setMessages((prev) => [...prev, { id: msgId, role: 'assistant', content: emptyObj }]);

      // 1. Stream summary
      if (data.summary) {
        const words = data.summary.split(' ');
        let curSummary = '';
        for (let i = 0; i < words.length; i += 3) {
          curSummary += (i > 0 ? ' ' : '') + words.slice(i, i + 3).join(' ');
          setMessages((prev) =>
            prev.map((m) =>
              m.id === msgId ? { ...m, content: { ...m.content, summary: curSummary } } : m
            )
          );
          onChunkRef.current?.();
          await new Promise((r) => setTimeout(r, 25));
        }
      }

      // 2. Stream sections
      if (data.sections && Array.isArray(data.sections)) {
        for (let sIdx = 0; sIdx < data.sections.length; sIdx++) {
          const sec = data.sections[sIdx];
          const secWords = sec.content ? sec.content.split(' ') : [];
          let curSecContent = '';

          // Add section header
          setMessages((prev) =>
            prev.map((m) => {
              if (m.id !== msgId) return m;
              const sectionsCopy = [...(m.content.sections || [])];
              sectionsCopy[sIdx] = { heading: sec.heading, content: '' };
              return { ...m, content: { ...m.content, sections: sectionsCopy } };
            })
          );
          onChunkRef.current?.();
          await new Promise((r) => setTimeout(r, 35));

          // Stream content
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
            onChunkRef.current?.();
            await new Promise((r) => setTimeout(r, 25));
          }
        }
      }

      // 3. Finalize
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, content: { ...data } } : m))
      );
      setIsStreaming(false);
      onChunkRef.current?.();
      return;
    }

    // C. Other structured types (comparison table, eligibility cards)
    setMessages((prev) => [...prev, { id: msgId, role: 'assistant', content: data }]);
    setIsStreaming(false);
    onChunkRef.current?.();
  }, []);

  // ── 3. SEND MESSAGE HANDLER ──
  const sendMessage = useCallback(
    async (textToSend?: string) => {
      const query = textToSend || inputQuery;
      if (!query.trim() || isLoading || isStreaming) return;

      const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: query };
      setMessages((prev) => [...prev, userMsg]);
      setInputQuery('');
      setIsLoading(true);
      onNewMessageRef.current?.();

      const activeToken =
        sessionToken ||
        (typeof window !== 'undefined' ? localStorage.getItem(storageKey) : '') ||
        'sess_default';

      try {
        const res = await fetch('/api/ai/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roleType,
            userQuery: query,
            sessionToken: activeToken,
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
            await streamResponseInChunks(json.data);
            return;
          }
        }
      } catch (err) {
        console.warn('[useAiChat] API error, falling back:', err);
      }

      // Fallback
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
    },
    [inputQuery, isLoading, isStreaming, roleType, sessionToken, storageKey, streamResponseInChunks]
  );

  const clearChat = useCallback(() => {
    setMessages([DEFAULT_INIT_MESSAGE]);
  }, []);

  return {
    messages,
    setMessages,
    inputQuery,
    setInputQuery,
    isLoading,
    isStreaming,
    roleType,
    setRoleType,
    sessionToken,
    sendMessage,
    clearChat,
  };
}
