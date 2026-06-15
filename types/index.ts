// フクワウチ — 型定義(運営: 株式会社オニカナ)
// REQUIREMENTS.md セクション4 を参照

export type CompanyType = "client" | "supplier";

export type Industry =
  | "manufacturing"
  | "it"
  | "retail"
  | "construction"
  | "medical"
  | "finance"
  | "logistics"
  | "wholesale"
  | "realestate"
  | "service"
  | "other";

export type EmployeeScale =
  | "micro" // 1-10名
  | "small" // 11-50名
  | "sme" // 51-300名
  | "mid" // 301-1000名
  | "large"; // 1001名以上

export type ChallengeCategory =
  | "hr_recruitment"
  | "hr_retention"
  | "dx_promotion"
  | "sales_strengthening"
  | "marketing"
  | "cost_reduction"
  | "management_consulting"
  | "it_infrastructure"
  | "legal_compliance"
  | "finance_funding";

export type MeetingTargetRole = "staff" | "manager" | "executive";

export type BudgetRange =
  | "budget_under_10k"
  | "budget_10k_50k"
  | "budget_50k_100k"
  | "budget_over_100k";

export type Urgency = "immediate" | "within_1m" | "within_3m" | "over_6m";

export interface Company {
  id: string;
  type: CompanyType;
  name: string;
  industry: Industry;
  employeeCount: number;
  employeeScale: EmployeeScale;
  prefecture: string;
  description: string;

  // クライアント固有
  challenges?: ChallengeCategory[];
  budget?: BudgetRange;
  urgency?: Urgency;

  // 支援先固有
  serviceCategories?: ChallengeCategory[];
  targetIndustries?: Industry[];
  targetScales?: EmployeeScale[];
  targetAreas?: string[];
  priceRangeMin?: number;
  meetingPriority?: "high" | "medium" | "low";
  responseRate?: number;
  successCount?: number;
  totalOffers?: number;
  // 支援先プロフィール拡張(⑤⑦⑧対応)
  strengthLine?: string;          // 強み一行(レコメンドカードで表示)
  serviceMaterialUrl?: string;    // サービス資料URL(ダミーで # でも可)
  websiteUrl?: string;            // 公式サイトURL
  isActive?: boolean;             // 有効/無効トグル(管理者が制御)
  signupDate?: string;            // Giver会員登録日
  representativeName?: string;    // 代表者名(プロフィール表示用)

  createdAt: string;
}

export interface QuestionnaireAnswers {
  // 会社情報(Step 1・必須)
  companyName: string;
  industry: Industry;            // 主カテゴリ(マッチング判定に使用)
  industryDetail?: string;       // ユーザーが入力した細分業種(表示用)
  employeeScale: EmployeeScale;
  prefecture: string;
  companyWebsite: string;
  // 担当者情報(Step 1・必須)
  contactName: string;
  contactInfo: string;           // メールアドレス
  contactPhone: string;
  // 課題・予算(Step 2)
  challenges: ChallengeCategory[];
  budget: BudgetRange;
  urgency: Urgency;
  // 詳細(Step 3・任意)
  companyDocumentNames?: string[];
  companyUrls?: string[];
  // 後方互換(UIから削除済みのフィールド)
  targetRole?: MeetingTargetRole;
  backgroundText?: string;
  desiredSupportText?: string;
}

export interface Questionnaire {
  id: string;
  clientId: string;
  answers: QuestionnaireAnswers;
  extractedTags: {
    industry: Industry;
    scale: EmployeeScale;
    categories: ChallengeCategory[];
    area: string;
    budget: BudgetRange;
  };
  status: "draft" | "submitted" | "matched";
  createdAt: string;
}

export type MatchStatus =
  | "recommended"
  | "liked"
  | "super_liked"
  | "auto_offered"
  | "accepted"
  | "rejected"
  | "matched"
  | "completed"
  | "cancelled";

export interface Match {
  id: string;
  questionnaireId: string;
  clientId: string;
  supplierId: string;
  matchScore: number;
  tagMatchScore: number;
  successRateScore: number;
  matchType: "ai_recommend" | "auto_offer";
  status: MatchStatus;
  targetRole: MeetingTargetRole;
  meetingPrice?: number;
  createdAt: string;
  updatedAt: string;
  // UI拡張: タグ一致根拠を保持
  tagBreakdown?: {
    industry: boolean;
    scale: boolean;
    category: boolean;
    area: boolean;
    budget: boolean;
  };
}

export interface Meeting {
  id: string;
  matchId: string;
  proposedDates?: string[];
  scheduledAt?: string;
  status: "proposing" | "scheduled" | "completed" | "cancelled";
  clientConfirmedAt?: string;
  supplierConfirmedAt?: string;
  meetingPrice: number;
  createdAt: string;
}

