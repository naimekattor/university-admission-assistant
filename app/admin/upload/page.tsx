'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const universities = ['BUET', 'DU', 'JU', 'RU', 'CU', 'GST', 'KUET', 'RUET', 'CUET', 'SUST', 'JNU', 'MBSTU', 'Other'];
const docTypes = ['circular', 'prospectus', 'faq', 'notice', 'regulation'];
const predefinedUnits = [
  { label: 'Auto Detect', value: 'auto' },
  { label: 'Ka Unit (ক ইউনিট - Science / A Unit)', value: 'Ka Unit (Science / A Unit)' },
  { label: 'Kha Unit (খ ইউনিট - Arts / B Unit)', value: 'Kha Unit (Arts / B Unit)' },
  { label: 'Ga Unit (গ ইউনিট - Commerce / C Unit)', value: 'Ga Unit (Commerce / C Unit)' },
  { label: 'Gha Unit (ঘ ইউনিট - Combined / D Unit)', value: 'Gha Unit (Combined / D Unit)' },
  { label: 'Cha Unit (চ ইউনিট - Fine Arts)', value: 'Cha Unit (Fine Arts)' },
  { label: 'All Units', value: 'All Units' },
  { label: 'Custom / Other', value: 'custom' },
];

export default function AdminUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [university, setUniversity] = useState('');
  const [unit, setUnit] = useState('auto');
  const [customUnit, setCustomUnit] = useState('');
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

    const effectiveUnit = unit === 'custom' ? customUnit : unit;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('university', university);
    formData.append('unit', effectiveUnit);
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
            Upload university unit-based circulars, prospectuses, FAQs, notices, or regulations (Supports Bangla & PDF/DOCX)
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
                <p className="text-gray-400">Drop circular file here or click to browse</p>
                <p className="text-gray-600 text-sm mt-1">PDF, DOCX, TXT, HTML, PNG, JPG</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">University</label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-zinc-900 text-white px-2.5 text-sm"
              >
                <option value="">Select University</option>
                {universities.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Unit (ইউনিট)</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-zinc-900 text-white px-2.5 text-sm"
              >
                {predefinedUnits.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>

          {unit === 'custom' && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Custom Unit Name</label>
              <Input
                type="text"
                placeholder="e.g. Unit 1 / IBA / Architecture"
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value)}
                className="bg-zinc-900 text-white"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Year</label>
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min={2020}
                max={2030}
                className="bg-zinc-900 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-zinc-900 text-white px-2.5 text-sm"
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
