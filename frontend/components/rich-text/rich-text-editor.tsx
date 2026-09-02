'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-center text-xs text-slate-400 font-mono min-h-[180px]">
      Loading Quill Editor...
    </div>
  ),
});

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
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
  'bullet',
  'color',
  'background',
  'blockquote',
  'code-block',
  'link',
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write content here...',
  className = '',
  minHeight = '180px',
}: RichTextEditorProps) {
  const [content, setContent] = useState(value);

  useEffect(() => {
    setContent(value || '');
  }, [value]);

  const handleChange = (val: string) => {
    setContent(val);
    onChange(val);
  };

  return (
    <div className={`rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs quill-light-wrapper ${className}`}>
      <style jsx global>{`
        .quill-light-wrapper .ql-toolbar.ql-snow {
          background-color: #f8fafc;
          border: none;
          border-bottom: 1px solid #e2e8f0;
          padding: 8px 12px;
        }
        .quill-light-wrapper .ql-container.ql-snow {
          border: none;
          background-color: #ffffff;
          color: #0f172a;
          font-family: inherit;
          min-height: ${minHeight};
          font-size: 13px;
        }
        .quill-light-wrapper .ql-editor {
          min-height: ${minHeight};
          padding: 14px;
          line-height: 1.6;
        }
        .quill-light-wrapper .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
        }
        .quill-light-wrapper .ql-snow.ql-toolbar button:hover,
        .quill-light-wrapper .ql-snow .ql-toolbar button:hover,
        .quill-light-wrapper .ql-snow.ql-toolbar button.ql-active,
        .quill-light-wrapper .ql-snow .ql-toolbar button.ql-active {
          color: #ff5500;
        }
        .quill-light-wrapper .ql-snow.ql-toolbar button:hover .ql-stroke,
        .quill-light-wrapper .ql-snow .ql-toolbar button:hover .ql-stroke,
        .quill-light-wrapper .ql-snow.ql-toolbar button.ql-active .ql-stroke,
        .quill-light-wrapper .ql-snow .ql-toolbar button.ql-active .ql-stroke {
          stroke: #ff5500;
        }
        .quill-light-wrapper .ql-snow.ql-toolbar button:hover .ql-fill,
        .quill-light-wrapper .ql-snow .ql-toolbar button:hover .ql-fill,
        .quill-light-wrapper .ql-snow.ql-toolbar button.ql-active .ql-fill,
        .quill-light-wrapper .ql-snow .ql-toolbar button.ql-active .ql-fill {
          fill: #ff5500;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        modules={quillModules}
        formats={quillFormats}
      />
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
        <span>Rich HTML Format</span>
        <span className="text-[#FF5500] font-semibold">Quill Editor</span>
      </div>
    </div>
  );
}
