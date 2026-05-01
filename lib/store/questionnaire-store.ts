"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuestionnaireAnswers } from "@/types";

// アンケート入力途中の自動保存に利用
// REQUIREMENTS.md セクション5.2.1 を参照
interface QuestionnaireState {
  step: number;
  answers: Partial<QuestionnaireAnswers>;
  setStep: (step: number) => void;
  setAnswers: (answers: Partial<QuestionnaireAnswers>) => void;
  reset: () => void;
}

export const useQuestionnaireStore = create<QuestionnaireState>()(
  persist(
    (set) => ({
      step: 1,
      answers: {},
      setStep: (step) => set({ step }),
      setAnswers: (answers) =>
        set((state) => ({ answers: { ...state.answers, ...answers } })),
      reset: () => set({ step: 1, answers: {} }),
    }),
    {
      name: "onikana-questionnaire-draft",
    },
  ),
);
