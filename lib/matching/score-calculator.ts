import type {
  Company,
  ChallengeCategory,
  EmployeeScale,
  Industry,
  BudgetRange,
} from "@/types";
import { BUDGET_TO_AMOUNT } from "@/types";

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
export function scoreSupplier(
  client: ClientCriteria,
  supplier: Company,
  weights: { tag: number; success: number } = { tag: 0.5, success: 0.5 },
): ScoredSupplier {
  const breakdown = calculateTagBreakdown(client, supplier);
  const tagMatchScore = calculateTagMatchScore(breakdown);
  const successRateScore = calculateSuccessRateScore(supplier);
  const matchScore = Math.round(
    tagMatchScore * weights.tag + successRateScore * weights.success,
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
  const { threshold = 50, limit = 5, weights = { tag: 0.5, success: 0.5 } } =
    options;

  return suppliers
    .map((s) => scoreSupplier(client, s, weights))
    .filter((s) => s.matchScore >= threshold)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}
