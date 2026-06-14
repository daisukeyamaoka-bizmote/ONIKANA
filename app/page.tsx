import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { DemoResetButton } from "@/components/shared/demo-reset";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 via-white to-aqua-50">
      <main className="container-page flex flex-col items-center pt-16 pb-16 sm:pt-24">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/80 px-3 py-1 text-xs font-medium text-navy-700 shadow-card">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
          AIマッチング × 商談セッティング ・ デモ版
        </div>
        <h1 className="text-center text-5xl sm:text-6xl font-bold tracking-tight text-navy-900">
          ONIKANA
        </h1>
        <p className="mt-3 text-center text-lg text-navy-900/70">
          企業と企業を、最適につなぐ。
        </p>

        <p className="mt-6 text-center text-sm text-navy-900/60 max-w-2xl">
          ここはデモ用の入口です。下のボタンから3つの利用者役を切り替えてご覧いただけます。
          <br />
          ログインは不要・ボタンを押すとそのまま画面に入れます。
        </p>

        <section className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          <RoleCard
            href="/client/questionnaire"
            tag="クライアントとして見る"
            tagColor="bg-aqua"
            title="支援を受けたい企業"
            description="アンケート → AIレコメンド10社 → 気になる/ぜひ話したいを操作"
            cta="クライアント画面へ"
            shortcuts={[
              { href: "/client/recommendations", label: "レコメンドへ直行" },
              { href: "/client/dashboard", label: "ダッシュボード" },
            ]}
          />
          <RoleCard
            href="/supplier/dashboard"
            tag="支援先(Giver)として見る"
            tagColor="bg-supplier"
            title="支援を提供する企業"
            description="打診一覧 → 承諾/辞退 → 日程提案 → プロフィール編集"
            cta="支援先画面へ"
            shortcuts={[
              { href: "/supplier/profile", label: "プロフィール" },
              { href: "/supplier/signup", label: "会員登録(プレビュー)" },
            ]}
          />
          <RoleCard
            href="/admin/dashboard"
            tag="管理者として見る"
            tagColor="bg-navy-700"
            title="オニカナ運営"
            description="KPI・マッチング状況・LIKE可視化・スコアリング調整"
            cta="管理画面へ"
            shortcuts={[
              { href: "/admin/likes", label: "LIKE可視化" },
              { href: "/admin/companies", label: "企業マスタ" },
            ]}
          />
        </section>

        <section className="mt-16 w-full">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-navy-900/60">
            このプラットフォームの特徴
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <FeatureItem
              title="5軸AIマッチング"
              text="業種・規模・課題・地域・予算の5軸+実績スコア。最適な支援先を上位10社に絞り込み。"
            />
            <FeatureItem
              title="役職別 商談単価"
              text="一般¥30,000・課長¥50,000・役員¥90,000。明確な単価で価値が見える。"
            />
            <FeatureItem
              title="自動打診の補填"
              text="気になる企業が3件未満なら、システムが自動で支援先に打診を送信。"
            />
          </div>
        </section>

        <div className="mt-12 rounded-2xl border border-navy/10 bg-white/70 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-2xl">
          <p className="text-xs text-navy-900/60">
            デモ操作後は、LIKEやマッチング状態が残ります。
            <br />
            次のデモの前に状態を初期化したい場合はこちら:
          </p>
          <DemoResetButton />
        </div>

        <footer className="mt-16 text-center text-xs text-navy-900/50">
          Powered by{" "}
          <span className="font-semibold text-navy-900/70">bizmote</span>
          {" ・ "}
          <span>デモ版 v0.2</span>
        </footer>
      </main>
    </div>
  );
}

function RoleCard({
  href,
  tag,
  tagColor,
  title,
  description,
  cta,
  shortcuts,
}: {
  href: string;
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  cta: string;
  shortcuts?: { href: string; label: string }[];
}) {
  return (
    <Card className="h-full transition hover:shadow-card-hover hover:-translate-y-0.5">
      <CardContent className="flex h-full flex-col">
        <span
          className={`inline-flex w-fit items-center rounded-full ${tagColor} px-2.5 py-0.5 text-xs font-medium text-white`}
        >
          {tag}
        </span>
        <h3 className="mt-4 text-xl font-semibold text-navy-900">{title}</h3>
        <p className="mt-2 flex-1 text-sm text-navy-900/70">{description}</p>
        <Link
          href={href}
          className="mt-5 inline-flex items-center text-sm font-semibold text-aqua-700 hover:underline"
        >
          {cta}
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
        {shortcuts && shortcuts.length > 0 && (
          <div className="mt-3 pt-3 border-t border-navy/10">
            <p className="text-xs text-navy-900/50 mb-1">直接アクセス</p>
            <div className="flex flex-wrap gap-1.5">
              {shortcuts.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="rounded-full border border-navy/15 px-2 py-0.5 text-xs text-navy-900/70 hover:bg-navy-50"
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
    <div className="rounded-xl border border-navy/10 bg-white/70 p-5">
      <h4 className="text-base font-semibold text-navy-900">{title}</h4>
      <p className="mt-1 text-sm text-navy-900/70">{text}</p>
    </div>
  );
}
