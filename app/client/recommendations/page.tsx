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
import {
  rankSuppliers,
  type ScoredSupplier,
} from "@/lib/matching/score-calculator";
import {
  INDUSTRY_LABELS,
  EMPLOYEE_SCALE_LABELS,
  CHALLENGE_LABELS,
  type ChallengeCategory,
} from "@/types";
import { useScoringStore } from "@/lib/store/scoring-store";
import { cn } from "@/lib/utils";

type Action = "liked" | "super_liked" | null;

export default function RecommendationsPage() {
  const router = useRouter();
  const { answers } = useQuestionnaireStore();
  const scoring = useScoringStore();
  const [hydrated, setHydrated] = useState(false);
  const [actions, setActions] = useState<Record<string, Action>>({});
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // ハイドレート前は表示しない
  // クライアントが直接 /client/recommendations を訪問してもデモが動くよう、
  // アンケート未入力時は「c001(サンライト精機)」をデフォルトに。
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
    return rankSuppliers(criteria, DUMMY_SUPPLIERS, {
      threshold: scoring.recommendThreshold,
      limit: 5,
      weights: { tag: scoring.tagWeight, success: scoring.successWeight },
    });
  }, [hydrated, answers, scoring, fallback]);

  const selectedCount = Object.values(actions).filter(Boolean).length;

  if (!hydrated) {
    return (
      <div className="text-center text-navy-900/50 py-20">読み込み中…</div>
    );
  }

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      router.push("/client/dashboard?matched=true");
    }, 1200);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-aqua-700">
            AIマッチング結果
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-navy-900">
            あなたの課題に合う支援先 {ranked.length}社
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
          {ranked.map((scored) => (
            <SupplierCard
              key={scored.supplier.id}
              scored={scored}
              action={actions[scored.supplier.id] ?? null}
              onAction={(action) =>
                setActions((prev) => ({
                  ...prev,
                  [scored.supplier.id]:
                    prev[scored.supplier.id] === action ? null : action,
                }))
              }
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
              <span className="text-navy-900/50">/ 3 件選ぶとマッチング確定</span>
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

      {/* 確定バー分の余白 */}
      <div className="h-24" />
    </div>
  );
}

function SupplierCard({
  scored,
  action,
  onAction,
}: {
  scored: ScoredSupplier;
  action: Action;
  onAction: (action: Action) => void;
}) {
  const { supplier, matchScore, breakdown } = scored;
  const high = supplier.meetingPriority === "high";
  const veteran = (supplier.successCount ?? 0) >= 10;

  return (
    <Card
      className={cn(
        "flex flex-col h-full transition",
        action === "super_liked" && "ring-2 ring-red-500",
        action === "liked" && "ring-2 ring-pink-400",
      )}
    >
      <CardContent className="flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
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

        <p className="mt-4 text-sm text-navy-900/80 leading-relaxed line-clamp-3">
          {supplier.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {supplier.serviceCategories?.map((c) => (
            <Badge key={c} variant="default">
              {CHALLENGE_LABELS[c]}
            </Badge>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {veteran && <Badge variant="navy">実績豊富 (成約{supplier.successCount}件)</Badge>}
          {high && <Badge variant="success">積極対応</Badge>}
        </div>

        <div className="mt-auto pt-5 grid grid-cols-2 gap-2">
          <Button
            variant={action === "liked" ? "like" : "likeIdle"}
            onClick={() => onAction("liked")}
          >
            ♡ 気になる
          </Button>
          <Button
            variant={action === "super_liked" ? "superLike" : "superLikeIdle"}
            onClick={() => onAction("super_liked")}
          >
            ★ ぜひ話したい
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
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
        matched ? "bg-success/10 text-success" : "bg-gray-100 text-gray-500",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          matched ? "bg-success" : "bg-gray-400",
        )}
      />
      {label}
      {matched ? "◎" : "△"}
    </span>
  );
}
