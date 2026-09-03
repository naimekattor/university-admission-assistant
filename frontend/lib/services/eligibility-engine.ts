// Eligibility Engine - Structured Rules for University Admission

export type AcademicGroup = 'Science' | 'Commerce' | 'Humanities';

export interface StudentProfile {
  sscGPA: number;
  hscGPA: number;
  group: AcademicGroup;
  passingYear: number;
  preferredSubject?: string;
  preferredLocation?: string;
}

export interface UniversityDepartment {
  id: string;
  university: string;
  department: string;
  program: string;
  minGPA?: number;                    // Legacy average GPA cutoff (evaluated if specific cutoffs not declared)
  minSscGPA?: number;                 // Minimum SSC GPA cutoff
  minHscGPA?: number;                 // Minimum HSC GPA cutoff
  minCombinedGPA?: number;            // Minimum Combined (SSC + HSC) GPA cutoff
  allowedGroups: AcademicGroup[];
  requiredSubjects: string[];
  allowSecondTime?: boolean;
  allowedPassingYears?: number[];
  seats: number;
  applicationDeadline: string;
  website: string;
  admissionFee: number;
  circularYear?: number;
  requiresSubjectVerification?: boolean;
}

export type EligibilityStatus = 'eligible' | 'eligible_pending' | 'ineligible';

export interface RequirementCheck {
  type: 'gpa_ssc' | 'gpa_hsc' | 'gpa_combined' | 'gpa_average' | 'group' | 'passing_year' | 'subject_prerequisite';
  satisfied: boolean;
  status: 'satisfied' | 'failed' | 'unverified';
  ruleDescription: string;
  studentValue: string | number;
  message: string;
}

export interface DepartmentEligibilityResult {
  id: string;
  department: UniversityDepartment;
  status: EligibilityStatus;
  isEligible: boolean;                  // true if status === 'eligible' or status === 'eligible_pending'
  isPending: boolean;                   // true if status === 'eligible_pending'
  satisfiedRequirements: string[];     // List of requirements successfully satisfied
  unsatisfiedRequirements: string[];   // List of specific reasons for disqualification
  unverifiedRequirements: string[];    // List of pending prerequisites / disclaimers
  gpaMargin?: number;                  // Score delta compared to minimum threshold
}

export interface EligibilitySummaryEvaluation {
  profile: StudentProfile;
  totalEvaluated: number;
  eligibleCount: number;
  ineligibleCount: number;
  pendingCount: number;
  results: DepartmentEligibilityResult[];
}

