export interface DiagnosticAnswer {
  questionId: string;
  subjectName: string;
  chapterName: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface DiagnosticEvaluationResult {
  totalScore: number;
  maxScore: number;
  accuracyPercentage: number;
  subjectBreakdown: Array<{ subject: string; score: number; accuracy: number; status: 'strong' | 'moderate' | 'weak' }>;
  weakTopics: string[];
  recommendedStudyHoursDaily: number;
}

export class ExamsService {
  public evaluateDiagnostic(answers: DiagnosticAnswer[]): DiagnosticEvaluationResult {
    let totalScore = 0;
    let maxScore = answers.length;
    let correctCount = 0;

    const subjectMap = new Map<string, { total: number; correct: number }>();

    answers.forEach((ans) => {
      if (ans.isCorrect) {
        totalScore += 1.0;
        correctCount++;
      } else {
        totalScore -= 0.25; // BUET negative marking
      }

      const existing = subjectMap.get(ans.subjectName) || { total: 0, correct: 0 };
      existing.total += 1;
      if (ans.isCorrect) existing.correct += 1;
      subjectMap.set(ans.subjectName, existing);
    });

    const accuracyPercentage = maxScore > 0 ? (correctCount / maxScore) * 100 : 0;
    const weakTopics: string[] = [];

    const subjectBreakdown = Array.from(subjectMap.entries()).map(([subject, data]) => {
      const acc = (data.correct / data.total) * 100;
      let status: 'strong' | 'moderate' | 'weak' = 'moderate';
      if (acc >= 75) status = 'strong';
      else if (acc < 50) {
        status = 'weak';
        weakTopics.push(`${subject} Fundamentals`);
      }

      return {
        subject,
        score: data.correct,
        accuracy: Math.round(acc),
        status,
      };
    });

    return {
      totalScore: Math.max(0, Number(totalScore.toFixed(2))),
      maxScore,
      accuracyPercentage: Math.round(accuracyPercentage),
      subjectBreakdown,
      weakTopics: weakTopics.length > 0 ? weakTopics : ['Chemistry Organic Reactions', 'Physics Vector Calculus'],
      recommendedStudyHoursDaily: 4.5,
    };
  }
}

export const examsService = new ExamsService();
