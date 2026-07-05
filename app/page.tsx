import Link from "next/link";
import { DemoResetButton } from "@/components/shared/demo-reset";

// トップページ — 編集デザイン(左寄せ・明朝見出し・罫線・余白)
// カードの羅列や中央寄せヒーローを避け、"索引"のような佇まいにする
export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper">
      <main className="mx-auto w-full max-w-5xl px-6 pb-20 pt-16 sm:px-10 sm:pt-24">
        {/* ブランド行 */}
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-oni-red font-serif text-lg text-paper"
            aria-hidden
          >
            福
          </span>
          <div className="leading-tight">
            <p className="font-serif text-lg font-bold tracking-wide text-ink">
              フクワウチ
            </p>
            <p className="text-[11px] uppercase tracking-[0.25em] text-mist-500">
              AI Business Matching
            </p>
          </div>
        </div>

        {/* ヒーロー */}
        <div className="mt-16 max-w-3xl">
          <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight text-ink sm:text-6xl">
            福を、企業へ。
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-8 text-mist-600">
            企業の課題と、最適な支援先を、5軸のAIマッチングで結ぶ。
            株式会社オニカナが運営するビジネスマッチングプラットフォームです。
            ご利用企業は無料。支援先は商談一件ごとの成果報酬のみ。
          </p>
        </div>

        {/* 入口の索引 */}
        <section className="mt-20">
          <div className="flex items-baseline justify-between border-b border-ink pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-mist-500">
              入口を選ぶ — Demo Entrance
            </h2>
            <p className="text-[11px] text-mist-400">ログイン不要</p>
          </div>

          <EntranceRow
            index="01"
            accent="text-oni-blue"
            href="/client/questionnaire"
            title="支援を受けたい企業"
            role="クライアント"
            description="アンケートに答えると、AIが上位10社を提案。気になる会社を選ぶだけ。利用は無料。"
            shortcuts={[
              { href: "/client/recommendations", label: "レコメンド" },
              { href: "/client/dashboard", label: "ダッシュボード" },
              { href: "/client/messages", label: "メッセージ" },
            ]}
          />
          <EntranceRow
            index="02"
            accent="text-oni-red"
            href="/supplier/dashboard"
            title="支援を提供する企業"
            role="支援先(Giver)"
            description="届いた打診のアポ単価を確認して承諾。メッセージで日程を提案し、商談へ。"
            shortcuts={[
              { href: "/supplier/offers", label: "打診一覧" },
              { href: "/supplier/profile", label: "プロフィール" },
              { href: "/supplier/signup", label: "会員登録" },
            ]}
          />
          <EntranceRow
            index="03"
            accent="text-ink"
            href="/admin/dashboard"
            title="オニカナ運営"
            role="管理者"
            description="KPI・マッチング進捗・LIKE・支援先別請求・スコアリング調整を一元管理。"
            shortcuts={[
              { href: "/admin/matches", label: "マッチング" },
              { href: "/admin/likes", label: "LIKE" },
              { href: "/admin/scoring", label: "スコアリング" },
            ]}
          />
        </section>

        {/* 特徴 */}
        <section className="mt-20">
          <div className="border-b border-ink pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-mist-500">
              特徴 — Why Fukuwauchi
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 pt-8 sm:grid-cols-3">
            <Feature
              no="一"
              title="5軸AIマッチング"
              text="業種・規模・課題・地域・予算の5軸に過去実績を重ね、最適な支援先を上位10社まで絞り込みます。"
            />
            <Feature
              no="二"
              title="役職別のアポ単価"
              text="一般 ¥30,000/課長 ¥50,000/役員 ¥90,000。商談一件の価値が、誰にでも明快です。"
            />
            <Feature
              no="三"
              title="完全成果報酬"
              text="課金は商談1時間の実施が確定した時点のみ。成果がなければ、費用も発生しません。"
            />
          </div>
        </section>

        {/* デモ管理 */}
        <section className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-mist-200 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs leading-6 text-mist-500">
            デモ操作の状態(LIKE・メッセージ・マッチング)はこのブラウザに保存されます。
            <br className="hidden sm:block" />
            次のデモの前に初期化する場合は右のボタンを押してください。
          </p>
          <DemoResetButton />
        </section>

        <footer className="mt-16 flex items-center justify-between text-[11px] text-mist-400">
          <span>
            運営 株式会社オニカナ ・ 開発 bizmote株式会社
          </span>
          <span>Demo v0.5</span>
        </footer>
      </main>
    </div>
  );
}

function EntranceRow({
  index,
  accent,
  href,
  title,
  role,
  description,
  shortcuts,
}: {
  index: string;
  accent: string;
  href: string;
  title: string;
  role: string;
  description: string;
  shortcuts: { href: string; label: string }[];
}) {
  return (
    <div className="group border-b border-mist-200">
      <div className="flex flex-col gap-3 py-8 sm:flex-row sm:items-start sm:gap-8">
        <span
          className={`font-serif text-3xl font-bold leading-none ${accent}`}
        >
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <Link
              href={href}
              className="font-serif text-2xl font-bold text-ink underline-offset-4 hover:underline"
            >
              {title}
            </Link>
            <span className="text-xs tracking-widest text-mist-500">
              {role}
            </span>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-7 text-mist-600">
            {description}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
            {shortcuts.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="text-xs text-mist-500 underline-offset-2 hover:text-ink hover:underline"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
        <Link
          href={href}
          className="hidden shrink-0 self-center text-2xl text-mist-300 transition group-hover:translate-x-1 group-hover:text-ink sm:block"
          aria-label={`${title}へ`}
        >
          →
        </Link>
      </div>
    </div>
  );
}

function Feature({
  no,
  title,
  text,
}: {
  no: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-sm text-oni-red">{no}</span>
        <h3 className="font-serif text-lg font-bold text-ink">{title}</h3>
      </div>
      <p className="mt-3 text-[13px] leading-7 text-mist-600">{text}</p>
    </div>
  );
}
