import { create } from 'zustand';

interface MockExamState {
  examId: string | null;
  examTitle: string;
  durationMinutes: number;
  timeRemainingSeconds: number;
  answers: Record<string, string>; // questionId -> selectedOptionId
  isCompleted: boolean;
  startExam: (id: string, title: string, durationMinutes: number) => void;
  selectAnswer: (questionId: string, optionId: string) => void;
  tick: () => void;
  submitExam: () => void;
  resetExam: () => void;
}

export const useMockExamStore = create<MockExamState>((set) => ({
  examId: null,
  examTitle: '',
  durationMinutes: 60,
  timeRemainingSeconds: 3600,
  answers: {},
  isCompleted: false,

  startExam: (id, title, durationMinutes) =>
    set({
      examId: id,
      examTitle: title,
      durationMinutes,
      timeRemainingSeconds: durationMinutes * 60,
      answers: {},
      isCompleted: false,
    }),

  selectAnswer: (questionId, optionId) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: optionId },
    })),

  tick: () =>
    set((state) => {
      if (state.timeRemainingSeconds <= 1) {
        return { timeRemainingSeconds: 0, isCompleted: true };
      }
      return { timeRemainingSeconds: state.timeRemainingSeconds - 1 };
    }),

  submitExam: () => set({ isCompleted: true }),

  resetExam: () =>
    set({
      examId: null,
      examTitle: '',
      durationMinutes: 60,
      timeRemainingSeconds: 3600,
      answers: {},
      isCompleted: false,
    }),
}));
