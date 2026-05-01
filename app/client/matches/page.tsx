"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchStatusBadge } from "@/components/shared/match-status-badge";
import { findMatchesByClientId } from "@/lib/dummy-data/matches";
import { findSupplierById } from "@/lib/dummy-data/suppliers";
import { MOCK_CLIENT } from "@/lib/auth/mock-user";
import {
  INDUSTRY_LABELS,
  EMPLOYEE_SCALE_LABELS,
  type MatchStatus,
} from "@/types";
import { cn, formatDateTime } from "@/lib/utils";

const FILTERS: { id: "all" | MatchStatus; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "matched", label: "商談確定" },
  { id: "accepted", label: "承諾済み" },
  { id: "completed", label: "完了" },
  { id: "rejected", label: "辞退" },
];

export default function ClientMatchesPage() {
  const [filter, setFilter] = useState<"all" | MatchStatus>("all");
  const all = findMatchesByClientId(MOCK_CLIENT.id);
  const filtered =
    filter === "all" ? all : all.filter((m) => m.status === filter);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">マッチング一覧</h1>
      <p className="mt-1 text-sm text-navy-900/60">
        貴社のマッチング案件をすべて表示しています。
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition",
              filter === f.id
                ? "border-aqua bg-aqua text-white"
                : "border-navy/15 bg-white text-navy-900 hover:bg-navy-50",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((m) => {
          const s = findSupplierById(m.supplierId);
          if (!s) return null;
          return (
            <Card key={m.id}>
              <CardContent>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy-900">{s.name}</h3>
                    <p className="text-xs text-navy-900/60 mt-0.5">
                      {INDUSTRY_LABELS[s.industry]} ・{" "}
                      {EMPLOYEE_SCALE_LABELS[s.employeeScale]} ・{" "}
                      {s.prefecture}
                    </p>
                  </div>
                  <MatchStatusBadge status={m.status} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-navy-900/60">
                  <span>
                    スコア{" "}
                    <span className="num-emphasis text-base font-bold text-navy-900">
                      {m.matchScore}
                    </span>
                  </span>
                  <Badge variant="muted">
                    {m.matchType === "ai_recommend" ? "AIレコメンド" : "自動打診"}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-navy-900/50">
                  更新: {formatDateTime(m.updatedAt)}
                </p>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-navy-900/50 py-12">
            該当するマッチングはありません。
          </p>
        )}
      </div>
    </div>
  );
}
