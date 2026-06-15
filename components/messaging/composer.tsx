"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import type { ScheduleSlot } from "@/types";

interface ComposerProps {
  perspective: "client" | "supplier";
  canProposeSchedule: boolean;
  onSendText: (body: string) => void;
  onProposeSchedule?: (slots: ScheduleSlot[]) => void;
}

// 「明日 10:00」のような初期値生成
function defaultSlot(daysFromNow: number, hour: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:00`;
}

export function Composer({
  perspective,
  canProposeSchedule,
  onSendText,
  onProposeSchedule,
}: ComposerProps) {
  const [text, setText] = useState("");
  const [proposeOpen, setProposeOpen] = useState(false);
  const [slot1, setSlot1] = useState(defaultSlot(7, 10));
  const [slot2, setSlot2] = useState(defaultSlot(8, 14));
  const [slot3, setSlot3] = useState(defaultSlot(9, 16));
  const [location, setLocation] = useState("オンライン(Google Meet)");

  const handleSendText = () => {
    if (!text.trim()) return;
    onSendText(text);
    setText("");
  };

  const handlePropose = () => {
    if (!onProposeSchedule) return;
    const toSlot = (local: string): ScheduleSlot => {
      const start = new Date(local);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      return { start: start.toISOString(), end: end.toISOString(), location };
    };
    const slots = [slot1, slot2, slot3].filter(Boolean).map(toSlot);
    if (slots.length === 0) return;
    onProposeSchedule(slots);
    setProposeOpen(false);
  };

  return (
    <div className="border-t border-mist-200 bg-paper">
      {proposeOpen && (
        <div className="border-b border-mist-200 bg-fuku-sand-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-oni-red">
            日程提案フォーム
          </p>
          <p className="mt-1 text-xs text-mist-600">
            候補日時を3つ選んでください(60分・場所共通)。
          </p>
          <div className="mt-3 space-y-2">
            <SlotInput label="候補1" value={slot1} onChange={setSlot1} />
            <SlotInput label="候補2" value={slot2} onChange={setSlot2} />
            <SlotInput label="候補3" value={slot3} onChange={setSlot3} />
            <div>
              <Label className="!mb-1 !text-xs">場所</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="例:オンライン(Google Meet)"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setProposeOpen(false)}
            >
              キャンセル
            </Button>
            <Button variant="supplier" size="sm" onClick={handlePropose}>
              提案を送信
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-end gap-2 p-3">
        {canProposeSchedule && !proposeOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setProposeOpen(true)}
          >
            日程を提案
          </Button>
        )}
        <Textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSendText();
            }
          }}
          placeholder={
            perspective === "client"
              ? "メッセージを入力 (Cmd+Enter で送信)"
              : "返信を入力 (Cmd+Enter で送信)"
          }
          className="!min-h-[42px] flex-1 resize-none"
        />
        <Button
          variant="primary"
          size="sm"
          disabled={!text.trim()}
          onClick={handleSendText}
        >
          送信
        </Button>
      </div>
    </div>
  );
}

function SlotInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="!mb-1 !text-xs">{label}</Label>
      <Input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
