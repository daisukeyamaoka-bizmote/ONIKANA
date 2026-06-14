"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, Label, Select } from "@/components/ui/input";
import {
  INDUSTRY_LABELS,
  EMPLOYEE_SCALE_LABELS,
  CHALLENGE_LABELS,
  PREFECTURES,
  type ChallengeCategory,
} from "@/types";
import { cn } from "@/lib/utils";

// ⑧ Giver(支援先)会員登録フォームのプレビュー
// デモ用なので送信時はトーストだけ出して /supplier/dashboard に戻ります
export default function SupplierSignupPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState<ChallengeCategory[]>([]);

  const toggle = (c: ChallengeCategory) =>
    setCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-10 text-center">
        <Card>
          <CardContent className="py-12">
            <div className="text-5xl mb-3">📨</div>
            <h1 className="text-2xl font-bold text-navy-900">
              申請を受け付けました
            </h1>
            <p className="mt-3 text-sm text-navy-900/70">
              オニカナ事務局による審査(通常2-3営業日)を経て、ご登録メールにて結果をお知らせします。
            </p>
            <Badge variant="warn" className="mt-4">
              ステータス: 審査中
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-supplier">
          Giver会員 新規登録
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-navy-900">
          支援先として登録する
        </h1>
        <p className="mt-1 text-sm text-navy-900/60">
          オニカナの審査を経て、AIマッチングの対象となります。所要時間: 約5分
        </p>
      </div>

      <div className="mb-4 flex items-center gap-2 text-xs">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                step >= n
                  ? "bg-supplier text-white"
                  : "bg-gray-200 text-gray-500",
              )}
            >
              {n}
            </span>
            <span
              className={cn(
                step === n ? "font-semibold text-navy-900" : "text-navy-900/50",
              )}
            >
              {n === 1 ? "基本情報" : n === 2 ? "提供サービス" : "提供可能範囲"}
            </span>
            {n < 3 && <span className="text-gray-300 mx-1">―</span>}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="space-y-5">
          {step === 1 && (
            <>
              <div>
                <Label>会社名 *</Label>
                <Input placeholder="例: 株式会社サンプル" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>業種 *</Label>
                  <Select>
                    <option value="">選択してください</option>
                    {Object.entries(INDUSTRY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>従業員規模 *</Label>
                  <Select>
                    <option value="">選択してください</option>
                    {Object.entries(EMPLOYEE_SCALE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>所在地 *</Label>
                  <Select>
                    <option value="">選択してください</option>
                    {PREFECTURES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>代表者名 *</Label>
                  <Input placeholder="例: 山田 太郎" />
                </div>
                <div>
                  <Label>担当者メールアドレス *</Label>
                  <Input type="email" placeholder="contact@example.com" />
                </div>
                <div>
                  <Label>電話番号</Label>
                  <Input placeholder="03-xxxx-xxxx" />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <Label>提供できる課題カテゴリ *(複数選択可)</Label>
                <p className="text-xs text-navy-900/50 mb-3">
                  クライアントの課題とのマッチング判定に使用されます。
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(CHALLENGE_LABELS).map(([k, v]) => {
                    const cat = k as ChallengeCategory;
                    const selected = categories.includes(cat);
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => toggle(cat)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm transition text-left",
                          selected
                            ? "border-supplier bg-supplier-50 text-navy-900 font-semibold ring-2 ring-supplier"
                            : "border-navy/15 bg-white hover:border-navy/30",
                        )}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label>強み(一行・最大50字)*</Label>
                <Input
                  maxLength={50}
                  placeholder="例: ITエンジニア採用に特化、平均3ヶ月で初採用を実現"
                />
              </div>
              <div>
                <Label>サービス概要 *(200-300字)</Label>
                <Textarea
                  rows={5}
                  placeholder="提供サービスの内容、得意領域、これまでの実績などを記載してください。"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>サービス資料URL</Label>
                  <Input placeholder="https://" />
                </div>
                <div>
                  <Label>公式サイトURL</Label>
                  <Input placeholder="https://" />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <Label>対応可能な業種(複数選択可)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(INDUSTRY_LABELS).map(([k, v]) => (
                    <PillCheck key={k}>{v}</PillCheck>
                  ))}
                </div>
              </div>
              <div>
                <Label>対応可能な企業規模</Label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {Object.entries(EMPLOYEE_SCALE_LABELS).map(([k, v]) => (
                    <PillCheck key={k}>{v}</PillCheck>
                  ))}
                </div>
              </div>
              <div>
                <Label>対応エリア</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <PillCheck>全国対応</PillCheck>
                  <Input placeholder="特定都道府県を選ぶ場合は記載" />
                </div>
              </div>
              <div>
                <Label>提供価格帯(月額下限)</Label>
                <Input type="number" placeholder="例: 300000" />
              </div>
              <div>
                <Label>アポ受入積極度</Label>
                <Select>
                  <option value="high">積極的に対応(返答72h以内)</option>
                  <option value="medium">通常(返答1週間以内)</option>
                  <option value="low">厳選対応(マッチ度高のみ)</option>
                </Select>
              </div>
              <div className="rounded-lg bg-aqua-50 border border-aqua-100 p-3 text-xs text-navy-900/80">
                <p className="font-semibold mb-1">審査について</p>
                <p>
                  申請後、オニカナ事務局で書類審査(2-3営業日)を行います。
                  審査通過後にAIマッチングの対象となります。
                </p>
              </div>
            </>
          )}

          <div className="flex justify-between gap-3 pt-4 border-t border-navy/10">
            <Button
              variant="outline"
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
            >
              ← 戻る
            </Button>
            {step < 3 ? (
              <Button variant="supplier" onClick={() => setStep(step + 1)}>
                次へ →
              </Button>
            ) : (
              <Button
                variant="supplier"
                onClick={() => setSubmitted(true)}
              >
                審査申請する
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PillCheck({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOn(!on)}
      className={cn(
        "rounded-lg border px-3 py-2 text-sm transition text-left",
        on
          ? "border-supplier bg-supplier-50 text-navy-900 font-semibold ring-2 ring-supplier"
          : "border-navy/15 bg-white hover:border-navy/30",
      )}
    >
      {children}
    </button>
  );
}
