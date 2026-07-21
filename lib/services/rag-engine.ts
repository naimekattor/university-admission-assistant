import { searchDocuments as qdrantSearchDocs } from '@/lib/qdrant';

export interface DocumentChunk {
  id: string;
  university: string;
  unit?: string;
  year: number;
  source: string;
  page: number;
  text: string;
  type: 'circular' | 'prospectus' | 'faq' | 'notice' | 'regulation';
}

export const mockDocumentChunks: DocumentChunk[] = [
  {
    id: 'buet-circ-2026-1',
    university: 'BUET',
    unit: 'Ka Unit (Science / Engineering)',
    year: 2026,
    source: 'BUET_Admission_2026.pdf',
    page: 1,
    text: 'BUET admission for 2026 will be held in three phases. Phase 1: Application submission from November 2025 to December 2025. Phase 2: Admission test in January 2026. Phase 3: Merit list publication in February 2026.',
    type: 'circular',
  },
  {
    id: 'buet-circ-2026-2',
    university: 'BUET',
    unit: 'Ka Unit (Science / Engineering)',
    year: 2026,
    source: 'BUET_Admission_2026.pdf',
    page: 2,
    text: 'Applicants must have a minimum HSC GPA of 4.5 for engineering programs. Science group students with physics, chemistry, and mathematics are eligible to apply.',
    type: 'circular',
  },
  {
    id: 'du-faq-1',
    university: 'DU',
    unit: 'All Units',
    year: 2026,
    source: 'DU_FAQ_2026.pdf',
    page: 1,
    text: 'ঢাকা বিশ্ববিদ্যালয় ভর্তি পরীক্ষা ইউনিটভিত্তিক অনুষ্ঠিত হয় (ক, খ, গ, চ ইউনিট)। Q: How many times can I apply to DU? A: You can submit application according to current circular rules.',
    type: 'faq',
  },
  {
    id: 'du-faq-2',
    university: 'DU',
    unit: 'All Units',
    year: 2026,
    source: 'DU_FAQ_2026.pdf',
    page: 1,
    text: 'Q: What documents do I need for admission? A: You need your SSC and HSC certificates/transcripts, birth certificate, National ID, passport size photos, and medical report.',
    type: 'faq',
  },
  {
    id: 'kuet-prosp-1',
    university: 'KUET',
    unit: 'Engineering Unit',
    year: 2026,
    source: 'KUET_Prospectus_2026.pdf',
    page: 3,
    text: 'KUET offers 12 departments including Electrical & Electronic Engineering, Mechanical Engineering, Civil Engineering, Chemical Engineering, and Industrial & Production Engineering.',
    type: 'prospectus',
  },
  {
    id: 'ruet-prosp-1',
    university: 'RUET',
    unit: 'Engineering Unit',
    year: 2026,
    source: 'RUET_Prospectus_2026.pdf',
    page: 5,
    text: 'RUET provides excellent infrastructure with modern laboratories, computer centers, and a well-stocked library. The campus is located in Rajshahi with on-campus hostel facilities.',
    type: 'prospectus',
  },
];

export async function searchDocuments(
  query: string,
  university?: string,
  documentType?: string,
  limit = 5
): Promise<DocumentChunk[]> {
  let results = mockDocumentChunks;

  if (university) {
    results = results.filter(
      (doc) => doc.university.toLowerCase() === university.toLowerCase()
    );
  }
  if (documentType) {
    results = results.filter((doc) => doc.type === documentType);
  }

  try {
    const qdrantResults = await qdrantSearchDocs(query, limit * 2);
    if (qdrantResults.length > 0) {
      const qdrantDocs: DocumentChunk[] = qdrantResults
        .filter(r => r.payload)
        .map(r => ({
          id: (r.payload!.id || r.payload!.docId) as string,
          university: r.payload!.university as string,
          unit: (r.payload!.unit as string) || 'All Units',
          year: (r.payload!.year as number) || new Date().getFullYear(),
          source: r.payload!.source as string,
          page: (r.payload!.page as number) || 1,
          text: r.payload!.text as string,
          type: (r.payload!.type as DocumentChunk['type']) || 'circular',
        }));
      if (university) {
        return qdrantDocs.filter(d => d.university.toLowerCase() === university.toLowerCase()).slice(0, limit);
      }
      if (documentType) {
        return qdrantDocs.filter(d => d.type === documentType).slice(0, limit);
      }
      return qdrantDocs.slice(0, limit);
    }
  } catch {
    console.warn('Qdrant search failed, falling back to mock data');
  }

  const queryLower = query.toLowerCase();
  results = results.sort((a, b) => {
    const aMatches = (a.text.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
    const bMatches = (b.text.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
    return bMatches - aMatches;
  });

  return results.slice(0, limit);
}

export async function getUniversityContext(
  university: string,
  topic?: string
): Promise<string> {
  const docs = await searchDocuments(topic || '', university, undefined, 3);

  if (docs.length === 0) {
    return `No specific information found for ${university}. General admission guidelines apply.`;
  }

  return docs
    .map(
      (doc) =>
        `[${doc.university} ${doc.unit ? `- ${doc.unit}` : ''} (${doc.type.toUpperCase()}) - Page ${doc.page}] ${doc.text}`
    )
    .join('\n\n');
}

export async function getComparisonContext(
  university1: string,
  university2: string,
  topic: string
): Promise<{ uni1: string; uni2: string }> {
  const [context1, context2] = await Promise.all([
    getUniversityContext(university1, topic),
    getUniversityContext(university2, topic),
  ]);

  return {
    uni1: context1,
    uni2: context2,
  };
}

export function buildAdmissionSystemPrompt(): string {
  return `You are an expert admission advisor for public, private, and engineering universities in Bangladesh (e.g., DU, BUET, JU, RU, CU, GST Cluster, RUET, KUET, CUET, SUST).

Your role:
1. Help Bangladeshi students understand unit-based circulars (ক/Ka Unit - Science, খ/Kha Unit - Arts/Humanities, গ/Ga Unit - Commerce/Business, ঘ/Gha Unit - Combined, চ/Cha Unit - Fine Arts, Engineering/GST Cluster).
2. Answer questions in the language requested by the student (Bengali/Bangla or English). If the user writes in Bangla, respond fluently in polite, natural Bangla.
3. Provide accurate guidance on SSC/HSC GPA eligibility, subject requirements (Physics, Math, Chemistry, Biology, English), and mark calculations.
4. Refer to official university circulars, unit guidelines, and prospectuses.

Key principles:
- Clearly explain Unit requirements (e.g., Ka Unit for Science background, Kha Unit for Arts/Humanities background, Ga Unit for Business background).
- Highlight key deadlines, pass marks, negative marking rules, and seat capacity if mentioned in context.
- Be precise with minimum GPA requirements (e.g., total GPA without 4th subject or with 4th subject as specified by the university).
- Encourage students to double-check official university admission portals for final circular updates.`;
}

export function formatDocumentsForContext(documents: DocumentChunk[]): string {
  if (documents.length === 0) {
    return 'No relevant documents found.';
  }

  return (
    'Relevant Circular & Admission Information:\n' +
    documents
      .map(
        (doc, idx) =>
          `${idx + 1}. [${doc.university} - ${doc.unit || 'General'} - ${doc.type}] (${doc.source}, page ${doc.page})\n${doc.text}`
      )
      .join('\n\n')
  );
}
