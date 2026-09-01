import { db } from '../db';
import { eq } from 'drizzle-orm';
import { universities, programs } from '../db/schema';

export async function getUniversityContext(): Promise<string> {
  const unis = await db.select().from(universities).limit(10);

  if (unis.length === 0) {
    return '';
  }

  return `
Available Universities in Bangladesh:
${unis
  .map(
    (uni) => `
- ${uni.name} (${uni.shortName})
  Location: ${uni.location}
  Admission Type: ${uni.admissionType}
  Cutoff Marks: ${uni.cutoffMarks}
  Website: ${uni.website}
  Description: ${uni.description}
`,
  )
  .join('\n')}
`;
}

export async function getProgramContext(universityId?: string): Promise<string> {
  let progs;
  
  if (universityId) {
    progs = await db
      .select()
      .from(programs)
      .where(eq(programs.universityId, universityId))
      .limit(20);
  } else {
    progs = await db.select().from(programs).limit(20);
  }

  if (progs.length === 0) {
    return '';
  }

  return `
Available Programs:
${progs
  .map(
    (prog) => `
- ${prog.name}
  Duration: ${prog.duration}
  Available Seats: ${prog.seats}
  Cutoff Marks: ${prog.cutoffMarks}
  Description: ${prog.description}
`,
  )
  .join('\n')}
`;
}

export function getSystemPrompt(): string {
  return `You are an expert university admission counselor for Bangladesh. You help HSC students understand the university admission process, eligibility requirements, and find suitable universities and programs based on their academic performance and interests.

Key responsibilities:
1. Provide accurate information about university admission processes in Bangladesh
2. Help students understand eligibility criteria
3. Recommend suitable universities based on their marks and preferences
4. Answer questions about different programs and career paths
5. Guide students through the admission journey

Always be supportive and encouraging. Remember that students may be stressed about admissions. Use simple Bengali or English terminology that students understand.

When discussing universities or programs, be specific about:
- Admission requirements
- Cutoff marks
- Program duration
- Career prospects
- Application procedures

If a student asks about a specific university or program not in your knowledge base, acknowledge it and provide general guidance.`;
}

export async function buildSystemContext(): Promise<string> {
  const basePrompt = getSystemPrompt();
  const uniContext = await getUniversityContext();
  const progContext = await getProgramContext();

  return `${basePrompt}

${uniContext}

${progContext}`;
}