// In-memory university departments data with structured admission rules
export const universitiesDepartments: UniversityDepartment[] = [
  {
    id: 'buet-cse',
    university: 'BUET',
    department: 'Computer Science & Engineering',
    program: 'CSE',
    minGPA: 4.5,
    minSscGPA: 4.0,
    minHscGPA: 4.0,
    minCombinedGPA: 9.0,
    allowedGroups: ['Science'],
    requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
    allowSecondTime: false,
    allowedPassingYears: [2024],
    seats: 120,
    applicationDeadline: '2024-12-31',
    website: 'https://buet.ac.bd',
    admissionFee: 2500,
    circularYear: 2024,
    requiresSubjectVerification: true,
  },
  {
    id: 'buet-civil',
    university: 'BUET',
    department: 'Civil Engineering',
    program: 'CE',
    minGPA: 4.2,
    minSscGPA: 4.0,
    minHscGPA: 4.0,
    minCombinedGPA: 8.5,
    allowedGroups: ['Science'],
    requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
    allowSecondTime: false,
    allowedPassingYears: [2024],
    seats: 100,
    applicationDeadline: '2024-12-31',
    website: 'https://buet.ac.bd',
    admissionFee: 2500,
    circularYear: 2024,
    requiresSubjectVerification: true,
  },
  {
    id: 'du-cse',
    university: 'DU',
    department: 'Computer Science',
    program: 'CSE',
    minGPA: 4.0,
    minSscGPA: 3.5,
    minHscGPA: 3.5,
    minCombinedGPA: 8.0,
    allowedGroups: ['Science'],
    requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
    allowSecondTime: true,
    allowedPassingYears: [2024, 2023],
    seats: 80,
    applicationDeadline: '2024-12-15',
    website: 'https://du.ac.bd',
    admissionFee: 1500,
    circularYear: 2024,
    requiresSubjectVerification: true,
  },
  {
    id: 'kuet-eee',
    university: 'KUET',
    department: 'Electrical & Electronic Engineering',
    program: 'EEE',
    minGPA: 4.0,
    minSscGPA: 4.0,
    minHscGPA: 4.0,
    minCombinedGPA: 8.5,
    allowedGroups: ['Science'],
    requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
    allowSecondTime: false,
    allowedPassingYears: [2024],
    seats: 90,
    applicationDeadline: '2024-12-20',
    website: 'https://kuet.ac.bd',
    admissionFee: 2000,
    circularYear: 2024,
    requiresSubjectVerification: true,
  },
  {
    id: 'ruet-me',
    university: 'RUET',
    department: 'Mechanical Engineering',
    program: 'ME',
    minGPA: 3.8,
    minSscGPA: 3.5,
    minHscGPA: 3.5,
    minCombinedGPA: 8.0,
    allowedGroups: ['Science'],
    requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
    allowSecondTime: false,
    allowedPassingYears: [2024],
    seats: 75,
    applicationDeadline: '2024-12-25',
    website: 'https://ruet.ac.bd',
    admissionFee: 1800,
    circularYear: 2024,
    requiresSubjectVerification: true,
  },
  {
    id: 'du-law',
    university: 'DU',
    department: 'Faculty of Law',
    program: 'Law',
    minGPA: 4.5,
    minSscGPA: 3.5,
    minHscGPA: 3.5,
    minCombinedGPA: 8.0,
    allowedGroups: ['Science', 'Commerce', 'Humanities'],
    requiredSubjects: [],
    allowSecondTime: true,
    allowedPassingYears: [2024, 2023],
    seats: 60,
    applicationDeadline: '2024-12-15',
    website: 'https://du.ac.bd',
    admissionFee: 1200,
    circularYear: 2024,
    requiresSubjectVerification: false,
  },
];

/**
 * Evaluates an applicant's profile against a single university department rule
 * deterministically according to the department's declared criteria.
 */
