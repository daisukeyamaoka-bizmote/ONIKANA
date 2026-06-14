"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ⑤ 支援先の有効/無効状態を管理者から制御する
// ダミーデータ側の isActive をオーバーライドする
interface SupplierStatusStore {
  overrides: Record<string, boolean>; // supplierId → isActive
  toggle: (supplierId: string, current: boolean) => void;
  reset: () => void;
}

export const useSupplierStatusStore = create<SupplierStatusStore>()(
  persist(
    (set) => ({
      overrides: {},
      toggle: (supplierId, current) =>
        set((state) => ({
          overrides: { ...state.overrides, [supplierId]: !current },
        })),
      reset: () => set({ overrides: {} }),
    }),
    { name: "onikana-supplier-status" },
  ),
);
