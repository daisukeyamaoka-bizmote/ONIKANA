"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useScoringStore } from "@/lib/store/scoring-store";
import { DUMMY_CLIENTS } from "@/lib/dummy-data/clients";
import { DUMMY_SUPPLIERS } from "@/lib/dummy-data/suppliers";
import { rankSuppliers } from "@/lib/matching/score-calculator";
import { CHALLENGE_LABELS } from "@/types";

export default function ScoringPage() {
  const scoring = useScoringStore();

  const sampleClient = DUMMY_CLIENTS[0]; // サンライト精機をシミュレーター用に固定使用

  const preview = useMemo(() => {
    return rankSuppliers(
      {
        industry: sampleClient.industry,
        employeeScale: sampleClient.employeeScale,
        prefecture: sampleClient.prefecture,
        challenges: sampleClient.challenges ?? [],
        budget: sampleClient.budget!,
      },
      DUMMY_SUPPLIERS,
      {
        threshold: scoring.recommendThreshold,
        limit: 10,
        weights: { tag: scoring.tagWeight, success: scoring.successWeight },
      },
    );
  }, [scoring, sampleClient]);

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">
            スコアリング設定
          </h1>
          <p className="mt-1 text-sm text-navy-900/60">
            AIマッチングの閾値・重みを調整。プレビューで結果がリアルタイムで反映されます。
          </p>
        </div>
        <Button variant="outline" onClick={scoring.reset}>
          初期値に戻す
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardContent className="space-y-6">
            <SettingSlider
              label="AIレコメンド表示閾値"
              hint="このスコア以上の支援先のみ表示"
              value={scoring.recommendThreshold}
              min={0}
              max={100}
              step={5}
              onChange={(v) => scoring.set({ recommendThreshold: v })}
              suffix="点"
            />
            <SettingSlider
              label="自動打診トリガー閾値"
              hint="3件未達 + 24時間 経過時、このスコア以上の支援先に自動打診"
              value={scoring.autoOfferThreshold}
              min={0}
              max={100}
              step={5}
              onChange={(v) => scoring.set({ autoOfferThreshold: v })}
              suffix="点"
            />
            <SettingSlider
              label="タグ一致重み"
              hint="5軸タグ一致を重視するほど大きく"
              value={scoring.tagWeight * 100}
              min={0}
              max={100}
              step={5}
              onChange={(v) => {
                const tag = v / 100;
                scoring.set({ tagWeight: tag, successWeight: 1 - tag });
              }}
              suffix="%"
            />
            <SettingSlider
              label="実績スコア重み"
              hint="過去の成約実績を重視するほど大きく"
              value={scoring.successWeight * 100}
              min={0}
              max={100}
              step={5}
              onChange={(v) => {
                const success = v / 100;
                scoring.set({ successWeight: success, tagWeight: 1 - success });
              }}
              suffix="%"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-navy-900">
                シミュレーター
              </h2>
              <Badge variant="outline">
                対象: {sampleClient.name}
              </Badge>
            </div>
            <p className="text-xs text-navy-900/60 mb-4">
              現在の設定で、上位{preview.length}社が表示されます。
            </p>
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {preview.map((p) => (
                <div
                  key={p.supplier.id}
                  className="flex items-center justify-between rounded-lg border border-navy/10 bg-white px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy-900 truncate">
                      {p.supplier.name}
                    </p>
                    <p className="text-xs text-navy-900/60">
                      タグ {p.tagMatchScore} / 実績 {p.successRateScore}
                    </p>
                  </div>
                  <div className="num-emphasis text-lg font-bold text-navy-900">
                    {p.matchScore}
                  </div>
                </div>
              ))}
              {preview.length === 0 && (
                <p className="text-center text-sm text-navy-900/50 py-8">
                  閾値を満たす支援先がありません。
                </p>
              )}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-navy-50 p-3 text-center">
              <Stat label="表示数" value={`${preview.length}社`} />
              <Stat
                label="平均スコア"
                value={
                  preview.length > 0
                    ? `${Math.round(
                        preview.reduce((s, p) => s + p.matchScore, 0) /
                          preview.length,
                      )}`
                    : "—"
                }
              />
              <Stat
                label="サンプル課題"
                value={
                  sampleClient.challenges
                    ?.map((c) => CHALLENGE_LABELS[c])
                    .join("/") ?? "—"
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingSlider({
  label,
  hint,
  value,
  min,
  max,
  step,
  onChange,
  suffix,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-navy-900">{label}</label>
        <span className="num-emphasis text-lg font-bold text-aqua-700">
          {Math.round(value)}
          {suffix}
        </span>
      </div>
      {hint && <p className="text-xs text-navy-900/50 mb-2">{hint}</p>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-aqua"
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-navy-900/60">{label}</p>
      <p className="num-emphasis text-sm font-semibold text-navy-900 truncate">
        {value}
      </p>
    </div>
  );
}
