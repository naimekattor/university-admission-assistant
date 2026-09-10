import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AcademicGroup = 'Science' | 'Commerce' | 'Humanities';

interface EligibilityState {
  sscGPA: number | '';
  hscGPA: number | '';
  group: AcademicGroup;
  passingYear: number;
  hasChecked: boolean;
  setScores: (data: Partial<Omit<EligibilityState, 'setScores' | 'resetScores'>>) => void;
  resetScores: () => void;
}

export const useEligibilityStore = create<EligibilityState>()(
  persist(
    (set) => ({
      sscGPA: '',
      hscGPA: '',
      group: 'Science',
      passingYear: 2026,
      hasChecked: false,
      setScores: (data) => set((state) => ({ ...state, ...data, hasChecked: true })),
      resetScores: () =>
        set({
          sscGPA: '',
          hscGPA: '',
          group: 'Science',
          passingYear: 2026,
          hasChecked: false,
        }),
    }),
    {
      name: 'eduguide_eligibility_state',
    }
  )
);
