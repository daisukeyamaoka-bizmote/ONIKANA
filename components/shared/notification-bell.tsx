"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useNotificationStore } from "@/lib/store/notification-store";
import type { NotificationType } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  perspective: "client" | "supplier";
}

function relativeTime(iso?: string): string {
  if (!iso) return "";
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "今";
  if (min < 60) return `${min}分前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}時間前`;
  const day = Math.floor(hr / 24);
  return `${day}日前`;
}

const TYPE_LABEL: Record<NotificationType, string> = {
  new_message: "新着メッセージ",
  schedule_proposed: "日程提案",
  schedule_confirmed: "日程確定",
  reminder: "リマインド",
  offer_accepted: "打診承諾",
};

export function NotificationBell({ perspective }: Props) {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const notifications = useNotificationStore((s) => s.notifications);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const items = hydrated
    ? notifications
        .filter((n) => n.recipientType === perspective)
        .sort(
          (a, b) =>
            new Date(b.sentAt ?? b.scheduledFor ?? 0).getTime() -
            new Date(a.sentAt ?? a.scheduledFor ?? 0).getTime(),
        )
    : [];
  const unread = items.filter((n) => !n.readAt).length;

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="通知"
        onClick={() => setOpen(!open)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-mist-200 bg-paper text-ink hover:bg-mist-100"
      >
        <BellIcon />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-oni-red px-1 text-[10px] font-bold leading-none text-paper">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-mist-200 bg-paper shadow-card-hover">
          <div className="flex items-center justify-between border-b border-mist-100 px-4 py-3">
            <p className="text-sm font-semibold text-ink">通知</p>
            <button
              className="text-xs text-mist-600 hover:text-ink"
              onClick={() => markAllRead(perspective)}
            >
              すべて既読に
            </button>
          </div>
          <ul className="max-h-96 divide-y divide-mist-100 overflow-y-auto">
            {items.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-mist-500">
                通知はありません
              </li>
            )}
            {items.slice(0, 8).map((n) => (
              <li key={n.id}>
                {n.linkUrl ? (
                  <Link
                    href={n.linkUrl}
                    onClick={() => {
                      markRead(n.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex flex-col gap-1 px-4 py-3 hover:bg-mist-50",
                      !n.readAt && "bg-fuku-sand-50",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-mist-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-mist-700">
                        {TYPE_LABEL[n.type]}
                      </span>
                      {!n.readAt && (
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-oni-red" />
                      )}
                      <span className="ml-auto text-[10px] text-mist-500">
                        {relativeTime(n.sentAt ?? n.scheduledFor)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-ink">{n.title}</p>
                    <p className="text-xs text-mist-600">{n.body}</p>
                  </Link>
                ) : (
                  <div className="px-4 py-3">
                    <p className="text-sm">{n.title}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
