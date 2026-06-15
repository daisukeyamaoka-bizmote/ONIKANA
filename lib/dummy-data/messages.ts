import type { Message } from "@/types";

// デモ用シードメッセージ。
// 日時は「現在から相対」に見せたいが、Zustand永続化との兼ね合いで
// 固定アンカー(2026-06-16)を基準に生成しています。
// デモリセットで再生成される設計。

function iso(year: number, month: number, day: number, hour = 14, minute = 0) {
  return new Date(year, month - 1, day, hour, minute).toISOString();
}

// 「明日」想定の確定商談
const TOMORROW_SLOT = {
  start: iso(2026, 6, 16, 14, 0),
  end: iso(2026, 6, 16, 15, 0),
  location: "オンライン(Google Meet)",
};

// 候補スロット群
const CANDIDATE_SLOTS_A = [
  { start: iso(2026, 6, 22, 10, 0), end: iso(2026, 6, 22, 11, 0), location: "オンライン" },
  { start: iso(2026, 6, 23, 14, 0), end: iso(2026, 6, 23, 15, 0), location: "オンライン" },
  { start: iso(2026, 6, 24, 16, 0), end: iso(2026, 6, 24, 17, 0), location: "オンライン" },
];

const CANDIDATE_SLOTS_B = [
  { start: iso(2026, 6, 25, 11, 0), end: iso(2026, 6, 25, 12, 0), location: "オンライン" },
  { start: iso(2026, 6, 26, 15, 0), end: iso(2026, 6, 26, 16, 0), location: "オンライン" },
  { start: iso(2026, 6, 29, 10, 0), end: iso(2026, 6, 29, 11, 0), location: "オンライン" },
];

