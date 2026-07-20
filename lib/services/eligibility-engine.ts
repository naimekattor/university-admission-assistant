// Eligibility Engine - Structured Rules for University Admission

export interface StudentProfile {
  sscGPA: number;
  hscGPA: number;
  group: 'Science' | 'Commerce' | 'Humanities';
  passingYear: number;
  preferredSubject?: string;
  preferredLocation?: string;
}

export interface UniversityDepartment {
  id: string;
  university: string;
  department: string;
  program: string;
  minGPA: number;
  allowedGroups: string[];
  requiredSubjects: string[];
  seats: number;
  applicationDeadline: string;
  website: string;
  admissionFee: number;
}

// Mock university departments data
export const universitiesDepartments: UniversityDepartment[] = [
  {
    id: 'buet-cse',
    university: 'BUET',
    department: 'Computer Science & Engineering',
    program: 'CSE',
    minGPA: 4.5,
    allowedGroups: ['Science'],
    requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
    seats: 120,
    applicationDeadline: '2024-12-31',
    website: 'https://buet.ac.bd',
    admissionFee: 2500,
  },
  {
    id: 'buet-civil',
    university: 'BUET',
    department: 'Civil Engineering',
    program: 'CE',
    minGPA: 4.2,
    allowedGroups: ['Science'],
    requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
    seats: 100,
    applicationDeadline: '2024-12-31',
    website: 'https://buet.ac.bd',
    admissionFee: 2500,
  },
  {
    id: 'du-cse',
    university: 'DU',
    department: 'Computer Science',
    program: 'CSE',
    minGPA: 4.0,
    allowedGroups: ['Science'],
    requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
    seats: 80,
    applicationDeadline: '2024-12-15',
    website: 'https://du.ac.bd',
    admissionFee: 1500,
  },
  {
    id: 'kuet-eee',
    university: 'KUET',
    department: 'Electrical & Electronic Engineering',
    program: 'EEE',
    minGPA: 4.0,
    allowedGroups: ['Science'],
    requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
    seats: 90,
    applicationDeadline: '2024-12-20',
    website: 'https://kuet.ac.bd',
    admissionFee: 2000,
  },
  {
    id: 'ruet-me',
    university: 'RUET',
    department: 'Mechanical Engineering',
    program: 'ME',
    minGPA: 3.8,
    allowedGroups: ['Science'],
    requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
    seats: 75,
    applicationDeadline: '2024-12-25',
    website: 'https://ruet.ac.bd',
    admissionFee: 1800,
  },
  {
    id: 'du-law',
    university: 'DU',
    department: 'Faculty of Law',
    program: 'Law',
    minGPA: 4.5,
    allowedGroups: ['Science', 'Commerce', 'Humanities'],
    requiredSubjects: [],
    seats: 60,
    applicationDeadline: '2024-12-15',
    website: 'https://du.ac.bd',
    admissionFee: 1200,
  },
];

/**
 * Check eligibility for a specific department
 */
export function checkEligibility(
  student: StudentProfile,
  department: UniversityDepartment
): {
  eligible: boolean;
  reasons: string[];
  gpaMargin: number;
} {
  const reasons: string[] = [];
  let eligible = true;

  // Check GPA requirement (use average of SSC and HSC)
  const averageGPA = (student.sscGPA + student.hscGPA) / 2;
  const gpaMargin = averageGPA - department.minGPA;

  if (averageGPA < department.minGPA) {
    eligible = false;
    reasons.push(
      `GPA requirement not met. Minimum: ${department.minGPA}, Your average: ${averageGPA.toFixed(2)}`
    );
  } else {
    reasons.push(
      `GPA requirement met (${averageGPA.toFixed(2)} >= ${department.minGPA})`
    );
  }

  // Check group eligibility
  if (!department.allowedGroups.includes(student.group)) {
    eligible = false;
    reasons.push(
      `Your group (${student.group}) is not eligible. Allowed groups: ${department.allowedGroups.join(', ')}`
    );
  } else {
    reasons.push(`Your group (${student.group}) is eligible`);
  }

  // Check required subjects
  if (department.requiredSubjects.length > 0) {
    // This is simplified - in real implementation, track actual subjects taken
    if (student.group === 'Science') {
      reasons.push(
        `Required subjects verified for Science group`
      );
    }
  }

  return { eligible, reasons, gpaMargin };
}

/**
 * Get all eligible universities for a student
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
  return universitiesDepartments.filter(
    (dept) => dept.program === program
  );
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
      dept1: dept1?.minGPA,
      dept2: dept2?.minGPA,
      easier: dept1 && dept2 ? (dept1.minGPA < dept2.minGPA ? 'dept1' : 'dept2') : null,
    },
    seats: {
      dept1: dept1?.seats,
      dept2: dept2?.seats,
    },
    admissionFee: {
      dept1: dept1?.admissionFee,
      dept2: dept2?.admissionFee,
      cheaper: dept1 && dept2 ? (dept1.admissionFee < dept2.admissionFee ? 'dept1' : 'dept2') : null,
    },
    applicationDeadline: {
      dept1: dept1?.applicationDeadline,
      dept2: dept2?.applicationDeadline,
    },
  };

  return { dept1, dept2, comparison };
}
