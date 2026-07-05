"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageBubble } from "@/components/messaging/message-bubble";
import { ScheduleProposalCard } from "@/components/messaging/schedule-proposal-card";
import { ScheduleConfirmedCard } from "@/components/messaging/schedule-confirmed-card";
import { Composer } from "@/components/messaging/composer";
import { useMessageStore } from "@/lib/store/message-store";
import { useMatchStore } from "@/lib/store/match-store";
import { useNotificationStore } from "@/lib/store/notification-store";
import { findMatchById } from "@/lib/dummy-data/matches";
import { findClientById } from "@/lib/dummy-data/clients";
import { findSupplierById } from "@/lib/dummy-data/suppliers";
import type { ScheduleSlot } from "@/types";

interface Props {
  matchId: string;
  perspective: "client" | "supplier";
  backHref: string;
  detailHref?: string;
}

export function ThreadView({
  matchId,
  perspective,
  backHref,
  detailHref,
}: Props) {
  const messages = useMessageStore((s) => s.messages);
  const sendText = useMessageStore((s) => s.sendText);
  const proposeSchedule = useMessageStore((s) => s.proposeSchedule);
  const confirmSchedule = useMessageStore((s) => s.confirmSchedule);
  const markRead = useMessageStore((s) => s.markRead);
  // 日程確定をマッチング側にも同期させる(商談ページ・管理画面に反映)
  const setScheduledAt = useMatchStore((s) => s.setScheduledAt);
  const scrollRef = useRef<HTMLDivElement>(null);

  const integrations = useNotificationStore((s) =>
    perspective === "client" ? s.clientIntegrations : s.supplierIntegrations,
  );

  const match = findMatchById(matchId);
  const client = match ? findClientById(match.clientId) : null;
  const supplier = match ? findSupplierById(match.supplierId) : null;

  const thread = useMemo(
    () =>
      messages
        .filter((m) => m.matchId === matchId)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
    [messages, matchId],
  );

  const alreadyConfirmed = thread.some((m) => m.type === "schedule_confirmed");

  // 入室時に既読化
  useEffect(() => {
    markRead(matchId, perspective);
  }, [matchId, perspective, markRead]);

  // 新着メッセージで最下部へ自動スクロール
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread.length]);

  if (!match || !client || !supplier) {
    return (
      <p className="text-sm text-mist-500">スレッドが見つかりません。</p>
    );
  }

  const counterpartyName =
    perspective === "client" ? supplier.name : client.name;
  // 発言者名は実データから解決(スレッドごとに正しい会社名になる)
  const myName =
    perspective === "client"
      ? `${client.name} 担当`
      : `${supplier.name} 担当`;

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      {/* スレッドヘッダ */}
      <Card className="mb-3 flex-shrink-0">
        <CardContent className="!py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={backHref}
                className="text-xs text-mist-500 hover:text-ink"
              >
                ← 受信箱に戻る
              </Link>
              <h2 className="mt-1 truncate text-lg font-semibold text-ink">
                {counterpartyName}
              </h2>
              <p className="text-xs text-mist-500">
                マッチスコア {match.matchScore} ・{" "}
                {match.matchType === "ai_recommend"
                  ? "AIレコメンド"
                  : "自動打診"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {alreadyConfirmed && <Badge variant="navy">日程確定済</Badge>}
              {integrations.googleCalendarConnected ? (
                <Badge variant="success">Googleカレンダー連携中</Badge>
              ) : (
                <Badge variant="warn">カレンダー未連携</Badge>
              )}
              {detailHref && (
                <Link
                  href={detailHref}
                  className="text-xs text-oni-blue hover:underline"
                >
                  打診詳細を見る →
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* メッセージ本体 */}
      <Card className="flex flex-1 flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {thread.length === 0 && (
            <p className="text-center text-sm text-mist-500">
              まだメッセージがありません。
            </p>
          )}
          {thread.map((m) => {
            if (m.type === "schedule_proposal") {
              return (
                <ScheduleProposalCard
                  key={m.id}
                  message={m}
                  perspective={perspective}
                  alreadyConfirmed={alreadyConfirmed}
                  onConfirm={(slot: ScheduleSlot) => {
                    confirmSchedule({ matchId, senderName: myName, slot });
                    // 商談ページ・管理画面のステータスも「商談確定」に更新
                    setScheduledAt(matchId, slot.start);
                  }}
                />
              );
            }
            if (m.type === "schedule_confirmed") {
              return <ScheduleConfirmedCard key={m.id} message={m} />;
            }
            return (
              <MessageBubble key={m.id} message={m} perspective={perspective} />
            );
          })}
        </div>

        <Composer
          perspective={perspective}
          canProposeSchedule={perspective === "supplier" && !alreadyConfirmed}
          onSendText={(body) =>
            sendText({
              matchId,
              senderType: perspective,
              senderName: myName,
              body,
            })
          }
          onProposeSchedule={(slots) =>
            proposeSchedule({ matchId, senderName: myName, slots })
          }
        />
      </Card>
    </div>
  );
}
