import type { NotificationItem } from "@/types";

function iso(year: number, month: number, day: number, hour = 9, minute = 0) {
  return new Date(year, month - 1, day, hour, minute).toISOString();
}

// Phase 2 のシード通知(モック)
// 「現在=2026-06-15 朝」を想定して、明日の商談(m001)の24時間前リマインドや
// 未読の新着メッセージを並べています。
export const DUMMY_NOTIFICATIONS: NotificationItem[] = [
  // === クライアント(c001 / サンライト精機 山田)宛 ===
  {
    id: "notif-c-001",
    recipientType: "client",
    type: "reminder",
    title: "明日の商談リマインド",
    body: "明日 6/16(火) 14:00 から ピープルブリッジ様 との商談です。",
    linkUrl: "/client/messages/m001",
    channels: ["in_app", "email"],
    scheduledFor: iso(2026, 6, 15, 14, 0),
    sentAt: iso(2026, 6, 15, 14, 0),
  },
  {
    id: "notif-c-002",
    recipientType: "client",
    type: "schedule_proposed",
    title: "新しい日程提案が届きました",
    body: "オフィスエア様から3つの日程候補が届いています。ご確認ください。",
    linkUrl: "/client/messages/m003",
    channels: ["in_app"],
    sentAt: iso(2026, 6, 14, 11, 6),
  },
  {
    id: "notif-c-003",
    recipientType: "client",
    type: "offer_accepted",
    title: "打診が承諾されました",
    body: "ハーモニーHR様(完了案件)",
    linkUrl: "/client/messages/m002",
    channels: ["in_app"],
    sentAt: iso(2026, 5, 28, 10, 0),
    readAt: iso(2026, 5, 28, 11, 0),
  },

  // === 支援先(s001 / ピープルブリッジ 佐藤)宛 ===
  {
    id: "notif-s-001",
    recipientType: "supplier",
    type: "new_message",
    title: "新着メッセージ",
    body: "グランドビルド 鈴木様より「すみません、別日いただけますか?」",
    linkUrl: "/supplier/messages/m006",
    channels: ["in_app", "email"],
    sentAt: iso(2026, 6, 14, 17, 30),
  },
  {
    id: "notif-s-002",
    recipientType: "supplier",
    type: "reminder",
    title: "明日の商談リマインド",
    body: "明日 6/16(火) 14:00 から サンライト精機様 との商談です。",
    linkUrl: "/supplier/messages/m001",
    channels: ["in_app", "email"],
    scheduledFor: iso(2026, 6, 15, 14, 0),
    sentAt: iso(2026, 6, 15, 14, 0),
  },
  {
    id: "notif-s-003",
    recipientType: "supplier",
    type: "schedule_confirmed",
    title: "日程が確定しました",
    body: "サンライト精機様 6/16(火) 14:00-15:00 で確定。Googleカレンダーに登録済。",
    linkUrl: "/supplier/messages/m001",
    channels: ["in_app"],
    sentAt: iso(2026, 6, 14, 9, 20),
    readAt: iso(2026, 6, 14, 9, 30),
  },
];
