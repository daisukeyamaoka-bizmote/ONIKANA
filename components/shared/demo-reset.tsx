"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuestionnaireStore } from "@/lib/store/questionnaire-store";
import { useMatchStore } from "@/lib/store/match-store";
import { useLikeStore } from "@/lib/store/like-store";
import { useScoringStore } from "@/lib/store/scoring-store";
import { useSupplierStatusStore } from "@/lib/store/supplier-status-store";

// すべてのデモ用ストアを初期化するボタン
// 商談前後で状態がぐちゃぐちゃになっても「リセット」一発で同じ初期状態に戻ります。
export function DemoResetButton({
  variant = "outline",
  className,
}: {
  variant?: "outline" | "ghost" | "danger";
  className?: string;
}) {
  const [done, setDone] = useState(false);
  const q = useQuestionnaireStore();
  const m = useMatchStore();
  const l = useLikeStore();
  const sc = useScoringStore();
  const ss = useSupplierStatusStore();

  const reset = () => {
    if (!confirm("デモデータ(アンケート/LIKE/マッチング状態など)を初期化します。よろしいですか?"))
      return;
    q.reset();
    m.reset();
    l.reset();
    sc.reset();
    ss.reset();
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };

  return (
    <Button variant={variant} onClick={reset} size="sm" className={className}>
      {done ? "✓ リセット完了" : "🔄 デモデータをリセット"}
    </Button>
  );
}
