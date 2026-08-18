# Interface Contract: Eligibility Summary Service

**Feature**: `001-eligibility-summary`  
**Date**: 2026-08-18  

---

## 1. Engine Function Signatures (`lib/services/eligibility-engine.ts`)

```typescript
/**
 * Evaluates an applicant's profile against a single university department rule
 * deterministically according to the department's declared criteria.
 */
export function evaluateDepartmentEligibility(
  student: StudentProfile,
  department: UniversityDepartment
): DepartmentEligibilityResult;

/**
 * Evaluates an applicant's profile against all configured departments in the dataset,
 * returning a complete summary breakdown with counts and sorted results.
 */
export function evaluateEligibilitySummary(
  student: StudentProfile,
  departments?: UniversityDepartment[]
): EligibilitySummaryEvaluation;

/**
 * Backward-compatible wrapper preserving legacy getEligibleUniversities signature
 */
export function getEligibleUniversities(
  student: StudentProfile
): Array<UniversityDepartment & { eligibility: ReturnType<typeof checkEligibility> }>;
```

---

## 2. Component Presentation Contract (`app/eligibility/page.tsx`)

### Props & State Contract

```typescript
export interface EligibilityPageState {
  // Input form state
  sscGPA: number | '';
  hscGPA: number | '';
  group: 'Science' | 'Commerce' | 'Humanities';
  passingYear: number;
  
  // Evaluation state
  submitted: boolean;
  summary: EligibilitySummaryEvaluation | null;
  
  // UI filter state
  activeTab: 'all' | 'eligible' | 'ineligible';
  searchQuery: string;
}
```

---

## 3. UI Status Badges & Color Mapping

| Status | Badge Label | Visual Style | Notes |
| :--- | :--- | :--- | :--- |
| `eligible` | **Eligible** | Green (`text-green-700 bg-green-50 border-green-200`) | All verified criteria satisfied |
| `eligible_pending` | **Provisionally Eligible (Verification Pending)** | Amber/Yellow (`text-amber-700 bg-amber-50 border-amber-200`) | Verifiable criteria met; subject prerequisite confirmation required |
| `ineligible` | **Not Eligible** | Rose/Red (`text-rose-700 bg-rose-50 border-rose-200`) | Shows explicit failure reasons with delta |
