'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  Database,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Trash2,
  Eye,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';

export default function AdminKnowledgePage() {
  const [file, setFile] = useState<File | null>(null);
  const [university, setUniversity] = useState('BUET');
  const [unit, setUnit] = useState('Ka Unit');
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ success: boolean; text: string } | null>(null);

  const documentChunks = [
    {
      id: 'chk-1',
      sourceDoc: 'BUET_Admission_Circular_2026.pdf',
      university: 'BUET',
      unit: 'Ka Unit',
      chunkCount: 48,
      status: 'Indexed',
      lastIndexed: '2 hours ago',
      embeddingDimension: 768,
    },
    {
      id: 'chk-2',
      sourceDoc: 'DU_Ka_Unit_Prospectus_2026.pdf',
      university: 'DU',
      unit: 'Ka Unit',
      chunkCount: 36,
      status: 'Indexed',
      lastIndexed: '1 day ago',
      embeddingDimension: 768,
    },
    {
      id: 'chk-3',
      sourceDoc: 'KUET_Engineering_Rules.pdf',
      university: 'KUET',
      unit: 'All Units',
      chunkCount: 24,
      status: 'Pending Verification',
      lastIndexed: '3 days ago',
      embeddingDimension: 768,
    },
  ];

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setMsg(null);
    setTimeout(() => {
      setUploading(false);
      setMsg({
        success: true,
        text: `Successfully indexed ${file.name} into PostgreSQL pgvector table document_chunks!`,
      });
      setFile(null);
    }, 1200);
  };

  return (
    <AdminShell
      pageTitle="Knowledge Base & RAG Health Intelligence"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Knowledge Base' }]}
    >
      <div className="space-y-6">
        {/* ── Success Alert ── */}
        {msg && (
          <div className="p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{msg.text}</span>
          </div>
        )}

        {/* ── RAG Health Status Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="INDEXED CHUNKS"
            value="108 Chunks"
            subValue="Across 8 Documents"
            icon={Database}
            variant="primary"
          />
          <StatCard
            label="VECTOR ENGINE"
            value="PostgreSQL"
            subValue="pgvector cosine <=>"
            icon={FileText}
            variant="default"
          />
          <StatCard
            label="EMBEDDING MODEL"
            value="embedding-001"
            subValue="768 Dimensions"
            icon={CheckCircle2}
            variant="success"
          />
          <StatCard
            label="RAG SYSTEM HEALTH"
            value="Operational"
            subValue="Query latency: 180ms"
            icon={CheckCircle2}
            variant="accent"
          />
        </div>

        {/* ── PDF Circular Ingestion Box ── */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#FF5500] flex items-center justify-center shadow-2xs shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                  Upload Admission Circular PDF → Automatic pgvector Chunking
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ingest official prospectus PDFs to index into vectorized semantic search
                </p>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-[#FF5500] border border-orange-200 self-start sm:self-auto">
              Official Circular Ingestion
            </span>
          </div>

          <form onSubmit={handleUpload} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 block">Target University Tag</label>
                <select
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                >
                  <option>BUET</option>
                  <option>DU</option>
                  <option>KUET</option>
                  <option>RUET</option>
                  <option>CUET</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 block">Unit Tag</label>
                <input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. Ka Unit, A Unit"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 block">Select Circular PDF File</label>
              <div className="border-2 border-dashed border-slate-200 hover:border-orange-400 bg-slate-50/70 hover:bg-orange-50/20 rounded-2xl p-5 text-center transition cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-1 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#FF5500] flex items-center justify-center mx-auto shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 pt-1">
                    {file ? file.name : 'Click to browse or drag and drop official PDF'}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {file
                      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB PDF ready to index`
                      : 'PDF circular files up to 25MB supported'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={uploading || !file}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:shadow-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Chunking & Indexing Vectors...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Index PDF into pgvector</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ── Document Chunks Table ── */}
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Indexed Documents & Chunk Telemetry
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Semantic search embeddings stored in PostgreSQL pgvector
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
              {documentChunks.length} Documents Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-5">Document Name</th>
                  <th className="py-3.5 px-4">University • Unit</th>
                  <th className="py-3.5 px-4">Chunks</th>
                  <th className="py-3.5 px-4">Dimensions</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Last Indexed</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documentChunks.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#FF5500] shrink-0" />
                        <span>{doc.sourceDoc}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {doc.university} • {doc.unit}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-[#FF5500] text-xs">
                        {doc.chunkCount} Chunks
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-[11px] text-slate-500 font-semibold bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                        {doc.embeddingDimension}d
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          doc.status === 'Indexed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            doc.status === 'Indexed' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-[11px] font-medium">
                      {doc.lastIndexed}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          className="p-2 rounded-xl bg-slate-50 hover:bg-[#FF5500] text-slate-500 hover:text-white border border-slate-200/70 transition shadow-2xs cursor-pointer"
                          title="View Chunks"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200/70 transition shadow-2xs cursor-pointer"
                          title="Delete Vectors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
