"use client";

import type { Message } from "@/types";

function dt(iso: string) {
  const d = new Date(iso);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}(${days[d.getDay()]}) ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

interface Props {
  message: Message;
}

export function ScheduleConfirmedCard({ message }: Props) {
  const slot = message.confirmedSlot;
  if (!slot) return null;

  return (
    <div className="mx-auto my-4 w-full max-w-md rounded-2xl border-2 border-oni-blue bg-oni-blue-50 p-4">
      <span className="text-xs font-semibold tracking-widest uppercase text-oni-blue">
        日程確定
      </span>
      <p className="mt-2 text-base font-semibold text-ink">
        {dt(slot.start)}
      </p>
      <p className="mt-1 text-xs text-mist-700">
        60分 ・ {slot.location ?? "場所未設定"}
      </p>
      {message.googleEventId && (
        <p className="mt-3 text-xs text-mist-600">
          Googleカレンダーに登録済 ・ イベントID:{" "}
          <span className="font-mono">{message.googleEventId}</span>
        </p>
      )}
    </div>
  );
}
