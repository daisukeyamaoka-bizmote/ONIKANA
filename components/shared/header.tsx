import Link from "next/link";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/shared/notification-bell";

interface HeaderProps {
  variant?: "client" | "supplier" | "admin";
  userLabel?: string;
}

const VARIANT_LABEL: Record<NonNullable<HeaderProps["variant"]>, string> = {
  client: "クライアント",
  supplier: "支援先",
  admin: "管理者",
};

// ロール識別カラー: クライアント=群青、支援先=朱、管理者=墨
const VARIANT_COLOR: Record<NonNullable<HeaderProps["variant"]>, string> = {
  client: "bg-oni-blue",
  supplier: "bg-oni-red",
  admin: "bg-ink",
};

export function Header({ variant = "client", userLabel }: HeaderProps) {
  const navItems =
    variant === "client"
      ? [
          { href: "/client/dashboard", label: "ダッシュボード" },
          { href: "/client/recommendations", label: "レコメンド" },
          { href: "/client/matches", label: "マッチング" },
          { href: "/client/messages", label: "メッセージ" },
          { href: "/client/meetings", label: "商談" },
        ]
      : variant === "supplier"
        ? [
            { href: "/supplier/dashboard", label: "ダッシュボード" },
            { href: "/supplier/offers", label: "打診一覧" },
            { href: "/supplier/messages", label: "メッセージ" },
            { href: "/supplier/meetings", label: "商談" },
            { href: "/supplier/profile", label: "プロフィール" },
          ]
        : [
            { href: "/admin/dashboard", label: "KPI" },
            { href: "/admin/companies", label: "企業" },
            { href: "/admin/matches", label: "マッチング" },
            { href: "/admin/likes", label: "LIKE" },
            { href: "/admin/scoring", label: "スコアリング" },
          ];

  const settingsHref =
    variant === "client"
      ? "/client/settings/integrations"
      : variant === "supplier"
        ? "/supplier/settings/integrations"
        : null;

  return (
    <header className="sticky top-0 z-30 border-b border-mist-200 bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-wider text-ink"
          >
            <span
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-md text-paper text-base",
                VARIANT_COLOR[variant],
              )}
              aria-hidden
            >
              福
            </span>
            <span className="hidden sm:inline">フクワウチ</span>
          </Link>
          <span className="hidden md:inline text-xs text-mist-600 border-l border-mist-200 pl-3">
            {VARIANT_LABEL[variant]}画面
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-sm text-mist-700 hover:bg-mist-100 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {variant !== "admin" && <NotificationBell perspective={variant} />}
          {settingsHref && (
            <Link
              href={settingsHref}
              className="hidden md:inline rounded-lg px-2 py-1.5 text-xs text-mist-700 hover:bg-mist-100 hover:text-ink"
            >
              設定
            </Link>
          )}
          {userLabel && (
            <span className="hidden sm:inline text-sm text-mist-700">
              {userLabel}
            </span>
          )}
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-paper text-sm font-semibold",
              VARIANT_COLOR[variant],
            )}
          >
            {(userLabel ?? "ゲ").charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
