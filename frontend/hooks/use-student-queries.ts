'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface DailyTask {
  id: string;
  subject: string;
  topic: string;
  type: 'Lesson' | 'Practice' | 'Revision' | 'Mock Test';
  duration: string;
  completed: boolean;
  href: string;
}

const DEFAULT_TASKS: DailyTask[] = [
  {
    id: 'p1',
    subject: 'Physics',
    topic: "Newton's Laws & Linear Momentum",
    type: 'Lesson',
    duration: '35 mins',
    completed: true,
    href: '/prepare/lessons/newtons-second-law-buet-guide',
  },
  {
    id: 'p2',
    subject: 'Chemistry',
    topic: 'Organic Reaction Mechanisms & Electrophiles',
    type: 'Lesson',
    duration: '40 mins',
    completed: false,
    href: '/prepare',
  },
  {
    id: 'p3',
    subject: 'Higher Math',
    topic: 'Calculus Differentiation 20 MCQs',
    type: 'Practice',
    duration: '25 mins',
    completed: false,
    href: '/practice',
  },
  {
    id: 'p4',
    subject: 'Physics',
    topic: 'Rotational Dynamics Revision Flashcards',
    type: 'Revision',
    duration: '15 mins',
    completed: false,
    href: '/mistakes',
  },
];

export function useStudentDashboard() {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['student', 'dashboard', 'tasks'],
    queryFn: async (): Promise<DailyTask[]> => {
      try {
        const res = await fetch('/api/v1/study-plan');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            return json.data;
          }
        }
      } catch {}
      return DEFAULT_TASKS;
    },
    staleTime: 1000 * 60 * 2, // 2 mins fresh
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      // Optimistic update handled in onMutate or local queryClient update
      return taskId;
    },
    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey: ['student', 'dashboard', 'tasks'] });
      const previous = queryClient.getQueryData<DailyTask[]>(['student', 'dashboard', 'tasks']);

      if (previous) {
        queryClient.setQueryData<DailyTask[]>(
          ['student', 'dashboard', 'tasks'],
          previous.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
        );
      }

      return { previous };
    },
    onError: (_err, _taskId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['student', 'dashboard', 'tasks'], context.previous);
      }
    },
  });

  return {
    tasks: tasksQuery.data || DEFAULT_TASKS,
    isLoading: tasksQuery.isLoading,
    toggleTask: toggleTaskMutation.mutate,
  };
}

export function usePreparationRoadmap() {
  return useQuery({
    queryKey: ['student', 'preparation', 'roadmap'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/v1/preparation/subjects');
        if (res.ok) {
          const json = await res.json();
          return json.data || null;
        }
      } catch {}
      return null;
    },
    staleTime: 1000 * 60 * 10, // 10 mins fresh
  });
}
