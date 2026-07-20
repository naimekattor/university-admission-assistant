'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const universities = ['BUET', 'DU', 'KUET', 'RUET', 'CUET', 'SUST', 'JNU', 'MBSTU', 'Other'];
const docTypes = ['circular', 'prospectus', 'faq', 'notice', 'regulation'];

export default function AdminUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [university, setUniversity] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [docType, setDocType] = useState('circular');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('university', university);
    formData.append('year', year);
    formData.append('documentType', docType);

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, message: 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <a href="/" className="text-sm text-gray-400 hover:text-white">← Back to Home</a>
          <h1 className="text-2xl font-bold mt-2">Upload Circular</h1>
          <p className="text-gray-400 text-sm mt-1">
            Upload university circulars, prospectuses, FAQs, notices, or regulations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files[0];
              if (f) setFile(f);
            }}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt,.html,.png,.jpg,.jpeg,.webp"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <div>
                <p className="text-blue-400 font-medium">{file.name}</p>
                <p className="text-gray-500 text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-400">Drop file here or click to browse</p>
                <p className="text-gray-600 text-sm mt-1">PDF, DOCX, TXT, HTML, PNG, JPG</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">University</label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                <option value="">Select</option>
                {universities.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Year</label>
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min={2020}
                max={2030}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                {docTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!file || uploading}
            className="w-full"
          >
            {uploading ? 'Processing...' : 'Upload & Index'}
          </Button>
        </form>

        {result && (
          <div className={`mt-6 p-4 rounded-lg text-sm ${
            result.success ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
          }`}>
            {result.message}
          </div>
        )}
      </div>
    </div>
  );
}
