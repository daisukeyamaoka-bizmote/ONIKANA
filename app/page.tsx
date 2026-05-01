import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 via-white to-aqua-50">
      <main className="container-page flex flex-col items-center pt-20 pb-16 sm:pt-28">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/80 px-3 py-1 text-xs font-medium text-navy-700 shadow-card">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
          AIマッチング × 商談セッティング
        </div>
        <h1 className="text-center text-5xl sm:text-6xl font-bold tracking-tight text-navy-900">
          ONIKANA
        </h1>
        <p className="mt-3 text-center text-lg text-navy-900/70">
          企業と企業を、最適につなぐ。
        </p>

        <section className="mt-14 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          <RoleCard
            href="/client/questionnaire"
            tag="クライアント企業"
            tagColor="bg-aqua"
            title="支援を受けたい方"
            description="アンケートに答えるだけで、最適な支援先5社をAIが提案。"
            cta="アンケートを開始"
          />
          <RoleCard
            href="/supplier/dashboard"
            tag="支援先企業"
            tagColor="bg-supplier"
            title="支援を提供する方"
            description="マッチした打診を確認・承諾し、商談日程を提案。"
            cta="ダッシュボードへ"
          />
          <RoleCard
            href="/admin/dashboard"
            tag="オニカナ管理者"
            tagColor="bg-navy-700"
            title="運営管理"
            description="KPIダッシュボードで売上・成果報酬・マッチング状況を一元管理。"
            cta="管理画面へ"
          />
        </section>

        <section className="mt-20 w-full">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-navy-900/60">
            このプラットフォームの特徴
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <FeatureItem
              title="5軸AIマッチング"
              text="業種・規模・課題・地域・予算の5軸でスコアリング。最適な支援先を上位5社に絞り込み。"
            />
            <FeatureItem
              title="役職別 商談単価"
              text="一般¥30,000、課長¥50,000、役員¥90,000。明確な単価で価値が見える。"
            />
            <FeatureItem
              title="自動打診の補填"
              text="気になる企業が3件未満なら、システムが自動で支援先に打診を送信。"
            />
          </div>
        </section>

        <footer className="mt-24 text-center text-xs text-navy-900/50">
          Powered by{" "}
          <span className="font-semibold text-navy-900/70">bizmote</span>
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
}: {
  href: string;
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition hover:shadow-card-hover hover:-translate-y-0.5">
        <CardContent className="flex h-full flex-col">
          <span
            className={`inline-flex w-fit items-center rounded-full ${tagColor} px-2.5 py-0.5 text-xs font-medium text-white`}
          >
            {tag}
          </span>
          <h3 className="mt-4 text-xl font-semibold text-navy-900">{title}</h3>
          <p className="mt-2 flex-1 text-sm text-navy-900/70">{description}</p>
          <div className="mt-6 flex items-center text-sm font-semibold text-aqua-700">
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
          </div>
        </CardContent>
      </Card>
    </Link>
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
