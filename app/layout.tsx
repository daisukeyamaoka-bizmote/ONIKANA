import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ONIKANA MATCHING SYSTEM",
  description: "企業と企業を、最適につなぐ。AIマッチングプラットフォーム",
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
