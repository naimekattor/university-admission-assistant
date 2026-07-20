'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Home, Menu, X } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMessage }] }),
      });
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');
      
      let aiMessage = '';
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        aiMessage += chunk;
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiMessage }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 bg-card border-r border-border h-screen flex flex-col transition-transform duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <div className="text-2xl">🎓</div>
            <span className="font-bold text-foreground">EduGuide</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => {
              window.location.href = '/chat';
              setSidebarOpen(false);
            }}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition"
          >
            New Chat
          </button>
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <Link href="/eligibility">
            <Button variant="outline" className="w-full justify-start" size="sm">
              ✅ Check Eligibility
            </Button>
          </Link>
          <Link href="/recommendations">
            <Button variant="outline" className="w-full justify-start" size="sm">
              🎯 Recommendations
            </Button>
          </Link>
          <Link href="/universities">
            <Button variant="outline" className="w-full justify-start" size="sm">
              📚 Browse Universities
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card px-4 py-4 flex items-center justify-between md:justify-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="text-2xl">🎓</div>
            <h1 className="text-lg font-semibold text-foreground">University Advisor</h1>
          </div>
          <div className="w-10" /> {/* Spacer for alignment */}
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">💬</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Start Your Admission Journey</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Ask me anything about universities in Bangladesh, admission requirements, programs, and career paths.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md">
                <button
                  onClick={() => {
                    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                    if (textarea) {
                      textarea.value =
                        "What are the top computer science programs in Bangladesh?";
                      textarea.focus();
                    }
                  }}
                  className="p-4 text-left text-sm rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-foreground transition"
                >
                  💻 Top CS Programs
                </button>
                <button
                  onClick={() => {
                    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                    if (textarea) {
                      textarea.value =
                        "I scored 85 marks in HSC. What universities can I get into?";
                      textarea.focus();
                    }
                  }}
                  className="p-4 text-left text-sm rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-foreground transition"
                >
                  ✅ Am I Eligible?
                </button>
                <button
                  onClick={() => {
                    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                    if (textarea) {
                      textarea.value =
                        "Tell me about admission fees and the admission process";
                      textarea.focus();
                    }
                  }}
                  className="p-4 text-left text-sm rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-foreground transition"
                >
                  💰 Admission Costs
                </button>
                <button
                  onClick={() => {
                    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                    if (textarea) {
                      textarea.value =
                        "What are the career prospects for engineering graduates?";
                      textarea.focus();
                    }
                  }}
                  className="p-4 text-left text-sm rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-foreground transition"
                >
                  🚀 Career Paths
                </button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message: any, idx: number) => (
                <div
                  key={idx}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-secondary text-foreground rounded-bl-none border border-border'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-foreground px-4 py-3 rounded-lg border border-border rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleFormSubmit}
          className="border-t border-border bg-card p-4"
        >
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about universities, programs, eligibility..."
              rows={1}
              className="flex-1 p-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleFormSubmit(e as any);
                }
              }}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
