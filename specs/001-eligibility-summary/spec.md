# Feature Specification: University Eligibility Summary

**Feature Branch**: `001-eligibility-summary`

**Created**: 2026-08-18

**Status**: Draft

**Input**: User description: "Add a University Eligibility Summary feature to the existing AI Admission Assistant. The feature should allow a student to see a clear summary of their eligibility information after providing their academic details, including academic profile, eligible units, ineligible units, satisfied requirements, unsatisfied requirements, and unverified information."

## Clarifications

### Session 2026-08-18

- Q: How should derived academic metrics (such as average GPA or combined GPA) be calculated across admission rules? → A: The system MUST calculate derived academic metrics only when explicitly required by the applicable admission rule. The system MUST NOT assume that SSC and HSC GPA should be averaged or combined unless the applicable university or program rule explicitly defines that calculation.
- Q: Should the University Eligibility Summary feature continue using and extending the existing structured in-memory dataset in lib/services/eligibility-engine.ts, or migrate to the database? → A: Keep the in-memory universitiesDepartments dataset as the active source of truth for this feature, enriching its structure with any new rule fields needed for the summary without performing database migrations.
- Q: How should the in-memory admission dataset represent and evaluate specific admission criteria? → A: Enrich the dataset schema with explicit optional rule fields (minSscGPA, minHscGPA, minCombinedGPA, allowSecondTime, requiredSubjects) and evaluate only the specific criteria defined for each department/unit.
- Q: How should the system determine and display "Verification Pending" when an admission requirement cannot be verified from the basic academic profile alone? → A: When all verifiable criteria (GPA, Group, Year) pass but specific subject prerequisites or circular items remain unconfirmed from the basic profile, classify the department as "Eligible (Verification Pending)" with an informational badge and a clear list of unverified requirements.
- Q: How should the summary results page organize the presentation of eligible programs, ineligible programs, and student profile details? → A: Display a top Student Profile Card, followed by tabbed/toggleable views (All Programs, Eligible Programs, Ineligible Programs) with count badges and expandable card details.
- Q: How should department metadata fields (available seats, admission fees, and application deadlines) be handled during eligibility evaluation? → A: Treat seats, fees, and deadlines as purely informational display attributes on the program card, without using them as disqualifying criteria for academic eligibility.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Comprehensive Academic & Eligibility Summary Overview (Priority: P1)

As a university admission applicant, I want to submit my academic details (SSC GPA, HSC GPA, HSC Group, Passing Year) and view a unified summary screen detailing my academic profile alongside a clear breakdown of which universities and programs I qualify for, so that I can quickly assess my realistic admission options.

**Why this priority**: Core value of the assistant. Applicants need immediate, unambiguous understanding of where they stand before committing time and application fees.

**Independent Test**: Can be tested by entering valid academic credentials (e.g., SSC 5.0, HSC 5.0, Science, 2024) and verifying that the resulting summary presents the academic profile and an accurate list of eligible programs with reasons for qualification.

**Acceptance Scenarios**:

1. **Given** a student enters valid SSC and HSC credentials with a permitted group, **When** they request eligibility verification, **Then** the system displays a persistent student profile card (showing SSC GPA, HSC GPA, HSC group, passing year, and only rule-relevant derived metrics) and a dedicated section listing all qualified programs with their verified criteria.
2. **Given** a student with high marks qualifying for multiple universities, **When** reviewing the eligible list, **Then** each program card shows the specific requirements satisfied (e.g., minimum GPA met, group permitted) and relevant program parameters (available seats, application deadline, fee).

---

### User Story 2 - Ineligible Units Breakdown with Gap Explanations (Priority: P1)

As an applicant whose scores or group do not meet certain institutional thresholds, I want to see which universities or departments I am not currently eligible for along with the specific reasons why, so that I understand exactly what requirements I failed to satisfy without confusion or false hope.

**Why this priority**: Knowing why one is disqualified prevents wasted application efforts, provides transparency, and builds trust.

**Independent Test**: Can be tested with moderate marks (e.g., SSC 3.50, HSC 3.50, Humanities) and verifying that programs with higher GPA cutoffs or science-only requirements appear in the ineligible section with explicit failure reasons (e.g., "Minimum GPA required: 4.00, Your GPA: 3.50").

