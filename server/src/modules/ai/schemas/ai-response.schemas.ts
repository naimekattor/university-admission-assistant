import { z } from 'zod';

export const UniversityComparisonSchema = z.object({
  type: z.literal('university_comparison'),
  title: z.string(),
  summary: z.string(),
  comparisonTable: z.array(
    z.object({
      metric: z.string(),
      uni1Value: z.string(),
      uni2Value: z.string(),
      advantage: z.string().optional(),
    })
  ),
  keyDifferences: z.array(z.string()),
  recommendedNextActions: z.array(
    z.object({
      label: z.string(),
      action: z.string(), // e.g. 'check_eligibility', 'view_university', 'start_preparation'
      targetSlug: z.string().optional(),
    })
  ),
});

export const EligibilityResultSchema = z.object({
  type: z.literal('eligibility_result'),
  summary: z.string(),
  overallEligible: z.boolean(),
  eligibleUniversities: z.array(
    z.object({
      university: z.string(),
      program: z.string(),
      gpaMargin: z.number().optional(),
      status: z.enum(['eligible', 'eligible_pending', 'ineligible']),
    })
  ),
  requirementsFulfilled: z.array(z.string()),
  missingRequirements: z.array(z.string()),
  recommendedNextActions: z.array(
    z.object({
      label: z.string(),
      action: z.string(),
    })
  ),
});

export const StudyPlanSchema = z.object({
  type: z.literal('study_plan'),
  targetGoal: z.string(),
  durationDays: z.number(),
  dailyHours: z.number(),
  summary: z.string(),
  weakTopicFocus: z.array(z.string()),
  dailySchedule: z.array(
    z.object({
      day: z.number(),
      subject: z.string(),
      chapter: z.string(),
      topic: z.string().optional(),
      taskType: z.enum(['lesson', 'practice', 'revision', 'mock_test']),
      allocatedMinutes: z.number(),
    })
  ),
  recommendedNextActions: z.array(
    z.object({
      label: z.string(),
      action: z.string(),
    })
  ),
});

export const QuestionExplanationSchema = z.object({
  type: z.literal('question_explanation'),
  questionText: z.string(),
  correctAnswer: z.string(),
  stepByStepSolution: z.array(z.string()),
  keyFormulae: z.array(z.string()).optional(),
  commonMistakesToAvoid: z.array(z.string()).optional(),
  relatedConceptsToReview: z.array(z.string()).optional(),
  recommendedNextActions: z.array(
    z.object({
      label: z.string(),
      action: z.string(),
    })
  ),
});

export const GeneralAnswerSchema = z.object({
  type: z.literal('general_answer'),
  summary: z.string(),
  sections: z.array(
    z.object({
      heading: z.string(),
      content: z.string(),
    })
  ),
  sourceCitations: z.array(z.string()).optional(),
  recommendedNextActions: z.array(
    z.object({
      label: z.string(),
      action: z.string(),
    })
  ),
});

export const StructuredAiResponseSchema = z.discriminatedUnion('type', [
  UniversityComparisonSchema,
  EligibilityResultSchema,
  StudyPlanSchema,
  QuestionExplanationSchema,
  GeneralAnswerSchema,
]);

export type UniversityComparisonResponse = z.infer<typeof UniversityComparisonSchema>;
export type EligibilityResultResponse = z.infer<typeof EligibilityResultSchema>;
export type StudyPlanResponse = z.infer<typeof StudyPlanSchema>;
export type QuestionExplanationResponse = z.infer<typeof QuestionExplanationSchema>;
export type GeneralAnswerResponse = z.infer<typeof GeneralAnswerSchema>;
export type StructuredAiResponse = z.infer<typeof StructuredAiResponseSchema>;
