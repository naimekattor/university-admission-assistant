'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[220px] rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-xs text-slate-400 flex items-center justify-center font-mono">
      Loading Quill Editor...
    </div>
  ),
});

interface RichEditorProps {
  content?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }],
    ['blockquote', 'code-block', 'link'],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'color',
  'background',
  'blockquote',
  'code-block',
  'link',
];

export function RichEditor({ content = '', placeholder = 'Start writing formatted text...', onChange }: RichEditorProps) {
  const [value, setValue] = useState(content);

  useEffect(() => {
    setValue(content || '');
  }, [content]);

  const handleChange = (val: string) => {
    setValue(val);
    onChange?.(val);
  };

  return (
    <div className="rounded-2xl border border-slate-700 overflow-hidden bg-slate-950 shadow-sm quill-dark-wrapper">
      <style jsx global>{`
        .quill-dark-wrapper .ql-toolbar.ql-snow {
          background-color: #0f172a;
          border: none;
          border-bottom: 1px solid #334155;
          padding: 8px 12px;
        }
        .quill-dark-wrapper .ql-container.ql-snow {
          border: none;
          background-color: #020617;
          color: #f8fafc;
          font-family: inherit;
          min-height: 220px;
          font-size: 14px;
        }
        .quill-dark-wrapper .ql-editor {
          min-height: 220px;
          padding: 16px;
          line-height: 1.6;
        }
        .quill-dark-wrapper .ql-editor.ql-blank::before {
          color: #64748b;
          font-style: normal;
        }
        .quill-dark-wrapper .ql-snow .ql-stroke {
          stroke: #94a3b8;
        }
        .quill-dark-wrapper .ql-snow .ql-fill {
          fill: #94a3b8;
        }
        .quill-dark-wrapper .ql-snow .ql-picker {
          color: #94a3b8;
        }
        .quill-dark-wrapper .ql-snow .ql-picker-options {
          background-color: #0f172a;
          border: 1px solid #334155;
          color: #f8fafc;
        }
        .quill-dark-wrapper .ql-snow.ql-toolbar button:hover,
        .quill-dark-wrapper .ql-snow .ql-toolbar button:hover,
        .quill-dark-wrapper .ql-snow.ql-toolbar button.ql-active,
        .quill-dark-wrapper .ql-snow .ql-toolbar button.ql-active {
          color: #ff5500;
        }
        .quill-dark-wrapper .ql-snow.ql-toolbar button:hover .ql-stroke,
        .quill-dark-wrapper .ql-snow .ql-toolbar button:hover .ql-stroke,
        .quill-dark-wrapper .ql-snow.ql-toolbar button.ql-active .ql-stroke,
        .quill-dark-wrapper .ql-snow .ql-toolbar button.ql-active .ql-stroke {
          stroke: #ff5500;
        }
        .quill-dark-wrapper .ql-snow.ql-toolbar button:hover .ql-fill,
        .quill-dark-wrapper .ql-snow .ql-toolbar button:hover .ql-fill,
        .quill-dark-wrapper .ql-snow.ql-toolbar button.ql-active .ql-fill,
        .quill-dark-wrapper .ql-snow .ql-toolbar button.ql-active .ql-fill {
          fill: #ff5500;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        modules={quillModules}
        formats={quillFormats}
      />
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
        <span>Quill Rich Text Format (HTML)</span>
        <span className="text-slate-400 font-semibold">Quill Editor</span>
      </div>
    </div>
  );
}