**Acceptance Scenarios**:

1. **Given** a student with credentials below certain program thresholds, **When** viewing the eligibility summary, **Then** the system renders a distinct "Not Eligible / Ineligible Programs" section.
2. **Given** an ineligible program entry, **When** expanded or inspected, **Then** the system lists the exact criteria that failed (e.g., GPA shortfall with exact difference, restricted group) separate from any criteria that were satisfied.

---

### User Story 3 - Unverified Requirements & Safe Information Disclosure (Priority: P2)

As an applicant seeking admission guidance, I want the summary to clearly flag requirements that could not be verified (such as subject-level grade prerequisites not yet supplied, or programs with pending official admission circular updates), so that I know what additional verification steps I need to perform and do not rely on incomplete data.

**Why this priority**: Prevents premature assumptions and guarantees compliance with the Truth-First constitutional principle by explicitly declaring data limitations.

**Independent Test**: Can be tested by evaluating programs requiring individual subject marks (e.g., Math/Physics minimum grade point) when only aggregate GPAs were provided, verifying that an "Unverified / Needs Additional Verification" tag or notice is displayed.

**Acceptance Scenarios**:

1. **Given** a department has verifiable thresholds met but subject-specific prerequisite rules not covered by the submitted profile, **When** displaying the program in the summary, **Then** the system displays an "Eligible (Verification Pending)" badge with a bulleted list of unverified prerequisites needing confirmation.
2. **Given** official admission circular data for a specific passing year or university is outdated or unverified, **When** rendering that institution's status, **Then** the system presents a clear disclaimer stating the data reflects previous circular terms and prompts verification with official university portals.

---

### User Story 4 - Filtering, Quick Search & Profile Modification (Priority: P3)

As an applicant reviewing a long list of institution results, I want to quickly filter by university, group, or eligibility status and easily edit my academic inputs without leaving the summary context, so that I can explore alternative scenarios smoothly.

**Why this priority**: Enhances usability and exploration efficiency when dealing with dozens of departments across public, engineering, and cluster universities.

**Independent Test**: Can be tested by toggling between "All", "Eligible Only", and "Ineligible Only" filters, or modifying the input GPA to instantly re-calculate results.

**Acceptance Scenarios**:

1. **Given** a generated summary with multiple results, **When** the user selects "Eligible Only" or searches for "BUET", **Then** the view filters the cards accordingly without reloading.
2. **Given** an active summary view, **When** the user clicks "Edit Profile" or updates GPA values, **Then** the summary seamlessly recalculates and reflects the new profile state.

---

### Edge Cases

