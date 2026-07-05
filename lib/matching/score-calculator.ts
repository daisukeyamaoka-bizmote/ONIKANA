import type {
  Company,
  ChallengeCategory,
  EmployeeScale,
  Industry,
  BudgetRange,
} from "@/types";
import {
  BUDGET_TO_AMOUNT,
  INDUSTRY_LABELS,
  EMPLOYEE_SCALE_LABELS,
  CHALLENGE_LABELS,
  BUDGET_LABELS,
} from "@/types";

// REQUIREMENTS.md セクション6 を参照
// 5軸タグ: 業種・規模・課題・地域・予算

export interface ClientCriteria {
  industry: Industry;
  employeeScale: EmployeeScale;
  prefecture: string;
  challenges: ChallengeCategory[];
  budget: BudgetRange;
}

export interface TagBreakdown {
  industry: boolean;
  scale: boolean;
  category: boolean;
  area: boolean;
  budget: boolean;
}

// 各軸が一致しているかを判定
export function calculateTagBreakdown(
  client: ClientCriteria,
  supplier: Company,
): TagBreakdown {
  // 業種一致: 支援先の対応可能業種に含まれているか
  const industry = supplier.targetIndustries?.includes(client.industry) ?? false;

  // 規模一致: 支援先の対応可能規模に含まれているか
  const scale = supplier.targetScales?.includes(client.employeeScale) ?? false;

  // 課題一致: クライアント課題のうち1つでも支援先サービスに含まれていればOK
  const category =
    supplier.serviceCategories?.some((s) => client.challenges.includes(s)) ??
    false;

  // 地域一致: 完全一致 OR 全国対応
  const area =
    supplier.targetAreas?.includes(client.prefecture) ||
    supplier.targetAreas?.includes("全国") ||
    false;

  // 予算一致: クライアント予算 >= 支援先価格帯下限
  const clientBudgetAmount = BUDGET_TO_AMOUNT[client.budget];
  const budget = (supplier.priceRangeMin ?? 0) <= clientBudgetAmount;

  return { industry, scale, category, area, budget };
}

// タグ一致スコア(0-100)
export function calculateTagMatchScore(breakdown: TagBreakdown): number {
  const matched = Object.values(breakdown).filter(Boolean).length;
  return matched * 20; // 5軸 × 20点
}

// 実績スコア(0-100)
export function calculateSuccessRateScore(supplier: Company): number {
  const totalOffers = supplier.totalOffers ?? 0;
  if (totalOffers === 0) return 50; // 新規支援先は中央値
  const successCount = supplier.successCount ?? 0;
  return Math.min(100, Math.round((successCount / totalOffers) * 100));
}

export interface ScoredSupplier {
  supplier: Company;
  matchScore: number;
  tagMatchScore: number;
  successRateScore: number;
  breakdown: TagBreakdown;
}

// 支援先1社のスコアリング
// 重みは合計が1でなくても正規化するため、総合スコアは常に0-100に収まる
export function scoreSupplier(
  client: ClientCriteria,
  supplier: Company,
  weights: { tag: number; success: number } = { tag: 0.5, success: 0.5 },
): ScoredSupplier {
  const breakdown = calculateTagBreakdown(client, supplier);
  const tagMatchScore = calculateTagMatchScore(breakdown);
  const successRateScore = calculateSuccessRateScore(supplier);
  const totalWeight = weights.tag + weights.success;
  const wTag = totalWeight > 0 ? weights.tag / totalWeight : 0.5;
  const wSuccess = totalWeight > 0 ? weights.success / totalWeight : 0.5;
  const matchScore = Math.round(
    tagMatchScore * wTag + successRateScore * wSuccess,
  );
  return {
    supplier,
    matchScore,
    tagMatchScore,
    successRateScore,
    breakdown,
  };
}

// 全支援先をスコアリングして上位N件を返す
export function rankSuppliers(
  client: ClientCriteria,
  suppliers: Company[],
  options: {
    threshold?: number;
    limit?: number;
    weights?: { tag: number; success: number };
  } = {},
): ScoredSupplier[] {
  const { threshold = 50, limit = 10, weights = { tag: 0.5, success: 0.5 } } =
    options;

  return suppliers
    .map((s) => scoreSupplier(client, s, weights))
    .filter((s) => s.matchScore >= threshold)
    // 同点時も並び順が揺れないよう、実績スコア → 名前順で決定的にソート
    .sort(
      (a, b) =>
        b.matchScore - a.matchScore ||
        b.successRateScore - a.successRateScore ||
        a.supplier.name.localeCompare(b.supplier.name, "ja"),
    )
    .slice(0, limit);
}

// マッチ理由を3つの短い日本語フレーズで返す(デモ説明用)
export function buildMatchReasons(
  client: ClientCriteria,
  supplier: Company,
  breakdown: TagBreakdown,
): string[] {
  const reasons: string[] = [];

  if (breakdown.category && supplier.serviceCategories) {
    const overlap = supplier.serviceCategories.filter((s) =>
      client.challenges.includes(s),
    );
    if (overlap.length > 0) {
      reasons.push(
        `課題「${overlap.map((c) => CHALLENGE_LABELS[c]).join("・")}」に直接対応`,
      );
    }
  }
  if (breakdown.industry) {
    reasons.push(`${INDUSTRY_LABELS[client.industry]}業界への支援実績あり`);
  }
  if (breakdown.scale) {
    reasons.push(`${EMPLOYEE_SCALE_LABELS[client.employeeScale]}規模の企業を主な対象としている`);
  }
  if (breakdown.area) {
    if (supplier.targetAreas?.includes("全国")) {
      reasons.push("全国対応・地理的制約なし");
    } else {
      reasons.push(`${client.prefecture}を含むエリアで対応可能`);
    }
  }
  if (breakdown.budget) {
    reasons.push(
      `予算${BUDGET_LABELS[client.budget]}でも提供可能な価格帯`,
    );
  }
  if ((supplier.successCount ?? 0) >= 20) {
    reasons.push(`過去${supplier.successCount}件の商談実績・信頼性◎`);
  }
  if (supplier.meetingPriority === "high") {
    reasons.push("打診の返答が早く・前向きな対応傾向");
  }

  return reasons.slice(0, 3); // 上位3つに絞る
}
