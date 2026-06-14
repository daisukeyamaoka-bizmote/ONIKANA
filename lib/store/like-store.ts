"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// クライアントが「気になる/ぜひ話したい」を押した記録
// レコメンド画面 → 管理画面 でリアルタイム共有するため Zustand + localStorage で永続化
export type LikeAction = "liked" | "super_liked";

interface LikeRecord {
  clientId: string;
  supplierId: string;
  action: LikeAction;
  at: string; // ISO日時
}

interface LikeStore {
  records: LikeRecord[];
  setLike: (
    clientId: string,
    supplierId: string,
    action: LikeAction | null,
  ) => void;
  getForClient: (clientId: string) => LikeRecord[];
  reset: () => void;
}

export const useLikeStore = create<LikeStore>()(
  persist(
    (set, get) => ({
      records: [],
      setLike: (clientId, supplierId, action) =>
        set((state) => {
          // 同じ client × supplier の既存レコードを削除
          const others = state.records.filter(
            (r) => !(r.clientId === clientId && r.supplierId === supplierId),
          );
          if (action === null) return { records: others };
          return {
            records: [
              ...others,
              { clientId, supplierId, action, at: new Date().toISOString() },
            ],
          };
        }),
      getForClient: (clientId) =>
        get().records.filter((r) => r.clientId === clientId),
      reset: () => set({ records: [] }),
    }),
    { name: "onikana-likes" },
  ),
);
