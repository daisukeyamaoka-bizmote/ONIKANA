import type { MeetingTargetRole } from "@/types";

// 商談単価の自動計算
// REQUIREMENTS.md セクション1.1 / 4.2 を参照
export function calculateMeetingPrice(role: MeetingTargetRole): number {
  switch (role) {
    case "staff":
      return 30000;
    case "manager":
      return 50000;
    case "executive":
      return 90000; // 80k-100kの中央値
  }
}

// bizmote成果報酬(売上の5%)
export function calculateBizmoteFee(meetingPrice: number): number {
  return Math.floor(meetingPrice * 0.05);
}