export function evaluateDepartmentEligibility(
  student: StudentProfile,
  department: UniversityDepartment
): DepartmentEligibilityResult {
  const satisfiedRequirements: string[] = [];
  const unsatisfiedRequirements: string[] = [];
  const unverifiedRequirements: string[] = [];

  let gpaCheckPassed = true;
  let gpaMargin = 0;

  // 1. Evaluate GPA rules strictly per department declaration
  const hasSpecificGpaRules =
    department.minSscGPA !== undefined ||
    department.minHscGPA !== undefined ||
    department.minCombinedGPA !== undefined;

  if (hasSpecificGpaRules) {
    if (department.minSscGPA !== undefined) {
      if (student.sscGPA < department.minSscGPA) {
        gpaCheckPassed = false;
        const diff = (department.minSscGPA - student.sscGPA).toFixed(2);
        unsatisfiedRequirements.push(
          `SSC GPA requirement not met. Minimum: ${department.minSscGPA.toFixed(2)}, Your SSC: ${student.sscGPA.toFixed(2)} (Shortfall: -${diff})`
        );
      } else {
        satisfiedRequirements.push(
          `SSC GPA threshold met (${student.sscGPA.toFixed(2)} >= ${department.minSscGPA.toFixed(2)})`
        );
      }
    }

    if (department.minHscGPA !== undefined) {
      if (student.hscGPA < department.minHscGPA) {
        gpaCheckPassed = false;
        const diff = (department.minHscGPA - student.hscGPA).toFixed(2);
        unsatisfiedRequirements.push(
          `HSC GPA requirement not met. Minimum: ${department.minHscGPA.toFixed(2)}, Your HSC: ${student.hscGPA.toFixed(2)} (Shortfall: -${diff})`
        );
      } else {
        satisfiedRequirements.push(
          `HSC GPA threshold met (${student.hscGPA.toFixed(2)} >= ${department.minHscGPA.toFixed(2)})`
        );
      }
    }

    if (department.minCombinedGPA !== undefined) {
      const combinedGPA = student.sscGPA + student.hscGPA;
      const combinedMargin = combinedGPA - department.minCombinedGPA;
      gpaMargin = combinedMargin;

      if (combinedGPA < department.minCombinedGPA) {
        gpaCheckPassed = false;
        const diff = (department.minCombinedGPA - combinedGPA).toFixed(2);
        unsatisfiedRequirements.push(
          `Combined GPA requirement not met. Minimum total: ${department.minCombinedGPA.toFixed(2)}, Your total: ${combinedGPA.toFixed(2)} (Shortfall: -${diff})`
        );
      } else {
        satisfiedRequirements.push(
          `Combined total GPA threshold met (${combinedGPA.toFixed(2)} >= ${department.minCombinedGPA.toFixed(2)})`
        );
      }
    }
  } else if (department.minGPA !== undefined) {
    // Fallback rule: Average GPA calculation if explicitly defined
    const averageGPA = (student.sscGPA + student.hscGPA) / 2;
    gpaMargin = averageGPA - department.minGPA;

    if (averageGPA < department.minGPA) {
      gpaCheckPassed = false;
      const diff = (department.minGPA - averageGPA).toFixed(2);
      unsatisfiedRequirements.push(
        `Average GPA requirement not met. Minimum: ${department.minGPA.toFixed(2)}, Your average: ${averageGPA.toFixed(2)} (Shortfall: -${diff})`
      );
    } else {
      satisfiedRequirements.push(
        `Average GPA threshold met (${averageGPA.toFixed(2)} >= ${department.minGPA.toFixed(2)})`
      );
    }
  }

  // 2. Evaluate Academic Group Eligibility
  const isGroupAllowed = department.allowedGroups.includes(student.group);
  if (!isGroupAllowed) {
    unsatisfiedRequirements.push(
      `Your academic group (${student.group}) is not eligible. Allowed groups: ${department.allowedGroups.join(', ')}`
    );
  } else {
    satisfiedRequirements.push(`Academic group (${student.group}) is eligible`);
  }

  // 3. Evaluate Passing Year / Second-time Eligibility
  const isCurrentBatch = student.passingYear >= 2024;
  if (department.allowSecondTime === false && !isCurrentBatch) {
    unsatisfiedRequirements.push(
      `Second-time applicants are not permitted for ${department.university} (HSC passing year ${student.passingYear} is ineligible).`
    );
  } else if (department.allowedPassingYears && department.allowedPassingYears.length > 0) {
    if (!department.allowedPassingYears.includes(student.passingYear)) {
      unsatisfiedRequirements.push(
        `Passing year ${student.passingYear} is not eligible. Allowed years: ${department.allowedPassingYears.join(', ')}`
      );
    } else {
      satisfiedRequirements.push(`Passing year (${student.passingYear}) is eligible`);
    }
  } else {
    satisfiedRequirements.push(`Passing year (${student.passingYear}) is eligible`);
  }

  // 4. Evaluate Subject Prerequisites
  if (department.requiredSubjects && department.requiredSubjects.length > 0) {
    if (isGroupAllowed) {
      satisfiedRequirements.push(
        `Subject prerequisites covered: ${department.requiredSubjects.join(', ')}`
      );
    }
  }

  if (department.requiresSubjectVerification && isGroupAllowed) {
    unverifiedRequirements.push(
      `Official admission test circular guidelines require subject-level mark confirmation on the official portal.`
    );
  }

  // 5. Derive Final Status Dynamically
  let status: EligibilityStatus = 'eligible';
  if (!gpaCheckPassed || !isGroupAllowed || unsatisfiedRequirements.length > 0) {
    status = 'ineligible';
  } else if (department.requiresSubjectVerification && unverifiedRequirements.length > 0) {
    status = 'eligible_pending';
  }

  return {
    id: department.id,
    department,
    status,
    isEligible: status === 'eligible' || status === 'eligible_pending',
    isPending: status === 'eligible_pending',
    satisfiedRequirements,
    unsatisfiedRequirements,
    unverifiedRequirements,
    gpaMargin,
  };
}

