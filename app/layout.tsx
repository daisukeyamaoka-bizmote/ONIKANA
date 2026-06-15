import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "フクワウチ — 福を、企業へ。",
  description:
    "オニカナが運営するAIマッチングプラットフォーム「フクワウチ」。企業の課題と最適な支援先を、5軸AIマッチングで結びます。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
