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
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuestionnaireStore } from "@/lib/store/questionnaire-store";
import {
  INDUSTRY_LABELS,
  EMPLOYEE_SCALE_LABELS,
  CHALLENGE_LABELS,
  BUDGET_LABELS,
  URGENCY_LABELS,
  ROLE_LABELS,
  ROLE_PRICES,
  PREFECTURES,
  type Industry,
  type EmployeeScale,
  type ChallengeCategory,
  type BudgetRange,
  type Urgency,
  type MeetingTargetRole,
} from "@/types";
import { formatYen, cn } from "@/lib/utils";

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
            {step === 3 && "Step 3: 詳細・ご連絡先"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "貴社の基本情報を教えてください。"}
            {step === 2 && "抱えている課題と希望される予算感を教えてください。"}
            {step === 3 && "より良いご提案のための詳細情報をお願いします。"}
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
    return Boolean(a.industry && a.employeeScale && a.prefecture);
  }
  if (step === 2) {
    const ch = a.challenges as ChallengeCategory[] | undefined;
    return Boolean(
      ch && ch.length > 0 && a.budget && a.urgency && a.targetRole,
    );
  }
  return Boolean(a.contactInfo);
}

function Step1({
  answers,
  setAnswers,
}: {
  answers: Record<string, unknown>;
  setAnswers: (a: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Q1. 業種をお選びください</Label>
        <Select
          value={(answers.industry as string) ?? ""}
          onChange={(e) => setAnswers({ industry: e.target.value as Industry })}
        >
          <option value="">選択してください</option>
          {Object.entries(INDUSTRY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Q2. 従業員規模</Label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {Object.entries(EMPLOYEE_SCALE_LABELS).map(([k, v]) => (
            <PillOption
              key={k}
              selected={answers.employeeScale === k}
              onClick={() => setAnswers({ employeeScale: k as EmployeeScale })}
            >
              {v}
            </PillOption>
          ))}
        </div>
      </div>
      <div>
        <Label>Q3. 所在地(都道府県)</Label>
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
    </div>
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
        <Label>Q4. 抱えている課題(最大3つ・複数選択可)</Label>
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
        <Label>Q5. 月次のご予算</Label>
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
        <Label>Q6. 導入希望時期</Label>
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
      <div>
        <Label>Q7. 商談したい相手の役職</Label>
        <p className="text-xs text-navy-900/50 mb-3">
          ※商談単価は役職に応じて変動します
        </p>
        <div className="grid grid-cols-1 gap-2">
          {(Object.keys(ROLE_LABELS) as MeetingTargetRole[]).map((role) => (
            <PillOption
              key={role}
              selected={answers.targetRole === role}
              onClick={() => setAnswers({ targetRole: role })}
              fullWidth
            >
              <div className="flex items-center justify-between w-full">
                <span>{ROLE_LABELS[role]}</span>
                <Badge variant="aqua">{formatYen(ROLE_PRICES[role])}</Badge>
              </div>
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
  return (
    <div className="space-y-6">
      <div>
        <Label>Q8. 会社の背景(任意・約200文字)</Label>
        <Textarea
          placeholder="例: 創業20年の精密部品メーカーです。近年は新規事業として...."
          maxLength={300}
          value={(answers.backgroundText as string) ?? ""}
          onChange={(e) => setAnswers({ backgroundText: e.target.value })}
        />
      </div>
      <div>
        <Label>Q9. 希望する支援内容(任意・約200文字)</Label>
        <Textarea
          placeholder="例: 半年以内にエンジニアを5名採用したく、スカウト代行と..."
          maxLength={300}
          value={(answers.desiredSupportText as string) ?? ""}
          onChange={(e) => setAnswers({ desiredSupportText: e.target.value })}
        />
      </div>
      <div>
        <Label>Q10. 連絡先メールアドレス</Label>
        <Input
          type="email"
          placeholder="contact@example.com"
          value={(answers.contactInfo as string) ?? ""}
          onChange={(e) => setAnswers({ contactInfo: e.target.value })}
        />
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
