# Quickstart & Verification Guide: University Eligibility Summary

**Feature**: `001-eligibility-summary`  
**Date**: 2026-08-18  

---

## 1. Prerequisites

1. Ensure dependencies are installed via `pnpm install`.
2. Start the local development server via `pnpm run dev`.
3. Open browser at `http://localhost:3000/eligibility`.

---

## 2. End-to-End Test Scenarios

### Scenario A: High Performing Science Student
* **Inputs**:
  * SSC GPA: `5.00`
  * HSC GPA: `5.00`
  * Group: `Science`
  * Passing Year: `2024`
* **Expected Results**:
  * **Profile Card**: Displays SSC `5.00`, HSC `5.00`, Group `Science`, Year `2024`.
  * **Eligible Tab**: BUET CSE, BUET Civil, DU CSE, KUET EEE, RUET ME, DU Law appear under Eligible / Verification Pending.
  * **Requirements Satisfied**: Shows GPA requirements met (`5.00 >= required`) and group matched.
  * **Unverified Badges**: Shows informational subject prerequisite notices (e.g. Physics, Chemistry, Math).
  * **Ineligible Tab**: `0` programs.

---

### Scenario B: Humanities Student
* **Inputs**:
  * SSC GPA: `4.60`
  * HSC GPA: `4.70`
  * Group: `Humanities`
  * Passing Year: `2024`
* **Expected Results**:
  * **Eligible Tab**: DU Law appears as Eligible with green badge.
  * **Ineligible Tab**: BUET CSE, BUET Civil, DU CSE, KUET EEE, RUET ME appear under Ineligible.
  * **Failure Reasons**: Explicit message: *"Your group (Humanities) is not eligible. Allowed groups: Science"*.

---

### Scenario C: Below Threshold Science Student
* **Inputs**:
  * SSC GPA: `3.50`
  * HSC GPA: `3.60`
  * Group: `Science`
  * Passing Year: `2024`
* **Expected Results**:
  * **Ineligible Tab**: BUET CSE (min 4.5), BUET Civil (min 4.2), DU CSE (min 4.0), KUET EEE (min 4.0), RUET ME (min 3.8) listed under Ineligible.
  * **Failure Reasons**: Displays exact GPA shortfall (e.g. *"GPA requirement not met. Minimum: 4.50, Your GPA: 3.55 (Shortfall: -0.95)"*).

---

### Scenario D: Interactive Search & Inline Profile Editing
* **Actions**:
  1. From results screen, type `"BUET"` into search filter $\rightarrow$ instantly filters down to BUET programs only.
  2. Click tab `"Ineligible"` $\rightarrow$ switches to show only disqualified units with count badge.
  3. Click `"Edit Profile"` or adjust input marks $\rightarrow$ restores input form and preserves smooth recalculation.
