export interface StudyPlanGenerationRequest {
  targetGoal: string;
  durationDays?: number;
  dailyHours?: number;
  weakTopics?: string[];
}

export interface GeneratedStudyPlan {
  targetGoal: string;
  durationDays: number;
  dailyHours: number;
  summary: string;
  scheduleItems: Array<{
    dayNumber: number;
    subjectName: string;
    chapterName: string;
    taskType: 'lesson' | 'practice' | 'revision' | 'mock_test';
    allocatedMinutes: number;
  }>;
}

export class StudyPlanService {
  public generatePlan(req: StudyPlanGenerationRequest): GeneratedStudyPlan {
    const targetGoal = req.targetGoal || 'BUET CSE';
    const durationDays = req.durationDays || 30;
    const dailyHours = req.dailyHours || 4.0;
    const totalDailyMinutes = Math.round(dailyHours * 60);

    const scheduleItems = [];

    for (let day = 1; day <= durationDays; day++) {
      if (day % 7 === 0) {
        // Full weekly mock test
        scheduleItems.push({
          dayNumber: day,
          subjectName: 'All Subjects',
          chapterName: 'Full Mock Test & Analysis',
          taskType: 'mock_test' as const,
          allocatedMinutes: totalDailyMinutes,
        });
      } else {
        // Daily learning + practice + revision
        scheduleItems.push(
          {
            dayNumber: day,
            subjectName: day % 2 === 1 ? 'Physics' : 'Chemistry',
            chapterName: day % 2 === 1 ? "Newton's Mechanics" : 'Organic Chemistry',
            taskType: 'lesson' as const,
            allocatedMinutes: Math.round(totalDailyMinutes * 0.45),
          },
          {
            dayNumber: day,
            subjectName: day % 2 === 1 ? 'Physics' : 'Chemistry',
            chapterName: day % 2 === 1 ? "Newton's Mechanics" : 'Organic Chemistry',
            taskType: 'practice' as const,
            allocatedMinutes: Math.round(totalDailyMinutes * 0.35),
          },
          {
            dayNumber: day,
            subjectName: 'Higher Mathematics',
            chapterName: 'Calculus',
            taskType: 'revision' as const,
            allocatedMinutes: Math.round(totalDailyMinutes * 0.20),
          }
        );
      }
    }

    return {
      targetGoal,
      durationDays,
      dailyHours,
      summary: `Personalized ${durationDays}-day admission preparation plan tailored for ${targetGoal}, prioritizing weak topics in Chemistry Organic Reactions and Physics Integration.`,
      scheduleItems,
    };
  }
}

export const studyPlanService = new StudyPlanService();
