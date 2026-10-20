"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AnswerValue, Answers, Category } from "@/lib/questions";
import type { CareerReport } from "@/lib/ai/schema";

interface QuizState {
  category: Category | null;
  answers: Answers;
  index: number;
  /** +1 forward, -1 back — drives the slide direction of the animation */
  direction: 1 | -1;
  report: CareerReport | null;
  demo: boolean;

  start: (category: Category) => void;
  answer: (questionId: string, value: AnswerValue) => void;
  go: (delta: 1 | -1) => void;
  setReport: (report: CareerReport, demo: boolean) => void;
  reset: () => void;
}

const initial = { category: null, answers: {}, index: 0, direction: 1 as const, report: null, demo: false };

// Progress is saved in localStorage, so a page reload never loses answers.
export const useQuiz = create<QuizState>()(
  persist(
    (set) => ({
      ...initial,
      start: (category) =>
        set((s) => (s.category === category && !s.report ? s : { ...initial, category })),
      answer: (id, value) => set((s) => ({ answers: { ...s.answers, [id]: value } })),
      go: (delta) => set((s) => ({ index: Math.max(0, s.index + delta), direction: delta })),
      setReport: (report, demo) => set({ report, demo }),
      reset: () => set(initial),
    }),
    { name: "pathwise-quiz", storage: createJSONStorage(() => localStorage) },
  ),
);