- **Borderline GPA**: Exact boundary match (e.g., GPA required is 4.00 and student score is exactly 4.00) must be classified as eligible.
- **Second-Time Admission Restrictions**: When an applicant's passing year indicates a second-time attempt, universities that prohibit second-time applicants must classify the student as ineligible with an explicit reason ("Second-time applicants not permitted").
- **Zero Eligible Matches**: When an applicant qualifies for zero programs, the system must show a supportive summary card explaining the overall profile standing, clear next steps, and guidance to consult general counseling resources rather than a blank or broken screen.
- **Missing or Ambiguous Department Data**: If a department's criteria cannot be computed deterministically due to unverified parameters, it must be flagged under a distinct "Verification Pending" status rather than falsely labeled eligible or ineligible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept student academic profile inputs including SSC GPA (0.00–5.00), HSC GPA (0.00–5.00), HSC Group (Science, Commerce, Humanities), and HSC Passing Year.
- **FR-002**: System MUST validate all academic inputs against valid Bangladeshi grading ranges (0.00 to 5.00) before initiating evaluation.
- **FR-003**: The system MUST calculate derived academic metrics only when those metrics are explicitly required by the applicable admission rule. The system MUST NOT assume that SSC and HSC GPA should be averaged or combined unless the applicable university or program rule explicitly defines that calculation.
- **FR-004**: System MUST display a concise Student Academic Profile card at the top of the summary containing submitted academic attributes and any rule-relevant derived metrics.
- **FR-005**: System MUST evaluate student eligibility against structured university admission criteria deterministically, evaluating only the specific rule fields defined for each department (e.g., `minSscGPA`, `minHscGPA`, `minCombinedGPA`, `allowedGroups`, `allowSecondTime`, `requiredSubjects`), without relying on LLM-generated rules or hallucinated cutoffs.
- **FR-006**: System MUST present a distinct list of "Eligible Programs" detailing each qualified university, department, program name, seat capacity, admission fee, and application timeline.
- **FR-007**: System MUST list all specific satisfied requirements (e.g., GPA threshold met, group requirement fulfilled) for each evaluated unit.
- **FR-008**: System MUST present a distinct list of "Ineligible Programs" containing all units where the student does not satisfy minimum requirements.
- **FR-009**: System MUST articulate the exact unmet requirement(s) for each ineligible program (e.g., specific GPA deficit, disallowed study group, second-time admission restriction).
- **FR-010**: System MUST classify programs where all verifiable criteria pass but specific subject grades or circular dates remain unconfirmed as "Eligible (Verification Pending)", accompanied by explicit warning badges and unverified item lists.
- **FR-011**: System MUST provide interactive filtering/sorting controls allowing users to switch between All, Eligible, and Ineligible views with count badges, or filter by university name.
- **FR-012**: System MUST allow users to edit their academic inputs or reset their profile to recalculate eligibility instantly.
- **FR-013**: System MUST provide direct navigation links to university detail pages and the advisory chat assistant for further inquiry.
- **FR-014**: System MUST maintain full responsiveness and accessibility across mobile, tablet, and desktop screen widths.
- **FR-015**: System MUST treat metadata fields (seat capacity, admission fee, application deadline) purely as informational display attributes without impacting the academic eligibility evaluation outcome.

### Key Entities *(include if feature involves data)*

- **Student Academic Profile**: Represents the applicant's academic standing, consisting of SSC GPA, HSC GPA, HSC Group (Science, Commerce, Humanities), Passing Year, and applicable rule-derived metrics (such as combined or average GPA where defined by the specific rule).
- **Admission Requirement Rule**: Structured admission criteria for a department or unit, containing rule-specific evaluation attributes (such as `minSscGPA?`, `minHscGPA?`, `minCombinedGPA?`, `minGPA?`, `allowedGroups`, `requiredSubjects?`, `allowSecondTime?`, `seats`, `admissionFee`, `applicationDeadline`, `website`, `circularYear?`, `verificationPending?`).
- **Eligibility Evaluation Result**: The deterministic outcome of evaluating a Student Academic Profile against an Admission Requirement Rule, consisting of an overall status (`Eligible`, `Eligible (Verification Pending)`, `Ineligible`), GPA margin/delta, list of satisfied requirements, list of unsatisfied requirements, and unverified requirement notes.
- **University Admission Unit**: The institutional entity offering the academic seat (e.g., University Name, Unit/Faculty, Department, Degree Program, Official Portal Link).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Students can input their academic information and view their full eligibility summary within 5 seconds.
- **SC-002**: 100% of eligibility determinations and requirement reasons are derived from verified structured rules with zero LLM-fabricated cutoffs.
- **SC-003**: 100% of ineligible results explicitly state at least one verified reason for disqualification (e.g., exact GPA gap or group mismatch).
- **SC-004**: 100% of programs with incomplete or prerequisite-dependent criteria display prominent unverified notices rather than ungrounded assumptions.
- **SC-005**: Summary interface achieves responsive layout usability with zero horizontal scroll breakage across mobile (375px), tablet (768px), and desktop (1280px) viewports.

## Assumptions

- The existing structured in-memory dataset in the eligibility engine (`lib/services/eligibility-engine.ts`) represents the source of truth for university departments, programs, and baseline criteria.
- GPA evaluation uses standard Bangladeshi 5.00 scale grading conventions evaluated strictly according to the specific criteria defined by each university/unit rule.
- Detailed subject-by-subject grade breakdowns (e.g., individual physics or mathematics grade letters) may not be available in initial basic input; such rules will be highlighted as "subject verification required" where applicable.
- Navigation links to university details and chat advisor connect to existing application routes (`/universities/[slug]` and `/chat`).
