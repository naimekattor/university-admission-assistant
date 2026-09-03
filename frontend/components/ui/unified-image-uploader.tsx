'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  ExternalLink,
  Link2,
  Sparkles,
  Cloud,
} from 'lucide-react';

interface UnifiedImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  placeholder?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  compact?: boolean;
  className?: string;
}

export function UnifiedImageUploader({
  value = '',
  onChange,
  label = 'Upload Image',
  hint = 'Supports JPG, PNG, WebP, SVG. Uploads to Cloudinary with ImgBB & local fallback.',
  placeholder = 'https://... or click browse',
  aspectRatio = 'video',
  compact = false,
  className = '',
}: UnifiedImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [provider, setProvider] = useState<'cloudinary' | 'imgbb' | 'local' | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFile = async (file: File) => {
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit.');
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (res.ok && json.success && json.url) {
        onChange(json.url);
        setProvider(json.provider || 'local');
      } else {
        throw new Error(json.message || 'Failed to upload image');
      }
    } catch (err: any) {
      console.error('[UnifiedImageUploader] Upload error:', err);
      setUploadError(err.message || 'Upload failed. Please try again or paste image URL.');
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  let aspectClass = 'aspect-video';
  if (aspectRatio === 'square') aspectClass = 'aspect-square';
  if (aspectRatio === 'wide') aspectClass = 'aspect-[21/9]';
  if (aspectRatio === 'auto') aspectClass = 'min-h-[140px]';

  return (
    <div className={`space-y-2 font-sans ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {label && <label className="text-xs font-bold text-slate-900 block">{label}</label>}
          {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
              mode === 'upload'
                ? 'bg-orange-50 text-[#FF5500] border border-orange-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            File Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
              mode === 'url'
                ? 'bg-orange-50 text-[#FF5500] border border-orange-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Link URL
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleUploadFile(e.target.files[0]);
          }
        }}
        accept="image/*,.svg"
        className="hidden"
      />

      {/* URL Input Mode */}
      {mode === 'url' && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#FF5500]"
            />
          </div>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
              title="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Drag & Drop Upload Zone (when in upload mode and no image or replacing) */}
      {mode === 'upload' && !value && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer relative overflow-hidden flex flex-col items-center justify-center gap-2.5 ${
            isDragOver
              ? 'border-[#FF5500] bg-orange-50/60 scale-[0.99]'
              : 'border-slate-300 hover:border-orange-400 bg-slate-50/50 hover:bg-orange-50/20'
          } ${compact ? 'py-4' : 'py-7'}`}
        >
          {isUploading ? (
            <div className="space-y-2 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#FF5500] animate-spin" />
              <p className="text-xs font-bold text-slate-800">
                Uploading to Cloudinary / ImgBB...
              </p>
              <p className="text-[11px] text-slate-500">Optimizing and storing asset</p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-2xl bg-orange-100/80 text-[#FF5500] flex items-center justify-center shadow-2xs">
                <UploadCloud className="w-5 h-5" />
              </div>

              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-800">
                  Click to browse or drag &amp; drop
                </p>
                <p className="text-[11px] text-slate-500">
                  PNG, JPG, SVG or WebP up to 10MB
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Cloud className="w-3 h-3 text-blue-500" /> Cloudinary
                </span>
                <span>•</span>
                <span>ImgBB Fallback</span>
                <span>•</span>
                <span>Local Fallback</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Active Image Preview Card */}
      {value && (
        <div className="p-3 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>Active Image Asset</span>
              </span>

              {/* Provider Badge */}
              {value.includes('cloudinary.com') ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Cloudinary Hosted
                </span>
              ) : value.includes('ibb.co') || value.includes('imgbb.com') ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ImgBB Hosted
                </span>
              ) : value.startsWith('/uploads') ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                  Local Server
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-[#FF5500]">
                  External Asset
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                title="View in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              >
                Replace
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className={`w-full ${aspectClass} rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 relative group`}>
            <img
              src={value}
              alt="Asset Preview"
              className="w-full h-full object-contain sm:object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>

          <div className="text-[11px] font-mono text-slate-500 truncate max-w-full">
            {value}
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
