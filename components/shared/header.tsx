import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeaderProps {
  variant?: "client" | "supplier" | "admin";
  userLabel?: string;
}

const VARIANT_LABEL: Record<NonNullable<HeaderProps["variant"]>, string> = {
  client: "クライアント",
  supplier: "支援先",
  admin: "管理者",
};

const VARIANT_COLOR: Record<NonNullable<HeaderProps["variant"]>, string> = {
  client: "bg-aqua",
  supplier: "bg-supplier",
  admin: "bg-navy-700",
};

export function Header({ variant = "client", userLabel }: HeaderProps) {
  const navItems =
    variant === "client"
      ? [
          { href: "/client/dashboard", label: "ダッシュボード" },
          { href: "/client/recommendations", label: "レコメンド" },
          { href: "/client/matches", label: "マッチング" },
          { href: "/client/meetings", label: "商談" },
        ]
      : variant === "supplier"
        ? [
            { href: "/supplier/dashboard", label: "ダッシュボード" },
            { href: "/supplier/offers", label: "打診一覧" },
            { href: "/supplier/meetings", label: "商談" },
            { href: "/supplier/profile", label: "プロフィール" },
            { href: "/supplier/signup", label: "会員登録(プレビュー)" },
          ]
        : [
            { href: "/admin/dashboard", label: "KPI" },
            { href: "/admin/companies", label: "企業" },
            { href: "/admin/matches", label: "マッチング" },
            { href: "/admin/likes", label: "LIKE" },
            { href: "/admin/scoring", label: "スコアリング" },
          ];

  return (
    <header className="sticky top-0 z-30 border-b border-navy/10 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-wider text-navy-900"
          >
            <span
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-md text-white text-sm",
                VARIANT_COLOR[variant],
              )}
            >
              O
            </span>
            <span className="hidden sm:inline">ONIKANA</span>
          </Link>
          <span className="hidden md:inline text-xs text-navy-900/60 border-l border-navy/10 pl-3">
            {VARIANT_LABEL[variant]}画面
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-sm text-navy-900/80 hover:bg-navy-50 hover:text-navy-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {userLabel && (
            <span className="text-sm text-navy-900/70 hidden sm:inline">
              {userLabel}
            </span>
          )}
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-white text-sm font-semibold",
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
