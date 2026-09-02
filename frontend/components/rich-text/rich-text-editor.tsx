'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

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
  // Dynamically load ReactQuill to prevent SSR window/document issues
  const ReactQuill = useMemo(
    () =>
      dynamic(() => import('react-quill-new'), {
        ssr: false,
        loading: () => (
          <div
            style={{ minHeight }}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-4 flex items-center justify-center text-xs text-slate-400 animate-pulse"
          >
            Loading rich text editor...
          </div>
        ),
      }),
    [minHeight]
  );

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'link'],
        ['clean'],
      ],
    }),
    []
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'blockquote',
    'link',
  ];

  return (
    <div className={`rich-text-editor-container ${className}`}>
      <style jsx global>{`
        .rich-text-editor-container .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          border-color: #1e293b;
          background-color: #0f172a;
        }
        .rich-text-editor-container .ql-toolbar .ql-stroke {
          stroke: #94a3b8;
        }
        .rich-text-editor-container .ql-toolbar .ql-fill {
          fill: #94a3b8;
        }
        .rich-text-editor-container .ql-toolbar .ql-picker {
          color: #94a3b8;
        }
        .rich-text-editor-container .ql-toolbar .ql-picker-options {
          background-color: #0f172a;
          border-color: #1e293b;
        }
        .rich-text-editor-container .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          border-color: #1e293b;
          background-color: #020617;
          font-family: var(--font-sans, 'Inter', sans-serif);
          font-size: 14px;
          min-height: ${minHeight};
        }
        .rich-text-editor-container .ql-editor {
          min-height: ${minHeight};
          color: #f8fafc;
          line-height: 1.6;
        }
        .rich-text-editor-container .ql-editor.ql-blank::before {
          color: #64748b;
          font-style: normal;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
      />
    </div>
  );
}
