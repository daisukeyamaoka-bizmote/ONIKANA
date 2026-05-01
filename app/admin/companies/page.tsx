"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DUMMY_SUPPLIERS } from "@/lib/dummy-data/suppliers";
import { DUMMY_CLIENTS } from "@/lib/dummy-data/clients";
import {
  INDUSTRY_LABELS,
  EMPLOYEE_SCALE_LABELS,
  CHALLENGE_LABELS,
} from "@/types";
import { cn } from "@/lib/utils";

type Tab = "client" | "supplier";

export default function AdminCompaniesPage() {
  const [tab, setTab] = useState<Tab>("supplier");
  const [query, setQuery] = useState("");

  const list = tab === "supplier" ? DUMMY_SUPPLIERS : DUMMY_CLIENTS;
  const filtered = list.filter(
    (c) =>
      c.name.includes(query) ||
      INDUSTRY_LABELS[c.industry].includes(query) ||
      c.prefecture.includes(query),
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">企業一覧</h1>
      <p className="mt-1 text-sm text-navy-900/60">
        登録されているクライアント・支援先企業を一覧表示。
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-navy/10 bg-white p-1 shadow-card">
          {(["supplier", "client"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm transition",
                tab === t
                  ? "bg-navy text-white"
                  : "text-navy-900 hover:bg-navy-50",
              )}
            >
              {t === "supplier"
                ? `支援先 (${DUMMY_SUPPLIERS.length})`
                : `クライアント (${DUMMY_CLIENTS.length})`}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-[200px] max-w-sm">
          <Input
            placeholder="会社名・業種・地域で検索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-left text-xs text-navy-900/70">
            <tr>
              <th className="px-4 py-3 font-medium">会社名</th>
              <th className="px-4 py-3 font-medium">業種</th>
              <th className="px-4 py-3 font-medium">規模</th>
              <th className="px-4 py-3 font-medium">所在地</th>
              <th className="px-4 py-3 font-medium">タグ</th>
              {tab === "supplier" && (
                <th className="px-4 py-3 font-medium">実績</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/10">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-navy-50/40">
                <td className="px-4 py-3 font-medium text-navy-900">
                  {c.name}
                </td>
                <td className="px-4 py-3 text-navy-900/80">
                  {INDUSTRY_LABELS[c.industry]}
                </td>
                <td className="px-4 py-3 text-navy-900/80">
                  {EMPLOYEE_SCALE_LABELS[c.employeeScale]}
                </td>
                <td className="px-4 py-3 text-navy-900/80">{c.prefecture}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(tab === "supplier"
                      ? c.serviceCategories
                      : c.challenges
                    )?.map((cat) => (
                      <Badge key={cat} variant="outline">
                        {CHALLENGE_LABELS[cat]}
                      </Badge>
                    ))}
                  </div>
                </td>
                {tab === "supplier" && (
                  <td className="px-4 py-3 text-navy-900/80 text-xs">
                    成約 {c.successCount ?? 0} / 打診 {c.totalOffers ?? 0}{" "}
                    <span className="text-navy-900/50">
                      ({Math.round(((c.responseRate ?? 0) * 100))}%)
                    </span>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={tab === "supplier" ? 6 : 5}
                  className="px-4 py-12 text-center text-navy-900/50"
                >
                  該当する企業がありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
