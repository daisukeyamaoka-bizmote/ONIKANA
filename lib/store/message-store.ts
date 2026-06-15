"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message, ScheduleSlot } from "@/types";
import { DUMMY_MESSAGES } from "@/lib/dummy-data/messages";

interface MessageStore {
  messages: Message[];

  // 送信(text)
  sendText: (params: {
    matchId: string;
    senderType: "client" | "supplier";
    senderName: string;
    body: string;
  }) => void;

  // 日程提案(支援先のみ)
  proposeSchedule: (params: {
    matchId: string;
    senderName: string;
    slots: ScheduleSlot[];
  }) => void;

  // 日程確定(クライアントのみ)
  confirmSchedule: (params: {
    matchId: string;
    senderName: string;
    slot: ScheduleSlot;
  }) => void;

  // 既読化
  markRead: (matchId: string, role: "client" | "supplier") => void;

  reset: () => void;
}

const nowIso = () => new Date().toISOString();
const newId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      messages: DUMMY_MESSAGES,

      sendText: ({ matchId, senderType, senderName, body }) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: newId(),
              matchId,
              senderType,
              senderName,
              type: "text",
              body,
              createdAt: nowIso(),
              readByClient: senderType === "client",
              readBySupplier: senderType === "supplier",
            },
          ],
        })),

      proposeSchedule: ({ matchId, senderName, slots }) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: newId(),
              matchId,
              senderType: "supplier",
              senderName,
              type: "schedule_proposal",
              proposedSlots: slots,
              createdAt: nowIso(),
              readByClient: false,
              readBySupplier: true,
            },
          ],
        })),

      confirmSchedule: ({ matchId, senderName, slot }) =>
        set((state) => {
          const confirmId = newId();
          const sysId = newId();
          return {
            messages: [
              ...state.messages,
              {
                id: confirmId,
                matchId,
                senderType: "client",
                senderName,
                type: "schedule_confirmed",
                confirmedSlot: slot,
                googleEventId: `evt_demo_${confirmId}`,
                createdAt: nowIso(),
                readByClient: true,
                readBySupplier: false,
              },
              {
                id: sysId,
                matchId,
                senderType: "system",
                type: "system",
                body: `日程が確定しました。両者のGoogleカレンダーに登録されました。`,
                createdAt: nowIso(),
                readByClient: true,
                readBySupplier: false,
              },
            ],
          };
        }),

      markRead: (matchId, role) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.matchId === matchId
              ? role === "client"
                ? { ...m, readByClient: true }
                : { ...m, readBySupplier: true }
              : m,
          ),
        })),

      reset: () => set({ messages: DUMMY_MESSAGES }),
    }),
    { name: "fukuwauchi-messages" },
  ),
);
