import { db, schema } from '../../db';
import { eq, asc } from 'drizzle-orm';

export class PreparationService {
  public async getAllSubjects() {
    try {
      const subjects = await db.select().from(schema.subjects).orderBy(asc(schema.subjects.order));
      if (subjects.length > 0) return subjects;
    } catch {
      // Fallback in dev without live DB connection
    }

    return [
      { id: '1', name: 'Physics', slug: 'physics', code: 'PHY', description: 'HSC Physics 1st & 2nd Paper', icon: '⚡', color: '#f59e0b', order: 1 },
      { id: '2', name: 'Chemistry', slug: 'chemistry', code: 'CHE', description: 'HSC Chemistry 1st & 2nd Paper', icon: '🧪', color: '#10b981', order: 2 },
      { id: '3', name: 'Higher Mathematics', slug: 'higher-math', code: 'MATH', description: 'HSC Higher Mathematics', icon: '📐', color: '#3b82f6', order: 3 },
      { id: '4', name: 'Biology', slug: 'biology', code: 'BIO', description: 'HSC Biology 1st & 2nd Paper', icon: '🧬', color: '#ec4899', order: 4 },
    ];
  }

  public async getSubjectBySlug(slug: string) {
    const subjects = await this.getAllSubjects();
    return subjects.find((s) => s.slug === slug) || subjects[0];
  }

  public async getChaptersBySubjectSlug(subjectSlug: string) {
    const subject = await this.getSubjectBySlug(subjectSlug);
    try {
      const chapters = await db
        .select()
        .from(schema.chapters)
        .where(eq(schema.chapters.subjectId, subject.id))
        .orderBy(asc(schema.chapters.order));
      if (chapters.length > 0) return chapters;
    } catch {
      // Fallback
    }

    if (subjectSlug === 'physics') {
      return [
        { id: 'c1', subjectId: subject.id, name: "Newton's Mechanics", slug: 'newtons-mechanics', description: 'Laws of motion, friction, momentum', paper: 1, order: 1 },
        { id: 'c2', subjectId: subject.id, name: 'Work, Energy & Power', slug: 'work-energy-power', description: 'Conservation of energy & power', paper: 1, order: 2 },
        { id: 'c3', subjectId: subject.id, name: 'Vectors & Kinematics', slug: 'vectors-kinematics', description: 'Dot/cross products & projectiles', paper: 1, order: 3 },
      ];
    }

    if (subjectSlug === 'chemistry') {
      return [
        { id: 'c4', subjectId: subject.id, name: 'Chemical Bonding & Structure', slug: 'chemical-bonding', description: 'Hybridization, VSEPR, dipole', paper: 1, order: 1 },
        { id: 'c5', subjectId: subject.id, name: 'Organic Chemistry', slug: 'organic-chemistry', description: 'Nomenclature & reaction mechanisms', paper: 2, order: 2 },
      ];
    }

    return [
      { id: 'c6', subjectId: subject.id, name: 'Calculus (Differentiation & Integration)', slug: 'calculus', description: 'Limits, derivatives & integrals', paper: 1, order: 1 },
      { id: 'c7', subjectId: subject.id, name: 'Trigonometry', slug: 'trigonometry', description: 'Compound angles & inverse functions', paper: 1, order: 2 },
    ];
  }

  public async getLessonBySlug(lessonSlug: string) {
    try {
      const lessons = await db
        .select()
        .from(schema.lessons)
        .where(eq(schema.lessons.slug, lessonSlug))
        .limit(1);
      if (lessons.length > 0) return lessons[0];
    } catch {
      // Fallback
    }

    return {
      id: 'l1',
      conceptId: 'concept-1',
      title: "Mastering Newton's Second Law & Impulse Problems for BUET",
      slug: lessonSlug,
      summary: 'High-yield momentum and force vector problem solving techniques.',
      content: `# Newton's Second Law & Impulse Problems

## Core Formulae
- **Force Equation**: $$\\vec{F} = \\frac{d\\vec{p}}{dt} = m\\vec{a}$$
- **Impulse of Force**: $$J = \\int F dt = \\Delta p = m(v - u)$$

## BUET Admission Strategy
In engineering admission tests, force is frequently represented as a time-dependent function $F(t) = a + bt^2$. Always integrate $F(t)$ over the given time interval to obtain total impulse.`,
      learningObjectives: ['Impulse-momentum theorem', 'Time-varying force integration', 'Rocket motion equations'],
      estimatedMinutes: 25,
      visualType: 'interactive',
      visualConfig: { type: 'physics_vectors', initialVelocity: 10, mass: 2 },
    };
  }
}

export const preparationService = new PreparationService();
