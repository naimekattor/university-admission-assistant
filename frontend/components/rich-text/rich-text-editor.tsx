'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Link as LinkIcon, Code, Undo, Redo } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write content here...',
  className = '',
  minHeight = '180px',
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync value to contentEditable when value changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value, mounted]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, val: string = '') => {
    if (typeof document !== 'undefined') {
      document.execCommand(command, false, val);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  if (!mounted) {
    return (
      <div
        style={{ minHeight }}
        className="w-full rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-center text-xs text-slate-400"
      >
        Loading rich text editor...
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden ${className}`}>
      {/* ── TOOLBAR ── */}
      <div className="bg-slate-50/80 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-1 text-xs">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          title="Bold"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('italic')}
          title="Italic"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <span className="w-[1px] h-4 bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h3>')}
          title="Heading"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
        >
          H3
        </button>

        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<p>')}
          title="Paragraph"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 font-medium text-xs transition"
        >
          P
        </button>

        <span className="w-[1px] h-4 bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          title="Bullet List"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          title="Numbered List"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <span className="w-[1px] h-4 bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) execCommand('createLink', url);
          }}
          title="Insert Link"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── CONTENT EDITABLE CANVAS ── */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        style={{ minHeight }}
        data-placeholder={placeholder}
        className="p-4 text-xs text-slate-900 focus:outline-none leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5"
      />
    </div>
  );
}
