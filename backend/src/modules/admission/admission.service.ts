import { db, schema, pool } from '../../db';
import { eq, desc } from 'drizzle-orm';
import { autoMigrateDatabase } from '../../db/migrate-schema';

export interface CircularWithUniversity {
  id: string;
  universityId: string;
  universityName: string;
  universityShortName: string;
  universityLogo?: string;
  title: string;
  unit: string;
  unitName: string;
  session: string;
  year: number;
  group: string;
  allowedGroups: string[];
  minSscGpa: number;
  minHscGpa: number;
  minCombinedGpa: number;
  allowSecondTime: boolean;
  allowedPassingYears: number[];
  requiredSubjects?: string[];
  totalSeats: number;
  applicationFee: number;
  status: string;
  applicationStartDate?: string | null;
  applicationEndDate?: string | null;
  examDate?: string | null;
  resultDate?: string | null;
  officialUrl?: string | null;
  summary?: string | null;
  createdAt: string;
  updatedAt: string;
}

function mapCircularRow({ circular, university }: { circular: any; university: any }): CircularWithUniversity {
  return {
    id: circular.id,
    universityId: circular.universityId,
    universityName: university?.name || 'Unknown University',
    universityShortName: university?.shortName || 'VAR',
    universityLogo: university?.logo || '🏛️',
    title: circular.title,
    unit: circular.unit || 'A Unit',
    unitName: circular.unitName || circular.title,
    session: circular.session || '2025-2026',
    year: circular.year || 2026,
    group: circular.group || 'Science',
    allowedGroups: (circular.allowedGroups as string[]) || ['Science'],
    minSscGpa: circular.minSscGpa ?? 3.5,
    minHscGpa: circular.minHscGpa ?? 3.5,
    minCombinedGpa: circular.minCombinedGpa ?? 7.5,
    allowSecondTime: Boolean(circular.allowSecondTime),
    allowedPassingYears: (circular.allowedPassingYears as number[]) || [2025, 2026],
    requiredSubjects: (circular.requiredSubjects as string[]) || [],
    totalSeats: circular.totalSeats || 100,
    applicationFee: circular.applicationFee || 1000,
    status: circular.status || 'active',
    applicationStartDate: circular.applicationStartDate ? new Date(circular.applicationStartDate).toISOString() : null,
    applicationEndDate: circular.applicationEndDate ? new Date(circular.applicationEndDate).toISOString() : null,
    examDate: circular.examDate ? new Date(circular.examDate).toISOString() : null,
    resultDate: circular.resultDate ? new Date(circular.resultDate).toISOString() : null,
    officialUrl: circular.officialUrl || null,
    summary: circular.summary || null,
    createdAt: circular.createdAt ? new Date(circular.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: circular.updatedAt ? new Date(circular.updatedAt).toISOString() : (circular.createdAt ? new Date(circular.createdAt).toISOString() : new Date().toISOString()),
  };
}

export class AdmissionService {
  /**
   * Fetch all admission circulars joined with their university metadata.
   */
  public async getCirculars(): Promise<CircularWithUniversity[]> {
    try {
      const rows = await db
        .select({
          circular: schema.admissionCirculars,
          university: schema.universities,
        })
        .from(schema.admissionCirculars)
        .leftJoin(schema.universities, eq(schema.admissionCirculars.universityId, schema.universities.id))
        .orderBy(desc(schema.admissionCirculars.createdAt));

      return rows.map(mapCircularRow);
    } catch (error: any) {
      console.warn('[AdmissionService] getCirculars failed, running autoMigrateDatabase recovery:', error.message);
      await autoMigrateDatabase(pool);

      const rows = await db
        .select({
          circular: schema.admissionCirculars,
          university: schema.universities,
        })
        .from(schema.admissionCirculars)
        .leftJoin(schema.universities, eq(schema.admissionCirculars.universityId, schema.universities.id))
        .orderBy(desc(schema.admissionCirculars.createdAt));

      return rows.map(mapCircularRow);
    }
  }

  /**
   * Fetch single circular by ID.
   */
  public async getCircularById(id: string): Promise<CircularWithUniversity | null> {
    try {
      const rows = await db
        .select({
          circular: schema.admissionCirculars,
          university: schema.universities,
        })
        .from(schema.admissionCirculars)
        .leftJoin(schema.universities, eq(schema.admissionCirculars.universityId, schema.universities.id))
        .where(eq(schema.admissionCirculars.id, id))
        .limit(1);

      if (rows.length === 0) return null;
      return mapCircularRow(rows[0]);
    } catch (error: any) {
      console.warn('[AdmissionService] getCircularById failed, running autoMigrateDatabase recovery:', error.message);
      await autoMigrateDatabase(pool);

      const rows = await db
        .select({
          circular: schema.admissionCirculars,
          university: schema.universities,
        })
        .from(schema.admissionCirculars)
        .leftJoin(schema.universities, eq(schema.admissionCirculars.universityId, schema.universities.id))
        .where(eq(schema.admissionCirculars.id, id))
        .limit(1);

      if (rows.length === 0) return null;
      return mapCircularRow(rows[0]);
    }
  }

  /**
   * Create new admission circular & unit with integrated eligibility rules.
   */
  public async createCircular(data: any): Promise<any> {
    const [inserted] = await db
      .insert(schema.admissionCirculars)
      .values({
        universityId: data.universityId,
        title: data.title,
        unit: data.unit || 'A Unit',
        unitName: data.unitName || data.title,
        session: data.session || '2025-2026',
        year: Number(data.year) || 2026,
        group: data.group || 'Science',
        allowedGroups: Array.isArray(data.allowedGroups) ? data.allowedGroups : [data.group || 'Science'],
        minSscGpa: Number(data.minSscGpa) || 3.5,
        minHscGpa: Number(data.minHscGpa) || 3.5,
        minCombinedGpa: Number(data.minCombinedGpa) || 7.5,
        allowSecondTime: Boolean(data.allowSecondTime),
        allowedPassingYears: Array.isArray(data.allowedPassingYears) ? data.allowedPassingYears : [2025, 2026],
        requiredSubjects: data.requiredSubjects || [],
        totalSeats: Number(data.totalSeats) || 100,
        applicationFee: Number(data.applicationFee) || 1000,
        status: data.status || 'active',
        applicationStartDate: data.applicationStartDate ? new Date(data.applicationStartDate) : null,
        applicationEndDate: data.applicationEndDate ? new Date(data.applicationEndDate) : null,
        examDate: data.examDate ? new Date(data.examDate) : null,
        resultDate: data.resultDate ? new Date(data.resultDate) : null,
        officialUrl: data.officialUrl || null,
        summary: data.summary || null,
      })
      .returning();

    return inserted;
  }

  /**
   * Update existing circular and its eligibility thresholds.
   */
  public async updateCircular(id: string, data: any): Promise<any> {
    const updatePayload: any = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.unit !== undefined) updatePayload.unit = data.unit;
    if (data.unitName !== undefined) updatePayload.unitName = data.unitName;
    if (data.session !== undefined) updatePayload.session = data.session;
    if (data.year !== undefined) updatePayload.year = Number(data.year);
    if (data.group !== undefined) updatePayload.group = data.group;
    if (data.allowedGroups !== undefined) updatePayload.allowedGroups = data.allowedGroups;
    if (data.minSscGpa !== undefined) updatePayload.minSscGpa = Number(data.minSscGpa);
    if (data.minHscGpa !== undefined) updatePayload.minHscGpa = Number(data.minHscGpa);
    if (data.minCombinedGpa !== undefined) updatePayload.minCombinedGpa = Number(data.minCombinedGpa);
    if (data.allowSecondTime !== undefined) updatePayload.allowSecondTime = Boolean(data.allowSecondTime);
    if (data.allowedPassingYears !== undefined) updatePayload.allowedPassingYears = data.allowedPassingYears;
    if (data.requiredSubjects !== undefined) updatePayload.requiredSubjects = data.requiredSubjects;
    if (data.totalSeats !== undefined) updatePayload.totalSeats = Number(data.totalSeats);
    if (data.applicationFee !== undefined) updatePayload.applicationFee = Number(data.applicationFee);
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.applicationStartDate !== undefined) {
      updatePayload.applicationStartDate = data.applicationStartDate ? new Date(data.applicationStartDate) : null;
    }
    if (data.applicationEndDate !== undefined) {
      updatePayload.applicationEndDate = data.applicationEndDate ? new Date(data.applicationEndDate) : null;
    }
    if (data.examDate !== undefined) {
      updatePayload.examDate = data.examDate ? new Date(data.examDate) : null;
    }
    if (data.officialUrl !== undefined) updatePayload.officialUrl = data.officialUrl;
    if (data.summary !== undefined) updatePayload.summary = data.summary;

    const [updated] = await db
      .update(schema.admissionCirculars)
      .set(updatePayload)
      .where(eq(schema.admissionCirculars.id, id))
      .returning();

    return updated;
  }

  /**
   * Delete circular by ID.
   */
  public async deleteCircular(id: string): Promise<boolean> {
    await db.delete(schema.admissionCirculars).where(eq(schema.admissionCirculars.id, id));
    return true;
  }

  /**
   * Get all academic programs joined with university and parent unit circular.
   */
  public async getPrograms(): Promise<any[]> {
    const rows = await db
      .select({
        program: schema.programs,
        university: schema.universities,
        circular: schema.admissionCirculars,
      })
      .from(schema.programs)
      .leftJoin(schema.universities, eq(schema.programs.universityId, schema.universities.id))
      .leftJoin(schema.admissionCirculars, eq(schema.programs.circularId, schema.admissionCirculars.id))
      .orderBy(desc(schema.programs.createdAt));

    return rows.map(({ program, university, circular }) => ({
      id: program.id,
      name: program.name,
      shortCode: program.shortCode || program.name.split(' ').map((w) => w[0]).join('').slice(0, 4).toUpperCase(),
      degree: program.degree || 'Bachelor',
      seats: program.seats || 60,
      description: program.description,
      duration: program.duration || '4 Years',
      cutoffMarks: program.cutoffMarks,
      universityId: program.universityId,
      universityName: university?.name || 'Unknown University',
      universityShortName: university?.shortName || 'VAR',
      universityLogo: university?.logo || '🏛️',
      circularId: program.circularId,
      unit: circular?.unit || 'Ka Unit',
      unitName: circular?.unitName || circular?.title || 'Main Unit',
      createdAt: program.createdAt.toISOString(),
    }));
  }

  /**
   * Create academic program.
   */
  public async createProgram(data: any): Promise<any> {
    const [inserted] = await db
      .insert(schema.programs)
      .values({
        universityId: data.universityId,
        circularId: data.circularId || null,
        name: data.name,
        shortCode: data.shortCode || null,
        degree: data.degree || 'Bachelor',
        seats: Number(data.seats) || 60,
        description: data.description || null,
        duration: data.duration || '4 Years',
      })
      .returning();

    return inserted;
  }

  /**
   * Update academic program.
   */
  public async updateProgram(id: string, data: any): Promise<any> {
    const updatePayload: any = {};
    if (data.universityId !== undefined) updatePayload.universityId = data.universityId;
    if (data.circularId !== undefined) updatePayload.circularId = data.circularId || null;
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.shortCode !== undefined) updatePayload.shortCode = data.shortCode;
    if (data.degree !== undefined) updatePayload.degree = data.degree;
    if (data.seats !== undefined) updatePayload.seats = Number(data.seats);
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.duration !== undefined) updatePayload.duration = data.duration;

    const [updated] = await db
      .update(schema.programs)
      .set(updatePayload)
      .where(eq(schema.programs.id, id))
      .returning();

    return updated;
  }

  /**
   * Delete academic program.
   */
  public async deleteProgram(id: string): Promise<boolean> {
    await db.delete(schema.programs).where(eq(schema.programs.id, id));
    return true;
  }

  /**
   * Get all universities for dropdown selectors.
   */
  public async getUniversitiesDropdown(): Promise<any[]> {
    return db
      .select({
        id: schema.universities.id,
        name: schema.universities.name,
        shortName: schema.universities.shortName,
        logo: schema.universities.logo,
        location: schema.universities.location,
      })
      .from(schema.universities)
      .orderBy(schema.universities.shortName);
  }
}

export const admissionService = new AdmissionService();
