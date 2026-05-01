"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { MatchStatusBadge } from "@/components/shared/match-status-badge";
import {
  findMatchesBySupplierId,
  findMeetingByMatchId,
} from "@/lib/dummy-data/matches";
import { findClientById } from "@/lib/dummy-data/clients";
import { MOCK_SUPPLIER } from "@/lib/auth/mock-user";
import { useMatchStore } from "@/lib/store/match-store";
import { formatDateTime } from "@/lib/utils";
import { INDUSTRY_LABELS } from "@/types";

export default function SupplierDashboard() {
  const overrides = useMatchStore((s) => s.overrides);
  const matches = findMatchesBySupplierId(MOCK_SUPPLIER.id).map((m) => ({
    ...m,
    status: overrides[m.id]?.status ?? m.status,
  }));

  const pending = matches.filter(
    (m) =>
      m.status === "recommended" ||
      m.status === "liked" ||
      m.status === "super_liked" ||
      m.status === "auto_offered",
  );
  const accepted = matches.filter(
    (m) => m.status === "accepted" || m.status === "matched",
  );
  const upcomingMeetings = matches
    .map((m) => {
      const meeting = findMeetingByMatchId(m.id);
      const client = findClientById(m.clientId);
      return meeting && client && meeting.scheduledAt
        ? { match: m, meeting, client }
        : null;
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .slice(0, 3);

  const recentOffers = pending.slice(0, 3);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">
            こんにちは、{MOCK_SUPPLIER.name}様
          </h1>
          <p className="mt-1 text-sm text-navy-900/60">
            新着の打診と商談予定を確認できます。
          </p>
        </div>
        <Link href="/supplier/offers">
          <Button variant="supplier">打診一覧を見る →</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="未対応の打診"
          value={`${pending.length}件`}
          accent="supplier"
          hint="承諾/辞退の判断が必要"
        />
        <StatCard label="承諾済み" value={`${accepted.length}件`} accent="aqua" />
        <StatCard
          label="商談予定"
          value={`${upcomingMeetings.length}件`}
          accent="success"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-navy-900">
                直近の打診
              </h2>
              <Link
                href="/supplier/offers"
                className="text-xs text-supplier hover:underline"
              >
                すべて見る →
              </Link>
            </div>
            {recentOffers.length === 0 ? (
              <p className="text-sm text-navy-900/50 py-6 text-center">
                未対応の打診はありません。
              </p>
            ) : (
              <ul className="divide-y divide-navy/10">
                {recentOffers.map((m) => {
                  const client = findClientById(m.clientId);
                  if (!client) return null;
                  return (
                    <li key={m.id} className="py-3">
                      <Link
                        href={`/supplier/offers/${m.id}`}
                        className="block hover:bg-navy-50 -mx-2 px-2 py-1 rounded"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-navy-900 truncate">
                              {client.name}
                            </p>
                            <p className="text-xs text-navy-900/60">
                              {INDUSTRY_LABELS[client.industry]} ・ スコア{" "}
                              {m.matchScore}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <MatchStatusBadge status={m.status} />
                            {m.status === "super_liked" && (
                              <Badge variant="red">★ 最有力</Badge>
                            )}
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-navy-900">
                直近の商談予定
              </h2>
              <Link
                href="/supplier/meetings"
                className="text-xs text-supplier hover:underline"
              >
                すべて見る →
              </Link>
            </div>
            {upcomingMeetings.length === 0 ? (
              <p className="text-sm text-navy-900/50 py-6 text-center">
                確定済みの商談はありません。
              </p>
            ) : (
              <ul className="divide-y divide-navy/10">
                {upcomingMeetings.map(({ match, meeting, client }) => (
                  <li
                    key={match.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-navy-900 truncate">
                        {client.name}
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
      </div>
    </div>
  );
}