// ラベル定義(UI で使う日本語表記)
export const INDUSTRY_LABELS: Record<Industry, string> = {
  manufacturing: "製造業",
  it: "IT・SaaS",
  retail: "小売",
  construction: "建設",
  medical: "医療・介護",
  finance: "金融",
  logistics: "物流",
  wholesale: "卸売",
  realestate: "不動産",
  service: "サービス",
  other: "その他",
};

export const EMPLOYEE_SCALE_LABELS: Record<EmployeeScale, string> = {
  micro: "1-10名",
  small: "11-50名",
  sme: "51-300名",
  mid: "301-1000名",
  large: "1001名以上",
};

export const CHALLENGE_LABELS: Record<ChallengeCategory, string> = {
  hr_recruitment: "採用",
  hr_retention: "定着",
  dx_promotion: "DX推進",
  sales_strengthening: "営業強化",
  marketing: "マーケティング",
  cost_reduction: "コスト削減",
  management_consulting: "経営戦略",
  it_infrastructure: "IT基盤",
  legal_compliance: "法務・コンプラ",
  finance_funding: "資金調達",
};

export const BUDGET_LABELS: Record<BudgetRange, string> = {
  budget_under_10k: "月10万円以下",
  budget_10k_50k: "月10万〜50万円",
  budget_50k_100k: "月50万〜100万円",
  budget_over_100k: "月100万円以上",
};

export const URGENCY_LABELS: Record<Urgency, string> = {
  immediate: "今すぐ",
  within_1m: "1ヶ月以内",
  within_3m: "3ヶ月以内",
  over_6m: "半年以上先",
};

export const ROLE_LABELS: Record<MeetingTargetRole, string> = {
  staff: "一般社員・主任クラス",
  manager: "課長・部長クラス",
  executive: "役員・経営層クラス",
};

export const ROLE_PRICES: Record<MeetingTargetRole, number> = {
  staff: 30000,
  manager: 50000,
  executive: 90000,
};

export const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  recommended: "AIレコメンド",
  liked: "気になる",
  super_liked: "ぜひ話したい",
  auto_offered: "自動打診中",
  accepted: "承諾済み",
  rejected: "辞退",
  matched: "商談確定",
  completed: "商談完了",
  cancelled: "キャンセル",
};

// 都道府県(47件)
export const PREFECTURES = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
] as const;

// 予算ランクを数値に変換(マッチング比較用)
export const BUDGET_TO_AMOUNT: Record<BudgetRange, number> = {
  budget_under_10k: 100000,
  budget_10k_50k: 300000,
  budget_50k_100k: 750000,
  budget_over_100k: 1500000,
};

// 業種の細分カテゴリ(検索可能リスト)
// 入力された値はマッチング判定用に Industry(主カテゴリ)へマップされる
export const INDUSTRY_DETAIL_TO_CATEGORY: Record<string, Industry> = {
  // 製造業
  "自動車・部品": "manufacturing",
  "電機・電子機器": "manufacturing",
  "機械・産業機器": "manufacturing",
  "食品・飲料": "manufacturing",
  "化学・素材": "manufacturing",
  "医薬品・バイオ": "manufacturing",
  "紙・パッケージ": "manufacturing",
  "繊維・アパレル製造": "manufacturing",
  // IT
  "SaaS・クラウド": "it",
  "受託開発・SIer": "it",
  "Web・アプリ制作": "it",
  "セキュリティ": "it",
  "AI・機械学習": "it",
  "ハードウェア・IoT": "it",
  // 小売
  "食品スーパー・量販": "retail",
  "アパレル・雑貨": "retail",
  "EC・通販": "retail",
  "専門店・小売": "retail",
  // サービス
  "飲食・レストラン": "service",
  "宿泊・ホテル": "service",
  "美容・サロン": "service",
  "フィットネス・健康": "service",
  "広告・PR": "service",
  "教育・スクール": "service",
  "コンサルティング": "service",
  "人材紹介・派遣": "service",
  "デザイン・クリエイティブ": "service",
  // 建設
  "総合建設(ゼネコン)": "construction",
  "建築・住宅": "construction",
  "土木・インフラ": "construction",
  "設備工事": "construction",
  // 不動産
  "不動産売買": "realestate",
  "不動産賃貸・管理": "realestate",
  "デベロッパー": "realestate",
  // 医療・介護
  "クリニック・診療所": "medical",
  "病院": "medical",
  "介護・福祉": "medical",
  "医療機器・製薬": "medical",
  // 金融
  "銀行・信金": "finance",
  "保険": "finance",
  "証券・運用": "finance",
  "リース・カード": "finance",
  // 物流
  "物流・運送": "logistics",
  "倉庫": "logistics",
  "海運・空運": "logistics",
  // 卸売
  "卸売・問屋": "wholesale",
  "総合商社・専門商社": "wholesale",
  // その他
  "農林水産": "other",
  "その他": "other",
};

export const INDUSTRY_DETAIL_OPTIONS = Object.keys(
  INDUSTRY_DETAIL_TO_CATEGORY,
);
