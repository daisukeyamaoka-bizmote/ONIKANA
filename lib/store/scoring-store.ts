"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// 管理者画面のスコアリング設定
// REQUIREMENTS.md セクション5.4.4 を参照
interface ScoringConfig {
  recommendThreshold: number; // AIレコメンド表示閾値(0-100)
  autoOfferThreshold: number; // 自動打診トリガー閾値(0-100)
  tagWeight: number; // タグ一致重み(0-1)
  successWeight: number; // 実績スコア重み(0-1)
}

interface ScoringStore extends ScoringConfig {
  set: (config: Partial<ScoringConfig>) => void;
  reset: () => void;
}

const DEFAULTS: ScoringConfig = {
  recommendThreshold: 50,
  autoOfferThreshold: 50,
  tagWeight: 0.5,
  successWeight: 0.5,
};

export const useScoringStore = create<ScoringStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      set: (config) => set((state) => ({ ...state, ...config })),
      reset: () => set({ ...DEFAULTS }),
    }),
    {
      name: "onikana-scoring-config",
    },
  ),
);
