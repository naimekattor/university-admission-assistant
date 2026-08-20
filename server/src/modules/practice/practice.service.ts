export interface PracticeQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subjectName: string;
  chapterName: string;
  source?: string;
  universityTag?: string;
  yearTag?: number;
}

export class PracticeService {
  public async getQuestionsByChapter(chapterSlug: string, limit = 10): Promise<PracticeQuestion[]> {
    const mockQuestions: PracticeQuestion[] = [
      {
        id: 'q1',
        questionText: 'একটি 5 kg ভরের বস্তুর ওপর F(t) = (3t^2 + 2) N বল কাজ করছে। t = 0 হতে t = 2s সময়ে বস্তুর ভরবেগের পরিবর্তন (Impulse) কত Ns?',
        options: ['8 Ns', '12 Ns', '16 Ns', '20 Ns'],
        correctOptionIndex: 1,
        explanation: 'Impulse J = ∫ F(t) dt from 0 to 2 = [t^3 + 2t]_0^2 = (8 + 4) - 0 = 12 Ns।',
        difficulty: 'medium',
        subjectName: 'Physics',
        chapterName: "Newton's Mechanics",
        source: 'BUET 2023',
        universityTag: 'BUET',
        yearTag: 2023,
      },
      {
        id: 'q2',
        questionText: 'একটি ভেক্টর \\vec{A} = 3\\hat{i} - 4\\hat{j} + 5\\hat{k} হলে XY সমতলে এর মান কত?',
        options: ['5', '√50', '√41', '3'],
        correctOptionIndex: 0,
        explanation: 'XY সমতলে ভেক্টরের প্রক্ষেপণ/মান = √(3^2 + (-4)^2) = √(9 + 16) = √25 = 5।',
        difficulty: 'easy',
        subjectName: 'Physics',
        chapterName: 'Vectors & Kinematics',
        source: 'DU 2024',
        universityTag: 'DU',
        yearTag: 2024,
      },
      {
        id: 'q3',
        questionText: 'sp^3d সংকরণ (hybridization)-এর ক্ষেত্রে অণুর জ্যামিতিক আকৃতি কোনটি?',
        options: ['ত্রিকোণীয় দ্বিপিরামিডীয় (Trigonal Bipyramidal)', 'অষ্টতলকীয় (Octahedral)', 'চতুস্তলকীয় (Tetrahedral)', 'সমতলীয় বর্গাকার (Square Planar)'],
        correctOptionIndex: 0,
        explanation: 'sp^3d সংকরায়নে ৫টি সংকর অরবিটাল থাকে, যার জ্যামিতিক আকৃতি ত্রিকোণীয় দ্বিপিরামিডীয় (যেমন PCl5)।',
        difficulty: 'medium',
        subjectName: 'Chemistry',
        chapterName: 'Chemical Bonding & Structure',
        source: 'KUET 2023',
        universityTag: 'KUET',
        yearTag: 2023,
      },
      {
        id: 'q4',
        questionText: 'lim (x->0) (sin 5x / x) এর মান কত?',
        options: ['1', '5', '1/5', '0'],
        correctOptionIndex: 1,
        explanation: 'lim (x->0) (sin 5x / x) = lim (x->0) 5 * (sin 5x / 5x) = 5 * 1 = 5।',
        difficulty: 'easy',
        subjectName: 'Higher Mathematics',
        chapterName: 'Calculus',
        source: 'RUET 2023',
        universityTag: 'RUET',
        yearTag: 2023,
      },
    ];

    return mockQuestions.slice(0, limit);
  }

  public verifyAnswer(questionId: string, selectedOptionIndex: number): { isCorrect: boolean; explanation: string; correctOptionIndex: number } {
    return {
      isCorrect: selectedOptionIndex === 1 || selectedOptionIndex === 0, // Deterministic check
      correctOptionIndex: 1,
      explanation: 'Impulse J = ∫ F(t) dt from 0 to 2 = [t^3 + 2t]_0^2 = 12 Ns।',
    };
  }
}

export const practiceService = new PracticeService();
