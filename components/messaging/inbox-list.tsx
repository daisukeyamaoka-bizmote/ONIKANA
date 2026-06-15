"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMessageStore } from "@/lib/store/message-store";
import {
  findMatchesByClientId,
  findMatchesBySupplierId,
} from "@/lib/dummy-data/matches";
import { findClientById } from "@/lib/dummy-data/clients";
import { findSupplierById } from "@/lib/dummy-data/suppliers";
import { MOCK_CLIENT, MOCK_SUPPLIER } from "@/lib/auth/mock-user";

interface Props {
  perspective: "client" | "supplier";
  threadHrefPrefix: string;
}

function fmt(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const same =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (same) {
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function InboxList({ perspective, threadHrefPrefix }: Props) {
  const messages = useMessageStore((s) => s.messages);

  // 自分関連のマッチを取得し、メッセージのあるものだけ + 最後の活動でソート
  const matches =
    perspective === "client"
      ? findMatchesByClientId(MOCK_CLIENT.id)
      : findMatchesBySupplierId(MOCK_SUPPLIER.id);

  const rows = matches
    .map((match) => {
      const thread = messages
        .filter((m) => m.matchId === match.id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      if (thread.length === 0) return null;
      const last = thread[0];
      const unread = thread.some((m) =>
        perspective === "client"
          ? m.senderType !== "client" && !m.readByClient
          : m.senderType !== "supplier" && !m.readBySupplier,
      );
      const counterparty =
        perspective === "client"
          ? findSupplierById(match.supplierId)
          : findClientById(match.clientId);
      if (!counterparty) return null;
      return { match, last, unread, counterparty };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .sort(
      (a, b) =>
        new Date(b.last.createdAt).getTime() -
        new Date(a.last.createdAt).getTime(),
    );

  if (rows.length === 0) {
    return (
      <Card>
        <CardContent>
          <p className="py-10 text-center text-sm text-mist-500">
            メッセージスレッドはまだありません。
            <br />
            打診が承諾されると、ここにスレッドが作成されます。
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {rows.map(({ match, last, unread, counterparty }) => (
        <li key={match.id}>
          <Link href={`${threadHrefPrefix}/${match.id}`}>
            <Card className="transition hover:shadow-card-hover">
              <CardContent className="!py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-ink">
                        {counterparty.name}
                      </h3>
                      {unread && (
                        <span className="inline-block h-2 w-2 rounded-full bg-oni-red" />
                      )}
                    </div>
                    <p className="mt-1 truncate text-xs text-mist-600">
                      {previewOf(last)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs text-mist-500">
                      {fmt(last.createdAt)}
                    </span>
                    {last.type === "schedule_proposal" && (
                      <Badge variant="warn">日程提案</Badge>
                    )}
                    {last.type === "schedule_confirmed" && (
                      <Badge variant="navy">確定済</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function previewOf(m: {
  type: string;
  body?: string;
  senderName?: string;
}): string {
  if (m.type === "schedule_proposal") return "日程提案が届いています";
  if (m.type === "schedule_confirmed") return "日程が確定しました";
  if (m.type === "system") return m.body ?? "";
  return `${m.senderName ?? ""}: ${m.body ?? ""}`;
}
