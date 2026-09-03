import {
  StudentProfile,
  evaluateEligibilitySummary,
  EligibilitySummaryEvaluation,
  evaluateDepartmentEligibility,
  DepartmentEligibilityResult,
  universitiesDepartments,
  UniversityDepartment,
} from '../../services/eligibility-engine';
import { admissionService } from '../admission/admission.service';

export class EligibilityService {
  /**
   * Evaluate applicant summary using live PostgreSQL circular rules with fallback.
   */
  public async evaluateSummary(profile: StudentProfile): Promise<EligibilitySummaryEvaluation> {
    try {
      const liveCirculars = await admissionService.getCirculars();
      const activeCirculars = liveCirculars.filter((c) => c.status === 'active');

      if (activeCirculars.length > 0) {
        const liveDepartments: UniversityDepartment[] = activeCirculars.map((c) => ({
          id: c.id,
          university: c.universityShortName || c.universityName,
          department: c.unitName || c.unit,
          program: c.unit,
          minGPA: c.minCombinedGpa,
          minSscGPA: c.minSscGpa,
          minHscGPA: c.minHscGpa,
          minCombinedGPA: c.minCombinedGpa,
          allowedGroups: c.allowedGroups as any,
          requiredSubjects: c.requiredSubjects || [],
          allowSecondTime: c.allowSecondTime,
          allowedPassingYears: c.allowedPassingYears,
          seats: c.totalSeats,
          applicationDeadline: c.applicationEndDate ? new Date(c.applicationEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA',
          website: c.officialUrl || '',
          admissionFee: c.applicationFee,
          circularYear: c.year,
        }));

        return evaluateEligibilitySummary(profile, liveDepartments);
      }
    } catch (err) {
      console.warn('[EligibilityService] Falling back to in-memory rules due to error:', err);
    }

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
