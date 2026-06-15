"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DUMMY_MEETINGS,
  findMatchById,
} from "@/lib/dummy-data/matches";
import { findClientById } from "@/lib/dummy-data/clients";
import { MOCK_SUPPLIER } from "@/lib/auth/mock-user";
import { useMatchStore } from "@/lib/store/match-store";
import { formatDateTime, formatYen } from "@/lib/utils";
import { ROLE_LABELS } from "@/types";

export default function SupplierMeetingsPage() {
  const overrides = useMatchStore((s) => s.overrides);
  const setCompleted = useMatchStore((s) => s.setCompleted);
  const setProposedDates = useMatchStore((s) => s.setProposedDates);
  const [proposeFor, setProposeFor] = useState<string | null>(null);
  const [draftDates, setDraftDates] = useState<string[]>(["", "", ""]);

  const meetings = DUMMY_MEETINGS.map((mt) => {
    const match = findMatchById(mt.matchId);
    if (!match || match.supplierId !== MOCK_SUPPLIER.id) return null;
    const client = findClientById(match.clientId);
    if (!client) return null;
    return { meeting: mt, match, client };
  }).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">商談スケジュール</h1>
      <p className="mt-1 text-sm text-navy-900/60">
        承諾済みの商談一覧。日程提案や実施報告ができます。
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {meetings.map(({ meeting, match, client }) => {
          const override = overrides[match.id] ?? {};
          const status = override.status ?? match.status;
          const completed = status === "completed";
          const scheduledAt = override.scheduledAt ?? meeting.scheduledAt;

          return (
            <Card key={meeting.id}>
              <CardContent>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy-900">
                      {client.name}
                    </h3>
                    <p className="text-xs text-navy-900/60 mt-0.5">
                      役職:{ROLE_LABELS[match.targetRole]} ・ 単価{" "}
                      {formatYen(match.meetingPrice ?? 0)}
                    </p>
                  </div>
                  <Badge variant={completed ? "success" : scheduledAt ? "navy" : "warn"}>
                    {completed
                      ? "完了"
                      : scheduledAt
                        ? "確定"
                        : "日程提案待ち"}
                  </Badge>
                </div>

                {scheduledAt ? (
                  <p className="mt-3 text-sm text-navy-900">
                    <span className="text-xs text-navy-900/60 mr-2">日時</span>
                    <span className="num-emphasis font-semibold">
                      {formatDateTime(scheduledAt)}
                    </span>
                  </p>
                ) : (
                  <Button
                    className="mt-4"
                    size="sm"
                    onClick={() => {
                      setProposeFor(match.id);
                      setDraftDates(meeting.proposedDates ?? ["", "", ""]);
                    }}
                  >
                    日程を提案する
                  </Button>
                )}

                {scheduledAt && !completed && (
                  <Button
                    className="mt-4"
                    variant="success"
                    size="sm"
                    onClick={() => setCompleted(match.id)}
                  >
                    商談を実施しました
                  </Button>
                )}
                {completed && (
                  <p className="mt-3 text-xs font-semibold text-ink">
                    商談実施済み
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
        {meetings.length === 0 && (
          <p className="col-span-full text-center text-navy-900/50 py-12">
            まだ商談はありません。
          </p>
        )}
      </div>

      {proposeFor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => setProposeFor(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-navy-900 mb-2">
              商談希望日時を3つ提案
            </h3>
            <div className="space-y-3 mt-4">
              {draftDates.map((d, i) => (
                <input
                  key={i}
                  type="datetime-local"
                  value={d}
                  onChange={(e) => {
                    const arr = [...draftDates];
                    arr[i] = e.target.value;
                    setDraftDates(arr);
                  }}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
                />
              ))}
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setProposeFor(null)}>
                キャンセル
              </Button>
              <Button
                onClick={() => {
                  const filled = draftDates.filter(Boolean);
                  if (filled.length > 0) {
                    setProposedDates(proposeFor, filled);
                  }
                  setProposeFor(null);
                }}
              >
                提案を送信
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
