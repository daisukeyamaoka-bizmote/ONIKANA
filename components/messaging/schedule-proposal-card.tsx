"use client";

import { useState } from "react";
import type { Message, ScheduleSlot } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function dt(iso: string) {
  const d = new Date(iso);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getMonth() + 1}/${d.getDate()}(${days[d.getDay()]}) ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

interface Props {
  message: Message;
  perspective: "client" | "supplier";
  alreadyConfirmed: boolean;
  onConfirm: (slot: ScheduleSlot) => void;
}

export function ScheduleProposalCard({
  message,
  perspective,
  alreadyConfirmed,
  onConfirm,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const slots = message.proposedSlots ?? [];
  const canSelect = perspective === "client" && !alreadyConfirmed;

  return (
    <div className="mx-auto my-4 w-full max-w-md rounded-2xl border-2 border-oni-red bg-paper p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest uppercase text-oni-red">
          日程提案
        </span>
        {alreadyConfirmed && (
          <span className="rounded-full bg-oni-blue px-2 py-0.5 text-xs text-paper">
            確定済み
          </span>
        )}
      </div>
      <h4 className="mt-2 text-base font-semibold text-ink">
        商談候補日時 {message.senderName && `・${message.senderName}`}
      </h4>
      <p className="mt-1 text-xs text-mist-600">
        下記からご都合の良い日時を1つお選びください。
      </p>

      <div className="mt-3 space-y-2">
        {slots.map((slot, idx) => {
          const isSelected = selected === idx;
          return (
            <label
              key={idx}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 transition",
                canSelect
                  ? "cursor-pointer"
                  : "cursor-default opacity-80",
                isSelected
                  ? "border-oni-blue bg-oni-blue-50"
                  : "border-mist-300 hover:border-mist-400",
                !canSelect && "hover:border-mist-300",
              )}
            >
              <input
                type="radio"
                disabled={!canSelect}
                checked={isSelected}
                onChange={() => setSelected(idx)}
                className="accent-oni-blue"
              />
              <div>
                <div className="text-sm font-medium text-ink">{dt(slot.start)}</div>
                <div className="text-xs text-mist-500">
                  60分 ・ {slot.location ?? "場所未設定"}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {canSelect ? (
        <Button
          variant="primary"
          className="mt-4 w-full"
          disabled={selected === null}
          onClick={() => selected !== null && onConfirm(slots[selected])}
        >
          {selected !== null
            ? `${dt(slots[selected].start)} で確定する`
            : "日時を選択してください"}
        </Button>
      ) : (
        <p className="mt-3 text-center text-xs text-mist-500">
          {perspective === "supplier"
            ? alreadyConfirmed
              ? "クライアントが確定しました"
              : "クライアントの選択をお待ちください"
            : "確定済みのため、変更できません"}
        </p>
      )}
    </div>
  );
}