export const DUMMY_MESSAGES: Message[] = [
  // ====== m001: サンライト精機(c001) × ピープルブリッジ(s001)・確定済み ======
  {
    id: "msg-m001-001",
    matchId: "m001",
    senderType: "system",
    type: "system",
    body: "ピープルブリッジ様が打診を承諾しました。商談日程をご相談ください。",
    createdAt: iso(2026, 6, 12, 9, 0),
    readByClient: true,
    readBySupplier: true,
  },
  {
    id: "msg-m001-002",
    matchId: "m001",
    senderType: "supplier",
    senderName: "ピープルブリッジ 佐藤",
    type: "text",
    body:
      "サンライト精機 山田様、お打診ありがとうございます。\nまずはエンジニア採用の現状を伺えればと思います。下記3日程でいかがでしょうか。",
    createdAt: iso(2026, 6, 12, 10, 30),
    readByClient: true,
    readBySupplier: true,
  },
  {
    id: "msg-m001-003",
    matchId: "m001",
    senderType: "supplier",
    senderName: "ピープルブリッジ 佐藤",
    type: "schedule_proposal",
    proposedSlots: [
      TOMORROW_SLOT,
      { start: iso(2026, 6, 17, 10, 0), end: iso(2026, 6, 17, 11, 0), location: "オンライン" },
      { start: iso(2026, 6, 18, 16, 0), end: iso(2026, 6, 18, 17, 0), location: "オンライン" },
    ],
    createdAt: iso(2026, 6, 12, 10, 31),
    readByClient: true,
    readBySupplier: true,
  },
  {
    id: "msg-m001-004",
    matchId: "m001",
    senderType: "client",
    senderName: "サンライト精機 山田",
    type: "text",
    body: "ありがとうございます、確認のうえご連絡します。",
    createdAt: iso(2026, 6, 13, 14, 10),
    readByClient: true,
    readBySupplier: true,
  },
  {
    id: "msg-m001-005",
    matchId: "m001",
    senderType: "client",
    senderName: "サンライト精機 山田",
    type: "schedule_confirmed",
    confirmedSlot: TOMORROW_SLOT,
    googleEventId: "evt_demo_m001_001",
    createdAt: iso(2026, 6, 14, 9, 20),
    readByClient: true,
    readBySupplier: true,
  },
  {
    id: "msg-m001-006",
    matchId: "m001",
    senderType: "system",
    type: "system",
    body:
      "6/16(火) 14:00-15:00 で確定しました。両者のGoogleカレンダーに登録されました。",
    createdAt: iso(2026, 6, 14, 9, 20),
    readByClient: true,
    readBySupplier: true,
  },

  // ====== m003: サンライト精機(c001) × オフィスエア(s010)・日程提案待ち ======
  {
    id: "msg-m003-001",
    matchId: "m003",
    senderType: "system",
    type: "system",
    body: "オフィスエア様が打診を承諾しました。",
    createdAt: iso(2026, 6, 14, 11, 0),
    readByClient: true,
    readBySupplier: true,
  },
  {
    id: "msg-m003-002",
    matchId: "m003",
    senderType: "supplier",
    senderName: "オフィスエア 岡田",
    type: "text",
    body:
      "サンライト精機様、ご打診ありがとうございます。\n評価制度のテーマで、まずは1時間お話を伺えればと思います。下記候補で空いている時間はありますか?",
    createdAt: iso(2026, 6, 14, 11, 5),
    readByClient: false,
    readBySupplier: true,
  },
  {
    id: "msg-m003-003",
    matchId: "m003",
    senderType: "supplier",
    senderName: "オフィスエア 岡田",
    type: "schedule_proposal",
    proposedSlots: CANDIDATE_SLOTS_A,
    createdAt: iso(2026, 6, 14, 11, 6),
    readByClient: false,
    readBySupplier: true,
  },

  // ====== m006: グランドビルド(c003) × ピープルブリッジ(s001)・調整中 ======
  {
    id: "msg-m006-001",
    matchId: "m006",
    senderType: "system",
    type: "system",
    body: "ピープルブリッジ様が打診を承諾しました。",
    createdAt: iso(2026, 6, 13, 9, 0),
    readByClient: true,
    readBySupplier: true,
  },
  {
    id: "msg-m006-002",
    matchId: "m006",
    senderType: "supplier",
    senderName: "ピープルブリッジ 佐藤",
    type: "text",
    body:
      "グランドビルド様、お打診ありがとうございます。\n若手定着のテーマでまずはお話を伺えればと思います。",
    createdAt: iso(2026, 6, 13, 9, 5),
    readByClient: true,
    readBySupplier: true,
  },
  {
    id: "msg-m006-003",
    matchId: "m006",
    senderType: "supplier",
    senderName: "ピープルブリッジ 佐藤",
    type: "schedule_proposal",
    proposedSlots: CANDIDATE_SLOTS_A,
    createdAt: iso(2026, 6, 13, 9, 6),
    readByClient: true,
    readBySupplier: true,
  },
  {
    id: "msg-m006-004",
    matchId: "m006",
    senderType: "client",
    senderName: "グランドビルド 鈴木",
    type: "text",
    body:
      "ありがとうございます。すみません、ご提案いただいた3日とも合わず、来週後半でいくつか頂けますか?",
    createdAt: iso(2026, 6, 14, 17, 30),
    readByClient: true,
    readBySupplier: false,
  },

  // ====== m002: サンライト精機(c001) × ハーモニーHR(s016)・完了済み ======
  {
    id: "msg-m002-001",
    matchId: "m002",
    senderType: "system",
    type: "system",
    body: "ハーモニーHR様が打診を承諾しました。",
    createdAt: iso(2026, 5, 28, 10, 0),
    readByClient: true,
    readBySupplier: true,
  },
  {
    id: "msg-m002-002",
    matchId: "m002",
    senderType: "supplier",
    senderName: "ハーモニーHR 上田",
    type: "schedule_proposal",
    proposedSlots: CANDIDATE_SLOTS_B,
    createdAt: iso(2026, 5, 28, 10, 5),
    readByClient: true,
    readBySupplier: true,
  },
  {
    id: "msg-m002-003",
    matchId: "m002",
    senderType: "client",
    senderName: "サンライト精機 山田",
    type: "schedule_confirmed",
    confirmedSlot: CANDIDATE_SLOTS_B[1],
    googleEventId: "evt_demo_m002_001",
    createdAt: iso(2026, 5, 29, 11, 0),
    readByClient: true,
    readBySupplier: true,
  },
  {
    id: "msg-m002-004",
    matchId: "m002",
    senderType: "system",
    type: "system",
    body: "商談実施が完了しました。お疲れさまでした。",
    createdAt: iso(2026, 6, 5, 16, 30),
    readByClient: true,
    readBySupplier: true,
  },
];

export function getMessagesForMatch(matchId: string): Message[] {
  return DUMMY_MESSAGES.filter((m) => m.matchId === matchId).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

// ある match の現状(日程確定済か / 提案待ちかなど)を推定するヘルパー
export function getThreadStatus(matchId: string, allMessages: Message[]) {
  const list = allMessages.filter((m) => m.matchId === matchId);
  const hasConfirmed = list.some((m) => m.type === "schedule_confirmed");
  const hasProposal = list.some((m) => m.type === "schedule_proposal");
  const isCompleted = list.some(
    (m) => m.type === "system" && m.body?.includes("商談実施"),
  );
  return {
    hasConfirmed,
    hasProposal,
    isCompleted,
    confirmedSlot: list.find((m) => m.type === "schedule_confirmed")?.confirmedSlot,
  };
}
