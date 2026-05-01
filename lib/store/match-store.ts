"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MatchStatus } from "@/types";

// MVPデモではDBに保存せず、ブラウザ内のステート変化として再現する
// (例: クライアントが「気になる」を押した結果や、支援先が承諾した結果)
interface MatchOverride {
  status?: MatchStatus;
  proposedDates?: string[];
  scheduledAt?: string;
  meetingCompleted?: boolean;
}

interface MatchStore {
  overrides: Record<string, MatchOverride>;
  setStatus: (matchId: string, status: MatchStatus) => void;
  setProposedDates: (matchId: string, dates: string[]) => void;
  setScheduledAt: (matchId: string, iso: string) => void;
  setCompleted: (matchId: string) => void;
  reset: () => void;
}

export const useMatchStore = create<MatchStore>()(
  persist(
    (set) => ({
      overrides: {},
      setStatus: (matchId, status) =>
        set((state) => ({
          overrides: {
            ...state.overrides,
            [matchId]: { ...state.overrides[matchId], status },
          },
        })),
      setProposedDates: (matchId, dates) =>
        set((state) => ({
          overrides: {
            ...state.overrides,
            [matchId]: { ...state.overrides[matchId], proposedDates: dates },
          },
        })),
      setScheduledAt: (matchId, iso) =>
        set((state) => ({
          overrides: {
            ...state.overrides,
            [matchId]: {
              ...state.overrides[matchId],
              scheduledAt: iso,
              status: "matched",
            },
          },
        })),
      setCompleted: (matchId) =>
        set((state) => ({
          overrides: {
            ...state.overrides,
            [matchId]: {
              ...state.overrides[matchId],
              status: "completed",
              meetingCompleted: true,
            },
          },
        })),
      reset: () => set({ overrides: {} }),
    }),
    {
      name: "onikana-match-overrides",
    },
  ),
);
