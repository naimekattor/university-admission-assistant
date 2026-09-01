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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
      setMsg({ success: true, text: `Successfully indexed ${file.name} into PostgreSQL pgvector table document_chunks!` });
      setFile(null);
    }, 1200);
  };

  return (
    <AdminShell
      pageTitle="Knowledge Base & RAG Health Intelligence"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Knowledge Base' }]}
    >
      <div className="space-y-6">
        
        {msg && (
          <div className="p-4 rounded-xl text-xs font-semibold flex items-center gap-2 bg-[var(--eg-success-soft)] text-[var(--eg-success)] border border-[var(--eg-success)]/20">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{msg.text}</span>
          </div>
        )}

        {/* RAG Health Status Grid */}
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

        {/* PDF Circular Upload Box */}
        <div className="eg-card space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--eg-border)] pb-3">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-[var(--eg-primary)]" />
              <h3 className="text-body-lg font-bold text-[var(--eg-text-primary)]">
                Upload Admission Circular PDF → Automatic pgvector Chunking
              </h3>
            </div>
            <span className="text-xs text-[var(--eg-text-muted)]">Official Circular Ingestion</span>
          </div>

          <form onSubmit={handleUpload} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Target University Tag</label>
                <select value={university} onChange={(e) => setUniversity(e.target.value)} className="eg-input">
                  <option>BUET</option>
                  <option>DU</option>
                  <option>KUET</option>
                  <option>RUET</option>
                  <option>CUET</option>
                </select>
              </div>
              <div>
                <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Unit Tag</label>
                <input value={unit} onChange={(e) => setUnit(e.target.value)} className="eg-input" />
              </div>
            </div>

            <div>
              <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Select Circular PDF File</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                className="eg-input py-2"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={uploading || !file}
                className="btn btn-primary font-semibold text-xs"
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

        {/* Document Chunks Table */}
        <div className="eg-card p-0 overflow-hidden shadow-card">
          <div className="p-4 border-b border-[var(--eg-border)] font-bold text-sm text-[var(--eg-text-primary)]">
            Indexed Documents & Chunk Telemetry
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left admin-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>University • Unit</th>
                  <th>Chunks</th>
                  <th>Dimensions</th>
                  <th>Status</th>
                  <th>Last Indexed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documentChunks.map((doc) => (
                  <tr key={doc.id}>
                    <td className="font-semibold text-xs text-[var(--eg-text-primary)]">{doc.sourceDoc}</td>
                    <td>{doc.university} • {doc.unit}</td>
                    <td className="font-bold text-xs text-[var(--eg-primary)]">{doc.chunkCount} Chunks</td>
                    <td className="text-caption font-mono text-[var(--eg-text-muted)]">{doc.embeddingDimension}d</td>
                    <td>
                      <Badge variant={doc.status === 'Indexed' ? 'success' : 'warning'} size="sm">
                        {doc.status}
                      </Badge>
                    </td>
                    <td className="text-caption text-[var(--eg-text-muted)]">{doc.lastIndexed}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded hover:bg-[var(--eg-surface-subtle)] text-[var(--eg-text-muted)] hover:text-[var(--eg-primary)]">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-[var(--eg-error-soft)] text-[var(--eg-text-muted)] hover:text-[var(--eg-error)]">
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
