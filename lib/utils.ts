import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwindクラスを統合する共通ヘルパー
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 数値カンマ整形(¥30,000 のような表示用)
export function formatYen(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("ja-JP");
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
