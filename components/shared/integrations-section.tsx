"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotificationStore } from "@/lib/store/notification-store";

interface Props {
  perspective: "client" | "supplier";
}

const MOCK_EMAIL_BY_ROLE = {
  client: "yamada@sunlight-seiki.example.jp",
  supplier: "sato@peoplebridge.example.jp",
};

export function IntegrationsSection({ perspective }: Props) {
  const integrations = useNotificationStore((s) =>
    perspective === "client" ? s.clientIntegrations : s.supplierIntegrations,
  );
  const connectGoogle = useNotificationStore((s) => s.connectGoogle);
  const disconnectGoogle = useNotificationStore((s) => s.disconnectGoogle);
  const [hydrated, setHydrated] = useState(false);
  const [connecting, setConnecting] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) return null;

  const handleConnect = () => {
    setConnecting(true);
    // 本番: NextAuth Google OAuth → tokenを保管
    // デモ: 数秒待ってから「連携済み」に切り替え
    setTimeout(() => {
      connectGoogle(perspective, MOCK_EMAIL_BY_ROLE[perspective]);
      setConnecting(false);
    }, 1200);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">外部サービス連携</h1>
        <p className="mt-1 text-sm text-mist-600">
          確定した商談を自分のカレンダーに自動登録するための連携設定です。
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-fuku-sand-100 text-base font-semibold text-ink">
                G
              </div>
              <div>
                <h3 className="font-semibold text-ink">Googleカレンダー</h3>
                <p className="mt-1 text-sm text-mist-600">
                  日程確定時に、自分のGoogleカレンダーへ自動でイベントを追加します。
                  商談前のリマインドもここから配信されます。
                </p>
                {integrations.googleCalendarConnected ? (
                  <div className="mt-3 space-y-1 text-xs text-mist-700">
                    <p>
                      <span className="text-mist-500">連携アカウント: </span>
                      <span className="font-medium text-ink">
                        {integrations.googleCalendarEmail}
                      </span>
                    </p>
                    <p>
                      <span className="text-mist-500">使用するカレンダー: </span>
                      <span className="font-medium text-ink">プライマリ</span>
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-mist-500">
                    未連携の状態でもメッセージ・日程確定は動作しますが、カレンダーへの自動登録は行われません。
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {integrations.googleCalendarConnected ? (
                <>
                  <Badge variant="success">連携中</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => disconnectGoogle(perspective)}
                  >
                    連携を解除
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  disabled={connecting}
                  onClick={handleConnect}
                >
                  {connecting ? "連携中…" : "Googleで連携する"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mist-100 text-base font-semibold text-mist-500">
                O
              </div>
              <div>
                <h3 className="font-semibold text-mist-700">
                  Outlookカレンダー
                </h3>
                <p className="mt-1 text-sm text-mist-500">
                  Phase 3 で対応予定です。
                </p>
              </div>
            </div>
            <Badge variant="muted">準備中</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
