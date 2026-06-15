import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { DemoResetButton } from "@/components/shared/demo-reset";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-fuku-sand-50">
      <main className="container-page flex flex-col items-center pt-16 pb-16 sm:pt-24">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-mist-200 bg-paper px-3 py-1 text-xs text-mist-600">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-oni-red" />
          AIマッチング × 商談セッティング
        </div>
        <h1 className="text-center text-5xl sm:text-6xl font-bold tracking-tight text-ink">
          <span className="text-oni-red">フク</span>
          <span className="text-oni-blue">ワウチ</span>
        </h1>
        <p className="mt-3 text-center text-base text-mist-700">
          福を、企業へ。
        </p>
        <p className="mt-1 text-xs text-mist-500">
          Powered by 株式会社オニカナ
        </p>

        <p className="mt-8 text-center text-sm text-mist-600 max-w-2xl">
          ここはデモ用の入口です。下のボタンから3つの利用者役を切り替えてご覧いただけます。
          ログインは不要、ボタンを押すとそのまま画面に入れます。
        </p>

        <section className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          <RoleCard
            href="/client/questionnaire"
            tag="クライアントとして見る"
            tagAccent="oni-blue"
            title="支援を受けたい企業"
            description="アンケート → AIレコメンド10社 → 気になる / ぜひ話したい を操作。利用は完全無料。"
            cta="クライアント画面へ"
            shortcuts={[
              { href: "/client/recommendations", label: "レコメンドへ直行" },
              { href: "/client/dashboard", label: "ダッシュボード" },
            ]}
          />
          <RoleCard
            href="/supplier/dashboard"
            tag="支援先(Giver)として見る"
            tagAccent="oni-red"
            title="支援を提供する企業"
            description="打診一覧 → アポ単価を確認して承諾 → 日程提案。プロフィール編集も可能。"
            cta="支援先画面へ"
            shortcuts={[
              { href: "/supplier/profile", label: "プロフィール" },
              { href: "/supplier/signup", label: "会員登録(プレビュー)" },
            ]}
          />
          <RoleCard
            href="/admin/dashboard"
            tag="管理者として見る"
            tagAccent="ink"
            title="オニカナ運営"
            description="KPI・マッチング状況・LIKE可視化・支援先別請求額・スコアリング調整。"
            cta="管理画面へ"
            shortcuts={[
              { href: "/admin/likes", label: "LIKE可視化" },
              { href: "/admin/companies", label: "企業マスタ" },
            ]}
          />
        </section>

        <section className="mt-16 w-full">
          <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-mist-500">
            このプラットフォームの特徴
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <FeatureItem
              title="5軸AIマッチング"
              text="業種・規模・課題・地域・予算の5軸+実績スコアで上位10社に絞り込み。"
            />
            <FeatureItem
              title="役職別 アポ単価"
              text="一般¥30,000 / 課長¥50,000 / 役員¥90,000。明確な単価で価値が見える。"
            />
            <FeatureItem
              title="完全成果報酬モデル"
              text="商談1時間の実施が成立した時点で課金。発生しないリスクは双方ゼロ。"
            />
          </div>
        </section>

        <div className="mt-12 rounded-2xl border border-mist-200 bg-paper p-4 flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-2xl">
          <p className="text-xs text-mist-600">
            デモ操作後は LIKE やマッチング状態が残ります。
            次のデモの前に状態を初期化したい場合はこちら。
          </p>
          <DemoResetButton />
        </div>

        <footer className="mt-16 text-center text-xs text-mist-500">
          Powered by{" "}
          <span className="font-semibold text-mist-700">bizmote</span>
          {"  ·  "}
          <span>デモ版 v0.4 — フクワウチ</span>
        </footer>
      </main>
    </div>
  );
}

const TAG_CLASSES = {
  "oni-blue": "bg-oni-blue text-paper",
  "oni-red": "bg-oni-red text-paper",
  ink: "bg-ink text-paper",
} as const;

function RoleCard({
  href,
  tag,
  tagAccent,
  title,
  description,
  cta,
  shortcuts,
}: {
  href: string;
  tag: string;
  tagAccent: keyof typeof TAG_CLASSES;
  title: string;
  description: string;
  cta: string;
  shortcuts?: { href: string; label: string }[];
}) {
  return (
    <Card className="h-full transition hover:shadow-card-hover hover:-translate-y-0.5 border-mist-200">
      <CardContent className="flex h-full flex-col">
        <span
          className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TAG_CLASSES[tagAccent]}`}
        >
          {tag}
        </span>
        <h3 className="mt-4 text-xl font-semibold text-ink">{title}</h3>
        <p className="mt-2 flex-1 text-sm text-mist-600">{description}</p>
        <Link
          href={href}
          className="mt-5 inline-flex items-center text-sm font-semibold text-ink hover:underline underline-offset-4"
        >
          {cta}
          <span className="ml-1">→</span>
        </Link>
        {shortcuts && shortcuts.length > 0 && (
          <div className="mt-3 pt-3 border-t border-mist-100">
            <p className="text-xs text-mist-500 mb-1">直接アクセス</p>
            <div className="flex flex-wrap gap-1.5">
              {shortcuts.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="rounded-full border border-mist-300 px-2 py-0.5 text-xs text-mist-700 hover:bg-mist-50"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FeatureItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-mist-200 bg-paper p-5">
      <h4 className="text-base font-semibold text-ink">{title}</h4>
      <p className="mt-1 text-sm text-mist-600">{text}</p>
    </div>
  );
}
