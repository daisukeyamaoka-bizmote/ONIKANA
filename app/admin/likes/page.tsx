"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLikeStore } from "@/lib/store/like-store";
import { findClientById } from "@/lib/dummy-data/clients";
import { findSupplierById } from "@/lib/dummy-data/suppliers";
import { formatDateTime } from "@/lib/utils";
import { INDUSTRY_LABELS } from "@/types";

// ③ クライアントがどの支援先にLIKEを送ったかを管理者が可視化するページ
export default function AdminLikesPage() {
  const records = useLikeStore((s) => s.records);
  const reset = useLikeStore((s) => s.reset);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) return null;

  // クライアント別にグルーピング
  const grouped = records.reduce<Record<string, typeof records>>((acc, r) => {
    if (!acc[r.clientId]) acc[r.clientId] = [];
    acc[r.clientId].push(r);
    return acc;
  }, {});

  const sorted = [...records].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">
            LIKE / ぜひ話したい 一覧
          </h1>
          <p className="mt-1 text-sm text-navy-900/60">
            クライアントが意思表示した支援先をリアルタイムで把握できます。
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            if (confirm("LIKEデータをリセットしますか?")) reset();
          }}
        >
          リセット
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-navy-900 mb-4">
              直近のアクション
            </h2>
            {sorted.length === 0 ? (
              <p className="py-8 text-center text-sm text-navy-900/50">
                まだLIKEはありません。
                <br />
                クライアント画面でレコメンドカードの操作をお試しください。
              </p>
            ) : (
              <ul className="divide-y divide-navy/10">
                {sorted.slice(0, 15).map((r, i) => {
                  const c = findClientById(r.clientId);
                  const s = findSupplierById(r.supplierId);
                  return (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-navy-900 truncate">
                          <span className="font-semibold">
                            {c?.name ?? r.clientId}
                          </span>
                          <span className="text-navy-900/50 mx-1">→</span>
                          <span>{s?.name ?? r.supplierId}</span>
                        </p>
                        <p className="text-xs text-navy-900/50 mt-0.5">
                          {formatDateTime(r.at)}
                        </p>
                      </div>
                      <Badge
                        variant={r.action === "super_liked" ? "red" : "pink"}
                      >
                        {r.action === "super_liked"
                          ? "★ぜひ話したい"
                          : "♡気になる"}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-navy-900 mb-4">
              クライアント別サマリー
            </h2>
            {Object.keys(grouped).length === 0 ? (
              <p className="py-8 text-center text-sm text-navy-900/50">
                データなし
              </p>
            ) : (
              <ul className="space-y-4">
                {Object.entries(grouped).map(([clientId, rs]) => {
                  const c = findClientById(clientId);
                  return (
                    <li
                      key={clientId}
                      className="rounded-lg border border-navy/10 p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-navy-900 text-sm">
                          {c?.name ?? clientId}
                        </p>
                        <Badge variant="navy">{rs.length}件</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {rs.map((r, idx) => {
                          const s = findSupplierById(r.supplierId);
                          return (
                            <Badge
                              key={idx}
                              variant={
                                r.action === "super_liked" ? "red" : "pink"
                              }
                            >
                              {s?.name ?? r.supplierId}
                              {r.action === "super_liked" ? " ★" : " ♡"}
                            </Badge>
                          );
                        })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 text-xs text-navy-900/50">
        LIKEデータはブラウザに保存されています(localStorage)。
        本番ではDBに永続化し、ここに表示されたタイミングで支援先に自動打診を発射する設計です。
      </div>

      <div className="mt-4">
        <Link
          href="/admin/dashboard"
          className="text-sm text-aqua-700 hover:underline"
        >
          ← KPIダッシュボードへ戻る
        </Link>
      </div>
    </div>
  );
}
