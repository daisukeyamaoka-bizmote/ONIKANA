"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  NotificationItem,
  UserIntegrations,
  NotificationPreferences,
} from "@/types";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "@/types";
import { DUMMY_NOTIFICATIONS } from "@/lib/dummy-data/notifications";

type Role = "client" | "supplier";

interface NotificationStore {
  notifications: NotificationItem[];
  // ロール別の連携状態・通知設定
  clientIntegrations: UserIntegrations;
  supplierIntegrations: UserIntegrations;
  clientPreferences: NotificationPreferences;
  supplierPreferences: NotificationPreferences;

  // 通知操作
  markRead: (id: string) => void;
  markAllRead: (role: Role) => void;

  // 連携
  connectGoogle: (role: Role, email: string) => void;
  disconnectGoogle: (role: Role) => void;

  // 通知設定
  setPreferences: (role: Role, prefs: Partial<NotificationPreferences>) => void;

  reset: () => void;
}

const INITIAL_INTEGRATIONS: UserIntegrations = {
  googleCalendarConnected: false,
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: DUMMY_NOTIFICATIONS,
      clientIntegrations: INITIAL_INTEGRATIONS,
      supplierIntegrations: INITIAL_INTEGRATIONS,
      clientPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
      supplierPreferences: DEFAULT_NOTIFICATION_PREFERENCES,

      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, readAt: new Date().toISOString() } : n,
          ),
        })),

      markAllRead: (role) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.recipientType === role && !n.readAt
              ? { ...n, readAt: new Date().toISOString() }
              : n,
          ),
        })),

      connectGoogle: (role, email) =>
        set((state) => {
          const value: UserIntegrations = {
            googleCalendarConnected: true,
            googleCalendarEmail: email,
            primaryCalendarId: "primary",
            connectedAt: new Date().toISOString(),
          };
          return role === "client"
            ? { clientIntegrations: value }
            : { supplierIntegrations: value };
        }),

      disconnectGoogle: (role) =>
        set(() => {
          return role === "client"
            ? { clientIntegrations: INITIAL_INTEGRATIONS }
            : { supplierIntegrations: INITIAL_INTEGRATIONS };
        }),

      setPreferences: (role, prefs) =>
        set((state) => {
          const key = role === "client" ? "clientPreferences" : "supplierPreferences";
          return { [key]: { ...state[key], ...prefs } } as Partial<NotificationStore>;
        }),

      reset: () =>
        set({
          notifications: DUMMY_NOTIFICATIONS,
          clientIntegrations: INITIAL_INTEGRATIONS,
          supplierIntegrations: INITIAL_INTEGRATIONS,
          clientPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
          supplierPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
        }),
    }),
    { name: "fukuwauchi-notifications" },
  ),
);
