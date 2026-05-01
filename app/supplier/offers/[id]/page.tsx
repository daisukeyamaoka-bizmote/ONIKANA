"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { findMatchById } from "@/lib/dummy-data/matches";
import { findClientById } from "@/lib/dummy-data/clients";
import { useMatchStore } from "@/lib/store/match-store";
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
  if (!client) return null;

  const handleAccept = () => {
    setStatus(match.id, "accepted");
    setShowProposeModal(true);
  };

  const handleReject = (reason: string) => {
    console.log("辞退理由:", reason);
    setStatus(match.id, "rejected");
    setShowRejectModal(false);
    router.push("/supplier/offers");
  };

  const handlePropose = () => {
    const filled = proposedDates.filter(Boolean);
    if (filled.length === 0) return;
    setProposedDates(match.id, filled);
    setShowProposeModal(false);
    router.push("/supplier/meetings");
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
            <p className="text-sm text-navy-900/80 leading-relaxed bg-navy-50 rounded-lg p-4">
              {client.description}
            </p>
          </div>

          {status === "accepted" || status === "matched" ? (
            <div className="mt-8 rounded-xl bg-success/10 border border-success/30 p-4 text-center text-sm text-success">
              ✓ 承諾済みです。商談スケジュールから日程提案ができます。
            </div>
          ) : status === "rejected" ? (
            <div className="mt-8 rounded-xl bg-gray-100 border border-gray-200 p-4 text-center text-sm text-gray-600">
              辞退済みです。
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="success" size="lg" onClick={handleAccept}>
                承諾する
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
          ? "border-success/30 bg-success/5 text-success"
          : "border-gray-200 bg-gray-50 text-gray-400",
      )}
    >
      <p className="text-xs">{label}</p>
      <p className="text-lg font-bold">{matched ? "◎" : "△"}</p>
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
