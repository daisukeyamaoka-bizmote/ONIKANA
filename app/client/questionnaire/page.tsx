"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useQuestionnaireStore } from "@/lib/store/questionnaire-store";
import {
  INDUSTRY_LABELS,
  INDUSTRY_DETAIL_TO_CATEGORY,
  INDUSTRY_DETAIL_OPTIONS,
  EMPLOYEE_SCALE_LABELS,
  CHALLENGE_LABELS,
  BUDGET_LABELS,
  URGENCY_LABELS,
  PREFECTURES,
  type Industry,
  type EmployeeScale,
  type ChallengeCategory,
  type BudgetRange,
  type Urgency,
} from "@/types";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 3;

export default function QuestionnairePage() {
  const router = useRouter();
  const { step, answers, setStep, setAnswers, reset } =
    useQuestionnaireStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="text-center text-navy-900/50 py-20">読み込み中…</div>
    );
  }

  const handleSubmit = () => {
    // 提出 → レコメンド画面へ
    setStep(1);
    router.push("/client/recommendations");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 rounded-lg border border-mist-300 bg-paper px-4 py-2 text-xs text-mist-600 flex items-center justify-between">
        <span>
          <span className="font-semibold text-ink">クライアント企業のご利用は完全無料</span>
          {" 　"}所要時間 約3分
        </span>
        <span className="text-mist-500">課金対象は支援先のみ</span>
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-navy-900/60">
            アンケート ({step}/{TOTAL_STEPS})
          </span>
          <button
            onClick={() => {
              if (confirm("入力内容をリセットしますか?")) reset();
            }}
            className="text-xs text-navy-900/50 hover:text-navy-900"
          >
            リセット
          </button>
        </div>
        <Progress value={(step / TOTAL_STEPS) * 100} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Step 1: 基本情報"}
            {step === 2 && "Step 2: 課題と予算"}
            {step === 3 && "Step 3: 紹介資料・URL"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "貴社・ご担当者の情報を教えてください。"}
            {step === 2 && "抱えている課題と希望される予算感を教えてください。"}
            {step === 3 && "資料・URLは任意。AIが内容を読み取りマッチング精度を高めます。"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && <Step1 answers={answers} setAnswers={setAnswers} />}
          {step === 2 && <Step2 answers={answers} setAnswers={setAnswers} />}
          {step === 3 && <Step3 answers={answers} setAnswers={setAnswers} />}

          <div className="mt-8 flex justify-between gap-3">
            <Button
              variant="outline"
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
            >
              ← 戻る
            </Button>
            {step < TOTAL_STEPS ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid(step, answers)}
              >
                次へ →
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={handleSubmit}
                disabled={!isStepValid(3, answers)}
              >
                AIマッチングを開始
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// バリデーション(必須項目チェック)
function isStepValid(step: number, a: Record<string, unknown>): boolean {
  if (step === 1) {
    return Boolean(
      a.companyName &&
        a.industry &&
        a.employeeScale &&
        a.prefecture &&
        a.companyWebsite &&
        a.contactName &&
        a.contactInfo &&
        a.contactPhone,
    );
  }
  if (step === 2) {
    const ch = a.challenges as ChallengeCategory[] | undefined;
    return Boolean(ch && ch.length > 0 && a.budget && a.urgency);
  }
  // Step 3 は任意項目のみ
  return true;
}

function Step1({
  answers,
  setAnswers,
}: {
  answers: Record<string, unknown>;
  setAnswers: (a: Record<string, unknown>) => void;
}) {
  const industryDetail =
    (answers.industryDetail as string) ??
    ((answers.industry as Industry | undefined)
      ? INDUSTRY_LABELS[answers.industry as Industry]
      : "");

  const handleIndustryInput = (val: string) => {
    // 細分カテゴリから主カテゴリを推定。リスト外なら "other" にフォールバック
    const fromDetail = INDUSTRY_DETAIL_TO_CATEGORY[val];
    const fromLabel = (
      Object.entries(INDUSTRY_LABELS) as [Industry, string][]
    ).find(([, label]) => label === val)?.[0];
    const cat: Industry = fromDetail ?? fromLabel ?? "other";
    setAnswers({ industry: cat, industryDetail: val });
  };

  return (
    <div className="space-y-6">
      {/* 会社情報 */}
      <div className="space-y-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-mist-500">
          会社情報
        </h3>

        <div>
          <Label>
            会社名 <Req />
          </Label>
          <Input
            placeholder="例: 株式会社サンライト精機"
            value={(answers.companyName as string) ?? ""}
            onChange={(e) => setAnswers({ companyName: e.target.value })}
          />
        </div>

        <div>
          <Label>
            業種 <Req />
          </Label>
          <p className="text-xs text-mist-500 mb-2">
            候補から選択(入力で絞り込み可能)。一覧にない場合は自由記述でOK。
          </p>
          <Input
            list="industry-options"
            placeholder="入力 または 候補から選択"
            value={industryDetail}
            onChange={(e) => handleIndustryInput(e.target.value)}
          />
          <datalist id="industry-options">
            {INDUSTRY_DETAIL_OPTIONS.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        <div>
          <Label>
            従業員規模 <Req />
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Object.entries(EMPLOYEE_SCALE_LABELS).map(([k, v]) => (
              <PillOption
                key={k}
                selected={answers.employeeScale === k}
                onClick={() =>
                  setAnswers({ employeeScale: k as EmployeeScale })
                }
              >
                {v}
              </PillOption>
            ))}
          </div>
        </div>

        <div>
          <Label>
            所在地(都道府県)<Req />
          </Label>
          <Select
            value={(answers.prefecture as string) ?? ""}
            onChange={(e) => setAnswers({ prefecture: e.target.value })}
          >
            <option value="">選択してください</option>
            {PREFECTURES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>
            会社ホームページ <Req />
          </Label>
          <Input
            type="url"
            placeholder="https://example.com"
            value={(answers.companyWebsite as string) ?? ""}
            onChange={(e) => setAnswers({ companyWebsite: e.target.value })}
          />
        </div>
      </div>

      {/* 担当者情報 */}
      <div className="space-y-5 pt-2 border-t border-mist-200">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-mist-500">
          ご担当者情報
        </h3>

        <div>
          <Label>
            ご担当者名 <Req />
          </Label>
          <Input
            placeholder="例: 山田 太郎"
            value={(answers.contactName as string) ?? ""}
            onChange={(e) => setAnswers({ contactName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>
              メールアドレス <Req />
            </Label>
            <Input
              type="email"
              placeholder="contact@example.com"
              value={(answers.contactInfo as string) ?? ""}
              onChange={(e) => setAnswers({ contactInfo: e.target.value })}
            />
          </div>
          <div>
            <Label>
              電話番号 <Req />
            </Label>
            <Input
              type="tel"
              placeholder="03-0000-0000"
              value={(answers.contactPhone as string) ?? ""}
              onChange={(e) => setAnswers({ contactPhone: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Req() {
  return (
    <span
      aria-label="必須"
      title="必須"
      className="ml-1 text-xs font-semibold text-ink"
    >
      *
    </span>
  );
}

function Step2({
  answers,
  setAnswers,
}: {
  answers: Record<string, unknown>;
  setAnswers: (a: Record<string, unknown>) => void;
}) {
  const challenges = (answers.challenges as ChallengeCategory[]) ?? [];

  const toggleChallenge = (c: ChallengeCategory) => {
    if (challenges.includes(c)) {
      setAnswers({ challenges: challenges.filter((x) => x !== c) });
    } else if (challenges.length < 3) {
      setAnswers({ challenges: [...challenges, c] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>
          抱えている課題 <Req />
          <span className="ml-2 text-xs font-normal text-mist-500">
            最大3つ・複数選択可
          </span>
        </Label>
        <p className="text-xs text-navy-900/50 mb-3">
          現在 {challenges.length}/3 件選択中
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(CHALLENGE_LABELS).map(([k, v]) => (
            <PillOption
              key={k}
              selected={challenges.includes(k as ChallengeCategory)}
              disabled={
                !challenges.includes(k as ChallengeCategory) &&
                challenges.length >= 3
              }
              onClick={() => toggleChallenge(k as ChallengeCategory)}
            >
              {v}
            </PillOption>
          ))}
        </div>
      </div>
      <div>
        <Label>
          月次のご予算 <Req />
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(BUDGET_LABELS).map(([k, v]) => (
            <PillOption
              key={k}
              selected={answers.budget === k}
              onClick={() => setAnswers({ budget: k as BudgetRange })}
            >
              {v}
            </PillOption>
          ))}
        </div>
      </div>
      <div>
        <Label>
          導入希望時期 <Req />
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(URGENCY_LABELS).map(([k, v]) => (
            <PillOption
              key={k}
              selected={answers.urgency === k}
              onClick={() => setAnswers({ urgency: k as Urgency })}
            >
              {v}
            </PillOption>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3({
  answers,
  setAnswers,
}: {
  answers: Record<string, unknown>;
  setAnswers: (a: Record<string, unknown>) => void;
}) {
  // 添付ファイル(名称のみ保持。実体はストレージへ送る想定)
  const docs = (answers.companyDocumentNames as string[]) ?? [];
  // 関連URL(複数可)
  const urls = (answers.companyUrls as string[]) ?? [""];

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const names = Array.from(files).map((f) => f.name);
    setAnswers({ companyDocumentNames: [...docs, ...names] });
  };

  const removeDoc = (idx: number) =>
    setAnswers({
      companyDocumentNames: docs.filter((_, i) => i !== idx),
    });

  const setUrl = (idx: number, value: string) => {
    const next = [...urls];
    next[idx] = value;
    setAnswers({ companyUrls: next });
  };

  const addUrl = () => setAnswers({ companyUrls: [...urls, ""] });

  const removeUrl = (idx: number) =>
    setAnswers({ companyUrls: urls.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-mist-200 bg-mist-50 px-4 py-3 text-xs text-mist-600 leading-relaxed">
        文章でご記入いただく代わりに、貴社の<span className="font-semibold text-ink">会社紹介資料・サービス紹介資料</span>を添付するか、<span className="font-semibold text-ink">サイトURL</span>をご記入ください。
        いただいた情報はAIが内容を読み取り、より精度の高いマッチングに活用します。
        <span className="text-mist-500">(資料・URL欄はどちらも任意。片方だけでも構いません)</span>
      </div>

      <div>
        <Label>
          会社紹介・サービス紹介資料
          <span className="ml-2 text-xs font-normal text-mist-500">任意</span>
        </Label>
        <label
          htmlFor="company-docs"
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-mist-300 bg-paper px-4 py-8 cursor-pointer hover:bg-mist-50 transition"
        >
          <p className="text-sm font-medium text-ink">
            クリックしてファイルを選択
          </p>
          <p className="text-xs text-mist-500 mt-1">
            PDF / PowerPoint / 画像 (複数選択可)
          </p>
          <input
            id="company-docs"
            type="file"
            multiple
            accept=".pdf,.ppt,.pptx,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
        {docs.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {docs.map((name, i) => (
              <li
                key={`${name}-${i}`}
                className="flex items-center justify-between rounded border border-mist-200 bg-paper px-3 py-2 text-sm"
              >
                <span className="truncate text-ink">{name}</span>
                <button
                  type="button"
                  onClick={() => removeDoc(i)}
                  aria-label="削除"
                  className="ml-2 text-mist-500 hover:text-ink text-lg leading-none"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <Label>
          コーポレートサイト / サービス紹介ページURL
          <span className="ml-2 text-xs font-normal text-mist-500">任意</span>
        </Label>
        <p className="text-xs text-mist-500 mb-2">
          複数追加可能です。
        </p>
        <div className="space-y-2">
          {urls.map((url, i) => (
            <div key={i} className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(i, e.target.value)}
              />
              {urls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeUrl(i)}
                  className="shrink-0 rounded-lg border border-mist-200 px-3 text-sm text-mist-500 hover:bg-mist-50"
                >
                  削除
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addUrl}
          className="mt-2 text-xs text-ink hover:underline underline-offset-2"
        >
          + URLを追加
        </button>
      </div>
    </div>
  );
}

function PillOption({
  children,
  selected,
  onClick,
  disabled,
  fullWidth,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-lg border px-4 py-2.5 text-sm transition text-left",
        selected
          ? "border-aqua bg-aqua-50 text-navy-900 font-semibold ring-2 ring-aqua"
          : "border-navy/15 bg-white text-navy-900 hover:border-navy/30",
        disabled && "opacity-40 cursor-not-allowed",
        fullWidth && "w-full",
      )}
    >
      {children}
    </button>
  );
}
