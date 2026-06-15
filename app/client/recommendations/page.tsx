"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuestionnaireStore } from "@/lib/store/questionnaire-store";
import { DUMMY_SUPPLIERS } from "@/lib/dummy-data/suppliers";
import { DUMMY_CLIENTS } from "@/lib/dummy-data/clients";
import { useSupplierStatusStore } from "@/lib/store/supplier-status-store";
import {
  rankSuppliers,
  buildMatchReasons,
  type ScoredSupplier,
} from "@/lib/matching/score-calculator";
import {
  INDUSTRY_LABELS,
  EMPLOYEE_SCALE_LABELS,
  CHALLENGE_LABELS,
  type ChallengeCategory,
} from "@/types";
import { useScoringStore } from "@/lib/store/scoring-store";
import { useLikeStore } from "@/lib/store/like-store";
import { MOCK_CLIENT } from "@/lib/auth/mock-user";
import { cn } from "@/lib/utils";

export default function RecommendationsPage() {
  const router = useRouter();
  const { answers } = useQuestionnaireStore();
  const scoring = useScoringStore();
  const likeStore = useLikeStore();
  const statusOverrides = useSupplierStatusStore((s) => s.overrides);
  const [hydrated, setHydrated] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // アンケート未入力時はデフォルトクライアント(c001)の課題で表示
  const fallback = DUMMY_CLIENTS[0];

  const ranked: ScoredSupplier[] = useMemo(() => {
    if (!hydrated) return [];
    const criteria = {
      industry: (answers.industry ?? fallback.industry)!,
      employeeScale: (answers.employeeScale ?? fallback.employeeScale)!,
      prefecture: (answers.prefecture ?? fallback.prefecture)!,
      challenges: ((answers.challenges as ChallengeCategory[]) ??
        fallback.challenges ??
        []) as ChallengeCategory[],
      budget: (answers.budget ?? fallback.budget)!,
    };
    const active = DUMMY_SUPPLIERS.filter((s) => {
      const override = statusOverrides[s.id];
      const isActive = override ?? s.isActive ?? true;
      return isActive;
    });
    return rankSuppliers(criteria, active, {
      threshold: scoring.recommendThreshold,
      limit: 10, // Top10表示(③要件)
      weights: { tag: scoring.tagWeight, success: scoring.successWeight },
    });
  }, [hydrated, answers, scoring, fallback, statusOverrides]);

  // LIKE状態(永続化 store から取得)
  const clientLikes = hydrated ? likeStore.getForClient(MOCK_CLIENT.id) : [];
  const likeMap: Record<string, "liked" | "super_liked"> = {};
  clientLikes.forEach((r) => {
    likeMap[r.supplierId] = r.action;
  });
  const selectedCount = clientLikes.length;

  if (!hydrated) {
    return (
      <div className="text-center text-navy-900/50 py-20">読み込み中…</div>
    );
  }

  const criteria = {
    industry: (answers.industry ?? fallback.industry)!,
    employeeScale: (answers.employeeScale ?? fallback.employeeScale)!,
    prefecture: (answers.prefecture ?? fallback.prefecture)!,
    challenges: ((answers.challenges as ChallengeCategory[]) ??
      fallback.challenges ??
      []) as ChallengeCategory[],
    budget: (answers.budget ?? fallback.budget)!,
  };

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      router.push("/client/dashboard?matched=true");
    }, 1200);
  };

  const toggle = (
    supplierId: string,
    action: "liked" | "super_liked",
  ) => {
    const current = likeMap[supplierId];
    likeStore.setLike(
      MOCK_CLIENT.id,
      supplierId,
      current === action ? null : action,
    );
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-aqua-700">
            AIマッチング結果
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-navy-900">
            あなたの課題に合う支援先 上位{ranked.length}社
          </h1>
          <p className="mt-1 text-sm text-navy-900/60">
            5軸スコアリング(業種・規模・課題・地域・予算)+ 過去実績で算出
          </p>
        </div>
      </div>

      {ranked.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-center text-navy-900/60 py-8">
              スコア閾値を満たす支援先が見つかりませんでした。
              <br />
              管理者にスコアリング設定の調整をご依頼ください。
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {ranked.map((scored, idx) => (
            <SupplierCard
              key={scored.supplier.id}
              rank={idx + 1}
              scored={scored}
              reasons={buildMatchReasons(criteria, scored.supplier, scored.breakdown)}
              action={likeMap[scored.supplier.id] ?? null}
              onAction={(a) => toggle(scored.supplier.id, a)}
            />
          ))}
        </div>
      )}

      {/* 画面下部固定の確定バー */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-navy/10 bg-white shadow-card-hover">
        <div className="container-page flex items-center justify-between py-4">
          <div>
            <p className="text-sm text-navy-900/60">選択状況</p>
            <p className="text-lg font-bold text-navy-900">
              <span
                className={cn(
                  "num-emphasis",
                  selectedCount >= 3 ? "text-success" : "text-aqua-700",
                )}
              >
                {selectedCount}
              </span>{" "}
              <span className="text-navy-900/50">/ 3件選ぶとマッチング確定</span>
            </p>
          </div>
          <Button
            variant="success"
            size="lg"
            disabled={selectedCount < 3 || confirming}
            onClick={handleConfirm}
          >
            {confirming ? "確定中…" : "マッチング確定"}
          </Button>
        </div>
      </div>

      <div className="h-24" />
    </div>
  );
}

