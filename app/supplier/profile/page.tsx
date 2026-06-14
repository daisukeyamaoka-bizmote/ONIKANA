"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, Label } from "@/components/ui/input";
import { findSupplierById } from "@/lib/dummy-data/suppliers";
import { MOCK_SUPPLIER } from "@/lib/auth/mock-user";
import {
  INDUSTRY_LABELS,
  EMPLOYEE_SCALE_LABELS,
  CHALLENGE_LABELS,
} from "@/types";
import { formatYen } from "@/lib/utils";

export default function SupplierProfilePage() {
  const supplier = findSupplierById(MOCK_SUPPLIER.id);
  const [editing, setEditing] = useState(false);
  const [strength, setStrength] = useState(supplier?.strengthLine ?? "");
  const [description, setDescription] = useState(supplier?.description ?? "");

  if (!supplier) return <p>プロフィールが見つかりません。</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">プロフィール</h1>
          <p className="mt-1 text-sm text-navy-900/60">
            クライアントが見るあなたの会社情報を確認・更新できます。
          </p>
        </div>
        <Button
          variant={editing ? "outline" : "supplier"}
          onClick={() => setEditing(!editing)}
        >
          {editing ? "閲覧モードへ" : "編集モード"}
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-6">
          {/* ヘッダ部 */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-supplier text-white text-2xl font-bold">
              {supplier.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-navy-900">
                {supplier.name}
              </h2>
              <p className="text-sm text-navy-900/60 mt-0.5">
                {INDUSTRY_LABELS[supplier.industry]} ・ 従業員{" "}
                {supplier.employeeCount}名 (
                {EMPLOYEE_SCALE_LABELS[supplier.employeeScale]}) ・{" "}
                {supplier.prefecture}
              </p>
              <p className="text-xs text-navy-900/50 mt-1">
                代表: {supplier.representativeName ?? "—"} ・ 登録{" "}
                {supplier.signupDate ?? "—"}
              </p>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <Badge variant={supplier.isActive ? "success" : "muted"}>
                {supplier.isActive ? "公開中" : "非公開"}
              </Badge>
              <Badge variant="outline">
                返答率 {Math.round((supplier.responseRate ?? 0) * 100)}%
              </Badge>
            </div>
          </div>

          {/* 強み一行 */}
          <Section title="強み(一行で)" hint="レコメンドカードに表示されます">
            {editing ? (
              <Input
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                maxLength={50}
                placeholder="例: ITエンジニア採用に特化、平均3ヶ月で初採用を実現"
              />
            ) : (
              <p className="rounded-lg bg-aqua-50 border border-aqua-100 px-3 py-2 text-sm text-navy-900/80">
                {supplier.strengthLine ?? "未設定"}
              </p>
            )}
          </Section>

          <Section title="サービス概要">
            {editing ? (
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            ) : (
              <p className="text-sm text-navy-900/80 leading-relaxed bg-navy-50 rounded-lg p-3">
                {supplier.description}
              </p>
            )}
          </Section>

          <Section title="提供できる課題カテゴリ">
            <div className="flex flex-wrap gap-1.5">
              {supplier.serviceCategories?.map((c) => (
                <Badge key={c} variant="aqua">
                  {CHALLENGE_LABELS[c]}
                </Badge>
              ))}
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Section title="対応エリア">
              <div className="flex flex-wrap gap-1.5">
                {supplier.targetAreas?.map((a) => (
                  <Badge key={a} variant="outline">
                    {a}
                  </Badge>
                ))}
              </div>
            </Section>

            <Section title="対応可能な企業規模">
              <div className="flex flex-wrap gap-1.5">
                {supplier.targetScales?.map((s) => (
                  <Badge key={s} variant="outline">
                    {EMPLOYEE_SCALE_LABELS[s]}
                  </Badge>
                ))}
              </div>
            </Section>

            <Section title="価格帯(月額)">
              <p className="text-sm font-semibold text-navy-900">
                {supplier.priceRangeMin
                  ? `${formatYen(supplier.priceRangeMin)} 〜`
                  : "応相談"}
              </p>
            </Section>

            <Section title="アポ受入積極度">
              <Badge
                variant={
                  supplier.meetingPriority === "high"
                    ? "success"
                    : supplier.meetingPriority === "low"
                      ? "muted"
                      : "outline"
                }
              >
                {supplier.meetingPriority === "high"
                  ? "積極対応"
                  : supplier.meetingPriority === "low"
                    ? "厳選対応"
                    : "通常"}
              </Badge>
            </Section>
          </div>

          {/* サービス資料 */}
          <Section title="サービス資料・公式URL">
            <div className="space-y-2 text-sm">
              <div>
                <Label className="!mb-0.5 !text-xs">サービス資料</Label>
                {editing ? (
                  <Input
                    defaultValue={supplier.serviceMaterialUrl ?? ""}
                    placeholder="https://"
                  />
                ) : supplier.serviceMaterialUrl ? (
                  <a
                    href={supplier.serviceMaterialUrl}
                    onClick={(e) => e.preventDefault()}
                    className="text-aqua-700 hover:underline inline-flex items-center gap-1"
                  >
                    📄 {supplier.serviceMaterialUrl}
                  </a>
                ) : (
                  <p className="text-navy-900/50">未登録</p>
                )}
              </div>
              <div>
                <Label className="!mb-0.5 !text-xs">公式サイト</Label>
                {editing ? (
                  <Input
                    defaultValue={supplier.websiteUrl ?? ""}
                    placeholder="https://"
                  />
                ) : supplier.websiteUrl ? (
                  <a
                    href={supplier.websiteUrl}
                    onClick={(e) => e.preventDefault()}
                    className="text-aqua-700 hover:underline inline-flex items-center gap-1"
                  >
                    🌐 {supplier.websiteUrl}
                  </a>
                ) : (
                  <p className="text-navy-900/50">未登録</p>
                )}
              </div>
            </div>
          </Section>

          {/* 実績 */}
          <Section title="実績">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="総打診数" value={`${supplier.totalOffers ?? 0}件`} />
              <Stat
                label="商談成立"
                value={`${supplier.successCount ?? 0}件`}
              />
              <Stat
                label="返答率"
                value={`${Math.round((supplier.responseRate ?? 0) * 100)}%`}
              />
            </div>
          </Section>

          {editing && (
            <div className="flex justify-end gap-2 pt-4 border-t border-navy/10">
              <Button variant="outline" onClick={() => setEditing(false)}>
                キャンセル
              </Button>
              <Button variant="supplier" onClick={() => setEditing(false)}>
                保存
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-navy-900/70 mb-1">{title}</p>
      {hint && <p className="text-xs text-navy-900/50 mb-2">{hint}</p>}
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-navy-50 p-3 text-center">
      <p className="text-xs text-navy-900/60">{label}</p>
      <p className="num-emphasis text-lg font-bold text-navy-900 mt-0.5">
        {value}
      </p>
    </div>
  );
}
