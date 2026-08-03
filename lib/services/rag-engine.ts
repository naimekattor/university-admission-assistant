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
  limit = 2
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
    // Pipeline Step: Fetch Top 20 Candidates from Qdrant Vector Search
    const topCandidatesCount = 20;
    const qdrantResults = await qdrantSearchDocs(query, topCandidatesCount);
    
    if (qdrantResults.length > 0) {
      let qdrantDocs: DocumentChunk[] = qdrantResults
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

      // Pipeline Step: Reranker / Heuristic Prioritization (Prioritize Page 1 circular chunks for schedule queries)
      const isDateOrGeneralQuery = /কবে|তারিখ|সময়|পরীক্ষা|সময়|date|schedule|when/i.test(query);
      if (isDateOrGeneralQuery) {
        const page1Docs = qdrantDocs.filter(d => d.page === 1);
        const otherDocs = qdrantDocs.filter(d => d.page !== 1);
        qdrantDocs = [...page1Docs, ...otherDocs];
      }

      if (university) {
        qdrantDocs = qdrantDocs.filter(d => d.university.toLowerCase() === university.toLowerCase());
      }
      if (documentType) {
        qdrantDocs = qdrantDocs.filter(d => d.type === documentType);
      }

      // Pipeline Step: Return Top 2 Chunks to LLM
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
  const docs = await searchDocuments(topic || '', university, undefined, 2);

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

CRITICAL SCRIPT & LANGUAGE RESTRICTIONS:
- You are ONLY permitted to write in BANGLA (বাংলা script), ENGLISH (Latin script), or BANGLISH.
- ABSOLUTELY NEVER output Chinese (中文), Japanese, Korean, Cyrillic, or any other foreign language script under any circumstances!

STRICT LANGUAGE & STYLE RULES:
1. DYNAMIC LANGUAGE MATCHING:
   - If the student asks in FULL ENGLISH -> Respond entirely in ENGLISH. Do NOT output Bangla characters or foreign scripts.
   - If the student asks in BANGLA (বাংলা) -> Respond strictly in natural, clear, and polite BANGLA (বাংলা).
   - If the student asks in BANGLISH / MIXED English & Bangla (e.g., "BUET a koto GPA lagbe?") -> Respond in clear, helpful Bangla/Banglish matching the student's conversation style.

2. ACCURACY & CONTEXT GROUNDING (STRICT ANTI-HALLUCINATION):
   - Read ALL provided context excerpts demarcated under <context>.
   - Answer STRICTLY and ONLY based on the facts provided in the context.
   - If the context contains specific dates, exam schedules (e.g., "২০ ডিসেম্বর ২০২৫ Saturday"), eligibility criteria, or pass marks, extract and quote the EXACT date and information directly.
   - You MUST extract dates, numbers, and month names (e.g. "ডিসেম্বর", "জানুয়ারি", "ফেব্রুয়ারি") EXACTLY as written in the provided excerpts.
   - ABSOLUTELY DO NOT replace or substitute Bangla month names (e.g., if context says "২০ ডিসেম্বর ২০২৫", NEVER change "ডিসেম্বর" to "ফেব্রুয়ারি" or any other month).
   - If the context does not contain the answer to the user's specific question, explicitly state in Bangla: "প্রদত্ত সার্কুলারে এই নির্দিষ্ট তথ্যের উল্লেখ পাওয়া যায়নি।" DO NOT fabricate dates or guess.

3. ADMISSION & UNIT EXPERTISE:
   - Explain unit-based circulars clearly (ক/Ka Unit - Science/Engineering, খ/Kha Unit - Arts/Humanities, গ/Ga Unit - Commerce/Business, ঘ/Gha Unit - Combined, চ/Cha Unit - Fine Arts, Engineering/GST Cluster).
   - Provide accurate guidance on SSC/HSC GPA eligibility, subject requirements (Physics, Chemistry, Math, Biology, English), eligibility, pass marks, and negative marking rules.
   - Refer to official university circulars, unit guidelines, and prospectuses provided in context.

4. RESPONSE FORMATTING & SOURCE CITATIONS:
   - Provide a clean, polite, human-friendly response.
   - ABSOLUTELY DO NOT copy raw bracketed metadata headers into your main response text.
   - ALWAYS append a clear "📌 তথ্যসূত্র / Source Citation" section at the end of your response, explicitly citing the source filename and page number from the context excerpts (e.g., "📌 তথ্যসূত্র: ঢাকা বিশ্ববিদ্যালয় (বিজ্ঞান ইউনিট), নির্দেশিকা পৃষ্ঠা ১").

Key principles:
- Give direct, helpful, and accurate answers based on circular context.
- Highlight key deadlines, exam dates, pass marks, and seat capacity if mentioned in context.
- Be precise with minimum GPA requirements (with/without 4th subject).
- Encourage students to double-check official university admission portals for final circular updates.`;
}

export function formatDocumentsForContext(documents: DocumentChunk[]): string {
  if (documents.length === 0) {
    return 'No relevant documents found.';
  }

  return (
    '<context>\nOfficial Admission Circular Data:\n\n' +
    documents
      .map(
        (doc, idx) =>
          `--- Excerpt ${idx + 1} [University: ${doc.university} | Unit: ${doc.unit || 'General'} | Source: ${doc.source} | Page: ${doc.page}] ---\n${doc.text}`
      )
      .join('\n\n') +
    '\n</context>'
  );
}
