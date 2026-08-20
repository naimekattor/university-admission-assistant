import {
  StudentProfile,
  evaluateEligibilitySummary,
  EligibilitySummaryEvaluation,
  evaluateDepartmentEligibility,
  DepartmentEligibilityResult,
  universitiesDepartments,
  UniversityDepartment,
} from '@/lib/services/eligibility-engine';

export class EligibilityService {
  public evaluateSummary(profile: StudentProfile): EligibilitySummaryEvaluation {
    return evaluateEligibilitySummary(profile, universitiesDepartments);
  }

  public evaluateSingleDepartment(
    profile: StudentProfile,
    departmentId: string
  ): DepartmentEligibilityResult | null {
    const dept = universitiesDepartments.find((d: UniversityDepartment) => d.id === departmentId);
    if (!dept) return null;
    return evaluateDepartmentEligibility(profile, dept);
  }
}

export const eligibilityService = new EligibilityService();
