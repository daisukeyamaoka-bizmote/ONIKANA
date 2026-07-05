"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { findMatchById } from "@/lib/dummy-data/matches";
import { findClientById } from "@/lib/dummy-data/clients";
import { findSupplierById } from "@/lib/dummy-data/suppliers";
import { useMatchStore } from "@/lib/store/match-store";
import { useMessageStore } from "@/lib/store/message-store";
import {
  INDUSTRY_LABELS,
  EMPLOYEE_SCALE_LABELS,
  CHALLENGE_LABELS,
  BUDGET_LABELS,
  URGENCY_LABELS,
  ROLE_LABELS,
} from "@/types";
import { cn, formatYen } from "@/lib/utils";

const REJECTION_REASONS = [
  "対応領域が違う",
  "予算が合わない",
  "タイミングが合わない",
  "リソースが足りない",
  "その他",
];

export default function OfferDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const setStatus = useMatchStore((s) => s.setStatus);
  const setProposedDates = useMatchStore((s) => s.setProposedDates);
  const overrides = useMatchStore((s) => s.overrides);
  // 承諾・日程提案をメッセージスレッドにも連動させる
  const sendSystemViaStore = useMessageStore((s) => s.sendText);
  const proposeScheduleMsg = useMessageStore((s) => s.proposeSchedule);

  const match = findMatchById(params.id);
  const override = overrides[params.id] ?? {};
  const status = override.status ?? match?.status;

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [proposedDates, setProposedDatesLocal] = useState<string[]>(["", "", ""]);

  if (!match) {
    return <p className="text-navy-900/60">打診が見つかりません。</p>;
  }

  const client = findClientById(match.clientId);
  const supplier = findSupplierById(match.supplierId);
  if (!client || !supplier) return null;

  const supplierSenderName = `${supplier.name} 担当`;

  const handleAccept = () => {
    setStatus(match.id, "accepted");
    // 承諾と同時にメッセージスレッドを開通させる
    sendSystemViaStore({
      matchId: match.id,
      senderType: "supplier",
      senderName: supplierSenderName,
      body: "打診を承諾しました。日程のご相談に進みましょう。",
    });
    setShowProposeModal(true);
  };

  const handleReject = (reason: string) => {
    setStatus(match.id, "rejected");
    setShowRejectModal(false);
    router.push("/supplier/offers");
  };

  const handlePropose = () => {
    const filled = proposedDates.filter(Boolean);
    if (filled.length === 0) return;
    setProposedDates(match.id, filled);
    // メッセージスレッドにも日程提案カードとして反映
    proposeScheduleMsg({
      matchId: match.id,
      senderName: supplierSenderName,
      slots: filled.map((local) => {
        const start = new Date(local);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        return {
          start: start.toISOString(),
          end: end.toISOString(),
          location: "オンライン",
        };
      }),
    });
    setShowProposeModal(false);
    router.push(`/supplier/messages/${match.id}`);
  };

  const breakdown = match.tagBreakdown ?? {
    industry: false,
    scale: false,
    category: false,
    area: false,
    budget: false,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="text-sm text-navy-900/60 hover:text-navy-900 mb-4"
      >
        ← 戻る
      </button>

      <Card>
        <CardContent>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-navy-900">
                {client.name}
              </h1>
              <p className="text-sm text-navy-900/60 mt-1">
                {INDUSTRY_LABELS[client.industry]} ・ 従業員{" "}
                {client.employeeCount}名 ({EMPLOYEE_SCALE_LABELS[client.employeeScale]}) ・{" "}
                {client.prefecture}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-navy-900/50">マッチスコア</p>
              <p className="num-emphasis text-3xl font-bold text-navy-900">
                {match.matchScore}
              </p>
            </div>
          </div>

          <Progress value={match.matchScore} />

          <div className="mt-6 grid grid-cols-2 gap-4">
            <ScoreDetail label="タグ一致" value={match.tagMatchScore} />
            <ScoreDetail label="実績スコア" value={match.successRateScore} />
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-navy-900 mb-3">
              5軸タグの一致
            </h3>
            <div className="grid grid-cols-5 gap-2">
              <TagItem label="業種" matched={breakdown.industry} />
              <TagItem label="規模" matched={breakdown.scale} />
              <TagItem label="課題" matched={breakdown.category} />
              <TagItem label="地域" matched={breakdown.area} />
              <TagItem label="予算" matched={breakdown.budget} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <InfoRow label="課題">
              <div className="flex flex-wrap gap-1">
                {client.challenges?.map((c) => (
                  <Badge key={c}>{CHALLENGE_LABELS[c]}</Badge>
                ))}
              </div>
            </InfoRow>
            <InfoRow label="予算">
              {client.budget ? BUDGET_LABELS[client.budget] : "—"}
            </InfoRow>
            <InfoRow label="緊急度">
              {client.urgency ? URGENCY_LABELS[client.urgency] : "—"}
            </InfoRow>
            <InfoRow label="商談相手の役職">
              <span>
                {ROLE_LABELS[match.targetRole]}
                <Badge variant="aqua" className="ml-2">
                  {formatYen(match.meetingPrice ?? 0)}
                </Badge>
              </span>
            </InfoRow>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-navy-900 mb-2">
              会社の状況
            </h3>
            <p className="text-sm text-navy-900/80 leading-relaxed bg-mist-50 rounded-lg p-4">
              {client.description}
            </p>
          </div>

          {/* アポ単価の明示(支援先課金モデル) */}
          <div className="mt-8 rounded-xl border-2 border-ink p-5">
            <p className="text-xs uppercase tracking-widest text-mist-500">
              この案件のアポ単価
            </p>
            <div className="mt-1 flex items-end justify-between gap-3">
              <div>
                <p className="num-emphasis text-4xl font-bold text-ink">
                  {formatYen(match.meetingPrice ?? 0)}
                </p>
                <p className="text-xs text-mist-600 mt-1">
                  商談相手: {ROLE_LABELS[match.targetRole]} ・ 商談1時間の実施時に発生
                </p>
              </div>
              <p className="text-xs text-mist-500 max-w-[160px] text-right">
                承諾後、日程確定+商談実施でオニカナへの請求が確定します
              </p>
            </div>
          </div>

          {status === "accepted" || status === "matched" ? (
            <div className="mt-6 rounded-xl bg-mist-100 border border-mist-300 p-4 text-center text-sm text-ink">
              承諾済みです。商談スケジュールから日程提案ができます。
            </div>
          ) : status === "rejected" ? (
            <div className="mt-6 rounded-xl bg-mist-100 border border-mist-200 p-4 text-center text-sm text-mist-500">
              辞退済みです。
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="primary" size="lg" onClick={handleAccept}>
                {formatYen(match.meetingPrice ?? 0)} で承諾する
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowRejectModal(true)}
              >
                辞退する
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 辞退理由モーダル */}
      {showRejectModal && (
        <Modal onClose={() => setShowRejectModal(false)}>
          <h3 className="text-lg font-semibold text-navy-900 mb-3">
            辞退理由を選択してください(任意)
          </h3>
          <div className="space-y-2">
            {REJECTION_REASONS.map((r) => (
              <button
                key={r}
                onClick={() => handleReject(r)}
                className="w-full rounded-lg border border-navy/15 px-4 py-3 text-left text-sm hover:bg-navy-50"
              >
                {r}
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            className="w-full mt-3"
            onClick={() => setShowRejectModal(false)}
          >
            キャンセル
          </Button>
        </Modal>
      )}

      {/* 商談日時提案モーダル */}
      {showProposeModal && (
        <Modal onClose={() => setShowProposeModal(false)}>
          <h3 className="text-lg font-semibold text-navy-900 mb-2">
            商談希望日時を3つ提案
          </h3>
          <p className="text-xs text-navy-900/60 mb-4">
            クライアントが1つ選んで確定します。
          </p>
          <div className="space-y-3">
            {proposedDates.map((d, i) => (
              <input
                key={i}
                type="datetime-local"
                value={d}
                onChange={(e) => {
                  const arr = [...proposedDates];
                  arr[i] = e.target.value;
                  setProposedDatesLocal(arr);
                }}
                className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              />
            ))}
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowProposeModal(false)}
            >
              後で提案
            </Button>
            <Button variant="primary" onClick={handlePropose}>
              提案を送信
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ScoreDetail({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-navy-50 p-3">
      <p className="text-xs text-navy-900/60">{label}</p>
      <p className="num-emphasis mt-0.5 text-xl font-bold text-navy-900">
        {value}
        <span className="text-xs text-navy-900/50 font-normal"> /100</span>
      </p>
    </div>
  );
}

function TagItem({ label, matched }: { label: string; matched: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border px-2 py-3 text-center",
        matched
          ? "border-ink bg-ink text-paper"
          : "border-mist-200 bg-paper text-mist-400",
      )}
    >
      <p className="text-xs">{label}</p>
      <p className="text-xs font-semibold mt-1">{matched ? "適合" : "—"}</p>
    </div>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-navy-900/60 mb-1">{label}</p>
      <div className="text-sm text-navy-900">{children}</div>
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
