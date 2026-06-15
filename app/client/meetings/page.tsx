"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DUMMY_MEETINGS,
  findMatchById,
} from "@/lib/dummy-data/matches";
import { findSupplierById } from "@/lib/dummy-data/suppliers";
import { MOCK_CLIENT } from "@/lib/auth/mock-user";
import { useMatchStore } from "@/lib/store/match-store";
import { formatDateTime, formatYen } from "@/lib/utils";
import { ROLE_LABELS } from "@/types";

export default function ClientMeetingsPage() {
  const overrides = useMatchStore((s) => s.overrides);
  const setCompleted = useMatchStore((s) => s.setCompleted);
  const setScheduledAt = useMatchStore((s) => s.setScheduledAt);
  const [selectedDateBy, setSelectedDateBy] = useState<Record<string, string>>(
    {},
  );

  const meetings = DUMMY_MEETINGS.map((mt) => {
    const match = findMatchById(mt.matchId);
    if (!match || match.clientId !== MOCK_CLIENT.id) return null;
    const supplier = findSupplierById(match.supplierId);
    if (!supplier) return null;
    return { meeting: mt, match, supplier };
  }).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">商談スケジュール</h1>
      <p className="mt-1 text-sm text-navy-900/60">
        確定済み・調整中の商談一覧です。
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {meetings.map(({ meeting, match, supplier }) => {
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
                      {supplier.name}
                    </h3>
                    <p className="text-xs text-navy-900/60 mt-0.5">
                      役職:{ROLE_LABELS[match.targetRole]} ・ 商談単価{" "}
                      {formatYen(match.meetingPrice ?? 0)}
                    </p>
                  </div>
                  <Badge variant={completed ? "success" : "navy"}>
                    {completed
                      ? "完了"
                      : meeting.status === "proposing" && !scheduledAt
                        ? "日程調整中"
                        : "確定"}
                  </Badge>
                </div>

                {scheduledAt ? (
                  <p className="mt-3 text-sm text-navy-900">
                    <span className="text-xs text-navy-900/60 mr-2">日時</span>
                    <span className="num-emphasis font-semibold">
                      {formatDateTime(scheduledAt)}
                    </span>
                  </p>
                ) : meeting.proposedDates ? (
                  <div className="mt-3">
                    <p className="text-xs text-navy-900/60 mb-2">
                      支援先からの候補日時(1つ選択)
                    </p>
                    <div className="space-y-2">
                      {meeting.proposedDates.map((d) => (
                        <label
                          key={d}
                          className="flex items-center gap-2 cursor-pointer rounded-lg border border-navy/10 px-3 py-2 hover:bg-navy-50"
                        >
                          <input
                            type="radio"
                            name={meeting.id}
                            checked={selectedDateBy[meeting.id] === d}
                            onChange={() =>
                              setSelectedDateBy({
                                ...selectedDateBy,
                                [meeting.id]: d,
                              })
                            }
                          />
                          <span className="text-sm">{formatDateTime(d)}</span>
                        </label>
                      ))}
                    </div>
                    <Button
                      className="mt-3"
                      size="sm"
                      disabled={!selectedDateBy[meeting.id]}
                      onClick={() => {
                        const chosen = selectedDateBy[meeting.id];
                        if (chosen) setScheduledAt(match.id, chosen);
                      }}
                    >
                      この日時で確定
                    </Button>
                  </div>
                ) : null}

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
                    商談実施済み(売上計上)
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
    </div>
  );
}