function SupplierCard({
  rank,
  scored,
  reasons,
  action,
  onAction,
}: {
  rank: number;
  scored: ScoredSupplier;
  reasons: string[];
  action: "liked" | "super_liked" | null;
  onAction: (action: "liked" | "super_liked") => void;
}) {
  const { supplier, matchScore, breakdown } = scored;
  const high = supplier.meetingPriority === "high";
  const veteran = (supplier.successCount ?? 0) >= 10;

  return (
    <Card
      className={cn(
        "flex flex-col h-full transition border",
        action === "super_liked" && "ring-2 ring-ink ring-offset-1",
        action === "liked" && "ring-2 ring-mist-400 ring-offset-1",
      )}
    >
      <CardContent className="flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex items-start gap-2">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-white text-xs font-bold">
              {rank}
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-navy-900 leading-tight">
                {supplier.name}
              </h3>
              <p className="mt-0.5 text-xs text-navy-900/60">
                {INDUSTRY_LABELS[supplier.industry]} ・{" "}
                {EMPLOYEE_SCALE_LABELS[supplier.employeeScale]} ・{" "}
                {supplier.prefecture}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-navy-900/50">マッチスコア</div>
            <div className="num-emphasis text-2xl font-bold text-navy-900">
              {matchScore}
            </div>
          </div>
        </div>

        <Progress
          value={matchScore}
          indicatorClassName={cn(
            matchScore >= 85
              ? "bg-success"
              : matchScore >= 70
                ? "bg-aqua"
                : "bg-navy-200",
          )}
        />

        <div className="mt-4 flex flex-wrap gap-1.5">
          <TagDot label="業種" matched={breakdown.industry} />
          <TagDot label="規模" matched={breakdown.scale} />
          <TagDot label="課題" matched={breakdown.category} />
          <TagDot label="地域" matched={breakdown.area} />
          <TagDot label="予算" matched={breakdown.budget} />
        </div>

        {supplier.strengthLine && (
          <p className="mt-4 rounded-lg bg-aqua-50 border border-aqua-100 px-3 py-2 text-xs text-navy-900/80">
            <span className="font-semibold text-aqua-700">強み:</span>{" "}
            {supplier.strengthLine}
          </p>
        )}

        {/* マッチ理由 — デモのキーポイント */}
        {reasons.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-navy-900/70 mb-1">
              なぜこの会社か(AI判定)
            </p>
            <ul className="space-y-1">
              {reasons.map((r) => (
                <li
                  key={r}
                  className="flex items-start gap-2 text-xs text-navy-900/80"
                >
                  <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-ink" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {supplier.serviceCategories?.map((c) => (
            <Badge key={c} variant="default">
              {CHALLENGE_LABELS[c]}
            </Badge>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {veteran && (
            <Badge variant="navy">
              実績豊富 (成約{supplier.successCount}件)
            </Badge>
          )}
          {high && <Badge variant="success">積極対応</Badge>}
        </div>

        {/* サービス資料・URL(⑦要件) */}
        {(supplier.serviceMaterialUrl || supplier.websiteUrl) && (
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            {supplier.serviceMaterialUrl && (
              <a
                href={supplier.serviceMaterialUrl}
                onClick={(e) => e.preventDefault()}
                className="text-ink hover:underline underline-offset-2"
              >
                サービス資料
              </a>
            )}
            {supplier.websiteUrl && (
              <a
                href={supplier.websiteUrl}
                onClick={(e) => e.preventDefault()}
                className="text-ink hover:underline underline-offset-2"
              >
                公式サイト
              </a>
            )}
          </div>
        )}

        <div className="mt-auto pt-5 grid grid-cols-2 gap-2">
          <Button
            variant={action === "liked" ? "like" : "likeIdle"}
            onClick={() => onAction("liked")}
          >
            気になる
          </Button>
          <Button
            variant={action === "super_liked" ? "superLike" : "superLikeIdle"}
            onClick={() => onAction("super_liked")}
          >
            ぜひ話したい
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TagDot({ label, matched }: { label: string; matched: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border",
        matched
          ? "bg-ink text-paper border-ink"
          : "bg-paper text-mist-400 border-mist-200",
      )}
    >
      <span>{label}</span>
      <span className="opacity-70">{matched ? "適合" : "—"}</span>
    </span>
  );
}
