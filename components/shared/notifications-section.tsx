"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/lib/store/notification-store";
import { cn } from "@/lib/utils";
import type { NotificationPreferences } from "@/types";

interface Props {
  perspective: "client" | "supplier";
}

const REMINDER_OPTIONS: { hours: number; label: string }[] = [
  { hours: 24, label: "24時間前" },
  { hours: 12, label: "12時間前" },
  { hours: 3, label: "3時間前" },
  { hours: 1, label: "1時間前" },
];

const MESSAGE_OPTIONS: {
  value: NotificationPreferences["newMessageChannel"];
  label: string;
}[] = [
  { value: "immediate", label: "即時に通知" },
  { value: "daily_digest", label: "1日1回まとめて" },
  { value: "off", label: "通知しない" },
];

export function NotificationsSection({ perspective }: Props) {
  const prefs = useNotificationStore((s) =>
    perspective === "client" ? s.clientPreferences : s.supplierPreferences,
  );
  const setPreferences = useNotificationStore((s) => s.setPreferences);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) return null;

  const toggleReminder = (hours: number) => {
    const next = prefs.reminderHoursBefore.includes(hours)
      ? prefs.reminderHoursBefore.filter((h) => h !== hours)
      : [...prefs.reminderHoursBefore, hours].sort((a, b) => b - a);
    setPreferences(perspective, { reminderHoursBefore: next });
  };

  const toggleChannel = (channel: "in_app" | "email") => {
    const next = prefs.reminderChannels.includes(channel)
      ? prefs.reminderChannels.filter((c) => c !== channel)
      : [...prefs.reminderChannels, channel];
    setPreferences(perspective, { reminderChannels: next });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">通知設定</h1>
        <p className="mt-1 text-sm text-mist-600">
          商談前のリマインドや新着メッセージの受け取り方をカスタマイズできます。
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-ink">
              商談前のリマインド
            </h3>
            <p className="mt-1 text-xs text-mist-500">
              確定した商談の何時間前に通知を受け取るか(複数選択可)。
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {REMINDER_OPTIONS.map((opt) => {
                const on = prefs.reminderHoursBefore.includes(opt.hours);
                return (
                  <button
                    key={opt.hours}
                    type="button"
                    onClick={() => toggleReminder(opt.hours)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition",
                      on
                        ? "border-oni-blue bg-oni-blue text-paper"
                        : "border-mist-300 bg-paper text-ink hover:bg-mist-100",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">通知チャネル</h3>
            <p className="mt-1 text-xs text-mist-500">
              リマインドの受け取り方法を選択(複数選択可)。
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {(["in_app", "email"] as const).map((c) => {
                const on = prefs.reminderChannels.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleChannel(c)}
                    className={cn(
                      "rounded-lg border px-4 py-3 text-left text-sm transition",
                      on
                        ? "border-oni-blue bg-oni-blue-50"
                        : "border-mist-300 bg-paper hover:bg-mist-50",
                    )}
                  >
                    <p className="font-medium text-ink">
                      {c === "in_app" ? "アプリ内通知" : "メール通知"}
                    </p>
                    <p className="mt-0.5 text-xs text-mist-500">
                      {c === "in_app"
                        ? "ベルアイコンに通知が表示されます"
                        : "登録メールアドレスに送信されます"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-sm font-semibold text-ink">
            新着メッセージの通知
          </h3>
          <p className="mt-1 text-xs text-mist-500">
            やり取りの頻度に応じて選択してください。
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {MESSAGE_OPTIONS.map((opt) => {
              const on = prefs.newMessageChannel === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setPreferences(perspective, {
                      newMessageChannel: opt.value,
                    })
                  }
                  className={cn(
                    "rounded-lg border px-4 py-3 text-sm transition",
                    on
                      ? "border-oni-blue bg-oni-blue-50 font-semibold"
                      : "border-mist-300 bg-paper hover:bg-mist-50",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-sm font-semibold text-ink">サンプルプレビュー</h3>
          <p className="mt-1 text-xs text-mist-500">
            現在の設定でこのような通知が届きます。
          </p>
          <div className="mt-3 rounded-lg border border-mist-200 bg-fuku-sand-50 p-3 text-sm text-ink">
            <p className="text-xs uppercase tracking-widest text-mist-500">
              リマインド
            </p>
            <p className="mt-1 font-medium">明日の商談リマインド</p>
            <p className="mt-1 text-xs text-mist-600">
              明日 14:00 から 株式会社XX 様 との商談です。場所:オンライン
            </p>
            <p className="mt-2 text-[10px] text-mist-500">
              配信:
              {prefs.reminderHoursBefore
                .map((h) => `${h}時間前`)
                .join(" / ") || "なし"}
              {" ・ "}
              {prefs.reminderChannels
                .map((c) => (c === "in_app" ? "アプリ内" : "メール"))
                .join(" + ") || "チャネル未選択"}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-right">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setPreferences(perspective, {
              reminderHoursBefore: [24, 1],
              reminderChannels: ["in_app", "email"],
              newMessageChannel: "immediate",
            })
          }
        >
          初期値に戻す
        </Button>
      </div>
    </div>
  );
}