/**
 * Evaluates an applicant's profile against all configured departments in the dataset,
 * returning a complete summary breakdown with counts and sorted results.
 */
export function evaluateEligibilitySummary(
  student: StudentProfile,
  departments: UniversityDepartment[] = universitiesDepartments
): EligibilitySummaryEvaluation {
  const results = departments.map((dept) => evaluateDepartmentEligibility(student, dept));

  let eligibleCount = 0;
  let ineligibleCount = 0;
  let pendingCount = 0;

  for (const res of results) {
    if (res.status === 'eligible') {
      eligibleCount++;
    } else if (res.status === 'eligible_pending') {
      eligibleCount++;
      pendingCount++;
    } else {
      ineligibleCount++;
    }
  }

  // Sort results: Eligible & Pending first (by gpaMargin descending), then Ineligible
  results.sort((a, b) => {
    if (a.isEligible && !b.isEligible) return -1;
    if (!a.isEligible && b.isEligible) return 1;
    return (b.gpaMargin || 0) - (a.gpaMargin || 0);
  });

  return {
    profile: student,
    totalEvaluated: departments.length,
    eligibleCount,
    ineligibleCount,
    pendingCount,
    results,
  };
}

/**
 * Check eligibility for a specific department (Legacy / Backward-compatible)
 */
export function checkEligibility(
  student: StudentProfile,
  department: UniversityDepartment
): {
  eligible: boolean;
  reasons: string[];
  gpaMargin: number;
} {
  const evaluated = evaluateDepartmentEligibility(student, department);
  const reasons = evaluated.isEligible
    ? evaluated.satisfiedRequirements
    : evaluated.unsatisfiedRequirements;

  return {
    eligible: evaluated.isEligible,
    reasons,
    gpaMargin: evaluated.gpaMargin || 0,
  };
}

/**
 * Get all eligible universities for a student (Legacy / Backward-compatible)
 */
export function getEligibleUniversities(
  student: StudentProfile
): Array<UniversityDepartment & { eligibility: ReturnType<typeof checkEligibility> }> {
  return universitiesDepartments
    .map((dept) => ({
      ...dept,
      eligibility: checkEligibility(student, dept),
    }))
    .filter((dept) => dept.eligibility.eligible)
    .sort((a, b) => b.eligibility.gpaMargin - a.eligibility.gpaMargin);
}

/**
 * Get all universities for a specific program
 */
export function getUniversitiesForProgram(
  program: string
): UniversityDepartment[] {
  return universitiesDepartments.filter((dept) => dept.program === program);
}

/**
 * Compare two universities/departments
 */
export function compareUniversities(
  id1: string,
  id2: string
): {
  dept1: UniversityDepartment | null;
  dept2: UniversityDepartment | null;
  comparison: Record<string, any>;
} {
  const dept1 = universitiesDepartments.find((d) => d.id === id1) || null;
  const dept2 = universitiesDepartments.find((d) => d.id === id2) || null;

  const comparison = {
    minGPA: {
      dept1: dept1?.minCombinedGPA || dept1?.minGPA,
      dept2: dept2?.minCombinedGPA || dept2?.minGPA,
      easier:
        dept1 && dept2
          ? (dept1.minCombinedGPA || dept1.minGPA || 0) < (dept2.minCombinedGPA || dept2.minGPA || 0)
            ? 'dept1'
            : 'dept2'
          : null,
    },
    seats: {
      dept1: dept1?.seats,
      dept2: dept2?.seats,
    },
    admissionFee: {
      dept1: dept1?.admissionFee,
      dept2: dept2?.admissionFee,
      cheaper:
        dept1 && dept2
          ? dept1.admissionFee < dept2.admissionFee
            ? 'dept1'
            : 'dept2'
          : null,
    },
    applicationDeadline: {
      dept1: dept1?.applicationDeadline,
      dept2: dept2?.applicationDeadline,
    },
  };

  return { dept1, dept2, comparison };
}
