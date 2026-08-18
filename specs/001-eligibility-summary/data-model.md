# Data Model: University Eligibility Summary

**Feature**: `001-eligibility-summary`  
**Date**: 2026-08-18  
**Status**: Complete  

---

## 1. Core Entities & TypeScript Interfaces

### Student Profile Entity
Represents the applicant's submitted academic credentials.

```typescript
export interface StudentProfile {
  sscGPA: number;               // Range: 0.00 to 5.00
  hscGPA: number;               // Range: 0.00 to 5.00
  group: 'Science' | 'Commerce' | 'Humanities';
  passingYear: number;          // e.g., 2024, 2023
  preferredSubject?: string;
  preferredLocation?: string;
}
```

### University Department / Admission Unit Rule Entity
Structured in-memory criteria defining specific admission rules for an institutional unit.

```typescript
export interface UniversityDepartment {
  id: string;                         // Unique department identifier (e.g., 'buet-cse')
  university: string;                 // University name (e.g., 'BUET', 'DU', 'KUET')
  department: string;                 // Department name
  program: string;                    // Program code (e.g., 'CSE', 'EEE', 'Law')
  minGPA?: number;                    // Legacy average GPA cutoff (if rule uses average)
  minSscGPA?: number;                 // Minimum SSC GPA cutoff (if rule evaluates SSC separately)
  minHscGPA?: number;                 // Minimum HSC GPA cutoff (if rule evaluates HSC separately)
  minCombinedGPA?: number;            // Minimum Combined (SSC + HSC) GPA cutoff
  allowedGroups: Array<'Science' | 'Commerce' | 'Humanities'>;
  requiredSubjects: string[];         // e.g. ['Physics', 'Chemistry', 'Mathematics']
  allowSecondTime?: boolean;          // Whether 2nd-time applicants (previous year batch) are allowed
  allowedPassingYears?: number[];     // Explicit list of eligible HSC passing years (e.g. [2024, 2023])
  seats: number;                      // Informational seat count
  applicationDeadline: string;        // Informational deadline string (ISO or readable date)
  website: string;                    // Official portal URL
  admissionFee: number;               // Application fee in BDT
  circularYear?: number;              // Circular session year (e.g. 2024 or 2025)
  verificationPending?: boolean;      // Flag if circular rules require manual update confirmation
}
```

### Requirement Evaluation Breakdown
Detailed evaluation item for an individual criterion.

```typescript
export interface RequirementCheck {
  type: 'gpa_ssc' | 'gpa_hsc' | 'gpa_combined' | 'gpa_average' | 'group' | 'passing_year' | 'subject_prerequisite';
  satisfied: boolean;
  status: 'satisfied' | 'failed' | 'unverified';
  ruleDescription: string;
  studentValue: string | number;
  message: string;
}
```

### Department Eligibility Result
Full evaluation payload for a single university department.

```typescript
export type EligibilityStatus = 'eligible' | 'eligible_pending' | 'ineligible';

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
```

### Full Summary Evaluation
Aggregate container for the entire evaluation session.

```typescript
export interface EligibilitySummaryEvaluation {
  profile: StudentProfile;
  totalEvaluated: number;
  eligibleCount: number;
  ineligibleCount: number;
  pendingCount: number;
  results: DepartmentEligibilityResult[];
}
```

---

## 2. Validation & Boundary Rules

1. **GPA Boundary Validation**:
   - `0.00 <= sscGPA <= 5.00`
   - `0.00 <= hscGPA <= 5.00`
   - Floating point precision formatted to 2 decimal places for user display.
2. **Rule Satisfaction Evaluation**:
   - **SSC GPA Rule**: If `dept.minSscGPA` is defined, `student.sscGPA >= dept.minSscGPA`.
   - **HSC GPA Rule**: If `dept.minHscGPA` is defined, `student.hscGPA >= dept.minHscGPA`.
   - **Combined GPA Rule**: If `dept.minCombinedGPA` is defined, `(student.sscGPA + student.hscGPA) >= dept.minCombinedGPA`.
   - **Average GPA Rule**: If `dept.minGPA` is defined without separate cutoffs, `(student.sscGPA + student.hscGPA) / 2 >= dept.minGPA`.
   - **Group Rule**: `dept.allowedGroups.includes(student.group)`.
   - **Passing Year Rule**: If `dept.allowSecondTime === false`, `student.passingYear` must match current batch (e.g. 2024).
   - **Subject Prerequisites**: If `dept.requiredSubjects.length > 0` and student is in permitted group, marked as `unverified` unless individual subject grades are supplied in the future.
