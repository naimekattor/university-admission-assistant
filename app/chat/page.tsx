'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Send,
  Home,
  Menu,
  X,
  Plus,
  Sparkles,
  Bot,
  User,
  GraduationCap,
  BookOpen,
  Award,
  Upload,
  RotateCcw,
  Loader2,
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const quickTopics = [
  {
    title: 'DU Ka & Kha Unit Eligibility',
    desc: 'SSC/HSC GPA cutoffs, subject criteria & mark breakdown for Dhaka University',
    query: 'What are the eligibility requirements and mark details for DU Ka Unit and Kha Unit?',
    icon: GraduationCap,
  },
  {
    title: 'BUET & Engineering Admission',
    desc: 'Minimum HSC math/physics/chemistry scores & application phases for BUET, KUET, RUET',
    query: 'What are the minimum HSC GPA and subject requirement details for BUET and Engineering admission?',
    icon: Award,
  },
  {
    title: 'GST Cluster Varsity Process',
    desc: 'Science, Humanities & Business Studies group mark calculation in GST Cluster',
    query: 'Explain GST Cluster university admission process, unit categories, and scoring rules.',
    icon: BookOpen,
  },
  {
    title: 'Unit Selection & Circular Guide',
    desc: 'Understanding Ka, Kha, Ga, Gha & Cha unit circulars in Bangladeshi universities',
    query: 'How are Ka, Kha, Ga, Gha, and Cha units categorized in Bangladeshi public universities?',
    icon: Sparkles,
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Clean raw AI SDK protocol markers like `0:"text"` if present in streams
  const cleanChunkText = (raw: string): string => {
    return raw.replace(/^0:"(.*)"\r?\n?/gm, (match, p1) => {
      try {
        return JSON.parse(`"${p1}"`);
      } catch {
        return p1;
      }
    });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const newHistory: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newHistory);
    setIsLoading(true);

    // Add empty assistant placeholder for real-time token streaming & typing indicator
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response reader available');

      let accumulated = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const cleaned = cleanChunkText(chunk);
        accumulated += cleaned;

        // Progressive chunking-wise streaming update
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: accumulated,
          };
          return updated;
        });
      }
    } catch (error) {
      console.error('Streaming error:', error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Sorry, there was an issue retrieving response. Please check local server status and try again.',
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    if (isLoading) return;
    setMessages([]);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Theme Consistent */}
      <aside
        className={`fixed md:relative z-50 w-72 bg-card border-r border-border h-screen flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand & New Chat */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition">
              <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-foreground">EduGuide</span>
                <span className="block text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
                  Bangladesh Admission
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-muted-foreground hover:text-foreground p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <Button
            onClick={handleNewChat}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground justify-start gap-2.5 rounded-xl text-sm font-medium py-2.5 shadow-sm transition disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            New Chat Session
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Actions
          </div>

          <Link
            href="/eligibility"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-secondary hover:text-secondary-foreground transition group"
          >
            <Award className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span>Check Eligibility</span>
          </Link>

          <Link
            href="/recommendations"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-secondary hover:text-secondary-foreground transition group"
          >
            <Sparkles className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span>Smart Recommendations</span>
          </Link>

          <Link
            href="/universities"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-secondary hover:text-secondary-foreground transition group"
          >
            <BookOpen className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span>Browse Universities</span>
          </Link>

          <Link
            href="/admin/upload"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-secondary hover:text-secondary-foreground transition group"
          >
            <Upload className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span>Upload Unit Circulars</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <Link href="/">
            <Button
              variant="outline"
              className="w-full justify-start gap-2.5 text-muted-foreground hover:text-foreground rounded-lg text-xs"
            >
              <Home className="w-4 h-4" />
              Return to Landing Page
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Conversation Interface */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background relative">
        {/* Top Header */}
        <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-foreground border border-border">
                <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-amber-500 animate-ping' : 'bg-primary animate-pulse'}`} />
                {isLoading ? 'AI is typing...' : 'EduGuide AI Advisor'}
              </span>
              <span className="hidden sm:inline text-xs text-muted-foreground">
                • Bangladesh Admission Assistant
              </span>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={handleNewChat}
              disabled={isLoading}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-secondary transition disabled:opacity-50"
              title="Reset Chat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Chat</span>
            </button>
          )}
        </header>

        {/* Message Viewport */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6 scrollbar-thin">
          {messages.length === 0 ? (
            /* Welcome Hero Screen */
            <div className="max-w-3xl mx-auto min-h-[75vh] flex flex-col justify-center items-center text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-6 shadow-lg">
                <Bot className="w-9 h-9" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
                How can I help your university admission?
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl mb-10 leading-relaxed">
                Ask anything about Bangladeshi university circulars, Ka/Kha/Ga/Gha unit requirements, HSC GPA eligibility, or engineering test prep.
              </p>

              {/* Action Topic Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-2xl text-left">
                {quickTopics.map((topic, i) => {
                  const IconComp = topic.icon;
                  return (
                    <button
                      key={i}
                      disabled={isLoading}
                      onClick={() => handleSendMessage(topic.query)}
                      className="p-4 rounded-xl bg-card border border-border hover:border-primary hover:bg-secondary/50 transition group flex flex-col justify-between shadow-sm disabled:opacity-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-primary group-hover:text-primary/90 transition">
                          {topic.title}
                        </span>
                        <IconComp className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {topic.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Chat Message Bubbles with Animated Typing Dots */
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                const isLastAssistant =
                  !isUser && index === messages.length - 1 && isLoading;
                const isThinking = isLastAssistant && msg.content === '';

                return (
                  <div
                    key={index}
                    className={`flex gap-3.5 md:gap-4 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        {isThinking ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                    )}

                    <div
                      className={`relative max-w-[85%] md:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isUser
                          ? 'bg-primary text-primary-foreground rounded-tr-xs shadow-sm'
                          : 'bg-card text-card-foreground border border-border rounded-tl-xs shadow-sm'
                      }`}
                    >
                      {isThinking ? (
                        <div className="flex items-center gap-2 py-0.5 px-1 text-muted-foreground">
                          <span className="text-xs font-medium">AI is typing</span>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                          </div>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap break-words">
                          {msg.content}
                          {isLastAssistant && (
                            <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
                          )}
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-lg bg-secondary text-secondary-foreground border border-border flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-card border-t border-border">
          <div className="max-w-3xl mx-auto">
            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pb-2 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                <span>EduGuide AI is searching circulars & typing...</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center bg-background border border-border focus-within:border-primary rounded-2xl p-2 shadow-sm transition"
            >
              <textarea
                ref={textareaRef}
                value={input}
                disabled={isLoading}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                    textareaRef.current.style.height = `${Math.min(
                      textareaRef.current.scrollHeight,
                      150,
                    )}px`;
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  isLoading
                    ? 'AI is searching & typing response...'
                    : 'Ask about DU Ka/Kha Unit, BUET GPA cutoffs, GST circulars...'
                }
                rows={1}
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm px-3 py-2 resize-none focus:outline-none max-h-36 scrollbar-none disabled:opacity-60 cursor-text"
              />

              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-9 w-9 p-0 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40 shrink-0 shadow-sm transition"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>

            <p className="text-[11px] text-muted-foreground text-center mt-2 font-light">
              EduGuide AI provides guidance based on official Bangladesh university circulars & vector RAG.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
