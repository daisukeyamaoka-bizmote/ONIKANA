"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchStatusBadge } from "@/components/shared/match-status-badge";
import { findMatchesBySupplierId } from "@/lib/dummy-data/matches";
import { findClientById } from "@/lib/dummy-data/clients";
import { MOCK_SUPPLIER } from "@/lib/auth/mock-user";
import { useMatchStore } from "@/lib/store/match-store";
import {
  INDUSTRY_LABELS,
  EMPLOYEE_SCALE_LABELS,
  CHALLENGE_LABELS,
} from "@/types";
import { cn, formatDate } from "@/lib/utils";

type Filter = "pending" | "accepted" | "rejected" | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "pending", label: "未対応" },
  { id: "accepted", label: "承諾済み" },
  { id: "rejected", label: "辞退済み" },
  { id: "all", label: "すべて" },
];

export default function SupplierOffersPage() {
  const [filter, setFilter] = useState<Filter>("pending");
  const overrides = useMatchStore((s) => s.overrides);

  const all = findMatchesBySupplierId(MOCK_SUPPLIER.id).map((m) => ({
    ...m,
    status: overrides[m.id]?.status ?? m.status,
  }));

  const filtered = all.filter((m) => {
    if (filter === "pending")
      return (
        m.status === "recommended" ||
        m.status === "liked" ||
        m.status === "super_liked" ||
        m.status === "auto_offered"
      );
    if (filter === "accepted")
      return m.status === "accepted" || m.status === "matched";
    if (filter === "rejected") return m.status === "rejected";
    return true;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">打診一覧</h1>
      <p className="mt-1 text-sm text-navy-900/60">
        クライアントから受信した打診を表示しています。
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition",
              filter === f.id
                ? "border-supplier bg-supplier text-white"
                : "border-navy/15 bg-white text-navy-900 hover:bg-navy-50",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((m) => {
          const c = findClientById(m.clientId);
          if (!c) return null;
          return (
            <Link key={m.id} href={`/supplier/offers/${m.id}`}>
              <Card className="h-full transition hover:shadow-card-hover">
                <CardContent>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-navy-900">{c.name}</h3>
                      <p className="text-xs text-navy-900/60 mt-0.5">
                        {INDUSTRY_LABELS[c.industry]} ・{" "}
                        {EMPLOYEE_SCALE_LABELS[c.employeeScale]} ・{" "}
                        {c.prefecture}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <MatchStatusBadge status={m.status} />
                      <Badge
                        variant={
                          m.matchType === "auto_offer" ? "warn" : "outline"
                        }
                      >
                        {m.matchType === "auto_offer"
                          ? "自動打診"
                          : "AIレコメンド"}
                      </Badge>
                      {m.status === "super_liked" && (
                        <Badge variant="red">★ 最有力</Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.challenges?.map((ch) => (
                      <Badge key={ch} variant="default">
                        {CHALLENGE_LABELS[ch]}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-navy-900/60">
                    <span>
                      マッチスコア{" "}
                      <span className="num-emphasis text-base font-bold text-navy-900">
                        {m.matchScore}
                      </span>
                    </span>
                    <span>打診: {formatDate(m.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-navy-900/50 py-12">
            該当する打診はありません。
          </p>
        )}
      </div>
    </div>
  );
}
