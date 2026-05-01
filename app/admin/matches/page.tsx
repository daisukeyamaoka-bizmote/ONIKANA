"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchStatusBadge } from "@/components/shared/match-status-badge";
import { DUMMY_MATCHES } from "@/lib/dummy-data/matches";
import { findClientById } from "@/lib/dummy-data/clients";
import { findSupplierById } from "@/lib/dummy-data/suppliers";
import { useMatchStore } from "@/lib/store/match-store";
import {
  type MatchStatus,
  ROLE_LABELS,
  MATCH_STATUS_LABELS,
} from "@/types";
import { cn, formatDateTime, formatYen } from "@/lib/utils";

const STATUS_FILTERS: { id: "all" | MatchStatus; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "matched", label: "商談確定" },
  { id: "completed", label: "完了" },
  { id: "accepted", label: "承諾" },
  { id: "rejected", label: "辞退" },
  { id: "auto_offered", label: "自動打診" },
];

export default function AdminMatchesPage() {
  const [filter, setFilter] = useState<"all" | MatchStatus>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const overrides = useMatchStore((s) => s.overrides);

  const matches = DUMMY_MATCHES.map((m) => ({
    ...m,
    status: overrides[m.id]?.status ?? m.status,
  }));
  const filtered =
    filter === "all" ? matches : matches.filter((m) => m.status === filter);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">マッチング案件一覧</h1>
      <p className="mt-1 text-sm text-navy-900/60">
        全マッチングの進捗と単価を一覧表示。
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition",
              filter === f.id
                ? "border-navy bg-navy text-white"
                : "border-navy/15 bg-white text-navy-900 hover:bg-navy-50",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card className="mt-6">
        <CardContent className="!p-0">
          <table className="w-full text-sm">
            <thead className="bg-navy-50 text-left text-xs text-navy-900/70">
              <tr>
                <th className="px-4 py-3 font-medium">クライアント</th>
                <th className="px-4 py-3 font-medium">支援先</th>
                <th className="px-4 py-3 font-medium">スコア</th>
                <th className="px-4 py-3 font-medium">役職 / 単価</th>
                <th className="px-4 py-3 font-medium">タイプ</th>
                <th className="px-4 py-3 font-medium">ステータス</th>
                <th className="px-4 py-3 font-medium">更新</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/10">
              {filtered.map((m) => {
                const c = findClientById(m.clientId);
                const s = findSupplierById(m.supplierId);
                if (!c || !s) return null;
                return (
                  <tr
                    key={m.id}
                    onClick={() => setSelected(m.id)}
                    className="hover:bg-navy-50/50 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium text-navy-900">
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-navy-900/80">{s.name}</td>
                    <td className="px-4 py-3 num-emphasis font-bold text-navy-900">
                      {m.matchScore}
                    </td>
                    <td className="px-4 py-3 text-navy-900/80">
                      {ROLE_LABELS[m.targetRole]}{" "}
                      <span className="text-xs text-navy-900/50">
                        ({formatYen(m.meetingPrice ?? 0)})
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          m.matchType === "auto_offer" ? "warn" : "outline"
                        }
                      >
                        {m.matchType === "auto_offer"
                          ? "自動"
                          : "AIレコメンド"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <MatchStatusBadge status={m.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-navy-900/60">
                      {formatDateTime(m.updatedAt)}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-navy-900/50"
                  >
                    該当する案件はありません。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {selected && (() => {
        const m = matches.find((x) => x.id === selected);
        if (!m) return null;
        const c = findClientById(m.clientId);
        const s = findSupplierById(m.supplierId);
        if (!c || !s) return null;
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
            onClick={() => setSelected(null)}
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-navy-900">
                  マッチング詳細
                </h3>
                <button
                  className="text-navy-900/60 hover:text-navy-900"
                  onClick={() => setSelected(null)}
                >
                  ✕
                </button>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <DT>マッチID</DT>
                <DD>{m.id}</DD>
                <DT>クライアント</DT>
                <DD>{c.name}</DD>
                <DT>支援先</DT>
                <DD>{s.name}</DD>
                <DT>スコア</DT>
                <DD className="num-emphasis">
                  総合 {m.matchScore} / タグ {m.tagMatchScore} / 実績{" "}
                  {m.successRateScore}
                </DD>
                <DT>商談単価</DT>
                <DD>
                  {formatYen(m.meetingPrice ?? 0)} ({ROLE_LABELS[m.targetRole]})
                </DD>
                <DT>タイプ</DT>
                <DD>
                  {m.matchType === "auto_offer"
                    ? "自動打診"
                    : "AIレコメンド"}
                </DD>
                <DT>ステータス</DT>
                <DD>{MATCH_STATUS_LABELS[m.status]}</DD>
                <DT>作成日時</DT>
                <DD>{formatDateTime(m.createdAt)}</DD>
                <DT>更新日時</DT>
                <DD>{formatDateTime(m.updatedAt)}</DD>
              </dl>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function DT({ children }: { children: React.ReactNode }) {
  return <dt className="text-navy-900/60">{children}</dt>;
}
function DD({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <dd className={`text-navy-900 font-medium ${className}`}>{children}</dd>
  );
}
