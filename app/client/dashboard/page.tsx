"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { MatchStatusBadge } from "@/components/shared/match-status-badge";
import { findMatchesByClientId, findMeetingByMatchId } from "@/lib/dummy-data/matches";
import { findSupplierById } from "@/lib/dummy-data/suppliers";
import { MOCK_CLIENT } from "@/lib/auth/mock-user";
import { formatDateTime } from "@/lib/utils";

function MatchedToast() {
  const params = useSearchParams();
  if (params.get("matched") !== "true") return null;
  return (
    <div className="mb-6 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
      マッチング確定しました。各支援先に打診を送信しました。
    </div>
  );
}

export default function ClientDashboard() {
  const matches = findMatchesByClientId(MOCK_CLIENT.id);
  const matched = matches.filter(
    (m) => m.status === "matched" || m.status === "accepted",
  );
  const waiting = matches.filter(
    (m) => m.status === "recommended" || m.status === "liked" || m.status === "super_liked",
  );
  const completed = matches.filter((m) => m.status === "completed");

  const upcomingMeetings = matches
    .map((m) => {
      const meeting = findMeetingByMatchId(m.id);
      const supplier = findSupplierById(m.supplierId);
      return meeting && meeting.scheduledAt && supplier
        ? { match: m, meeting, supplier }
        : null;
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .sort(
      (a, b) =>
        new Date(a.meeting.scheduledAt!).getTime() -
        new Date(b.meeting.scheduledAt!).getTime(),
    )
    .slice(0, 3);

  const recentMatches = [...matches]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div>
      <Suspense fallback={null}>
        <MatchedToast />
      </Suspense>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">
            こんにちは、{MOCK_CLIENT.name}様
          </h1>
          <p className="mt-1 text-sm text-navy-900/60">
            現在のマッチング状況を確認できます。
          </p>
        </div>
        <Link href="/client/questionnaire">
          <Button variant="secondary">＋ 新しいマッチングを探す</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="確定マッチング"
          value={`${matched.length}件`}
          accent="navy"
        />
        <StatCard
          label="待機中"
          value={`${waiting.length}件`}
          accent="aqua"
          hint="支援先からの返答待ち"
        />
        <StatCard
          label="完了商談"
          value={`${completed.length}件`}
          accent="success"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-navy-900">
                直近の商談予定
              </h2>
              <Link
                href="/client/meetings"
                className="text-xs text-aqua-700 hover:underline"
              >
                すべて見る →
              </Link>
            </div>
            {upcomingMeetings.length === 0 ? (
              <p className="text-sm text-navy-900/50 py-6 text-center">
                確定済みの商談はまだありません。
              </p>
            ) : (
              <ul className="divide-y divide-navy/10">
                {upcomingMeetings.map(({ match, meeting, supplier }) => (
                  <li
                    key={match.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-navy-900 truncate">
                        {supplier.name}
                      </p>
                      <p className="text-xs text-navy-900/60">
                        {formatDateTime(meeting.scheduledAt!)}
                      </p>
                    </div>
                    <MatchStatusBadge status={match.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-navy-900">
                直近のマッチング
              </h2>
              <Link
                href="/client/matches"
                className="text-xs text-aqua-700 hover:underline"
              >
                すべて見る →
              </Link>
            </div>
            <ul className="divide-y divide-navy/10">
              {recentMatches.map((m) => {
                const supplier = findSupplierById(m.supplierId);
                if (!supplier) return null;
                return (
                  <li
                    key={m.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-navy-900 truncate">
                        {supplier.name}
                      </p>
                      <p className="text-xs text-navy-900/60">
                        スコア {m.matchScore} ・ 更新{" "}
                        {formatDateTime(m.updatedAt)}
                      </p>
                    </div>
                    <MatchStatusBadge status={m.status} />
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
